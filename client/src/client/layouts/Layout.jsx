// Layout.jsx — MANWE (Production)
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/navigation/Header";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change (in case of nested routes not caught elsewhere)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);

  return (
    <div className="bg-[#080808] text-[#E8E3D8] min-h-screen flex flex-col">
      {/* A11y skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#E8E3D8] focus:text-[#080808] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.3em]"
      >
        SKIP TO CONTENT
      </a>

      <Header />

      <main
        id="main-content"
        role="main"
        className="flex-grow pt-[75px] lg:pt-[92px]"
      >
        <Outlet />
      </main>
    </div>
  );
}