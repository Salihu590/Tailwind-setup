const API_URL = "http://localhost:3001/api/admin";

const app = document.getElementById("app");
const loginFormContainer = document.getElementById("login-form-container");
const dashboardContainer = document.getElementById("dashboard-container");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const ordersList = document.getElementById("orders-list");
const logoutButton = document.getElementById("logout-button");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("adminToken", data.token);
      renderDashboard();
    } else {
      errorMessage.textContent =
        data.error || "Login failed. Please try again.";
    }
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.textContent =
      "An error occurred. Please check the server connection.";
  }
});

async function renderDashboard() {
  const token = localStorage.getItem("adminToken");

  if (token) {
    loginFormContainer.classList.add("hidden");
    dashboardContainer.classList.remove("hidden");
    errorMessage.textContent = "";

    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const orders = await response.json();
      renderOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      localStorage.removeItem("adminToken");
      renderDashboard();
      alert("Session expired or invalid. Please log in again.");
    }
  } else {
    loginFormContainer.classList.remove("hidden");
    dashboardContainer.classList.add("hidden");
  }
}

function renderOrders(orders) {
  ordersList.innerHTML = "";
  if (orders.length === 0) {
    ordersList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
            <h3>Order ID: ${order.orderId}</h3>
            <p><strong>Customer:</strong> ${order.checkoutData.firstName} ${
      order.checkoutData.lastName
    }</p>
            <p><strong>Email:</strong> ${order.checkoutData.email}</p>
            <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>
            <p><strong>Address:</strong> ${order.checkoutData.address}, ${
      order.checkoutData.city
    }, ${order.checkoutData.state}, ${order.checkoutData.country}</p>
            <p><strong>Total:</strong> ₦${order.total.toFixed(2)}</p>
            <p><strong>Payment Status:</strong> <span class="status-badge ${order.paymentStatus.toLowerCase()}">${
      order.paymentStatus
    }</span></p>
            <hr>
            <h4>Items:</h4>
            <ul>
                ${order.cartItems
                  .map(
                    (item) => `
                    <li class="item-row">
                        ${
                          item.image
                            ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
                            : ""
                        }
                        ${item.name} (x${item.quantity})${
                      item.size ? ` - Size: ${item.size}` : ""
                    } - ₦${item.price}
                    </li>
                `
                  )
                  .join("")}
            </ul>
            ${
              
              order.paymentStatus === "paid"
                ? `<button class="action-button" onclick="updateOrderStatus('${order.orderId}', 'shipped')">Mark as Shipped</button>`
                : order.paymentStatus === "shipped"
                ? `<button class="action-button" onclick="updateOrderStatus('${order.orderId}', 'delivered')">Mark as Delivered</button>`
                : order.paymentStatus === "delivered"
                ? `<button class="action-button" disabled>Delivered</button>`
                : ""
            }
        `;
    ordersList.appendChild(card);
  });
}

async function updateOrderStatus(orderId, newStatus) {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      renderDashboard();
    } else {
      console.error("Failed to update status.");
      alert("Failed to update status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("An error occurred. Please try again.");
  }
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  renderDashboard();
});

renderDashboard();
