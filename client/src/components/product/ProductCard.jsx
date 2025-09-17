import { Link } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || DEFAULT_IMAGE;

  return (
    <div className="text-center group transition-all duration-300 transform hover:scale-105 hover:z-10 relative">
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <div className="w-full aspect-square overflow-hidden rounded-lg relative">
          <img
            src={imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              !product.inStock && "grayscale opacity-50"
            }`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-600 text-white font-bold text-sm px-4 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <h3 className="mt-4 text-base font-medium group-hover:text-white transition-colors duration-300">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-300">
          {product.price.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </p>
      </Link>
    </div>
  );
}
