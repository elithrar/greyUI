# greyUI docs

A single-page Vite site that imports the library directly from `../src` so every example exercises the source package.

```bash
npm run dev:docs
npm run build:docs
npm run verify:docs
npm run deploy:docs
```

`wrangler.jsonc` deploys `docs/dist` as Workers Static Assets with SPA fallback. There is no Worker runtime script.
