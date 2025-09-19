import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Normalize the email to lowercase before sending
    const normalizedEmail = email.toLowerCase();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Something went wrong.");
      }

      setMessage(data.message);
      setMessageType("success");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-white font-mono">
      <h3 className="text-xl md:text-2xl font-bold mb-2 uppercase tracking-wide">
        Join the MANWE Tribe
      </h3>
      <p className="text-gray-400 mb-6 text-center text-sm">
        Stay updated with our latest drops and exclusive offers.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 w-full max-w-sm"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 p-3 text-sm bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white transition placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest transition-colors hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
          transition-opacity duration-300 ${
            message ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className={`px-6 py-3 rounded-full shadow-lg ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
