export default function AppSection({ onToast }) {
  return (
    <section className="section wrap split app-panel" id="app">
      <div className="center-xl">📍🚗🛵</div>
      <div>
        <div className="eyebrow">Mas mabilis na</div>
        <h2 className="section-title">McDelivery, Drive-Thru o Take-Out</h2>
        <p className="muted lede mb20">
          Deliver via McDelivery.ph, GrabFood o foodpanda — Metro Manila, Cebu, Davao at buong Pinas.
          Bayad via GCash, Maya, card o COD.
        </p>
        <div className="row">
          <button className="btn btn-outline" onClick={() => onToast("App Store link (demo)")}>⬇ App Store</button>
          <button className="btn btn-outline" onClick={() => onToast("Google Play link (demo)")}>▶ Google Play</button>
        </div>
      </div>
    </section>
  );
}
