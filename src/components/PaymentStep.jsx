import { useEffect, useState } from "react";

const METHODS = [
  { id: "qr", icon: "📱", name: "QR Ph", desc: "GCash / Maya — scan to pay" },
  { id: "card", icon: "💳", name: "Card Tap", desc: "Debit / credit, tap to pay" },
  { id: "cod", icon: "💵", name: "COD", desc: "Cash on delivery" },
];

// Deterministic faux-QR (clearly demo — not scannable)
function FauxQR({ seed }) {
  const N = 21;
  let h = 7;
  for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => (h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32;
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let on;
      if (inFinder(x, y)) {
        const lx = x >= N - 8 ? x - (N - 8) : x;
        const ly = y >= N - 8 ? y - (N - 8) : y;
        const edge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        on = edge || core;
      } else {
        on = rand() > 0.52;
      }
      cells.push(on);
    }
  }
  return (
    <div className="faux-qr" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {cells.map((on, i) => (
        <span key={i} className={on ? "on" : ""} />
      ))}
    </div>
  );
}

function QRPay({ total, onPaid }) {
  const [secs, setSecs] = useState(300);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  if (secs <= 0) {
    return (
      <div className="stack center">
        <p className="muted">⏰ QR expired. Generate a new one.</p>
        <button className="btn btn-red" onClick={() => setSecs(300)}>Generate New QR</button>
      </div>
    );
  }
  return (
    <div className="stack center">
      <FauxQR seed={`MCD-${total}-DEMO`} />
      <small className="muted">Demo QR — do not scan • expires in {mm}:{ss}</small>
      <b className="hero-price">₱{total.toLocaleString("en-PH")}</b>
      <button className="btn btn-red full" onClick={() => onPaid("QR Ph (GCash/Maya)")}>
        I Already Scanned — Paid ✓
      </button>
    </div>
  );
}

function CardPay({ total, onPaid }) {
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [busy, setBusy] = useState(false);
  const digits = num.replace(/\D/g, "").slice(0, 16);
  const ok = digits.length === 16 && name.trim().length > 1 && /^\d{2}\/\d{2}$/.test(exp);
  const pay = () => {
    if (!ok || busy) return;
    setBusy(true);
    setTimeout(() => onPaid(`Card •• ${digits.slice(-4)}`), 1600);
  };
  return (
    <div className="stack">
      <div className="demo-card">
        <span>💳</span>
        <b>{digits.replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••"}</b>
        <small>{name || "CARDHOLDER NAME"} • {exp || "MM/YY"}</small>
      </div>
      <input
        className="notes-input" placeholder="Card number (16 digits)"
        value={digits.replace(/(.{4})/g, "$1 ").trim()}
        onChange={(e) => setNum(e.target.value)} inputMode="numeric"
      />
      <input
        className="notes-input" placeholder="Cardholder name"
        value={name} onChange={(e) => setName(e.target.value)}
      />
      <input
        className="notes-input" placeholder="Expiry MM/YY" maxLength={5}
        value={exp}
        onChange={(e) => {
          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
          if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
          setExp(v);
        }}
      />
      <button className="btn btn-yellow full" disabled={!ok || busy} onClick={pay}>
        {busy ? "📲 Tapping… processing…" : `📲 Tap to Pay ₱${total.toLocaleString("en-PH")}`}
      </button>
      <small className="muted center">Demo only — no real charge.</small>
    </div>
  );
}

export default function PaymentStep({ total, onBack, onPaid }) {
  const [method, setMethod] = useState("qr");
  return (
    <div className="pay-step">
      <button className="pay-back" onClick={onBack}>← Back to cart</button>
      <h3>💰 Bayaran — ₱{total.toLocaleString("en-PH")}</h3>
      <div className="pay-methods">
        {METHODS.map((m) => (
          <button
            key={m.id}
            className={`pay-method ${method === m.id ? "on" : ""}`}
            onClick={() => setMethod(m.id)}
          >
            <span>{m.icon}</span>
            <b>{m.name}</b>
            <small>{m.desc}</small>
          </button>
        ))}
      </div>
      {method === "qr" && <QRPay total={total} onPaid={onPaid} />}
      {method === "card" && <CardPay total={total} onPaid={onPaid} />}
      {method === "cod" && (
        <div className="stack center">
          <div className="big-emoji">💵</div>
          <p className="muted">Ihanda ang <b>₱{total.toLocaleString("en-PH")}</b> — sukli available sa rider.</p>
          <button className="btn btn-red full" onClick={() => onPaid("Cash on Delivery")}>
            Confirm COD Order
          </button>
        </div>
      )}
    </div>
  );
}
