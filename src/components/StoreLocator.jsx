import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const MANILA = { lat: 14.5995, lon: 120.9842, label: "Manila" };
const RADIUS_M = 50000;

// Live McDonald's locations from OpenStreetMap (Overpass API) — no API key needed.
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

function bboxAround(lat, lon, m = RADIUS_M) {
  const dLat = m / 111320;
  const dLon = m / (111320 * Math.cos((lat * Math.PI) / 180));
  const s = (lat - dLat).toFixed(5);
  const n = (lat + dLat).toFixed(5);
  const w = (lon - dLon).toFixed(5);
  const e = (lon + dLon).toFixed(5);
  return `${s},${w},${n},${e}`;
}

function buildQuery(lat, lon) {
  // bbox hits the spatial index — far faster than a wide `around` scan
  const box = bboxAround(lat, lon);
  return `[out:json][timeout:25];(node["brand"="McDonald's"](${box});node["name"~"McDonald's",i](${box}););out 150;`;
}

function addressOf(tags = {}) {
  const parts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"] || tags["addr:municipality"]]
    .filter(Boolean)
    .join(" ");
  return parts || tags["addr:full"] || "McDonald's Philippines";
}

async function fetchStores(lat, lon) {
  const body = "data=" + encodeURIComponent(buildQuery(lat, lon));
  // Race all mirrors — first success wins instead of waiting out a slow one
  const hit = (ep) =>
    fetch(ep, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      return res.json();
    });
  const json = await Promise.any(ENDPOINTS.map(hit));
  const seen = new Set();
  return (json.elements || [])
    .filter((el) => el.lat && el.lon && !seen.has(el.id) && seen.add(el.id))
    .map((el) => ({
      id: el.id,
      lat: el.lat,
      lon: el.lon,
      name: el.tags?.name || "McDonald's",
      address: addressOf(el.tags),
    }));
}

function pinBadge(chosen) {
  return L.divIcon({
    className: "mc-pin",
    html: chosen ? "<div class='mc-pin-badge chosen'>🛵</div>" : "<div class='mc-pin-badge'>M</div>",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export default function StoreLocator({ theme, onToast, onStores, chosenId, onChoose }) {
  const mapRef = useRef(null);
  const mapEl = useRef(null);
  const markersRef = useRef(null);
  const tilesRef = useRef(null);
  const [center, setCenter] = useState(MANILA);
  const [stores, setStores] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | refreshing | ok | offline | error
  const [selected, setSelected] = useState(null);
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mcd-favs")) || {};
    } catch {
      return {};
    }
  });
  const [query, setQuery] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchAbort = useRef(null);

  // Typed location search (Nominatim, PH-biased, debounced)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setSuggest([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      searchAbort.current?.abort();
      searchAbort.current = new AbortController();
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ph&limit=5&q=${encodeURIComponent(q)}`,
          { signal: searchAbort.current.signal }
        );
        if (!res.ok) throw new Error("geo " + res.status);
        const j = await res.json();
        setSuggest(
          (Array.isArray(j) ? j : []).map((p) => ({
            lat: Number(p.lat),
            lon: Number(p.lon),
            label: String(p.display_name).split(",").slice(0, 2).join(","),
            full: p.display_name,
          }))
        );
      } catch (e) {
        if (e?.name !== "AbortError") setSuggest([]);
      } finally {
        setSearching(false);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [query]);

  const pickPlace = (p) => {
    setQuery("");
    setSuggest([]);
    setCenter({ lat: p.lat, lon: p.lon, label: p.label });
    load(p.lat, p.lon, p.label);
  };

  const toggleFav = (s) => {
    setFavs((f) => {
      const next = { ...f };
      if (next[s.id]) delete next[s.id];
      else next[s.id] = { id: s.id, name: s.name, address: s.address, lat: s.lat, lon: s.lon };
      try {
        localStorage.setItem("mcd-favs", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  };
  const favList = Object.values(favs);
  const chooseRef = useRef({ stores: [], onChoose: null, onToast: null });
  chooseRef.current = { stores, onChoose, onToast };
  const favRef = useRef(() => {});
  favRef.current = toggleFav;

  // Init map once
  useEffect(() => {
    const map = L.map(mapEl.current, { scrollWheelZoom: false, preferCanvas: true }).setView(
      [MANILA.lat, MANILA.lon],
      12
    );
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // Order + favorite buttons inside pin bubbles (delegated)
    const onPopupClick = (e) => {
      const btn = e.target.closest?.(".popup-order-btn, .popup-fav-btn");
      if (!btn) return;
      const { stores, onChoose, onToast } = chooseRef.current;
      const store = stores.find((s) => String(s.id) === btn.dataset.id);
      if (!store) return;
      if (btn.classList.contains("popup-fav-btn")) {
        favRef.current(store);
      } else {
        onChoose?.(store);
        onToast?.(`Origin: ${store.name} 🛵`);
      }
    };
    map.getContainer().addEventListener("click", onPopupClick);
    return () => {
      map.getContainer().removeEventListener("click", onPopupClick);
      map.remove();
    };
  }, []);

  // Swap light/dark tiles with theme
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tilesRef.current) {
      map.removeLayer(tilesRef.current);
      tilesRef.current = null;
    }
    const url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attr =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    // NOTE: CARTO dark tiles now require an API key, so we use free OSM
    // tiles everywhere and darken them with a CSS filter in dark mode.
    tilesRef.current = L.tileLayer(url, {
      maxZoom: 19,
      attribution: attr,
      className: theme === "dark" ? "dark-tiles" : "",
    }).addTo(map);
  }, [theme]);

  const load = async (lat, lon, label) => {
    // ASAP: paint cached branches instantly, then refresh in background
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem("mcd-branches"));
    } catch { /* no cache */ }
    if (cached?.list?.length) {
      setStores(cached.list);
      onStores?.(cached.list);
      setStatus("refreshing");
      const map = mapRef.current;
      map?.flyToBounds(L.latLngBounds(cached.list.map((s) => [s.lat, s.lon])).pad(0.15), { duration: 0.5 });
    } else {
      setStatus("loading");
      setStores([]);
    }
    setSelected(null);
    const show = (list) => {
      setStores(list);
      onStores?.(list);
      setStatus("ok");
      const map = mapRef.current;
      if (list.length > 0) {
        map.flyToBounds(L.latLngBounds(list.map((s) => [s.lat, s.lon])).pad(0.15), { duration: 1 });
      } else {
        map.flyTo([lat, lon], 12, { duration: 1 });
      }
    };
    try {
      const list = await fetchStores(lat, lon);
      try {
        localStorage.setItem("mcd-branches", JSON.stringify({ ts: Date.now(), list }));
      } catch { /* storage full — ignore */ }
      show(list);
      if (list.length === 0) onToast(`Walang McDo na nakita sa ${label} — try a bigger city`);
      else if (!cached?.list?.length) onToast(`${list.length} McDonald's nakita malapit sa ${label} 🍟`);
    } catch {
      // Offline and no usable cache already shown?
      if (!cached?.list?.length) {
        setStatus("error");
        onToast("Map data failed to load — check connection at subukan ulit");
      } else {
        setStatus("offline");
        onToast("📴 Offline — cached branches pinapakita");
      }
    }
  };

  // Initial load around Manila
  useEffect(() => {
    load(MANILA.lat, MANILA.lon, MANILA.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw markers whenever stores, chosen branch, or favorites change
  useEffect(() => {
    const layer = markersRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    stores.forEach((s) => {
      const isChosen = chosenId === s.id;
      const isFav = !!favs[s.id];
      const m = L.marker([s.lat, s.lon], { icon: pinBadge(isChosen) }).bindPopup(
        `<b>${isFav ? "⭐ " : ""}${s.name}</b><br/>${s.address}<br/>` +
        `<a target="_blank" rel="noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}">Directions →</a><br/>` +
        `<button class="popup-order-btn" data-id="${s.id}">${isChosen ? "✓ Chosen branch" : "🛵 Order from here"}</button> ` +
        `<button class="popup-fav-btn" data-id="${s.id}">${isFav ? "★ Favorited" : "☆ Favorite"}</button>`
      );
      m.on("click", () => setSelected(s.id));
      layer.addLayer(m);
    });
  }, [stores, chosenId, favs]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      onToast("Geolocation hindi supported ng browser mo");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lon: longitude, label: "your location" });
        load(latitude, longitude, "your location");
      },
      () => {
        setStatus("error");
        onToast("Location blocked — showing Manila muna");
        setCenter(MANILA);
        load(MANILA.lat, MANILA.lon, MANILA.label);
      },
      { timeout: 10000 }
    );
  };

  const focusStore = (s) => {
    setSelected(s.id);
    mapRef.current?.flyTo([s.lat, s.lon], 16, { duration: 1 });
  };

  return (
    <section className="section wrap" id="stores">
      <div className="eyebrow">Hanapin kami</div>
      <h2 className="section-title">McDonald&apos;s malapit sa &apos;yo</h2>
      <p className="muted lede-wide mb20">
        Live store data mula sa OpenStreetMap. Allow location o mag-browse sa mapa —
        pindutin ang pin para sa directions.
      </p>
      <div className="search-wrap mb16">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Type your location — barangay, city, landmark…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setSuggest([]); } }}
        />
        {searching && <small className="muted">…</small>}
        {suggest.length > 0 && (
          <div className="suggest-list">
            {suggest.map((p, i) => (
              <button key={`${p.lat}-${p.lon}-${i}`} onClick={() => pickPlace(p)} title={p.full}>
                📍 {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="row mb16">
        <button className="btn btn-red" onClick={useMyLocation}>📍 Use My Location</button>
        <button
          className="btn btn-outline"
          onClick={() => { setCenter(MANILA); load(MANILA.lat, MANILA.lon, MANILA.label); }}
        >
          Back to Manila
        </button>
        {chosenId && (
          <span className="branch-pill">🛵 Ordering from: <b>{stores.find((s) => s.id === chosenId)?.name || "chosen branch"}</b></span>
        )}
      </div>
      <div className="row mb16">
        <span className="muted muted-sm center-self">
          {status === "loading" && "⏳ Hinahanap ang mga stores…"}
          {status === "refreshing" && `⚡ ${stores.length} cached stores — refreshing…`}
          {status === "ok" && `🍟 ${stores.length} stores sa loob ng 50km ng ${center.label}`}
          {status === "offline" && `📴 Offline — ${stores.length} cached branches pinapakita`}
          {status === "error" && "⚠️ Hindi ma-load ang stores — subukan ulit."}
        </span>
      </div>
      <div className="store-grid">
        <div ref={mapEl} className="store-map" />
        <div className="store-list">
          {favList.length > 0 && (
            <div className="fav-section">
              <b>⭐ Favorites ({favList.length})</b>
              {favList.map((s) => (
                <div key={s.id} className="fav-item">
                  <span><b>{s.name}</b><br /><small className="muted">{s.address}</small></span>
                  <span className="row">
                    <button className="order-here" onClick={() => onChoose?.(s)}>🛵</button>
                    <button className="fav-star on" onClick={() => toggleFav(s)} title="Remove favorite">★</button>
                  </span>
                </div>
              ))}
            </div>
          )}
          {stores.length === 0 && status !== "loading" && status !== "refreshing" && (
            <p className="muted muted-sm">Walang stores na nakita dito. Try “Use My Location”.</p>
          )}
          {stores.map((s) => (
            <div
              key={s.id}
              className={`store-item ${selected === s.id ? "active" : ""} ${chosenId === s.id ? "chosen" : ""}`}
              onClick={() => focusStore(s)}
            >
              <b>{favs[s.id] ? "⭐ " : ""}{s.name} {chosenId === s.id && "🛵"}</b>
              <small>{s.address}</small>
              <span className="row">
                <button
                  className={`fav-star ${favs[s.id] ? "on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleFav(s); }}
                  title={favs[s.id] ? "Remove favorite" : "Add favorite"}
                >
                  {favs[s.id] ? "★" : "☆"}
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Directions →
                </a>
                <button
                  className="order-here"
                  onClick={(e) => { e.stopPropagation(); onChoose?.(s); }}
                >
                  {chosenId === s.id ? "✓ Chosen branch" : "Order from here 🛵"}
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
