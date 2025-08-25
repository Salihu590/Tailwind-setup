import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState } from "react";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) {
    return <p className="text-white p-8">Product not found</p>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-8 flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-lg text-gray-300">{product.price}</p>
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

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg w-fit">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
