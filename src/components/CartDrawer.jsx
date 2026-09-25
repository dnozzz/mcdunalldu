import { useState } from "react";
import PaymentStep from "./PaymentStep.jsx";
import { deliveryFee } from "../data/delivery.js";

export default function CartDrawer({ open, lines, onClose, onInc, onDec, onRemove, onCheckout, placed, branchName, km, feeLabel, freeOver }) {
  const subtotal = lines.reduce((s, l) => s + l.p * l.qty, 0);
  const delivery = deliveryFee(subtotal, km);
  const total = subtotal + delivery;
  const [step, setStep] = useState("cart");
  const [wasOpen, setWasOpen] = useState(open);
  // Reset to cart view whenever the drawer closes (render-time adjustment)
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setStep("cart");
  }

  return (
    <>
      <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-head">
          <div>
            <h3>🍟 Your Order</h3>
            <small className="muted">{branchName ? `🛵 From: ${branchName}` : "📍 No branch chosen — pick one in Stores"}</small>
          </div>
          <button className="cart-x" onClick={onClose}>✕</button>
        </div>

        {placed ? (
          <div className="cart-empty">
            <div className="big-emoji">🛵</div>
            <h4>Salamat! Order #{placed} confirmed</h4>
            <p className="muted">Subaybayan ang rider sa live map! 🗺️</p>
            <button className="btn btn-red" onClick={onClose}>Track My Order 🛵</button>
          </div>
        ) : step === "pay" ? (
          <div className="cart-pay-wrap">
            <PaymentStep total={total} onBack={() => setStep("cart")} onPaid={onCheckout} />
          </div>
        ) : lines.length === 0 ? (
          <div className="cart-empty">
            <div className="big-emoji">🍔</div>
            <h4>Walang laman ang cart</h4>
            <p className="muted">Gutom ka pa? Dagdagan mo na yan!</p>
            <button className="btn btn-yellow" onClick={onClose}>Mag-order Na</button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((l) => (
                <div className="cart-line" key={l.key || l.n}>
                  <span className="cart-emoji">{l.e}</span>
                  <div className="cart-info">
                    <b>{l.n}</b>
                    {l.options && <small className="cart-opts">⚙️ {l.options}</small>}
                    <small>{l.p === 0 ? "FREE reward 🎉" : `₱${l.p.toLocaleString("en-PH")} each`}</small>
                    <div className="cart-qty">
                      <button onClick={() => onDec(l.key || l.n)}>−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => onInc(l.key || l.n)}>+</button>
                    </div>
                  </div>
                  <div className="cart-right">
                    <b>{l.p === 0 ? "FREE" : `₱${(l.p * l.qty).toLocaleString("en-PH")}`}</b>
                    <button className="cart-rm" onClick={() => onRemove(l.key || l.n)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><b>₱{subtotal.toLocaleString("en-PH")}</b></div>
              <div>
                <span>Delivery 🚗 {feeLabel} {delivery === 0 && subtotal > 0 && `(FREE over ₱${freeOver} 🎉)`}</span>
                <b>{delivery === 0 ? "FREE" : `₱${delivery}`}</b>
              </div>
              <div className="grand"><span>Total</span><b>₱{total.toLocaleString("en-PH")}</b></div>
              <button className="btn btn-red full" onClick={() => setStep("pay")}>
                Checkout • ₱{total.toLocaleString("en-PH")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
