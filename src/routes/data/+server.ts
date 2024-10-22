import dataJson from "./oracle-cards-20241017090203-1000-entries.json";

import { error } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import type { Card } from "$lib/interfaces";

const cards = dataJson as Card[];

export const GET: RequestHandler = ({ url }) => {
  const start = Number(url.searchParams.get("start"));
  const end = Number(url.searchParams.get("end"));

  if (isNaN(start) || isNaN(end)) {
    error(400, "Must provide range start and end.");
  }

  if (start > end) {
    error(400, "Start can't be greater than end.");
  }

  if (start < 1 || end > 1000) {
    error(400, "Start and end must be in range 1 to 1000.");
  }

  // slice() extracts up to but not including end
  const cardsRange = cards.slice(start - 1, end);

  return json(cardsRange);
};
