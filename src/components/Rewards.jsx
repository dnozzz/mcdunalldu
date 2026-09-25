import { photos } from "../data/menu.js";
import { rewards } from "../data/rewards.js";
import FoodImage from "./FoodImage.jsx";

export default function Rewards({ points, onRedeem }) {
  return (
    <section className="section wrap split" id="rewards">
      <div>
        <div className="eyebrow">MyMcDonald&apos;s Rewards PH</div>
        <h2 className="section-title">Kumita ng points kada kagat</h2>
        <p className="muted">
          <b className="pts-strong">⭐ {points.toLocaleString("en-PH")} pts</b> —
          1 pt kada ₱10 na gastos. I-redeem sa libreng pagkain!
        </p>
        <div className="reward-grid">
          {rewards.map((r) => {
            const can = points >= r.cost;
            return (
              <div className={`reward-card ${can ? "" : "locked"}`} key={r.id}>
                <span className="reward-emoji">{r.emoji}</span>
                <b>{r.name}</b>
                <small>⭐ {r.cost.toLocaleString("en-PH")} pts</small>
                <button
                  className={`btn ${can ? "btn-red" : "btn-outline"}`}
                  disabled={!can}
                  onClick={() => onRedeem(r)}
                >
                  {can ? "Redeem" : "Kulang pa"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="phone"><div className="screen">
          <div className="screen-title">MyMcDonald&apos;s PH</div>
          <div className="reward-points">
            ⭐ {points.toLocaleString("en-PH")} pts
          </div>
          <small className="muted">nidagdag kada checkout</small>
          <div className="screen-mock"><FoodImage src={photos.fries} alt="Free Fries" emoji="🍟" className="food-photo reward-photo" /></div>
          <div className="screen-card">
            {points >= 600 ? "LIBRENG FRIES UNLOCKED 🍟" : `₱${((600 - points) * 10).toLocaleString("en-PH")} pa para sa Free Fries`}
          </div>
          <ul className="checks checks-left">
            <li>1 pt kada ₱10 — auto-credit sa checkout</li>
            <li>Member-only Payday deals</li>
            <li>Birthday treat kada taon</li>
          </ul>
        </div></div>
      </div>
    </section>
  );
}
