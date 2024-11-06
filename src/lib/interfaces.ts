export interface ChartEntry {
  name: string;
  value: number;
}

// https://scryfall.com/docs/api/cards

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

enum LegalityStatus {
  "legal",
  "not_legal",
  "restricted",
  "banned",
}
export interface Legalities {
  standard: LegalityStatus;
  future: LegalityStatus;
  historic: LegalityStatus;
  timeless: LegalityStatus;
  gladiator: LegalityStatus;
  pioneer: LegalityStatus;
  explorer: LegalityStatus;
  modern: LegalityStatus;
  legacy: LegalityStatus;
  pauper: LegalityStatus;
  vintage: LegalityStatus;
  penny: LegalityStatus;
  commander: LegalityStatus;
  oathbreaker: LegalityStatus;
  standardbrawl: LegalityStatus;
  brawl: LegalityStatus;
  alchemy: LegalityStatus;
  paupercommander: LegalityStatus;
  duel: LegalityStatus;
  oldschool: LegalityStatus;
  premodern: LegalityStatus;
  predh: LegalityStatus;
}

// https://scryfall.com/docs/api/images
interface ImageURIs {
  small?: URL;
  normal?: URL;
  large?: URL;
  art_crop?: URL;
  border_crop?: URL;
  png?: URL;
}

enum Finishes {
  "foil",
  "nonfoil",
  "etched",
}

// https://scryfall.com/docs/api/frames
enum FrameEffects {
  "legendary",
  "miracle",
  "enchantment",
  "draft",
  "devoid",
  "tombstone",
  "colorshifted",
  "inverted",
  "sunmoondfc",
  "compasslanddfc",
  "originpwdfc",
  "mooneldrazidfc",
  "waxingandwaningmoondfc",
  "showcase",
  "extendedart",
  "companion",
  "etched",
  "snow",
  "lesson",
  "shatteredglass",
  "convertdfc",
  "fandfc",
  "upsidedowndfc",
  "spree",
}

enum Games {
  "paper",
  "arena",
  "mtgo",
}

// Multiface cards have a card_faces property containing at least two Card Face objects.
interface CardFaceObject {
  artist?: string;
  artist_id?: string;
  cmc?: number;
  color_indicator?: Colors[];
  colors?: Colors[];
  defense?: string;
  flavor_text?: string;
  illustration_id?: string;
  image_uris?: ImageURIs;
  layout?: string;
  loyalty?: string;
  mana_cost: string;
  name: string;
  object: "card_face";
  oracle_id?: string;
  oracle_text?: string;
  power?: string;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  toughness?: string;
  type_line?: string;
  watermark?: string;
}

// Cards that are closely related to other cards (because they call them by name, or generate a token, or meld, etc) have an all_parts property that contains Related Card objects.
interface RelatedCardObjects {
  id: string;
  object: "related_card";
  component: "token" | "meld_part" | "meld_result" | "combo_piece";
  name: string;
  type_line: string;
  uri: URL;
}

// Cards have the following core properties.
interface CoreCardFields {
  arena_id?: number;
  id: string;
  lang: string;
  mtgo_id?: number;
  mtgo_foil_id?: number;
  multiverse_ids?: number[];
  tcgplayer_id?: number;
  tcgplayer_etched_id?: number;
  cardmarket_id?: number;
  object: "card";
  layout: string;
  oracle_id?: string;
  prints_search_uri: URL;
  rulings_uri: URL;
  scryfall_uri: URL;
  uri: URL;
}

// Cards have the following properties relevant to the game rules.
interface GameplayFields {
  all_parts?: RelatedCardObjects[];
  card_faces?: CardFaceObject[];
  cmc: number;
  color_identity: Colors[]; // e.g. ["W", "U"]
  color_indicator?: Colors[];
  colors?: Colors[];
  defense?: string;
  edhrec_rank?: number;
  hand_modifier?: string;
  keywords: string[];
  legalities: Legalities;
  life_modifier?: string;
  loyalty?: string;
  mana_cost?: string;
  name: string;
  oracle_text?: string;
  penny_rank?: number;
  power?: string;
  produced_mana?: Colors[];
  reserved: boolean;
  toughness?: string;
  type_line?: string;
}

// Properties unique to their particular re/print.
interface PrintFields {
  artist?: string;
  artist_ids?: string[];
  attraction_lights?: string[]; // https://scryfall.com/search?q=t%3Aattraction+unique%3Aprints
  booster: boolean;
  border_color: "black" | "white" | "borderless" | "silver" | "gold";
  card_back_id: string;
  collector_number: string;
  content_warning?: boolean;
  digital: boolean;
  finishes: Finishes[];
  flavor_name?: string;
  flavor_text?: string;
  frame_effects?: FrameEffects[];
  frame: "1993" | "1997" | "2003" | "2015" | "future";
  full_art: boolean;
  games: Games[];
  highres_image: boolean;
  illustration_id?: string;
  image_status: "missing" | "placeholder" | "lowres" | "highres_scan";
  image_uris: ImageURIs;
  oversized: boolean;
  prices: {
    usd: string;
    usd_foil: string;
    usd_etched: string;
    eur: string;
    eur_foil: string;
    eur_etched: string;
    tix: string;
  };
  printed_name?: string;
  printed_text?: string;
  printed_type_line: string;
  promo: boolean;
  promo_types?: string[];
  purchase_uris?: {
    tcgplayer?: URL;
    cardmarket?: URL;
    cardhoarder?: URL;
  };
  rarity: "common" | "uncommon" | "rare" | "special" | "mythic" | "bonus";
  related_uris: {
    gatherer: URL;
    tcgplayer_infinite_articles: URL;
    tcgplayer_infinite_decks: URL;
    edhrec: URL;
  };
  released_at: string;
  reprint: boolean;
  scryfall_set_uri: URL;
  set_name: string;
  set_search_uri: URL;
  set_type: string;
  set_uri: URL;
  set: string;
  set_id: string;
  story_spotlight: boolean;
  textless: boolean;
  variation: boolean;
  variation_of?: string;
  security_stamp?: "oval" | "triangle" | "acorn" | "circle" | "arena" | "heart";
  watermark?: string;
  preview?: {
    previewed_at?: string;
    source_uri?: URL;
    source: string;
  };
}

export interface Card extends CoreCardFields, GameplayFields, PrintFields {}
