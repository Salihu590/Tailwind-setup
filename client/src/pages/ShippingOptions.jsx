import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const shippingRates = [
  {
    id: "standard",
    name: "Standard Shipping",
    cost: 2500,
    estDelivery: "3-5 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    cost: 5000,
    estDelivery: "1-2 business days",
  },
  {
    id: "free",
    name: "Free Shipping",
    cost: 0,
    estDelivery: "7-10 business days",
  },
];

export default function ShippingOptions() {
  const { cartItems } = useCart();
  const [selectedShipping, setSelectedShipping] = useState(shippingRates[0].id);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedRate = shippingRates.find(
    (rate) => rate.id === selectedShipping
  );
  const total = subtotal + (selectedRate ? selectedRate.cost : 0);

  return (
    <div className="bg-white min-h-screen lg:flex lg:justify-center p-4 lg:p-10">
      <div className="lg:w-1/2 p-6 lg:border-r lg:border-gray-200">
        <h1 className="text-2xl font-bold text-black mb-6">Shipping</h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Shipping Method
        </h2>

        <div className="space-y-4">
          {shippingRates.map((rate) => (
            <div
              key={rate.id}
              onClick={() => setSelectedShipping(rate.id)}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedShipping === rate.id
                  ? "border-black bg-gray-100"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id={rate.id}
                  name="shipping-rate"
                  value={rate.id}
                  checked={selectedShipping === rate.id}
                  readOnly
                  className="mr-3 text-black"
                />
                <label htmlFor={rate.id} className="text-gray-800">
                  <span className="font-medium">{rate.name}</span>
                  <p className="text-sm text-gray-500">{rate.estDelivery}</p>
                </label>
              </div>
              <span className="font-semibold text-black">
                {rate.cost === 0 ? "Free" : `₦${rate.cost.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>

        <Link
          to="/payment"
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors block text-center"
        >
          Continue to payment
        </Link>
      </div>

      <div className="lg:w-1/2 p-6 lg:p-10 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order summary
        </h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id + item.size} className="flex items-start gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain rounded-lg border border-gray-300"
              />
              <div className="flex-1">
                <h3 className="text-md font-medium text-black">{item.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-black font-semibold">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center text-gray-500">
            <span>Subtotal</span>
            <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-black mt-2">
            <span>Shipping</span>
            <span className="font-semibold">
              {selectedRate.cost === 0
                ? "Free"
                : `₦${selectedRate.cost.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between items-center text-black mt-4">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
