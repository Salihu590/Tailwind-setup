// NotFound.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — MANWE</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#080808] text-[#E8E3D8] flex flex-col items-center justify-center gap-8 px-6">
        <p
          className="text-[#C4541A]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "14px",
            letterSpacing: "0.4em",
          }}
        >
          ERROR 404
        </p>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(48px, 12vw, 120px)",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          LOST IN TRANSIT
        </h1>

        <p className="font-mono text-[10px] tracking-[0.35em] text-gray-500 text-center max-w-md">
          THIS ROUTE DOES NOT EXIST IN THE MANWE MANIFEST
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            to="/shop"
            className="border border-[#E8E3D8]/30 hover:border-[#E8E3D8] hover:bg-[#E8E3D8] hover:text-[#080808] px-8 py-3 transition-all"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "16px",
              letterSpacing: "0.25em",
            }}
          >
            RETURN TO SHOP
          </Link>
          <Link
            to="/"
            className="font-mono text-[10px] tracking-[0.3em] text-gray-500 hover:text-[#E8E3D8] transition-colors"
          >
            HOME →
          </Link>
        </div>
      </div>
    </>
  );
}