import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    specialInstructions,
    updateSpecialInstructions,
  } = useCart();

  const [agree, setAgree] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item, index) => (
                <li
                  key={`${item.id}-${item.size}-${index}`}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-lg border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-gray-500">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Size: {item.size}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-gray-800"
                        >
                          -
                        </button>
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Special Instructions for the Seller
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => updateSpecialInstructions(e.target.value)}
                placeholder="e.g., Please wrap as a gift."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none text-gray-800 placeholder-gray-400"
                rows="3"
              />
            </div>

            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="agree" className="text-gray-700">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-black underline hover:text-gray-500"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-4">
              <p className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">
                Total: ₦{total.toLocaleString()}
              </p>
              <Link
                to={agree ? "/checkout" : "#"}
                onClick={(e) => {
                  if (!agree) {
                    e.preventDefault();
                    alert(
                      "You must agree to the terms and conditions before checkout."
                    );
                  }
                }}
                className={`px-6 py-3 rounded-xl transition w-full sm:w-auto text-center ${
                  agree
                    ? "bg-black text-white hover:bg-gray-600"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
