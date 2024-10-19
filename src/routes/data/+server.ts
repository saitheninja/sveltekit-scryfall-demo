import dataJson from "./oracle-cards-20241017090203-1000-entries.json";

import { error } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

// https://scryfall.com/docs/api/cards
interface Card {
  object: "card"; // always "card"
  id: string;
}

const cards = dataJson as Card[];

export const GET: RequestHandler = ({ url }) => {
  const entryNo = Number(url.searchParams.get("number"));

  if (isNaN(entryNo) || entryNo < 1 || entryNo > 1000) {
    error(400, "Number must be in range 1-1000.");
  }

  const card = cards[entryNo - 1];
  // console.log(card);

  return json(card);
};
