/** Green success checkmark in a circle — shown at the top of a form's
 *  "submitted" confirmation. Presentational only. */
export function SuccessTick() {
  return (
    <span
      aria-hidden
      style={{
        display: "grid",
        placeItems: "center",
        width: "4rem",
        height: "4rem",
        borderRadius: "50%",
        background: "var(--success)",
        margin: "0 auto 1.2rem",
        boxShadow: "0 10px 28px -10px rgba(31,143,95,.65)",
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
