import { useState } from "react";

// Image with emoji fallback: if the hotlinked photo fails to load,
// the emoji shows instead so the layout never breaks.
export default function FoodImage({ src, alt, emoji, className, eager }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <span className={className}>{emoji}</span>;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
