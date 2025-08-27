import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const { addToCart } = useCart();

  if (!product) {
    return <p className="text-white p-8">Product not found</p>;
  }

  if (!product.images || product.images.length === 0) {
    return (
      <p className="text-white p-8">No images available for this product</p>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10,
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[currentImageIndex],
    });

    setConfirmationMessage(`${product.name} added to cart`);

    setTimeout(() => {
      setConfirmationMessage("");
    }, 3000);
  };

  return (
    <div className="bg-black text-white min-h-screen p-8 flex flex-col lg:flex-row gap-12 relative">
      <div className="flex-1 flex items-center justify-center relative">
        <div {...swipeHandlers} className="w-full max-w-md">
          <img
            src={product.images[currentImageIndex]}
            alt={`${product.name} view ${currentImageIndex + 1}`}
            className="rounded-lg shadow-lg w-full h-auto object-contain"
            onError={(e) => {
              e.target.src =
                "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";
            }}
          />
        </div>

        {product.images.length > 1 && (
          <div className="hidden lg:flex absolute top-1/2 transform -translate-y-1/2 w-full justify-between px-4">
            <button
              onClick={handlePrevImage}
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 focus:outline-none"
              aria-label="Previous image"
            >
              <FaArrowLeft size={24} />
            </button>
            <button
              onClick={handleNextImage}
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 focus:outline-none"
              aria-label="Next image"
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        )}

        {product.images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {product.images.map((_, index) => (
              <button
                key={`${product.id}-image-${index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentImageIndex === index ? "bg-yellow-500" : "bg-gray-500"
                }`}
                aria-label={`View image ${index + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-lg text-gray-300">
          {product.price.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </p>
        <p className="text-gray-400">{product.description}</p>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Select Size:
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Choose a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg w-fit"
        >
          Add to Cart
        </button>
      </div>

      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
          transition-opacity duration-300 ${
            confirmationMessage
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg">
          {confirmationMessage}
        </div>
      </div>
    </div>
  );
}
