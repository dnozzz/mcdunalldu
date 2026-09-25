import { useState } from "react";
import { bigMacMeal, photos } from "../data/menu.js";
import FoodImage from "./FoodImage.jsx";
import Ticker from "./Ticker.jsx";

export default function Hero({ onAdd }) {
  const [qty, setQty] = useState(1);
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div>
          <div className="pill"><i /> NOW SERVING PH • CRISPY • HOT • FRESH</div>
          <h1 className="hero-title">Love Ko &apos;To. <span>I&apos;m lovin&apos; it.</span></h1>
          <p className="sub">
            Big Mac, Chicken McDo, McSpaghetti at World Famous Fries — order via
            McDelivery, GrabFood o foodpanda. GCash at Maya accepted!
          </p>
          <div className="hero-btns">
            <button className="btn btn-red" onClick={() => onAdd(bigMacMeal, 1)}>
              🍔 Order Big Mac Meal — ₱219
            </button>
            <a href="#menu" className="btn btn-outline">Tingnan ang Menu →</a>
          </div>
          <div className="stats">
            <div><b>700+</b><small>Stores sa Pinas</small></div>
            <div><b>4.8 ★</b><small>App Rating</small></div>
            <div><b>₱99</b><small>Simula sa Sulit Busog</small></div>
          </div>
        </div>
        <div className="burger-card">
          <div className="price-tag">₱219 ONLY</div>
          <div className="burger-visual"><FoodImage src={photos.bigMac} alt="Big Mac Meal" emoji="🍔" className="food-photo hero-photo" eager /></div>
          <div className="burger-meta">
            <div><h3>Big Mac® Meal (Medium)</h3><div className="stars">★★★★★ 8.2k reviews</div></div>
            <div className="hero-price">₱219</div>
          </div>
          <p className="burger-desc">Dalawang beef patties, Big Mac sauce, fries + regular drink. Sulit busog!</p>
          <div className="add-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn btn-yellow" onClick={() => onAdd(bigMacMeal, qty)}>Add to Order</button>
          </div>
        </div>
      </div>
      <div className="hero-ticker">
        <Ticker />
      </div>
    </section>
  );
}
