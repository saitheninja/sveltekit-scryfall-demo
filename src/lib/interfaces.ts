export interface ChartEntry {
  name: string;
  value: number;
}

export enum Colors {
  White = "W",
  Blue = "U",
  Black = "B",
  Red = "R",
  Green = "G",
  Colorless = "C",
}

// export interface Color {
//   name: string;
//   abbreviation: string;
//   hex_color: string;
// }
// export const allColors: Color[] = [
//   {
//     name: "white",
//     abbreviation: "W",
//     hex_color: "#FCFAD4",
//   },
//   {
//     name: "blue",
//     abbreviation: "U",
//     hex_color: "#A9DFF9",
//   },
//   {
//     name: "black",
//     abbreviation: "B",
//     hex_color: "#CCC3C1",
//   },
//   {
//     name: "red",
//     abbreviation: "R",
//     hex_color: "#F8AA8F",
//   },
//   {
//     name: "green",
//     abbreviation: "G",
//     hex_color: "#9CD4AF",
//   },
//   {
//     name: "colorless",
//     abbreviation: "C",
//     hex_color: "#D1DEDE",
//   },
// ];

// https://scryfall.com/docs/api/cards
export interface Card {
  // core card fields
  object: "card"; // always "card"
  id: string;
  scryfall_uri: URL;
  uri: URL;
  // gameplay fields
  cmc: number;
  color_identity: Colors[]; // e.g. ["W", "U"]
  legalities: "legal" | "not_legal" | "restricted" | "banned";
  name: string;
  type_line: string;
  // print fields
  // card face objects
  // related card objects
}
