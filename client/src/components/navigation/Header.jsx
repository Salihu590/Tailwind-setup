import { FiShoppingCart } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const logoUrl =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

export default function Header({
  toggleMenu,
  toggleSearch,
  searchOpen,
  searchQuery,
  setSearchQuery,
}) {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-40">
      <div className="flex items-center lg:hidden gap-4 p-4 w-full justify-between">
        <button
          onClick={toggleSearch}
          className="text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          aria-label={searchOpen ? "Close search" : "Open search"}
        >
          <FaSearch size={20} />
        </button>

        <Link to="/" aria-label="Home">
          <img src={logoUrl} alt="MANWE Logo" className="h-12" />
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" aria-label={`Cart with ${cartCount} items`}>
            <div className="relative">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          <button
            onClick={toggleMenu}
            className="text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="lg:hidden p-4 bg-black border-b border-gray-800">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-white text-white p-2 focus:outline-none"
            aria-label="Search products"
          />
        </div>
      )}

      <div className="hidden lg:flex justify-between items-center px-8 py-4 w-full">
        <Link to="/" aria-label="Home">
          <img src={logoUrl} alt="MANWE Logo" className="h-12" />
        </Link>

        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-white text-sm px-2 py-1 focus:outline-none"
            aria-label="Search products"
          />

          <Link
            to="/cart"
            className="flex items-center gap-1"
            aria-label={`Cart with ${cartCount} items`}
          >
            <div className="relative">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          <Link
            to="/checkout"
            className="hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            aria-label="Proceed to checkout"
          >
            Check Out
          </Link>
        </div>
      </div>
    </header>
  );
}
