import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="text-center">
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <img
          src={
            product.images[0] ||
            "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg"
          }
          alt={product.name}
          className="mx-auto w-72 h-72 object-cover hover:opacity-80 transition"
          onError={(e) => {
            e.target.src =
              "https://res.cloudinary.com/dsci2gspy/image/upload/v1756147657/WhatsApp_Image_2025-08-25_at_16.51.47_c686c776_aebbpo.jpg";
          }}
        />
        <h3 className="mt-4 text-base font-medium">{product.name}</h3>
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
