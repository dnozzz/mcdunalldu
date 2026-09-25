// Per-PRODUCT-TYPE customization rules.
// Ice only on iced beverages, extra patties only on burgers,
// extra rice/gravy only on rice meals — resolved by item.type
// (via ITEM_TYPES keyed on item name), with category fallback.

export const SIZES = {
  meal: [
    { id: "Solo", delta: 0 },
    { id: "Meal M (+fries + drink)", delta: 60 },
    { id: "Meal L (+fries + drink)", delta: 85 },
  ],
  fries: [
    { id: "Small", delta: -20 },
    { id: "Medium", delta: 0 },
    { id: "Large", delta: 25 },
  ],
  drinks: [
    { id: "Small", delta: -10 },
    { id: "Medium", delta: 0 },
    { id: "Large", delta: 15 },
  ],
  dessert: [
    { id: "Regular", delta: 0 },
    { id: "Large", delta: 30 },
  ],
};

const ADDON_DEFS = {
  patty: { id: "patty", label: "Extra beef patty", price: 60 },
  fillet: { id: "fillet", label: "Extra chicken fillet", price: 65 },
  cheese: { id: "cheese", label: "Extra cheese", price: 25 },
  egg: { id: "egg", label: "Extra egg", price: 30 },
  sauce: { id: "sauce", label: "Extra sauce", price: 15 },
  sausage: { id: "sausage", label: "Extra sausage", price: 45 },
  rice: { id: "rice", label: "Extra rice", price: 35 },
  gravy: { id: "gravy", label: "Extra gravy", price: 15 },
  drink55: { id: "drink", label: "Add regular drink", price: 55 },
  friesUp: { id: "fries-up", label: "Upsize fries to Large", price: 25 },
  drinkUp: { id: "drink-up", label: "Upsize drink to Large", price: 20 },
  cheesePowder: { id: "cheese-powder", label: "Cheese powder", price: 20 },
  oreo: { id: "oreo", label: "Extra Oreo bits", price: 20 },
  fudge: { id: "fudge", label: "Extra fudge/caramel", price: 20 },
  shot: { id: "shot", label: "Extra espresso shot", price: 40 },
  oat: { id: "oat", label: "Oat milk instead", price: 30 },
  whip: { id: "whip", label: "Whipped cream", price: 25 },
  dip: { id: "dip", label: "Extra dip (BBQ/sweet'n'sour)", price: 10 },
  nuggets: { id: "nuggets", label: "Extra 2-pc nuggets", price: 45 },
  hashpiece: { id: "hashpiece", label: "Extra hash brown piece", price: 30 },
};

const at = (...ids) => ids.map((id) => ADDON_DEFS[id]);

// Product-type configs
const TYPE_CONFIG = {
  // Burgers — the ONLY type with extra patties + fillings
  burger: {
    sizes: SIZES.meal, addons: at("patty", "cheese", "egg", "sauce"),
    freebies: ["No onions", "No pickles", "No mayo", "Well-done patty"],
  },
  "chicken-sandwich": {
    sizes: SIZES.meal, addons: at("fillet", "cheese"),
    freebies: ["No mayo", "No lettuce", "Well-done fillet"],
  },
  // Rice meals — the ONLY types with extra rice + gravy
  "rice-meal": {
    sizes: null, addons: at("rice", "gravy", "drink55"),
    freebies: ["Extra crispy", "Gravy on the side"],
  },
  "spag-meal": {
    sizes: null, addons: at("gravy", "drink55"),
    freebies: ["Extra crispy", "Gravy on the side"],
  },
  "nuggets-meal": {
    sizes: null, addons: at("nuggets", "dip"),
    freebies: ["Well-done", "Mixed dips"],
  },
  combo: {
    sizes: null, addons: at("friesUp", "drinkUp"),
    freebies: ["Gravy on the side"],
  },
  // Fries & snacks
  fries: {
    sizes: SIZES.fries, addons: at("cheesePowder"),
    freebies: ["No salt", "Extra salt", "Well-done crisp"],
  },
  snack: {
    sizes: null, addons: at("cheesePowder"),
    freebies: ["No salt", "Extra salt"],
  },
  hashbrowns: {
    sizes: null, addons: at("hashpiece"),
    freebies: ["Well-done crisp"],
  },
  // Desserts
  mcflurry: {
    sizes: SIZES.dessert, addons: at("oreo"), freebies: [],
  },
  sundae: {
    sizes: SIZES.dessert, addons: at("fudge"), freebies: [],
  },
  cone: { sizes: null, addons: [], freebies: [] },
  pie: { sizes: null, addons: [], freebies: ["Warmed up"] },
  bakery: {
    sizes: null, addons: [], freebies: ["Warmed up", "Sliced"],
  },
  // Iced beverages — the ONLY types with ice options
  soda: { sizes: SIZES.drinks, addons: [], freebies: [], ice: true },
  float: {
    sizes: SIZES.drinks, addons: at("whip"), freebies: [], ice: true,
  },
  juice: { sizes: SIZES.drinks, addons: [], freebies: [], ice: true },
  smoothie: { sizes: SIZES.drinks, addons: [], freebies: [], ice: true },
  "espresso-iced": {
    sizes: SIZES.drinks, addons: at("shot", "oat"), freebies: [],
    ice: true, sugar: true,
  },
  frappe: {
    sizes: SIZES.drinks, addons: at("shot"), freebies: ["Extra whipped cream"],
    sugar: true,
  },
  // Hot beverages — never ice
  "espresso-hot": {
    sizes: SIZES.drinks, addons: at("shot", "oat"), freebies: [],
  },
  "chocolate-hot": {
    sizes: SIZES.drinks, addons: at("whip"), freebies: [],
  },
  // Breakfast mains
  "breakfast-sandwich": {
    sizes: null, addons: at("egg", "cheese", "sausage"),
    freebies: ["Well-done egg"],
  },
  eggdesal: {
    sizes: null, addons: at("egg", "cheese"),
    freebies: ["Toasted well"],
  },
  hotcakes: {
    sizes: null, addons: at("sausage"),
    freebies: ["Extra syrup", "Extra butter"],
  },
};

// Item name → product type (covers the full 51-item menu)
const ITEM_TYPES = {
  // Combos
  "Big Mac Meal (Medium)": "combo",
  "1-pc Chicken McDo Meal": "combo",
  "Chicken McDo + McSpaghetti Combo": "combo",
  "Burger McDo Meal": "combo",
  "McChicken Meal": "combo",
  "Nuggets Happy Meal": "combo",
  // Burgers
  "Big Mac (Solo)": "burger",
  "Quarter Pounder with Cheese": "burger",
  "Double Cheeseburger": "burger",
  Cheeseburger: "burger",
  "Burger McDo": "burger",
  "McChicken Sandwich": "chicken-sandwich",
  "Crispy Chicken Sandwich": "chicken-sandwich",
  // Chicken & platters
  "1-pc Chicken McDo w/ Rice": "rice-meal",
  "2-pc Chicken McDo w/ Rice": "rice-meal",
  "1-pc Chicken McDo w/ McSpaghetti": "spag-meal",
  "6-pc Nuggets w/ Fries": "nuggets-meal",
  "Crispy Chicken Fillet w/ Rice": "rice-meal",
  // Breakfast
  "Cheesy Eggdesal": "eggdesal",
  "Sausage McMuffin w/ Egg": "breakfast-sandwich",
  "Sausage Platter with Rice": "rice-meal",
  "Hash Browns (2-pc)": "hashbrowns",
  "2-pc Hotcakes w/ Sausage": "hotcakes",
  // Fries & desserts
  "World Famous Fries (Medium)": "fries",
  Poptato: "snack",
  "Oreo McFlurry": "mcflurry",
  "Hot Fudge Sundae": "sundae",
  "Caramel Sundae": "sundae",
  "Vanilla Sundae Cone": "cone",
  "Taro Custard Pie": "pie",
  "Choco Pie": "pie",
  // Drinks
  "Coke (Medium)": "soda",
  "Coke Zero (Medium)": "soda",
  "Coke McFloat": "float",
  "Orange Juice": "juice",
  "Premium Roast Coffee": "espresso-hot",
  "A&W Root Beer": "soda",
  "A&W McFloat": "float",
  // McCafé
  "Espresso (Solo)": "espresso-hot",
  Americano: "espresso-hot",
  "Iced Americano": "espresso-iced",
  "Café Latte": "espresso-hot",
  "Iced Latte": "espresso-iced",
  Cappuccino: "espresso-hot",
  Macchiato: "espresso-hot",
  "Premium Hot Chocolate": "chocolate-hot",
  "Mocha Frappe": "frappe",
  "Caramel Frappe": "frappe",
  "Double Choco Frappe": "frappe",
  "Iced Mocha": "espresso-iced",
  "Strawberry Smoothie": "smoothie",
  "Chocolate Chip Cookie": "bakery",
  "Oreo Cheesecake": "bakery",
  "Blueberry Cheesecake": "bakery",
  "Dark Chocolate Fudge Cake": "bakery",
};

export const typeOf = (item) => ITEM_TYPES[item?.n] || null;

// Category fallback (kept for safety)
const CAT_FALLBACK = {
  burgers: "burger",
  chicken: "rice-meal",
  breakfast: "eggdesal",
  sides: "fries",
  drinks: "soda",
  mccafe: "espresso-hot",
  combos: "combo",
};

export function configFor(item, catId) {
  const t = typeOf(item) || CAT_FALLBACK[catId];
  return TYPE_CONFIG[t] || { sizes: null, addons: [], freebies: [] };
}

export const ICE_LEVELS = ["Less ice", "Regular ice", "More ice", "No ice"];
export const SUGAR_LEVELS = ["0% sugar", "50% sugar", "100% sugar"];
