# Gallery

Next.js application that consumes the private shadcn-compatible registry and allows browsing,
filtering, saving collections, and exporting component bundles via the official CLI.

## Scripts

```bash
pnpm install
pnpm dev
```

To run the export CLI by hand:

```bash
pnpm tsx tools/export-cli.ts \
  --collection ./collections/ai-starter.json \
  --registry http://localhost:3000/registry/index.json \
  --template empty \
  --pm pnpm
```
