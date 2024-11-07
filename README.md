# Scryfall API Demo

This is a demo project built with SvelteKit (like Next.js for Svelte).
It has a demo log in that saves data to the browser's local storage.
It uses data from [the Scryfall API](https://scryfall.com/docs/api) to generate D3 charts and an HTML table.

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

Home page.

### `/log-in`

Has `LogInForm` component that sends a request to a REST endpoint.
Displays error message on failure.
On success, saves log in details to browser's local storage.

### `/scryfall`

UI to examine data.
Select range of cards to fetch from endpoint.
Generate bar chart of CMCs.
Generate pie chart of color identities.
Generate table of relevant data.

### `/data`

Data from [the Scryfall Bulk Data API](https://scryfall.com/docs/api/bulk-data), hosted locally as a REST endpoint.
