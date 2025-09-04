import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const getDeliveryCost = (state) => {
  const deliveryRates = {
    "FCT (Abuja)": 6000,
    Lagos: 9000,
    Rivers: 10000,
  };

  if (deliveryRates.hasOwnProperty(state)) {
    return deliveryRates[state];
  } else {
    return 4500;
  }
};

export default function ShippingOptions() {
  const { cartItems, checkoutData, specialInstructions, updateDeliveryCost } =
    useCart();

  const deliveryState = checkoutData.state;

  const deliveryCost = getDeliveryCost(deliveryState);

  const [selectedDelivery, setSelectedDelivery] = useState({
    id: "calculated",
    name: "Standard Delivery",
    cost: deliveryCost,
    estDelivery: "3-7 business days",
  });

  useEffect(() => {
    const newCost = getDeliveryCost(checkoutData.state);
    setSelectedDelivery((prev) => ({ ...prev, cost: newCost }));
  }, [checkoutData.state]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + selectedDelivery.cost;

  const deliveryAddress = checkoutData.address
    ? `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state}, ${checkoutData.country}`
    : "N/A";

  const handleContinue = () => {
    updateDeliveryCost(selectedDelivery.cost);
  };

  return (
    <div className="bg-white min-h-screen lg:flex lg:justify-center p-4 lg:p-10">
      <div className="lg:w-1/2 p-6 lg:border-r lg:border-gray-200">
        <h1 className="text-2xl font-bold text-black mb-6">Delivery</h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Delivery Method
        </h2>

        <div
          onClick={() => {}}
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer border-black bg-gray-100`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              id={selectedDelivery.id}
              name="delivery-rate"
              value={selectedDelivery.id}
              checked={true}
              readOnly
              className="mr-3 text-black"
            />
            <label htmlFor={selectedDelivery.id} className="text-gray-800">
              <span className="font-medium">{selectedDelivery.name}</span>
              <p className="text-sm text-gray-500">
                {selectedDelivery.estDelivery}
              </p>
            </label>
          </div>
          <span className="font-semibold text-black">
            ₦{selectedDelivery.cost.toLocaleString()}
          </span>
        </div>

        <Link
          to="/checkout/payment"
          onClick={handleContinue}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors block text-center"
        >
          Continue to payment
        </Link>
      </div>

      <div className="lg:w-1/2 p-6 lg:p-10 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order summary
        </h2>

        <div className="border-b border-gray-300 pb-4 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Customer Information
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {checkoutData.firstName}{" "}
            {checkoutData.lastName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {checkoutData.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Phone:</strong> {checkoutData.phone}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Delivery Location:</strong> {deliveryAddress}
          </p>
        </div>

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

          {specialInstructions && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Special Instructions
              </h3>
              <p className="text-sm text-gray-600">{specialInstructions}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center text-gray-500">
            <span>Subtotal</span>
            <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-black mt-2">
            <span>Delivery fee</span>
            <span className="font-semibold">
              ₦{selectedDelivery.cost.toLocaleString()}
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
