import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Physio Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%)",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 24 }}>🏥</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#1e293b" }}>
          Physio Guide
        </div>
        <div style={{ fontSize: 32, color: "#64748b", marginTop: 16 }}>
          물리치료사가 제공하는 맞춤 운동 가이드
        </div>
      </div>
    ),
    { ...size }
  );
}
