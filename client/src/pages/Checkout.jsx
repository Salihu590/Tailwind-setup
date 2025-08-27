import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const statesByCountry = {
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  ],
  UK: ["England", "Scotland", "Wales", "Northern Ireland"],
  Ghana: ["Ashanti", "Greater Accra", "Northern", "Volta", "Western"],
};

const countryCodes = {
  Nigeria: "+234",
  UK: "+44",
  Ghana: "+233",
  Other: ""
};

export default function Checkout() {
  const { cartItems, updateCheckoutData } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Nigeria",
    state: "",
    phone: "",
    email: ""
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const states = statesByCountry[formData.country] || [];
  const phoneCode = countryCodes[formData.country] || "";

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.country ||
      !formData.state ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Save the form data to the context before navigating
    updateCheckoutData(formData);
    
    navigate("/checkout/shipping");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="bg-white min-h-screen lg:flex lg:justify-center p-4 lg:p-10">
      {/* Main Content: Shipping Form */}
      <div className="lg:w-1/2 p-6 lg:border-r lg:border-gray-200">
        <h1 className="text-2xl font-bold text-black mb-6">Checkout</h1>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
          
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-3 rounded-lg w-full text-black"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full text-black"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full text-black"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="border p-3 rounded-lg w-full text-black"
            required
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            name="apartment"
            onChange={handleInputChange}
            className="border p-3 rounded-lg w-full text-black"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full text-black"
              required
            >
              <option value="Nigeria">Nigeria</option>
              <option value="UK">United Kingdom</option>
              <option value="Ghana">Ghana</option>
              <option value="Other">Other</option>
            </select>

            {states.length > 0 ? (
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="border p-3 rounded-lg w-full text-black"
                required
              >
                <option value="">Select state/region</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Region/Province"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="border p-3 rounded-lg w-full text-black"
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full text-black"
              required
            />
            <input
              type="text"
              placeholder="Postal code (optional)"
              name="postalCode"
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full text-black"
            />
          </div>

          <div className="relative">
            {phoneCode && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {phoneCode}
              </span>
            )}
            <input
              type="tel"
              placeholder="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`border p-3 rounded-lg w-full text-black ${phoneCode ? "pl-12" : ""}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue to shipping
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:w-1/2 p-6 lg:p-10 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order summary</h2>
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
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-black font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center text-black">
            <span className="text-lg">Subtotal</span>
            <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-gray-500 text-sm mt-2">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between items-center text-black mt-4">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">₦{subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
