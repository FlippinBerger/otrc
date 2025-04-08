# Old Town Run Club Fort Collins, CO
Welcome to the home of our website's open source code! Written 100% by a human in neovim with no AI.

## Tech used
Client: Nuxt
Server: Fastify

## Dependencies
Node 22.14
pnpm
Postgres 17

## Running the app
I've been keeping it simple so far for local dev, just run postgres locally, and have a tab each for the server and client.
`brew services start postgresql`

`cd server`
`pnpm i`
`pnpm build && pnpm start`

in another tab
`cd vnuxt`
`pnpm i`
`pnpm dev`

