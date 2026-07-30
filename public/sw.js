"use strict";

const CACHE_PREFIX = "nasayem-alkhair";
const OFFLINE_PACK_CACHE_PREFIX = `${CACHE_PREFIX}-offline-pack-`;
const RELEASE_VERSION = "git-a26833d356fb-src-948091cd05abca51";
const EXPECTED_OFFLINE_ROUTES = ["/","/prayer-times","/azkar","/tasbih","/progress","/umrah","/miqat","/services","/more","/privacy","/terms","/disclaimer","/sources","/support","/offline","/azkar/morning","/azkar/evening","/azkar/prayer","/azkar/sleep","/azkar/wakeup","/azkar/after-prayer","/azkar/quran-duas","/azkar/prophetic-duas","/azkar/names-of-allah","/azkar/comprehensive-duas","/umrah/travel","/umrah/ihram","/umrah/entering-makkah","/umrah/tawaf","/umrah/zamzam","/umrah/sai","/umrah/shaving-or-trimming-hair","/umrah/completion-of-umrah"];
const EXPECTED_ROUTE_SET = new Set(EXPECTED_OFFLINE_ROUTES);
const RUNTIME_CACHE_MAX_ENTRIES = 60;
const PAGE_CACHE_MAX_ENTRIES = 40;
const STATIC_ASSET_CACHE_MAX_ENTRIES = 120;
const NAVIGATION_TIMEOUT_MS = 3000;
const PACK_REQUEST_TIMEOUT_MS = 15000;
const MAX_REQUEST_ID_LENGTH = 100;
const ACCEPTED_MESSAGE_TYPES = new Set([
  "GET_PWA_STATUS",
  "CACHE_CURRENT_PAGE",
  "PREPARE_OFFLINE_PACK",
  "REMOVE_OFFLINE_CONTENT",
  "SKIP_WAITING"
]);
const CACHE_NAMES = {
  shell: `${CACHE_PREFIX}-shell-${RELEASE_VERSION}`,
  pages: `${CACHE_PREFIX}-pages-${RELEASE_VERSION}`,
  staticAssets: `${CACHE_PREFIX}-static-assets-${RELEASE_VERSION}`,
  offlinePack: `${CACHE_PREFIX}-offline-pack-${RELEASE_VERSION}`,
  runtime: `${CACHE_PREFIX}-runtime-${RELEASE_VERSION}`
};
const ACTIVE_CACHE_NAMES = new Set(Object.values(CACHE_NAMES));
const SHELL_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/pwa/favicon-32.png",
  "/pwa/apple-touch-icon.png",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-maskable-512.png"
];
const LOCAL_ASSET_PATTERN =
  /\.(?:css|js|mjs|woff2?|png|jpe?g|gif|webp|svg|ico|json)$/i;

function reply(event, message) {
  const port = event.ports && event.ports[0];

  if (port) {
    port.postMessage(message);
    return;
  }

  if (event.source) {
    event.source.postMessage(message);
  }
}

function isControlledSameOriginClient(event) {
  const source = event.source;

  if (
    !source ||
    source.type !== "window" ||
    typeof source.id !== "string" ||
    source.id.length === 0 ||
    typeof source.url !== "string"
  ) {
    return false;
  }

  try {
    const sourceUrl = new URL(source.url);
    const scopeUrl = new URL(self.registration.scope);

    return (
      sourceUrl.origin === self.location.origin &&
      sourceUrl.origin === scopeUrl.origin &&
      sourceUrl.pathname.startsWith(scopeUrl.pathname)
    );
  } catch {
    return false;
  }
}

function isMessageRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyMessageKeys(data, allowedKeys) {
  const keys = Object.keys(data);

  return (
    keys.length === allowedKeys.length &&
    keys.every((key) => allowedKeys.includes(key))
  );
}

function isValidRequestId(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_REQUEST_ID_LENGTH &&
    /^[A-Za-z0-9._:-]+$/.test(value)
  );
}

function toSafeSameOriginUrl(value, allowAsset = false) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.includes("\\") ||
    value.includes("..") ||
    value.length > 300
  ) {
    return null;
  }

  try {
    const url = new URL(value, self.location.origin);

    if (
      url.origin !== self.location.origin ||
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.hash ||
      url.search
    ) {
      return null;
    }

    if (!allowAsset && !EXPECTED_ROUTE_SET.has(url.pathname)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function isValidOfflineRouteList(routes) {
  if (
    !Array.isArray(routes) ||
    routes.length !== EXPECTED_OFFLINE_ROUTES.length ||
    routes.length > 100
  ) {
    return false;
  }

  const normalizedRoutes = routes.map((route) =>
    toSafeSameOriginUrl(route, false)
  );

  return (
    normalizedRoutes.every(Boolean) &&
    new Set(normalizedRoutes.map((url) => url.pathname)).size ===
      EXPECTED_ROUTE_SET.size
  );
}

function isCacheableResponse(response, expectedKind = "asset") {
  if (
    !response ||
    !response.ok ||
    response.status !== 200 ||
    response.type === "opaque"
  ) {
    return false;
  }

  try {
    if (new URL(response.url).origin !== self.location.origin) {
      return false;
    }
  } catch {
    return false;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/x-component")) {
    return false;
  }

  if (expectedKind === "document") {
    return contentType.includes("text/html");
  }

  return !contentType.includes("application/problem+json");
}

async function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const overflow = keys.length - maxEntries;

  if (overflow <= 0) {
    return;
  }

  await Promise.all(keys.slice(0, overflow).map((request) => cache.delete(request)));
}

async function matchCacheSafely(cacheName, request) {
  try {
    return await (await caches.open(cacheName)).match(request);
  } catch {
    return undefined;
  }
}

async function cacheResponseSafely(
  cacheName,
  request,
  response,
  maxEntries
) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);

    if (typeof maxEntries === "number") {
      await trimCache(cacheName, maxEntries);
    }
  } catch {
    // Cache quota and storage-denial failures must not fail network responses.
  }
}

async function cacheShell() {
  try {
    const cache = await caches.open(CACHE_NAMES.shell);
    await cache.addAll(SHELL_URLS);
  } catch {
    // Installation can continue when persistent cache storage is unavailable.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const obsoleteNasayemCaches = cacheNames.filter(
        (cacheName) =>
          cacheName.startsWith(`${CACHE_PREFIX}-`) &&
          !ACTIVE_CACHE_NAMES.has(cacheName)
      );

      await Promise.all(
        obsoleteNasayemCaches.map((cacheName) => caches.delete(cacheName))
      );
      await self.clients.claim();
    })()
  );
});

async function cacheFirst(request, cacheName) {
  const cachedResponse = await matchCacheSafely(cacheName, request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (isCacheableResponse(response)) {
    await cacheResponseSafely(
      cacheName,
      request,
      response.clone(),
      STATIC_ASSET_CACHE_MAX_ENTRIES
    );
  }

  return response;
}

async function staleWhileRevalidate(request, event) {
  const cachedResponse =
    (await matchCacheSafely(CACHE_NAMES.staticAssets, request)) ||
    (await matchCacheSafely(CACHE_NAMES.offlinePack, request));
  const networkPromise = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        await cacheResponseSafely(
          CACHE_NAMES.staticAssets,
          request,
          response.clone(),
          STATIC_ASSET_CACHE_MAX_ENTRIES
        );
      }

      return response;
    })
    .catch(() => null);

  if (cachedResponse) {
    event.waitUntil(networkPromise);
    return cachedResponse;
  }

  return (await networkPromise) || Response.error();
}

function navigationCacheKey(requestUrl) {
  const url = new URL(requestUrl);
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function networkFirstNavigation(request) {
  const cacheKey = navigationCacheKey(request.url);

  try {
    const response = await fetchWithTimeout(request, NAVIGATION_TIMEOUT_MS);

    if (isCacheableResponse(response, "document")) {
      await cacheResponseSafely(
        CACHE_NAMES.pages,
        cacheKey,
        response.clone(),
        PAGE_CACHE_MAX_ENTRIES
      );
    }

    return response;
  } catch {
    return (
      (await matchCacheSafely(CACHE_NAMES.pages, cacheKey)) ||
      (await matchCacheSafely(CACHE_NAMES.offlinePack, cacheKey)) ||
      (await matchCacheSafely(CACHE_NAMES.shell, "/offline")) ||
      Response.error()
    );
  }
}

async function boundedRuntime(request) {
  try {
    const response = await fetch(request);

    if (isCacheableResponse(response)) {
      await cacheResponseSafely(
        CACHE_NAMES.runtime,
        request,
        response.clone(),
        RUNTIME_CACHE_MAX_ENTRIES
      );
    }

    return response;
  } catch {
    return (
      (await matchCacheSafely(CACHE_NAMES.runtime, request)) ||
      Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    request.headers.has("authorization")
  ) {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1" ||
    request.headers.get("accept")?.includes("text/x-component")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.search) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.staticAssets));
    return;
  }

  if (
    url.pathname.startsWith("/pwa/") ||
    LOCAL_ASSET_PATTERN.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }

  if (
    ["script", "style", "font", "image", "manifest"].includes(
      request.destination
    )
  ) {
    event.respondWith(boundedRuntime(request));
  }
});

function extractReferencedAssets(documentText, documentUrl) {
  const assets = new Set();
  const attributePattern = /\b(?:src|href)=["']([^"'<>]+)["']/gi;
  let match;

  while ((match = attributePattern.exec(documentText))) {
    try {
      const url = new URL(match[1], documentUrl);

      if (
        url.origin === self.location.origin &&
        !url.search &&
        !url.hash &&
        (url.pathname.startsWith("/_next/static/") ||
          url.pathname.startsWith("/pwa/") ||
          LOCAL_ASSET_PATTERN.test(url.pathname))
      ) {
        assets.add(url.toString());
      }
    } catch {
      // Invalid references are ignored.
    }
  }

  return [...assets].slice(0, 1000);
}

function extractCssAssets(cssText, cssUrl) {
  const assets = new Set();
  const urlPattern = /url\(\s*["']?([^"'()]+)["']?\s*\)/gi;
  let match;

  while ((match = urlPattern.exec(cssText))) {
    try {
      const url = new URL(match[1], cssUrl);

      if (
        url.origin === self.location.origin &&
        !url.search &&
        !url.hash &&
        (url.pathname.startsWith("/_next/static/") ||
          LOCAL_ASSET_PATTERN.test(url.pathname))
      ) {
        assets.add(url.toString());
      }
    } catch {
      // Invalid CSS references are ignored.
    }
  }

  return [...assets].slice(0, 500);
}

async function cacheOfflineAsset(assetUrl, cache, seenAssets) {
  if (seenAssets.has(assetUrl)) {
    return;
  }

  seenAssets.add(assetUrl);
  const url = toSafeSameOriginUrl(new URL(assetUrl).pathname, true);

  if (!url) {
    return;
  }

  try {
    const response = await fetchWithTimeout(url.toString(), PACK_REQUEST_TIMEOUT_MS);

    if (!isCacheableResponse(response)) {
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    const cssText = contentType.includes("text/css")
      ? await response.clone().text()
      : "";

    await cache.put(url.toString(), response);

    if (cssText) {
      const nestedAssets = extractCssAssets(cssText, url.toString());

      for (const nestedAsset of nestedAssets) {
        await cacheOfflineAsset(nestedAsset, cache, seenAssets);
      }
    }
  } catch {
    // A noncritical asset failure does not mark a required route as failed.
  }
}

async function cacheRequiredRoute(route, cache, seenAssets) {
  const url = toSafeSameOriginUrl(route, false);

  if (!url) {
    throw new Error("invalid-route");
  }

  const response = await fetchWithTimeout(url.toString(), PACK_REQUEST_TIMEOUT_MS);

  if (!isCacheableResponse(response, "document")) {
    throw new Error("route-unavailable");
  }

  const documentText = await response.clone().text();
  await cache.put(url.toString(), response);
  const assets = extractReferencedAssets(documentText, url.toString());

  for (const asset of assets) {
    await cacheOfflineAsset(asset, cache, seenAssets);
  }
}

async function prepareOfflinePack(event, routes, requestId) {
  const cache = await caches.open(CACHE_NAMES.offlinePack);
  const seenAssets = new Set();
  const failedRoutes = [];
  let completed = 0;
  let nextRouteIndex = 0;

  async function routeWorker() {
    while (nextRouteIndex < routes.length) {
      const routeIndex = nextRouteIndex;
      nextRouteIndex += 1;
      const route = routes[routeIndex];

      try {
        await cacheRequiredRoute(route, cache, seenAssets);
      } catch {
        failedRoutes.push(route);
      }

      completed += 1;
      reply(event, {
        type: "PWA_PACK_PROGRESS",
        requestId,
        completed,
        total: routes.length
      });
    }
  }

  await Promise.all([routeWorker(), routeWorker(), routeWorker()]);

  reply(event, {
    type: "PWA_PACK_COMPLETE",
    requestId,
    completed,
    failedRoutes,
    success: failedRoutes.length === 0,
    total: routes.length,
    version: RELEASE_VERSION
  });
}

async function cacheCurrentPage(path) {
  const url = toSafeSameOriginUrl(path, false);

  if (!url) {
    return;
  }

  const seenAssets = new Set();

  try {
    const response = await fetchWithTimeout(url.toString(), PACK_REQUEST_TIMEOUT_MS);

    if (!isCacheableResponse(response, "document")) {
      return;
    }

    const documentText = await response.clone().text();
    await cacheResponseSafely(
      CACHE_NAMES.pages,
      url.toString(),
      response,
      PAGE_CACHE_MAX_ENTRIES
    );
    const assetCache = await caches.open(CACHE_NAMES.staticAssets);

    for (const asset of extractReferencedAssets(documentText, url.toString())) {
      await cacheOfflineAsset(asset, assetCache, seenAssets);
    }

    await trimCache(CACHE_NAMES.staticAssets, STATIC_ASSET_CACHE_MAX_ENTRIES);
  } catch {
    // Basic offline preparation is best-effort.
  }
}

self.addEventListener("message", (event) => {
  if (!isControlledSameOriginClient(event)) {
    return;
  }

  const data = event.data;

  if (
    !isMessageRecord(data) ||
    typeof data.type !== "string" ||
    !ACCEPTED_MESSAGE_TYPES.has(data.type)
  ) {
    return;
  }

  if (data.type === "GET_PWA_STATUS") {
    if (
      !hasOnlyMessageKeys(data, ["type", "requestId"]) ||
      !isValidRequestId(data.requestId)
    ) {
      return;
    }

    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        reply(event, {
          type: "PWA_STATUS",
          requestId: data.requestId,
          offlinePackCachePresent: cacheNames.includes(CACHE_NAMES.offlinePack),
          version: RELEASE_VERSION
        });
      })()
    );
    return;
  }

  if (data.type === "CACHE_CURRENT_PAGE") {
    if (!hasOnlyMessageKeys(data, ["type", "path"])) {
      return;
    }

    event.waitUntil(cacheCurrentPage(data.path));
    return;
  }

  if (data.type === "PREPARE_OFFLINE_PACK") {
    if (
      !hasOnlyMessageKeys(data, ["type", "requestId", "routes"]) ||
      !isValidRequestId(data.requestId) ||
      !isValidOfflineRouteList(data.routes)
    ) {
      if (isValidRequestId(data.requestId)) {
        reply(event, {
          type: "PWA_PACK_COMPLETE",
          requestId: data.requestId,
          completed: 0,
          failedRoutes: [],
          success: false,
          total: EXPECTED_OFFLINE_ROUTES.length,
          version: RELEASE_VERSION
        });
      }
      return;
    }

    event.waitUntil(
      prepareOfflinePack(event, data.routes, data.requestId)
    );
    return;
  }

  if (data.type === "REMOVE_OFFLINE_CONTENT") {
    if (
      !hasOnlyMessageKeys(data, ["type", "requestId"]) ||
      !isValidRequestId(data.requestId)
    ) {
      return;
    }

    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        const offlinePackCaches = cacheNames.filter((cacheName) =>
          cacheName.startsWith(OFFLINE_PACK_CACHE_PREFIX)
        );
        const results = await Promise.all(
          offlinePackCaches.map((cacheName) => caches.delete(cacheName))
        );

        reply(event, {
          type: "PWA_OFFLINE_CONTENT_REMOVED",
          requestId: data.requestId,
          success: results.every(Boolean)
        });
      })()
    );
    return;
  }

  if (data.type === "SKIP_WAITING") {
    if (
      !hasOnlyMessageKeys(data, ["type", "requestId"]) ||
      !isValidRequestId(data.requestId)
    ) {
      return;
    }

    event.waitUntil(
      (async () => {
        await self.skipWaiting();
        reply(event, {
          type: "PWA_SKIP_WAITING_ACCEPTED",
          requestId: data.requestId
        });
      })()
    );
  }
});
