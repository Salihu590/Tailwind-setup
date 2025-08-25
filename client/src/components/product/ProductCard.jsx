import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="text-center">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="mx-auto w-72 h-72 object-cover hover:opacity-80 transition"
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
