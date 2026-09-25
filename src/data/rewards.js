// Loyalty points: earn 1 pt per ₱10 spent, redeem for free food.
// New members start with a 1,500-pt welcome bonus (matches site copy).
export const WELCOME_BONUS = 1500;
export const pointsFor = (pesos) => Math.floor(pesos / 10);

export const rewards = [
  {
    id: "free-coke", name: "FREE Coke (Medium)", cost: 300, emoji: "🥤",
    item: { e: "🥤", n: "Coke (Medium) — FREE Reward", p: 0 },
  },
  {
    id: "free-fries", name: "FREE Fries (Medium)", cost: 600, emoji: "🍟",
    item: { e: "🍟", n: "Fries (Medium) — FREE Reward", p: 0 },
  },
  {
    id: "free-cheeseburger", name: "FREE Cheeseburger", cost: 900, emoji: "🍔",
    item: { e: "🍔", n: "Cheeseburger — FREE Reward", p: 0 },
  },
  {
    id: "free-mcflurry", name: "FREE Oreo McFlurry", cost: 1100, emoji: "🍦",
    item: { e: "🍦", n: "Oreo McFlurry — FREE Reward", p: 0 },
  },
  {
    id: "free-bigmac", name: "FREE Big Mac", cost: 1500, emoji: "🍔",
    item: { e: "🍔", n: "Big Mac — FREE Reward", p: 0 },
  },
  {
    id: "free-chickenmeal", name: "FREE Chicken McDo Meal", cost: 1800, emoji: "🍗",
    item: { e: "🍗", n: "Chicken McDo Meal — FREE Reward", p: 0 },
  },
];
