import { useState, useEffect } from "react";
import ProductGrid from "../components/product/ProductGrid";
import products from "../data/products";
import { FaTiktok, FaWhatsapp, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { X } from "lucide-react";
import Header from "../components/navigation/Header";
import NewsletterForm from "../components/NewsletterForm";
import { HashLoader } from "react-spinners";

const logoUrl =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

const bannerDesktopUrls = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
];

const bannerMobileUrls = [
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757857336/WhatsApp_Image_2025-09-14_at_14.29.35_9ab37444_v3bgjv.jpg",
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1757856672/WhatsApp_Image_2025-09-14_at_14.29.35_9ec80224_mvhxwm.jpg",
];

const categories = ["New", "Tops / Jerseys", "Bottoms", "Shorts", "Womens"];

export default function Shop() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (bannerDesktopUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === bannerDesktopUrls.length - 1 ? 0 : prevSlide + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

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

      <div className="relative w-full h-[450px] lg:h-[400px]">
        <div className="hidden lg:block absolute inset-0">
          {bannerDesktopUrls.map((url, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          ))}
        </div>

        <div className="lg:hidden relative w-full h-full">
          {bannerMobileUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Mobile Shop Banner ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => {
              const productGrid = document.getElementById("product-grid");
              if (productGrid) {
                productGrid.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="border-2 border-white px-8 py-3 text-2xl font-rubik-burned uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black"
          >
            Shop
          </button>
        </div>
      </div>

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
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(cat);
                  setIsLoading(true);
                }}
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
                href="https://wa.me/2349162407757"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="text-xl hover:text-gray-400 transition" />
              </a>
              <a
                href="https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ=="
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="text-xl hover:text-gray-400 transition" />
              </a>
              <a
                href="https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09"
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
                      setSearchQuery("");
                      setSelectedCategory(cat);
                      setMenuOpen(false);
                      setIsLoading(true);
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
                  href="https://wa.me/2349162407757"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp className="text-2xl hover:text-gray-400 transition" />
                </a>
                <a
                  href="https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ=="
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="text-2xl hover:text-gray-400 transition" />
                </a>
                <a
                  href="https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09"
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

        <main className="flex-1 w-full p-8 pt-20 lg:pt-8" id="product-grid">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <HashLoader color="#ffffff" size={50} />
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>

      <NewsletterForm />

      <footer className="w-full text-center text-xs text-gray-500 py-4 bg-black">
        &copy; 2025, MANWE
      </footer>
    </div>
  );
}
