import { ImageResponse } from "next/og";

export const alt = "Alpha Digital Solutions — Premium SEO Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f4f1ec",
          color: "#1c1a17",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div style={{ display: "flex", fontSize: "52px", fontWeight: 800, letterSpacing: "-2px" }}>
            Alpha
          </div>
          <div style={{ display: "flex", height: "56px", width: "2px", background: "#f98513" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "20px", letterSpacing: "7px", fontWeight: 700 }}>DIGITAL</div>
            <div style={{ fontSize: "20px", letterSpacing: "7px", fontWeight: 700, color: "#5a5650" }}>
              SOLUTIONS
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: "90px", height: "4px", background: "#f98513", marginBottom: "28px" }} />
          <div style={{ fontSize: "70px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px", maxWidth: "920px" }}>
            Better rankings. More traffic.
          </div>
          <div style={{ marginTop: "26px", fontSize: "27px", color: "#5a5650" }}>
            Full-service SEO, engineered for measurable organic growth.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "24px", color: "#c0590a", letterSpacing: "1px" }}>
          <div style={{ display: "flex", width: "10px", height: "10px", background: "#f98513" }} />
          alphadigitalsol.com
        </div>
      </div>
    ),
    { ...size }
  );
}
