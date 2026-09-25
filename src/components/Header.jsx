import { useState } from "react";

export default function Header({ cartCount, points, theme, onToggleTheme, onToast, onOpenCart }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site">
      <div className="wrap">
        <nav className="site-nav">
          <a className="logo" href="#">
            <div className="arches" /> McDonald&apos;s <span className="ph-badge">PH</span>
          </a>
          <div className={`links ${open ? "open" : ""}`} id="links">
            <a href="#menu">Menu</a>
            <a href="#deals">Sulit Deals</a>
            <a href="#ai">🤖 AI Buddy</a>
            <a href="#rewards">Rewards</a>
            <a href="#stores">Stores</a>
            <a href="#app">McDelivery</a>
          </div>
          <div className="nav-cta">
            <button className="theme-toggle" onClick={onToggleTheme} title="Toggle dark / light">
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <span className="points-pill" title="MyMcDonald's points">⭐ {points.toLocaleString("en-PH")}</span>
            <button className="cart" onClick={onOpenCart}>
              🍟 Cart <b>{cartCount}</b>
            </button>
            <button className="btn btn-red" onClick={() => onToast("Order started! Pickup in 5 min 🚗")}>
              Order Now
            </button>
            <button className="hamburger" onClick={() => setOpen((o) => !o)}>☰</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
