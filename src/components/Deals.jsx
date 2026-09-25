import { photos } from "../data/menu.js";
import FoodImage from "./FoodImage.jsx";

export default function Deals({ onToast }) {
  return (
    <section className="wrap" id="deals">
      <div className="deal">
        <div className="deal-left">
          <div className="eyebrow deal-eyebrow">Limitado lang • PH exclusive</div>
          <h2>Buy 1 Take 1 Burger McDo — ₱99</h2>
          <p>Chicken McDo, Burger McDo, McChicken o Cheeseburger. Sa app lang. GCash / Maya / COD pwede. Hanggang Sunday!</p>
          <div className="row">
            <button className="btn btn-yellow" onClick={() => onToast("Deal applied: B1T1 ₱99 🎉")}>Kunin ang Deal</button>
            <button className="btn btn-white" onClick={() => onToast("Terms: concept demo, PH pricing")}>Tingnan Terms</button>
          </div>
        </div>
        <div className="deal-right"><FoodImage src={photos.burgerMcDo} alt="Burger McDo" emoji="🍔" className="food-photo deal-photo" /></div>
      </div>
    </section>
  );
}
