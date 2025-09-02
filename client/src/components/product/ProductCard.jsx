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
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
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
