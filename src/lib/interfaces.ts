export interface ChartEntry {
  name: string;
  value: number;
}

// https://scryfall.com/docs/api/cards
export interface Card {
  // core card fields
  object: "card"; // always "card"
  id: string;
  scryfall_uri: URL;
  uri: URL;
  // gameplay fields
  cmc: number;
  color_identity: Colors[];
  legalities: "legal" | "not_legal" | "restricted" | "banned";
  name: string;
  type_line: string;
  // print fields
  // card face objects
  // related card objects
}

export interface Colors {
  color:
    | "W" // white
    | "U" // blue
    | "B" // black
    | "R" // red
    | "G"; // green
}
