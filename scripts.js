// ===== Setup Live Calculator =====
function setupCalculator(productSelectId, qtyInputId, totalElId, warningElId) {
  const productSelect = document.getElementById(productSelectId);
  const qtyInput = document.getElementById(qtyInputId);
  const totalEl = document.getElementById(totalElId);
  const warningEl = warningElId ? document.getElementById(warningElId) : null;

  if (!productSelect || !qtyInput || !totalEl) return;

  function updateTotal() {
    let price = 0;
    let qty = parseInt(qtyInput.value) || 0;
    if (warningEl) warningEl.textContent = "";

    if (productSelect.value === "1L") price = 20;
    if (productSelect.value === "20L") price = 60;
    if (productSelect.value === "250ML") {
      price = 200;
      if (qty < 2) {
        if (warningEl)
          warningEl.textContent = "Minimum 2 boxes required for 250ML Box.";
        qty = 2;
        qtyInput.value = 2;
      }
    }
    totalEl.textContent = price * qty;
  }

  productSelect.addEventListener("change", updateTotal);
  qtyInput.addEventListener("input", updateTotal);

  // Initial calculation
  updateTotal();

  // Return updater so we can trigger it externally
  return updateTotal;
}

// ===== Initialize Booking Page Calculator =====
function initializeBookingPage() {
  setupCalculator(
    "productSelect",
    "quantity",
    "totalAmount",
    "quantityWarning"
  );
}

// ===== Initialize Home Page Calculators =====
function initializeOrderCalculators() {
  setupCalculator("inlineProduct", "inlineQty", "inlineTotal", "inlineMinMsg");
  setupCalculator("mProduct", "mQty", "priceTotal", "minMsg");
}

// ===== Popup Handling =====
function openOrderModal(product) {
  const modal = document.getElementById("orderModal");
  const mProduct = document.getElementById("mProduct");

  if (mProduct) {
    mProduct.value = product;
    // Trigger calculation update
    mProduct.dispatchEvent(new Event("change"));
  }
  modal.setAttribute("aria-hidden", "false");
}

function showSuccessPopup(messageId) {
  const popup = document.getElementById(messageId);
  if (popup) popup.style.display = "flex";
}

function closeSuccessMessage() {
  const el = document.getElementById("successMessage");
  if (el) el.style.display = "none";
}

function closeOrderSuccess() {
  const el = document.getElementById("orderSuccess");
  if (el) el.style.display = "none";
}

// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", function () {
  // Booking Page
  if (document.getElementById("productSelect")) {
    initializeBookingPage();
  }

  // Home Page
  if (
    document.getElementById("inlineProduct") &&
    document.getElementById("mProduct")
  ) {
    initializeOrderCalculators();
  }

  // Booking Form
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      bookingForm.reset();
      initializeBookingPage();
      showSuccessPopup("orderSuccess");
    });
  }

  // Inline Form
  const inlineForm = document.getElementById("inlineOrder");
  if (inlineForm) {
    inlineForm.addEventListener("submit", function (e) {
      e.preventDefault();
      inlineForm.reset();
      initializeOrderCalculators();
      showSuccessPopup("successMessage");
    });
  }

  // Modal Form
  const modalForm = document.getElementById("modalOrderForm");
  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      modalForm.reset();
      initializeOrderCalculators();
      showSuccessPopup("successMessage");
      document.getElementById("orderModal").setAttribute("aria-hidden", "true");
    });
  }

  // Inline → Modal
  const openModalBtn = document.getElementById("openModalFromInline");
  if (openModalBtn) {
    openModalBtn.addEventListener("click", function () {
      document
        .getElementById("orderModal")
        .setAttribute("aria-hidden", "false");
    });
  }

  // Close Modal
  const modalClose = document.getElementById("modalClose");
  const modalCancel = document.getElementById("modalCancel");
  [modalClose, modalCancel].forEach((btn) => {
    if (btn)
      btn.addEventListener("click", () => {
        document
          .getElementById("orderModal")
          .setAttribute("aria-hidden", "true");
      });
  });

  // Mobile Menu
  const toggleBtn = document.getElementById("mobileMenuToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      document.querySelector(".nav-links").classList.toggle("active");
    });
  }
});
