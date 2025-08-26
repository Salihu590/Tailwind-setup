import { useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import products from "../data/products";
import { FaTiktok, FaWhatsapp, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { X } from "lucide-react";
import Header from "../components/navigation/Header";

const logoUrl =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const categories = ["New", "Tops / Jerseys", "Bottoms", "Shorts", "Womens"];

export default function Shop() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setMenuOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === "new" ||
      p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col bg-black text-white min-h-screen">
      <Header
        toggleMenu={toggleMenu}
        toggleSearch={toggleSearch}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-1">
        <aside className="hidden lg:flex flex-col justify-between w-64 p-6 font-mono uppercase text-sm border-r border-gray-800 h-screen sticky top-0">
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={logoUrl}
                alt="MANWE Logo"
                className="w-16 h-16 object-contain mb-6"
              />
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left cursor-pointer transition hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
                  selectedCategory === cat ? "text-gray-200" : "text-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center mt-12 mb-4">
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.tiktok.com/@mw.civ"
                target="_blank"
                rel="noreferrer"
              >
                <FaTiktok className="text-xl hover:text-gray-400 transition" />
              </a>
              <a
                href="https://wa.me/2341234567890"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="text-xl hover:text-gray-400 transition" />
              </a>
              <a
                href="https://www.instagram.com/manwe_official"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="text-xl hover:text-gray-400 transition" />
              </a>
              <a
                href="https://x.com/manwe_official"
                target="_blank"
                rel="noreferrer"
              >
                <FaXTwitter className="text-xl hover:text-gray-400 transition" />
              </a>
            </div>
            <img
              src={logoUrl}
              alt="MANWE Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
        </aside>

        {menuOpen && (
          <div className="lg:hidden fixed inset-0 w-full h-full bg-black bg-opacity-95 p-6 z-50 flex flex-col justify-between animate-slide-in-left">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center pt-12">
              <img
                src={logoUrl}
                alt="MANWE Logo"
                className="w-16 h-16 object-contain mb-8"
              />
              <div className="space-y-6 text-center uppercase text-lg font-mono">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMenuOpen(false);
                    }}
                    className={`block w-full cursor-pointer transition ${
                      selectedCategory === cat
                        ? "text-gray-200"
                        : "text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-6 mb-6">
                <a
                  href="https://www.tiktok.com/@mw.civ"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTiktok className="text-2xl hover:text-gray-400 transition" />
                </a>
                <a
                  href="https://wa.me/2341234567890"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp className="text-2xl hover:text-gray-400 transition" />
                </a>
                <a
                  href="https://www.instagram.com/manwe_official"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="text-2xl hover:text-gray-400 transition" />
                </a>
                <a
                  href="https://x.com/manwe_official"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter className="text-2xl hover:text-gray-400 transition" />
                </a>
              </div>
              <img
                src={logoUrl}
                alt="MANWE Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>
        )}

        <main className="flex-1 w-full p-8 pt-20 lg:pt-8">
          <ProductGrid products={filteredProducts} />
        </main>
      </div>

      <footer className="w-full text-center text-xs text-gray-500 py-4 bg-black">
        &copy; 2025, MANWE
      </footer>
    </div>
  );
}
