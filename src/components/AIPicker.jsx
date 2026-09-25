import { useState } from "react";
import { categories, menuItems } from "../data/menu.js";
import FoodImage from "./FoodImage.jsx";

const PREFS = [
  { id: "any", label: "Kahit ano 🍽️" },
  { id: "combos", label: "Sulit Combos 🍱" },
  { id: "burgers", label: "Burgers 🍔" },
  { id: "chicken", label: "Chicken 🍗" },
  { id: "breakfast", label: "Breakfast 🍳" },
  { id: "sides", label: "Fries & Desserts 🍟" },
  { id: "drinks", label: "Drinks 🥤" },
  { id: "mccafe", label: "McCafé ☕" },
];

const PRESETS = [99, 199, 299, 500];

// 0/1 knapsack: maximize item count, tiebreak on total value.
// Shuffled pool each run so "Surprise me" varies.
function buildOrder(budget, prefId) {
  const cat = categories.find((c) => c.id === prefId);
  const base = prefId === "any" || !cat ? menuItems : cat.items;
  const pool = [...base].sort(() => Math.random() - 0.5);
  const W = Math.max(0, Math.min(Math.floor(budget) || 0, 5000));
  const dp = Array.from({ length: W + 1 }, () => ({ count: 0, value: 0, picks: [] }));
  pool.forEach((it, idx) => {
    for (let w = W; w >= it.p; w--) {
      const prev = dp[w - it.p];
      const cur = dp[w];
      if (
        prev.count + 1 > cur.count ||
        (prev.count + 1 === cur.count && prev.value + it.p > cur.value)
      ) {
        dp[w] = { count: prev.count + 1, value: prev.value + it.p, picks: [...prev.picks, idx] };
      }
    }
  });
  let best = dp[0];
  for (let w = 1; w <= W; w++) {
    const c = dp[w];
    if (c.count > best.count || (c.count === best.count && c.value > best.value)) best = c;
  }
  return best.picks.map((i) => pool[i]);
}

export default function AIPicker({ onAddMany, onToast }) {
  const [budget, setBudget] = useState(299);
  const [pref, setPref] = useState("any");
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);

  const cheapest = Math.min(...menuItems.map((i) => i.p));

  const run = () => {
    if (!budget || budget < cheapest) {
      onToast(`Budget mo kulang — cheapest namin ₱${cheapest} (Vanilla Cone 🍦)`);
      return;
    }
    setThinking(true);
    setResult(null);
    setTimeout(() => {
      const picks = buildOrder(budget, pref);
      const total = picks.reduce((s, p) => s + p.p, 0);
      setResult({ picks, total, leftover: budget - total });
      setThinking(false);
    }, 700);
  };

  return (
    <section className="section wrap" id="ai">
      <div className="ai-panel">
        <div className="eyebrow">🤖 AI Order Buddy</div>
        <h2 className="section-title">Sabihin mo budget, ako bahala!</h2>
        <p className="muted mb16">
          Pipili ang AI ng pinaka-sulit na combination — pinakamaraming items sa budget mo.
        </p>
        <div className="ai-controls">
          <label>
            Budget (₱)
            <input
              type="number" min={cheapest} max={5000} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </label>
          <label>
            Craving
            <select value={pref} onChange={(e) => setPref(e.target.value)}>
              {PREFS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <button className="btn btn-red" onClick={run} disabled={thinking}>
            {thinking ? "🤔 Nag-iisip…" : "🤖 Piliin Mo Ako!"}
          </button>
        </div>
        <div className="ai-presets">
          {PRESETS.map((p) => (
            <button key={p} className={budget === p ? "on" : ""} onClick={() => setBudget(p)}>
              ₱{p}
            </button>
          ))}
        </div>

        {thinking && <p className="muted mt16">⏳ Tinitimbang ang 51 items sa budget mo…</p>}

        {result && (
          <div className="ai-result">
            <h3>🍟 AI Suggests — ₱{result.total.toLocaleString("en-PH")}
              <small> (sukli: ₱{result.leftover.toLocaleString("en-PH")})</small>
            </h3>
            <div className="ai-picks">
              {result.picks.map((p) => (
                <div className="ai-pick" key={p.n}>
                  <FoodImage src={p.img} alt={p.n} emoji={p.e} className="food-photo ai-thumb" />
                  <div><b>{p.n}</b><br /><small>₱{p.p.toLocaleString("en-PH")}</small></div>
                </div>
              ))}
            </div>
            <div className="row mt16">
              <button className="btn btn-yellow" onClick={() => { onAddMany(result.picks); onToast(`${result.picks.length} items nadagdag sa cart! 🛒`); }}>
                Add All to Cart 🛒
              </button>
              <button className="btn btn-outline" onClick={run}>🎲 Surprise Me Again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
