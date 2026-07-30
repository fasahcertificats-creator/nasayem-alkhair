const MAX_EXTERNAL_URL_LENGTH = 2048;

export function isSafeHttpsUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_EXTERNAL_URL_LENGTH
  ) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
