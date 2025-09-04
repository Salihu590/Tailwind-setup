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
const dashboardHeader = document.getElementById("dashboard-header");

const totalOrdersMetric = document.getElementById("total-orders-metric");
const totalRevenueMetric = document.getElementById("total-revenue-metric");
const pendingPaymentsMetric = document.getElementById(
  "pending-payments-metric"
);
const ordersToShipMetric = document.getElementById("orders-to-ship-metric");

const searchInput = document.getElementById("search-input");
const paymentStatusFilter = document.getElementById("payment-status-filter");
const orderStatusFilter = document.getElementById("order-status-filter");
const startDateFilter = document.getElementById("start-date-filter");
const endDateFilter = document.getElementById("end-date-filter");
const clearFiltersButton = document.getElementById("clear-filters");

const activeOrdersBtn = document.getElementById("active-orders-btn");
const archivedOrdersBtn = document.getElementById("archived-orders-btn");

const orderDetailsModal = document.getElementById("order-details-modal");
const orderDetailsContent = document.getElementById("order-details-content");
const closeButton = document.querySelector(".close-button");

const customersList = document.getElementById("customers-list");
const customerSearchInput = document.getElementById("customer-search-input");
const clearCustomerFiltersButton = document.getElementById(
  "clear-customer-filters"
);

const ordersViewBtn = document.getElementById("orders-view-btn");
const customersViewBtn = document.getElementById("customers-view-btn");
const revenueViewBtn = document.getElementById("revenue-view-btn");
const topProductsViewBtn = document.getElementById("top-products-view-btn");

const ordersSection = document.getElementById("orders-section");
const customersSection = document.getElementById("customers-section");
const revenueReportContainer = document.getElementById(
  "revenue-report-container"
);
const topProductsReportContainer = document.getElementById(
  "top-products-report-container"
);

const topProductsList = document.getElementById("top-products-list");

let allCustomersData = [];
let revenueChart = null;
let isActiveView = true;

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
      localStorage.setItem("adminUsername", username);
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

const showSection = (sectionToShow, buttonToActivate) => {
  const allSections = [
    ordersSection,
    customersSection,
    revenueReportContainer,
    topProductsReportContainer,
  ];
  const allButtons = [
    ordersViewBtn,
    customersViewBtn,
    revenueViewBtn,
    topProductsViewBtn,
  ];
  allSections.forEach((section) => section.classList.add("hidden"));
  allButtons.forEach((button) => button.classList.remove("active"));

  sectionToShow.classList.remove("hidden");
  buttonToActivate.classList.add("active");
};

ordersViewBtn.addEventListener("click", () =>
  showSection(ordersSection, ordersViewBtn)
);
customersViewBtn.addEventListener("click", () => {
  showSection(customersSection, customersViewBtn);
  renderCustomers();
});
revenueViewBtn.addEventListener("click", () => {
  showSection(revenueReportContainer, revenueViewBtn);
  renderRevenueChart();
});
topProductsViewBtn.addEventListener("click", () => {
  showSection(topProductsReportContainer, topProductsViewBtn);
  renderTopSellingProducts();
});

activeOrdersBtn.addEventListener("click", () => {
  isActiveView = true;
  activeOrdersBtn.classList.add("active");
  archivedOrdersBtn.classList.remove("active");
  renderDashboard();
});

archivedOrdersBtn.addEventListener("click", () => {
  isActiveView = false;
  activeOrdersBtn.classList.remove("active");
  archivedOrdersBtn.classList.add("active");
  renderDashboard();
});

searchInput.addEventListener("input", renderDashboard);
paymentStatusFilter.addEventListener("change", renderDashboard);
orderStatusFilter.addEventListener("change", renderDashboard);
startDateFilter.addEventListener("change", renderDashboard);
endDateFilter.addEventListener("change", renderDashboard);

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  paymentStatusFilter.value = "";
  orderStatusFilter.value = "";
  startDateFilter.value = "";
  endDateFilter.value = "";
  renderDashboard();
});

customerSearchInput.addEventListener("input", renderCustomers);
clearCustomerFiltersButton.addEventListener("click", () => {
  customerSearchInput.value = "";
  renderCustomers();
});

async function renderDashboard() {
  const token = localStorage.getItem("adminToken");
  const username = localStorage.getItem("adminUsername") || "Admin";
  const isSmallScreen = window.innerWidth <= 480;

  if (token) {
    loginFormContainer.classList.add("hidden");
    dashboardContainer.classList.remove("hidden");
    errorMessage.textContent = "";
    dashboardHeader.textContent = isSmallScreen
      ? `Hi, ${username}!`
      : `Hi, ${username}! What are we doing today?`;

    try {
      const start = startDateFilter.value;
      const end = endDateFilter.value;

      let url = `${API_URL}/orders`;
      let params = [];
      if (start) params.push(`startDate=${start}`);
      if (end) params.push(`endDate=${end}`);
      if (params.length > 0) url += "?" + params.join("&");

      const response = await fetch(url, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const orders = await response.json();

      const activeOrders = orders.filter(
        (order) => order.orderStatus !== "delivered"
      );
      const archivedOrders = orders.filter(
        (order) => order.orderStatus === "delivered"
      );

      const totalRevenue = orders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const pendingPayments = orders.filter(
        (order) => order.paymentStatus === "pending"
      ).length;
      const ordersToShip = orders.filter(
        (order) => order.orderStatus === "confirmed"
      ).length;

      totalOrdersMetric.textContent = totalOrders;
      totalRevenueMetric.textContent = `₦${totalRevenue.toFixed(2)}`;
      pendingPaymentsMetric.textContent = pendingPayments;
      ordersToShipMetric.textContent = ordersToShip;

      const searchQuery = searchInput.value.toLowerCase();
      const selectedPaymentStatus = paymentStatusFilter.value;
      const selectedOrderStatus = orderStatusFilter.value;

      let filteredOrders = isActiveView ? activeOrders : archivedOrders;

      filteredOrders = filteredOrders.filter((order) => {
        const matchesSearch =
          order.orderId.toLowerCase().includes(searchQuery) ||
          order.checkoutData.firstName.toLowerCase().includes(searchQuery) ||
          order.checkoutData.lastName.toLowerCase().includes(searchQuery) ||
          order.checkoutData.email.toLowerCase().includes(searchQuery);

        const matchesPaymentStatus =
          selectedPaymentStatus === "" ||
          order.paymentStatus.toLowerCase() === selectedPaymentStatus;
        const matchesOrderStatus =
          selectedOrderStatus === "" ||
          order.orderStatus.toLowerCase() === selectedOrderStatus;

        return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
      });

      renderOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
      renderDashboard();
      alert("Session expired or invalid. Please log in again.");
    }
  } else {
    loginFormContainer.classList.remove("hidden");
    dashboardContainer.classList.add("hidden");
    dashboardHeader.textContent = "Admin Dashboard";
  }
}

async function renderRevenueChart() {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await fetch(`${API_URL}/revenue-by-date`, {
      headers: {
        "x-auth-token": token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch revenue data.");
    }
    const data = await response.json();
    const dates = data.map((item) => item._id);
    const revenues = data.map((item) => item.totalRevenue);

    if (revenueChart) {
      revenueChart.destroy();
    }

    const ctx = document.getElementById("revenue-chart").getContext("2d");
    revenueChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Total Revenue",
            data: revenues,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderColor: "var(--accent-color)",
            borderWidth: 2,
            pointBackgroundColor: "var(--accent-color)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Revenue (₦)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
}

async function renderTopSellingProducts() {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await fetch(`${API_URL}/top-selling-products`, {
      headers: {
        "x-auth-token": token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch top products.");
    }
    const products = await response.json();

    if (!topProductsList) {
      console.error("Error: Element with ID 'top-products-list' not found.");
      return;
    }

    topProductsList.innerHTML = "";
    if (products.length === 0) {
      topProductsList.innerHTML = "<p>No products sold yet.</p>";
      return;
    }

    products.forEach((product, index) => {
      const productItem = document.createElement("div");
      productItem.className = "product-item";
      productItem.innerHTML = `
          <div class="product-rank">${index + 1}</div>
          <img src="${product.image}" alt="${
        product.name
      }" class="product-image">
          <div class="product-details">
              <h4>${product.name}</h4>
              <p>Sold: ${product.totalQuantity} units</p>
              <p>Revenue: ₦${product.totalRevenue.toFixed(2)}</p>
          </div>
      `;
      topProductsList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching top products:", error);
  }
}

async function renderCustomers() {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    if (allCustomersData.length === 0) {
      const response = await fetch(`${API_URL}/customers`, {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Failed to fetch customers.");
      allCustomersData = await response.json();
    }

    const searchQuery = customerSearchInput.value.toLowerCase();
    const filteredCustomers = allCustomersData.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery)
      );
    });

    customersList.innerHTML = "";
    if (filteredCustomers.length === 0) {
      customersList.innerHTML = "<p>No customers found.</p>";
      return;
    }

    filteredCustomers.forEach((customer) => {
      const card = document.createElement("div");
      card.className = "customer-card";
      card.addEventListener("click", () => showCustomerDetails(customer.email));
      card.innerHTML = `
                <h3>${customer.firstName} ${customer.lastName}</h3>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Total Orders:</strong> ${customer.orderCount}</p>
                <p><strong>Total Spent:</strong> ₦${customer.totalSpent.toFixed(
                  2
                )}</p>
            `;
      customersList.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    alert("Failed to load customer data.");
  }
}

async function showCustomerDetails(customerEmail) {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/customers/${customerEmail}`, {
      headers: { "x-auth-token": token },
    });

    if (!response.ok) throw new Error("Failed to fetch customer details.");

    const customer = await response.json();
    let ordersHtml = "";
    customer.orders.forEach((order) => {
      ordersHtml += `
                <div class="order-card" style="margin-bottom: 15px;">
                    <h4>Order ID: ${order.orderId}</h4>
                    <p><strong>Date:</strong> ${new Date(
                      order.createdAt
                    ).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₦${order.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${
                      order.orderStatus
                    }">${order.orderStatus}</span></p>
                </div>
            `;
    });

    orderDetailsContent.innerHTML = `
            <h3>Customer Profile</h3>
            <p><strong>Name:</strong> ${customer.firstName} ${
      customer.lastName
    }</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Total Orders:</strong> ${customer.orderCount}</p>
            <p><strong>Total Spent:</strong> ₦${customer.totalSpent.toFixed(
              2
            )}</p>
            <hr>
            <h4>All Orders for this Customer:</h4>
            ${ordersHtml}
        `;
    orderDetailsModal.classList.add("visible");
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    alert("Could not load customer details.");
  }
}

function renderOrders(orders) {
  ordersList.innerHTML = "";
  if (orders.length === 0) {
    ordersList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach((order) => {
    const specialInstructionsHtml = order.specialInstructions
      ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>`
      : "";

    const card = document.createElement("div");
    card.className = "order-card";
    card.addEventListener("click", () => showOrderDetails(order.orderId));
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
             <p><strong>Order Status:</strong> <span class="status-badge ${order.orderStatus.toLowerCase()}">${
      order.orderStatus
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
            ${specialInstructionsHtml}
        `;
    ordersList.appendChild(card);
  });
}

async function showOrderDetails(orderId) {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details.");
    }

    const order = await response.json();
    populateOrderModal(order);
    orderDetailsModal.classList.add("visible");
  } catch (error) {
    console.error("Error fetching order details:", error);
    alert("Could not load order details.");
  }
}

function populateOrderModal(order) {
  const specialInstructionsHtml = order.specialInstructions
    ? `
    <div style="margin-top: 20px;">
        <p><strong>Special Instructions:</strong></p>
        <p>${order.specialInstructions}</p>
    </div>
  `
    : "";

  orderDetailsContent.innerHTML = `
        <h3>Order ID: ${order.orderId}</h3>
        <p><strong>Customer:</strong> ${order.checkoutData.firstName} ${
    order.checkoutData.lastName
  }</p>
        <p><strong>Email:</strong> ${order.checkoutData.email}</p>
        <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>
        <p><strong>Address:</strong> ${order.checkoutData.address}, ${
    order.checkoutData.city
  }, ${order.checkoutData.state}, ${order.checkoutData.country}</p>
        <p><strong>Apartment/Suite:</strong> ${
          order.checkoutData.apartment || "N/A"
        }</p>
        <p><strong>Total:</strong> ₦${order.total.toFixed(2)}</p>
        <p><strong>Payment Status:</strong> <span class="status-badge ${order.paymentStatus.toLowerCase()}">${
    order.paymentStatus
  }</span></p>
        <p><strong>Order Status:</strong> <span class="status-badge ${order.orderStatus.toLowerCase()}">${
    order.orderStatus
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
        ${specialInstructionsHtml}
        ${
          order.orderStatus === "confirmed" && order.paymentStatus === "paid"
            ? `<button class="action-button" onclick="updateOrderStatus('${order.orderId}', 'shipped')">Mark as Shipped</button>`
            : order.orderStatus === "shipped"
            ? `<button class="action-button" onclick="updateOrderStatus('${order.orderId}', 'delivered')">Mark as Delivered</button>`
            : order.orderStatus === "delivered"
            ? `<button class="action-button" disabled>Delivered</button>`
            : ""
        }
        ${
          order.paymentStatus === "pending"
            ? `<button class="action-button" onclick="updatePaymentAndOrderStatus('${order.orderId}')">Mark as Paid & Confirmed</button>`
            : ""
        }
        <hr>
        <h4>Order Notes</h4>
        <div id="order-notes-list">
            ${
              order.notes && order.notes.length > 0
                ? order.notes.map((note) => `<p>• ${note}</p>`).join("")
                : "<p>No notes for this order.</p>"
            }
        </div>
        <div class="add-note-container">
            <textarea id="note-textarea" placeholder="Add a new note..." rows="3"></textarea>
            <button id="add-note-button" class="action-button" onclick="addOrderNote('${
              order._id
            }')">Add Note</button>
        </div>
    `;
}

function closeOrderDetailsModal() {
  orderDetailsModal.classList.remove("visible");
}

closeButton.addEventListener("click", closeOrderDetailsModal);
window.addEventListener("click", (event) => {
  if (event.target === orderDetailsModal) {
    closeOrderDetailsModal();
  }
});

async function addOrderNote(orderId) {
  const token = localStorage.getItem("adminToken");
  const noteTextarea = document.getElementById("note-textarea");
  const note = noteTextarea.value;
  if (!token || !note) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ note }),
    });

    if (response.ok) {
      const updatedOrder = await response.json();
      populateOrderModal(updatedOrder);
      noteTextarea.value = "";
    } else {
      alert("Failed to add note.");
    }
  } catch (error) {
    console.error("Error adding note:", error);
    alert("An error occurred. Please try again.");
  }
}

async function updateOrderStatus(orderId, newStatus) {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  const confirmationMessage = `Are you sure you want to mark this order as '${newStatus.toUpperCase()}'? This action cannot be undone.`;
  const confirmUpdate = confirm(confirmationMessage);

  if (!confirmUpdate) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ newStatus }),
    });

    if (response.ok) {
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      closeOrderDetailsModal();
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

async function updatePaymentAndOrderStatus(orderId) {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  const confirmUpdate = confirm(
    "Are you sure you want to mark this order as PAID and CONFIRMED? This action cannot be undone."
  );
  if (!confirmUpdate) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        newPaymentStatus: "paid",
        newOrderStatus: "confirmed",
      }),
    });

    if (response.ok) {
      console.log(`Order ${orderId} marked as paid and confirmed.`);
      closeOrderDetailsModal();
      renderDashboard();
      alert("Order has been successfully marked as paid and confirmed.");
    } else {
      console.error("Failed to update status.");
      alert("Failed to update payment status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("An error occurred. Please try again.");
  }
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUsername");
  renderDashboard();
});

window.addEventListener("resize", renderDashboard);

renderDashboard();
