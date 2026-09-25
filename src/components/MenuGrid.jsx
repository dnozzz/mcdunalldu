import { memo } from "react";
import { peso } from "../data/menu.js";
import FoodImage from "./FoodImage.jsx";

const MenuCard = memo(function MenuCard({ it, catId, onAdd, onCustomize }) {
  return (
    <div className="card">
      {it.tag ? <div className={`badge ${it.isNew ? "new" : ""}`}>{it.tag}</div> : null}
      <div className="card-img">
        <FoodImage src={it.img} alt={it.n} emoji={it.e} className="food-photo" />
      </div>
      <div className="card-body">
        <h3 title={it.n}>{it.n}</h3><p title={it.d}>{it.d}</p>
        <div className="card-foot">
          <span className="price">{peso(it.p)}</span>
          <div className="card-actions">
            <button className="customize" onClick={() => onCustomize(it, catId)} aria-label={`Customize ${it.n}`}>⚙️</button>
            <button className="add" onClick={() => onAdd(it)}>Add +</button>
          </div>
        </div>
      </div>
    </div>
  );
});

function MenuGrid({ categories, onAdd, onCustomize }) {
  return (
    <section className="section wrap" id="menu">
      <div className="eyebrow">Buong menu • Presyo sa piso</div>
      <h2 className="section-title">Paborito ng Pinoy</h2>
      <p className="muted lede">
        Mula almusal hanggang midnight merienda. Mainit, fresh, at sulit — lahat in Philippine Peso (₱).
      </p>
      <div className="cat-chips">
        {categories.map((c) => (
          <a key={c.id} href={`#cat-${c.id}`}>{c.title}</a>
        ))}
      </div>
      {categories.map((c) => (
        <div key={c.id} id={`cat-${c.id}`}>
          <h3 className="cat-title">{c.title}</h3>
          <p className="muted muted-sm">{c.sub}</p>
          <div className="grid">
            {c.items.map((it) => (
              <MenuCard key={it.n} it={it} catId={c.id} onAdd={onAdd} onCustomize={onCustomize} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default memo(MenuGrid);
