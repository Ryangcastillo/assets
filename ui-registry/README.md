# UI Registry

This repository contains a private registry compatible with the `shadcn/ui` CLI.

## Usage

Install components directly from the registry by pointing the CLI at the raw
`index.json` file:

```bash
npx shadcn@latest add --registry <REGISTRY_URL>/registry/index.json <component-id>
```

Each component ships with normalized destinations for `components` and `lib`
folders, and includes dependency metadata so the CLI can install peer and runtime
dependencies automatically.
