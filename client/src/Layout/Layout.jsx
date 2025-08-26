import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";

export default function Layout() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
    </div>
  );
}
