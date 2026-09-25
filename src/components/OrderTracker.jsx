import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { havKm, nearestStore } from "../data/delivery.js";

const RIDERS = [
  { name: "Kuya Jomar", rating: "4.9 ★", plate: "MC 4821" },
  { name: "Ate Liza", rating: "4.8 ★", plate: "MC 7305" },
  { name: "Kuya Ramil", rating: "5.0 ★", plate: "MC 1198" },
];

const PREP_SIM = 480; // 8 kitchen minutes (simulated)
const SIM_RATE = 5;   // 1 real second = 5 sim seconds at ×1 (a ~25-min order takes ~6 real minutes)
const SPEEDS = [1, 5, 20];

const fmtHMS = (s) => {
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${m}:${r}` : `${m}:${r}`;
};

// Time-of-day congestion estimate (Manila). Live traffic needs a paid
// API key — this is labeled as an estimate in the UI.
function trafficFactor(when = new Date()) {
  const h = when.getHours();
  const day = when.getDay();
  const weekend = day === 0 || day === 6;
  if (!weekend && ((h >= 7 && h < 10) || (h >= 17 && h < 21)))
    return { factor: 1.7, label: "Heavy traffic (rush hour)" };
  if ((h >= 11 && h < 14) || (weekend && h >= 10 && h < 20))
    return { factor: 1.3, label: "Moderate traffic" };
  if (h >= 22 || h < 5) return { factor: 0.9, label: "Light traffic (late night)" };
  return { factor: 1.0, label: "Normal traffic" };
}

async function fetchRoute(o, c) {
  // Real road routing via OSRM (free, no key). Falls back to straight line.
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${o.lon},${o.lat};${c.lon},${c.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("osrm " + res.status);
    const j = await res.json();
    const r = j.routes?.[0];
    if (!r) throw new Error("no route");
    return {
      coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      duration: r.duration,
      distance: r.distance / 1000,
      live: true,
    };
  } catch {
    const km = havKm(o.lat, o.lon, c.lat, c.lon);
    return {
      coords: [[o.lat, o.lon], [c.lat, c.lon]],
      duration: (km / 25) * 3600,
      distance: km,
      live: false,
    };
  }
}

function riderAt(coords, t) {
  if (t <= 0) return coords[0];
  if (t >= 1) return coords[coords.length - 1];
  const f = t * (coords.length - 1);
  const i = Math.floor(f);
  const r = f - i;
  const a = coords[i];
  const b = coords[Math.min(i + 1, coords.length - 1)];
  return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
}

export default function OrderTracker({ order, customer, branches, branch, theme, onClose, onRated }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const riderRef = useRef(null);
  const mountRef = useRef(Date.now());
  const [rider] = useState(() => RIDERS[order.id % RIDERS.length]);
  const [sim, setSim] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [rated, setRated] = useState(0);
  const [route, setRoute] = useState(null);
  // Single time base: session wall-clock. Sim-seconds ÷ effective rate =
  // real seconds, so ETA, waiting, and arrival can never diverge.

  const origin =
    branch ||
    nearestStore(branches, customer.lat, customer.lon) || null;
  const traffic = trafficFactor();

  // Route on mount
  useEffect(() => {
    if (!origin) return;
    let alive = true;
    fetchRoute(origin, customer).then((r) => alive && setRoute(r));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const travelSim = route ? route.duration * traffic.factor : 0;
  const totalSim = PREP_SIM + travelSim;
  const prepDone = sim >= PREP_SIM;
  const travelT = travelSim > 0 ? Math.min(1, Math.max(0, (sim - PREP_SIM) / travelSim)) : 0;
  const delivered = travelSim > 0 && sim >= totalSim;
  const remaining = Math.max(0, totalSim - sim);
  const phase = !prepDone ? 0 : !delivered ? 1 : 2;
  const PHASES = ["👨‍🍳 Preparing", "🛵 On the way", "✅ Delivered"];

  // Init map
  useEffect(() => {
    if (!origin) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(
      [(origin.lat + customer.lat) / 2, (origin.lon + customer.lon) / 2],
      13
    );
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      className: theme === "dark" ? "dark-tiles" : "",
    }).addTo(map);
    L.marker([origin.lat, origin.lon], {
      icon: L.divIcon({ className: "mc-pin", html: "<div class='mc-pin-badge'>M</div>", iconSize: [34, 34], iconAnchor: [17, 34] }),
    }).bindPopup(`<b>${origin.name}</b><br/>${origin.address || "McDonald's Philippines"}`).addTo(map);
    L.marker([customer.lat, customer.lon], {
      icon: L.divIcon({ className: "mc-pin", html: "<div class='home-pin'>🏠</div>", iconSize: [30, 30], iconAnchor: [15, 15] }),
    }).bindPopup("<b>You (your location)</b>").addTo(map);
    riderRef.current = L.marker([origin.lat, origin.lon], {
      icon: L.divIcon({ className: "mc-pin", html: "<div class='rider-pin'>🛵</div>", iconSize: [34, 34], iconAnchor: [17, 17] }),
    }).bindPopup(`<b>${rider.name}</b><br/>${rider.rating} • ${rider.plate}`).addTo(map);
    mapRef.current = map;
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin?.id]);

  // Draw route line when ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route) return;
    const line = L.polyline(route.coords, { color: "#ffc72c", weight: 4 }).addTo(map);
    map.fitBounds(line.getBounds().pad(0.2));
    return () => map.removeLayer(line);
  }, [route]);

  // Sim clock
  useEffect(() => {
    if (delivered || !route) return;
    const t = setInterval(() => setSim((e) => e + SIM_RATE * speed), 1000);
    return () => clearInterval(t);
  }, [delivered, speed, route]);

  // Move rider
  useEffect(() => {
    if (riderRef.current && route) riderRef.current.setLatLng(riderAt(route.coords, travelT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelT, route]);

  const rate = (stars) => {
    if (rated === 0) onRated(stars);
    setRated(stars);
  };

  if (!origin) {
    return (
      <>
        <div className="modal-overlay show" />
        <div className="track-modal">
          <div className="modal-head">
            <h3>🛵 Order #{order.id}</h3>
            <button className="cart-x" onClick={onClose}>✕</button>
          </div>
          <div className="stack center pad32">
            <p className="muted">Walang branch data — pumili muna ng real branch sa Stores map.</p>
            <button className="btn btn-red" onClick={onClose}>Pick a Branch 📍</button>
          </div>
        </div>
      </>
    );
  }

  const etaSecs = remaining / (SIM_RATE * speed);
  const waitedSecs = (Date.now() - mountRef.current) / 1000;
  // Live remaining road distance from the rider's current spot to you
  const riderPos = route ? riderAt(route.coords, travelT) : null;
  let leftKm = null;
  if (route && riderPos) {
    const f = travelT * (route.coords.length - 1);
    const i = Math.min(Math.floor(f), route.coords.length - 1);
    let km = 0;
    let prev = riderPos;
    for (let j = i + 1; j < route.coords.length; j++) {
      km += havKm(prev[0], prev[1], route.coords[j][0], route.coords[j][1]);
      prev = route.coords[j];
    }
    leftKm = km;
  }
  const arrival = new Date(Date.now() + etaSecs * 1000).toLocaleTimeString("en-PH", {
    hour: "numeric", minute: "2-digit",
  });

  return (
    <>
      <div className="modal-overlay show" />
      <div className="track-modal">
        <div className="modal-head">
          <h3>🛵 Order #{order.id} — {delivered ? "Delivered!" : "Live Tracking"}</h3>
          <button className="cart-x" onClick={onClose}>✕</button>
        </div>
        <div className="track-status">
          {PHASES.map((p, i) => (
            <div key={p} className={`track-phase ${i < phase ? "done" : i === phase ? "now" : ""}`}>
              <span>{i < phase ? "✓" : p.split(" ")[0]}</span>
              <small>{p.split(" ").slice(1).join(" ")}</small>
            </div>
          ))}
        </div>
        <div ref={mapEl} className="track-map" />
        <div className="track-info">
          <div className="track-origin">
            <small className="muted">From (real branch)</small>
            <b>🍟 {origin.name}</b>
            <small className="muted">{origin.address}</small>
          </div>
          <div className="track-eta">
            <div>
              <small className="muted">{delivered ? "Total trip time" : "ETA (with traffic)"}</small>
              <b>{delivered ? fmtHMS(waitedSecs) : fmtHMS(etaSecs)}</b>
            </div>
            <div>
              <small className="muted">{delivered ? "Items" : "Arriving by"}</small>
              <b>{delivered ? `${order.count} pcs` : arrival}</b>
            </div>
            <div>
              <small className="muted">Waiting</small>
              <b>{fmtHMS(waitedSecs)}</b>
            </div>
            <div>
              <small className="muted">Distance left</small>
              <b>{leftKm != null ? `${leftKm.toFixed(1)} km` : "…"}</b>
            </div>
            <button
              className={`btn ${speed === 1 ? "btn-outline" : "btn-yellow"}`}
              onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
              title="Demo speed"
            >
              {speed === 1 ? "▶ ×1 real-ish" : speed === 5 ? "⏩ ×5" : "⏩⏩ ×20"}
            </button>
          </div>
          <div className="progress"><span style={{ width: `${Math.round(((phase === 2 ? 1 : travelT * 0.9 + (prepDone ? 0.1 : 0)) * 100))}%` }} /></div>
          <p className="muted muted-sm">
            {rider.name} • {rider.rating} • {rider.plate} • {order.method} • ₱{order.total.toLocaleString("en-PH")}
            {order.km != null && (
              <><br />🚗 {order.km.toFixed(1)} km block • delivery ₱{order.fee}</>
            )}
            <br />
            Route: {route ? (route.live ? "real roads (OSRM)" : "straight-line fallback") : "computing…"} • {traffic.label} ×{traffic.factor}
            {route && ` • ${route.distance.toFixed(1)} km trip`}
          </p>
          {delivered ? (
            <div className="stack center">
              <p><b>Salamat sa pag-order! 🎉 Kumusta ang delivery?</b></p>
              <div className="row justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} className={`rate-star ${rated >= s ? "on" : ""}`} onClick={() => rate(s)}>★</button>
                ))}
              </div>
              {rated > 0 && <small className="muted">+5 pts bonus added! ⭐</small>}
              <button className="btn btn-red full" onClick={onClose}>Done — Back to Menu</button>
            </div>
          ) : (
            <p className="muted muted-sm">
              {!route
                ? "🗺️ Computing real-road route…"
                : phase === 0
                  ? "👨‍🍳 Kusina pa lang — pini-prepare ang order mo…"
                  : "🛵 Nasa daan na si rider! Subaybayan ang 🛵 sa mapa."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
