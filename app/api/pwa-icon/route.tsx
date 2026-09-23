import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

const VALID_SIZES = [32, 48, 64, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024];

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requested = Number(params.get("size") ?? "512");
  const size = VALID_SIZES.includes(requested) ? requested : 512;
  const maskable = params.get("maskable") === "1";

  const inset = maskable ? 0.28 : 0.15;
  const inner = Math.round(size * (1 - inset * 2));
  const radius = Math.round(inner * 0.26);
  const border = Math.max(2, Math.round(size * 0.014));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #14141b 0%, #050507 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: inner,
            height: inner,
            borderRadius: radius,
            border: `${border}px solid rgba(57,255,20,0.5)`,
            background: "rgba(57,255,20,0.08)",
            color: "#39ff14",
            fontSize: Math.round(inner * 0.5),
            fontWeight: 700,
          }}
        >
          A
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
