import { useMemo, useState } from "react";
import { ICE_LEVELS, SUGAR_LEVELS, configFor } from "../data/customize.js";
import FoodImage from "./FoodImage.jsx";

export default function CustomizeModal({ item, catId, onClose, onConfirm }) {
  const cfg = useMemo(() => configFor(item, catId), [item, catId]);
  const [size, setSize] = useState(cfg.sizes ? cfg.sizes.find((s) => s.delta === 0) || cfg.sizes[0] : null);
  const [addons, setAddons] = useState([]);
  const [freebies, setFreebies] = useState([]);
  const [ice, setIce] = useState("Regular ice");
  const [sugar, setSugar] = useState("100% sugar");
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);

  const toggle = (list, setList, id) =>
    setList((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const addonsTotal = addons.reduce(
    (s, id) => s + (cfg.addons.find((a) => a.id === id)?.price || 0),
    0
  );
  const unit = Math.max(0, item.p + (size?.delta || 0) + addonsTotal);
  const total = unit * qty;

  const parts = [];
  if (size && size.delta !== 0) parts.push(size.id);
  if (cfg.ice) parts.push(ice);
  if (cfg.sugar) parts.push(sugar);
  addons.forEach((id) => {
    const a = cfg.addons.find((x) => x.id === id);
    if (a) parts.push(`+${a.label}`);
  });
  freebies.forEach((f) => parts.push(f));
  if (notes.trim()) parts.push(`"${notes.trim()}"`);

  const confirm = () => {
    onConfirm(item, {
      unitPrice: unit,
      label: parts.length ? parts.join(" • ") : "As is",
      qty,
    });
  };

  return (
    <>
      <div className="modal-overlay show" onClick={onClose} />
      <div className="modal">
        <div className="modal-head">
          <h3>⚙️ Customize — {item.n}</h3>
          <button className="cart-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-top">
            <FoodImage src={item.img} alt={item.n} emoji={item.e} className="food-photo modal-photo" />
            <div>
              <p className="muted">{item.d}</p>
              <p><b>Base: ₱{item.p.toLocaleString("en-PH")}</b></p>
            </div>
          </div>

          {cfg.sizes && (
            <div className="opt-group">
              <b>Size</b>
              <div className="pills">
                {cfg.sizes.map((s) => (
                  <button
                    key={s.id}
                    className={size?.id === s.id ? "on" : ""}
                    onClick={() => setSize(s)}
                  >
                    {s.id} {s.delta !== 0 && `(${s.delta > 0 ? "+" : ""}₱${s.delta})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cfg.ice && (
            <div className="opt-group">
              <b>Yelo (ice)</b>
              <div className="pills">
                {ICE_LEVELS.map((l) => (
                  <button key={l} className={ice === l ? "on" : ""} onClick={() => setIce(l)}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {cfg.sugar && (
            <div className="opt-group">
              <b>Tamis (sugar)</b>
              <div className="pills">
                {SUGAR_LEVELS.map((l) => (
                  <button key={l} className={sugar === l ? "on" : ""} onClick={() => setSugar(l)}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {cfg.addons.length > 0 && (
            <div className="opt-group">
              <b>Dagdag (add-ons)</b>
              <div className="checks">
                {cfg.addons.map((a) => (
                  <label key={a.id} className={addons.includes(a.id) ? "on" : ""}>
                    <input
                      type="checkbox"
                      checked={addons.includes(a.id)}
                      onChange={() => toggle(addons, setAddons, a.id)}
                    />
                    {a.label} <span>+₱{a.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {cfg.freebies.length > 0 && (
            <div className="opt-group">
              <b>Libre (no charge)</b>
              <div className="pills">
                {cfg.freebies.map((f) => (
                  <button
                    key={f}
                    className={freebies.includes(f) ? "on" : ""}
                    onClick={() => toggle(freebies, setFreebies, f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="opt-group">
            <b>Special instructions</b>
            <input
              className="notes-input"
              placeholder="e.g. sawsawan please, extra tissue…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={80}
            />
          </div>
        </div>
        <div className="modal-foot">
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className="btn btn-yellow grow" onClick={confirm}>
            Add • ₱{total.toLocaleString("en-PH")}
          </button>
        </div>
      </div>
    </>
  );
}
