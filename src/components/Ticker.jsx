import { memo } from "react";

const items = [
  "🛵 McDELIVERY",
  "🍟 WORLD FAMOUS FRIES",
  "🍗 CHICKEN McDO",
  "🍝 McSPAGHETTI",
  "🍔 BIG MAC",
  "🍔 BURGER McDO",
  "🍦 McFLURRY OREO",
  "☕ McCAFÉ",
];

function Ticker() {
  const row = (hidden) => (
    <span className="ticker-track" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i}>
          {t} <i>•</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="ticker">
      {row(false)}
      {row(true)}
    </div>
  );
}

export default memo(Ticker);
