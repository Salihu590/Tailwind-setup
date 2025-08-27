import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const createOrderOnServer = async (orderData) => {
  const response = await fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Failed to create order on the server.');
  }

  const data = await response.json();
  return data;
};

// New function to initialize a Paystack payment
const initializePaystackPayment = async (paymentData) => {
  const response = await fetch('http://localhost:3001/api/paystack/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize Paystack payment.');
  }

  const data = await response.json();
  return data;
};

export default function Payment() {
  const { cartItems, checkoutData } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("whatsapp");
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedShippingRate = shippingRates.find(
    (rate) => rate.id === "standard"
  );
  const shippingCost = selectedShippingRate ? selectedShippingRate.cost : 2500;
  const total = subtotal + shippingCost;

  const generateMessage = (id) => {
    const cartItemsText = cartItems
      .map(
        (item) =>
          `📦 ${item.name} (${item.size ? item.size + ' - ' : ''}${item.color ? item.color : ''}) - ${
            item.quantity
          }x - NGN ${(item.price * item.quantity).toLocaleString()}`
      )
      .join("\n");

    const message = `Hi, I'd like to buy these items:

${cartItemsText}

🙍🏽‍♂️ Customer: ${checkoutData.firstName} ${checkoutData.lastName}

DELIVERY INFO:
Name: ${checkoutData.firstName} ${checkoutData.lastName}
Phone: ${checkoutData.phone}
Address: ${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state}, ${checkoutData.country}

🚚 Delivery Cost: NGN ${shippingCost.toLocaleString()}
💰 Total Price: NGN ${total.toLocaleString()}

🛍️ Click here to view your order summary:
https://your-website.com/orders/${id}/


-----------------------------------
FOR PAYMENTS

OPTION 1: Use the link attached to this order 🔗
Payments made via the link are automatically confirmed


OPTION 2: Transfer to this bank account 🏦
Acc Num: 1234567890
Bank: ABCD BANK
Acc Name: ABCD
-----------------------------------

Order ID: ${id}`;

    return message;
  };

  const handleCompleteOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const orderDetails = {
        cartItems,
        checkoutData,
        shippingCost,
        total,
      };

      const { orderId: uniqueOrderId } = await createOrderOnServer(orderDetails);
      setOrderId(uniqueOrderId);

      if (selectedPayment === "paynow") {
        // Handle Paystack payment here
        const paystackData = {
          email: checkoutData.email,
          amount: total,
          orderId: uniqueOrderId,
        };
        const { authorization_url } = await initializePaystackPayment(paystackData);
        window.open(authorization_url, "_blank");
      } else if (selectedPayment === "whatsapp") {
        // ... (existing WhatsApp code)
        const message = generateMessage(uniqueOrderId);
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "2348051749331";
        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
          "_blank"
        );
      } else if (selectedPayment === "instagram") {
        // ... (existing Instagram code)
        const message = generateMessage(uniqueOrderId);
        try {
          await navigator.clipboard.writeText(message);
          toast.success(
            "Order copied to clipboard. Redirecting to Instagram. Paste in Merchant's DM.",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          setTimeout(() => {
            window.open(
              "https://www.instagram.com/your_instagram_username/",
              "_blank"
            );
          }, 1000);
        } catch (err) {
          console.error("Failed to copy text: ", err);
          toast.error("Failed to copy order details. Please try again.", {
            position: "top-center",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to create order. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // ... (rest of your return JSX, it stays the same)
    <div className="bg-white min-h-screen lg:flex lg:justify-center p-4 lg:p-10">
      <div className="lg:w-1/2 p-6 lg:border-r lg:border-gray-200">
        <h1 className="text-2xl font-bold text-black mb-6">Order Summary</h1>
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Important</p>
          <p>
            Please make payment within 60 minutes to avoid order being
            cancelled.
          </p>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          How would you like to complete your Order?
        </h2>
        <div className="space-y-4">
          <div
            onClick={() => setSelectedPayment("paynow")}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPayment === "paynow"
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://res.cloudinary.com/dsci2gspy/image/upload/v1756323845/pay-now_m5i1jq.png"
                alt="Pay Now"
                className="w-8 h-8 mr-3"
              />
              <div>
                <span className="font-medium text-black">Pay Now</span>
                <p className="text-sm text-gray-500">
                  Pay with any method of your choice
                </p>
              </div>
            </div>
            <input
              type="radio"
              name="payment-option"
              value="paynow"
              checked={selectedPayment === "paynow"}
              readOnly
              className="mr-3 text-black"
            />
          </div>
          <div
            onClick={() => setSelectedPayment("whatsapp")}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPayment === "whatsapp"
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-8 h-8 mr-3"
              />
              <div>
                <span className="font-medium text-black">Send to WhatsApp</span>
                <p className="text-sm text-gray-500">
                  Finalize order with merchant on WhatsApp
                </p>
              </div>
            </div>
            <input
              type="radio"
              name="payment-option"
              value="whatsapp"
              checked={selectedPayment === "whatsapp"}
              readOnly
              className="mr-3 text-black"
            />
          </div>
          <div
            onClick={() => setSelectedPayment("instagram")}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPayment === "instagram"
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="w-8 h-8 mr-3"
              />
              <div>
                <span className="font-medium text-black">
                  Send to Instagram
                </span>
                <p className="text-sm text-gray-500">
                  Finalize order with merchant on Instagram
                </p>
              </div>
            </div>
            <input
              type="radio"
              name="payment-option"
              value="instagram"
              checked={selectedPayment === "instagram"}
              readOnly
              className="mr-3 text-black"
            />
          </div>
        </div>
        <button
          onClick={handleCompleteOrder}
          disabled={isProcessing}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors block text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Complete Order"}
        </button>
        <Link
          to="/checkout/shipping"
          className="mt-4 w-full text-black py-3 rounded-lg block text-center hover:underline"
        >
          Cancel
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
            <strong>Delivery Location:</strong> {checkoutData.address},{" "}
            {checkoutData.city}, {checkoutData.state}, {checkoutData.country}
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
        </div>
        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center text-gray-500">
            <span>Subtotal</span>
            <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-black mt-2">
            <span>Shipping</span>
            <span className="font-semibold">
              ₦{shippingCost.toLocaleString()}
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
