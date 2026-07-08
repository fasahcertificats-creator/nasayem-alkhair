# Firebase Data Layer

Nasayem Alkhair keeps Firebase access inside the service layer. Pages and UI components must not import Firebase SDK modules directly.

## Required Environment Variables

Create `.env.local` from `.env.local.example` and provide:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Firestore Collection

Umrah content is read from:

```text
umrah_content
```

## Document Schema

Each valid document must match:

```ts
interface UmrahContent {
  id: string;
  title: string;
  stage: string;
  order: number;
  text: string;
  source: string;
  authenticity: string;
  notes?: string;
}
```

Documents missing required fields, or containing invalid field types, are ignored by the data service. Invalid documents are logged only in development.

## Test The Connection

After creating `.env.local`, run:

```bash
npm run check:firestore
```

The script connects to Firestore, reads `umrah_content`, prints the number of documents found, and prints the first document title when available.
