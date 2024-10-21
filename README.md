# Scryfall API Demo

This is a demo project built with SvelteKit (like Next.js for Svelte).
It has a demo login that saves data to the browser's local storage.
It uses data from [Scryfall](https://scryfall.com/docs/api) to generate some D3 charts.

## Run

```bash
  nix develop
  npm i
  npm run dev
```

or

```bash
  docker-compose up
```

## Routes

### `/`

Has `LogInForm` component. Will be redirected here if no log in data is in local storage.

### `/data`

Data from [Scryfall](https://scryfall.com/docs/api/bulk-data), hosted locally as a REST endpoint.

### `/scryfall`

UI to examine data.
Select range of cards.
Generate bar chart of CMCs.
Generate pie chart of color identities.
