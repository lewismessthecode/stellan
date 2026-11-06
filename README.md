# Trove

Trove is a fork of [StarDash](https://github.com/boffti/stardash). It is a local dashboard for the GitHub repositories you have starred.

StarDash is copyright (c) 2026 StarDash Contributors and is licensed under the MIT License. That notice is in [LICENSE](LICENSE). Trove keeps the notice. The original project remains [boffti/stardash](https://github.com/boffti/stardash).

## What this fork changes

This fork keeps StarDash's star list, Radar, health reports, and MCP server. The changes are in the workspace.

- The interface is available in English and Simplified Chinese. The language control is in the sidebar.
- A repository graph links starred repositories that share a tag, a collection, or a topic.
- The workspace layout and navigation were rebuilt around that graph.
- The container image published for StarDash is the upstream app. Build the Dockerfile in this repository to run Trove.

## Run it locally

Install Node.js 22.5 or later, and pnpm.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000 and connect GitHub. The first account to sign in owns the instance.

AI features need a configured provider. Search and Radar work without one. The variables are in [.env.example](.env.example).

## Run it in Docker

The StarDash image on GHCR is the upstream app. This compose file builds Trove from the Dockerfile in this repository.

```sh
docker compose up --build -d
```

The database file is `/data/trove.db` on the `trove-data` volume. If an older checkout stored `/data/stardash.db` and `trove.db` is not there yet, the server renames the old file on its first start.

A volume created by the old compose project is named `stardash-data`. That volume is separate. Copy the database file if you still need it.

An existing browser signs in again, because the session cookie name changed. Theme and language return to the defaults, because the local storage keys changed. Mint MCP tokens again. Tokens created earlier no longer verify.

## License

MIT. Copyright (c) 2026 StarDash Contributors. The full notice is in [LICENSE](LICENSE).
