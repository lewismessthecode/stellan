#!/usr/bin/env node
import { DatabaseSync } from "node:sqlite"
import { createHash, randomBytes } from "node:crypto"
import { existsSync, renameSync } from "node:fs"
import { basename, dirname, join } from "node:path"

const [cmd = "help", ...rest] = process.argv.slice(2)
const path = process.env.DATABASE_PATH ?? "./data/trove.db"
const url = (process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`).replace(
  /\/$/,
  "",
)

function adoptLegacyDatabase(file) {
  if (basename(file) !== "trove.db" || existsSync(file)) return
  const legacy = join(dirname(file), "stardash.db")
  if (!existsSync(legacy)) return
  renameSync(legacy, file)
  for (const suffix of ["-wal", "-shm"]) {
    const from = legacy + suffix
    if (existsSync(from)) renameSync(from, file + suffix)
  }
}

const open = () => {
  if (path !== ":memory:") adoptLegacyDatabase(path)
  const db = new DatabaseSync(path)
  db.exec("pragma busy_timeout = 5000")
  return db
}
const owner = (db) => {
  const row = db.prepare("select id, github_username from profiles limit 1").get()
  if (!row) {
    console.error(`No one has signed in to this instance yet (${path}). Open ${url} first.`)
    process.exit(1)
  }
  return row
}
const config = (token) =>
  JSON.stringify(
    {
      mcpServers: {
        trove: {
          type: "http",
          url: `${url}/api/mcp`,
          headers: { Authorization: `Bearer ${token}` },
        },
      },
    },
    null,
    2,
  )

switch (cmd) {
  case "token": {
    const db = open()
    const { id: userId, github_username } = owner(db)
    const token = `trove_${randomBytes(24).toString("hex")}`
    const hash = createHash("sha256").update(token).digest("hex") // same as lib/api-tokens.ts
    db.prepare("insert into api_tokens (user_id, name, token_hash) values (?, ?, ?)").run(
      userId,
      rest[0] ?? "cli",
      hash,
    )
    console.log(`Token for @${github_username} (shown once):\n\n  ${token}\n\nMCP client config:\n`)
    console.log(config(token))
    break
  }
  case "tokens": {
    const db = open()
    const rows = db
      .prepare("select id, name, created_at, last_used_at from api_tokens order by created_at desc")
      .all()
    if (rows.length === 0) console.log("No tokens. Create one: trove token <name>")
    for (const r of rows)
      console.log(
        `${r.id}  ${r.name.padEnd(16)}  created ${r.created_at.slice(0, 10)}  last used ${r.last_used_at?.slice(0, 10) ?? "never"}`,
      )
    break
  }
  case "revoke": {
    if (!rest[0]) {
      console.error("Usage: trove revoke <id>")
      process.exit(1)
    }
    const n = open().prepare("delete from api_tokens where id = ?").run(rest[0]).changes
    console.log(n ? "Revoked." : "No token with that id.")
    break
  }
  case "mcp-config":
    console.log(config(rest[0] ?? "<token from `trove token`>"))
    break
  default:
    console.log(`trove <command>

  token [name]      Create a bearer token for MCP clients and print the client config
  tokens            List tokens
  revoke <id>       Revoke a token
  mcp-config [tok]  Print MCP client config for ${url}/api/mcp

Env: DATABASE_PATH (default ./data/trove.db), APP_URL, PORT`)
}
