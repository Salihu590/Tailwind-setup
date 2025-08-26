import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Terms and Conditions
        </h1>

        <p className="text-gray-700 mb-6">
          Welcome to our store! Please read these Terms and Conditions carefully
          before using our website or making any purchases.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              1. Orders
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>All orders are subject to availability.</li>
              <li>
                We reserve the right to refuse or cancel an order at any time.
              </li>
              <li>
                Prices and availability are subject to change without notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              2. Payments
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Payments must be made through our secure gateways.</li>
              <li>
                You agree to provide current, complete, and accurate billing
                information.
              </li>
              <li>
                Failure to provide accurate information may result in
                cancellation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              3. Returns
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Products can be returned within 7 days of delivery.</li>
              <li>
                Items must be unused, in original packaging, and in resale
                condition.
              </li>
              <li>
                Shipping costs for returns may apply unless the product is
                defective.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              4. Liability
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                We are not responsible for damages caused by misuse of our
                products.
              </li>
              <li>
                Our liability is limited to the value of the product purchased.
              </li>
              <li>We do not guarantee uninterrupted access to our website.</li>
            </ul>
          </section>
        </div>

        <p className="text-gray-700 mt-8">
          By proceeding with your purchase, you agree to these Terms and
          Conditions.
        </p>

        <div className="mt-8">
          <Link
            to="/cart"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
