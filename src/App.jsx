import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import AIPicker from "./components/AIPicker.jsx";
import AppSection from "./components/AppSection.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CustomizeModal from "./components/CustomizeModal.jsx";
import Deals from "./components/Deals.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MenuGrid from "./components/MenuGrid.jsx";
import Rewards from "./components/Rewards.jsx";
import Reveal from "./components/Reveal.jsx";
import Ticker from "./components/Ticker.jsx";
import Toast from "./components/Toast.jsx";
// Leaflet is heavy — code-split the two map views so first paint stays fast test
const StoreLocator = lazy(() => import("./components/StoreLocator.jsx"));
const OrderTracker = lazy(() => import("./components/OrderTracker.jsx"));

function MapFallback() {
  return <div className="wrap"><div className="map-skeleton">🗺️ Loading map…</div></div>;
}
import { categories } from "./data/menu.js";
import { FREE_OVER, deliveryFee, feeLabel, havKm, nearestStore } from "./data/delivery.js";
import { WELCOME_BONUS, pointsFor } from "./data/rewards.js";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("mcd-cart")) || [];
  } catch {
    return [];
  }
}
function loadPoints() {
  try {
    const v = localStorage.getItem("mcd-points");
    return v === null ? WELCOME_BONUS : Number(v) || 0;
  } catch {
    return WELCOME_BONUS;
  }
}

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [points, setPoints] = useState(loadPoints);
  const [custom, setCustom] = useState(null); // { item, catId }
  const [order, setOrder] = useState(null);   // active delivery
  const [customer, setCustomer] = useState(null);
  const [branches, setBranches] = useState([]); // real stores from map
  const [branch, setBranch] = useState(null);   // chosen origin branch

  // Customer location resolved once on mount (geolocation → Manila fallback)
  useEffect(() => {
    const fallback = { lat: 14.5995, lon: 120.9842 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCustomer({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCustomer(fallback),
        { timeout: 8000 }
      );
    } else {
      setCustomer(fallback);
    }
  }, []);

  // Delivery origin + mileage (shared by cart + checkout + tracker)
  // Memoized: nearest-store scan only re-runs when inputs change
  const origin = useMemo(
    () => (customer ? branch || nearestStore(branches, customer.lat, customer.lon) || null : null),
    [customer, branch, branches]
  );
  const km = useMemo(
    () => (origin && customer ? havKm(origin.lat, origin.lon, customer.lat, customer.lon) : null),
    [origin, customer]
  );
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("mcd-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("mcd-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("mcd-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("mcd-points", String(points));
    } catch {
      /* ignore */
    }
  }, [points]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Stable handlers: keep memoized children (menu cards) from re-rendering
  // on unrelated state changes like toasts and theme toggles.
  const addToCart = useCallback((item, qty = 1, silent = false) => {
    setPlaced(null);
    setCart((c) => {
      const found = c.find((l) => l.key === item.n);
      if (found) return c.map((l) => (l.key === item.n ? { ...l, qty: l.qty + qty } : l));
      return [...c, { key: item.n, n: item.n, p: item.p, e: item.e, img: item.img, qty, options: null }];
    });
    if (!silent) setToast(`${item.n} × ${qty} nadagdag sa order 🍟`);
  }, []);

  const addOne = useCallback((item) => addToCart(item, 1), [addToCart]);

  const addCustomized = useCallback((item, cfg) => {
    setPlaced(null);
    const key = [item.n, cfg.label].join("|");
    setCart((c) => {
      const found = c.find((l) => l.key === key);
      if (found) return c.map((l) => (l.key === key ? { ...l, qty: l.qty + cfg.qty } : l));
      return [...c, { key, n: item.n, p: cfg.unitPrice, e: item.e, img: item.img, qty: cfg.qty, options: cfg.label }];
    });
    setCustom(null);
    setToast(`${item.n} (customized) nadagdag! ⚙️`);
  }, []);

  const addMany = useCallback((items) => {
    setPlaced(null);
    setCart((c) => {
      const next = [...c];
      items.forEach((item) => {
        const found = next.find((l) => l.key === item.n);
        if (found) found.qty += 1;
        else next.push({ key: item.n, n: item.n, p: item.p, e: item.e, img: item.img, qty: 1, options: null });
      });
      return next;
    });
  }, []);

  const inc = useCallback((key) => setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))), []);
  const dec = useCallback(
    (key) =>
      setCart((c) =>
        c.map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0)
      ),
    []
  );
  const removeLine = useCallback((key) => setCart((c) => c.filter((l) => l.key !== key)), []);

  const checkout = useCallback(
    (method = "Cash") => {
      const subtotal = cart.reduce((s, l) => s + l.p * l.qty, 0);
      const delivery = deliveryFee(subtotal, km);
      const total = subtotal + delivery;
      const earned = pointsFor(subtotal);
      const orderNo = Math.floor(1000 + Math.random() * 9000);
      const count = cart.reduce((s, l) => s + l.qty, 0);
      setPlaced(orderNo);
      setCart([]);
      if (earned > 0) setPoints((p) => p + earned);
      setOrder({ id: orderNo, total, method, count, km, fee: delivery });
      setCartOpen(false);
      setToast(`Paid via ${method}! Order #${orderNo} • +${earned} pts ⭐`);
    },
    [cart, km]
  );

  const redeem = useCallback(
    (reward) => {
      if (points < reward.cost) {
        setToast("Kulang pa ang points mo — order lang nang order! 🍟");
        return;
      }
      setPoints((p) => p - reward.cost);
      addToCart(reward.item, 1, true);
      setToast(`${reward.name} redeemed! Nasa cart mo na 🎉`);
    },
    [points, addToCart]
  );

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const openCart = useCallback(() => { setPlaced(null); setCartOpen(true); }, []);
  const customizeItem = useCallback((item, catId) => setCustom({ item, catId }), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeCustom = useCallback(() => setCustom(null), []);
  const chooseBranch = useCallback(
    (s) => { setBranch(s); setToast(`Origin: ${s.name} 🛵`); },
    []
  );

  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      <Header
        cartCount={count}
        points={points}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToast={setToast}
        onOpenCart={openCart}
      />
      <Reveal><Hero onAdd={addToCart} /></Reveal>
      <Ticker />
      <Reveal><AIPicker onAddMany={addMany} onToast={setToast} /></Reveal>
      <Reveal>
        <MenuGrid
          categories={categories}
          onAdd={addOne}
          onCustomize={customizeItem}
        />
      </Reveal>
      <Reveal><Deals onToast={setToast} /></Reveal>
      <Reveal><Rewards points={points} onRedeem={redeem} /></Reveal>
      <Reveal><AppSection onToast={setToast} /></Reveal>
      <Suspense fallback={<MapFallback />}>
        <StoreLocator
          theme={theme}
          onToast={setToast}
          onStores={setBranches}
          chosenId={branch?.id}
          onChoose={chooseBranch}
        />
      </Suspense>
      <Footer />
      <CartDrawer
        open={cartOpen}
        lines={cart}
        placed={placed}
        branchName={branch?.name || origin?.name}
        km={km}
        feeLabel={feeLabel(km)}
        freeOver={FREE_OVER}
        onClose={closeCart}
        onInc={inc}
        onDec={dec}
        onRemove={removeLine}
        onCheckout={checkout}
      />
      {custom && (
        <CustomizeModal
          item={custom.item}
          catId={custom.catId}
          onClose={closeCustom}
          onConfirm={addCustomized}
        />
      )}
      {order && customer && (
        <Suspense fallback={<MapFallback />}>
          <OrderTracker
            order={order}
            customer={customer}
            branches={branches}
            branch={branch}
            theme={theme}
            onClose={() => { setOrder(null); }}
            onRated={(s) => {
              setPoints((p) => p + 5);
              setToast(`Salamat sa ${s}★ rating! +5 pts ⭐`);
            }}
          />
        </Suspense>
      )}
      <Toast message={toast} />
    </>
  );
}
