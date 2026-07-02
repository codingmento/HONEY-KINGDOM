const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");

menuIcon.onclick = function () {
  navbar.classList.toggle("active");
};

document.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !navbar.contains(e.target)) {
    navbar.classList.remove("active");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const cartCard = document.getElementById("cartCard");
  const cartItems = document.getElementById("cartItems");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const closeCart = document.getElementById("closeCart");

  function updateCartCount() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function renderCartItems() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>السلة فارغة</p>";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" class="cart-item-img">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p>$${item.price} × ${item.quantity}</p>
          </div>
          <button class="delete-item" data-index="${index}">×</button>
        </div>
      `;
    });

    cartItems.innerHTML += `<p class="cart-total">Total: $${total}</p>`;

    document.querySelectorAll(".delete-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        cart.splice(btn.dataset.index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
      });
    });
  }

  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const img = btn.dataset.img;

      const existing = cart.find((item) => item.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, img, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });

  cartIcon.addEventListener("click", () => {
    renderCartItems();
    cartModal.style.display = "flex";
  });

  closeCart.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
  });

  cartCard.addEventListener("click", (e) => e.stopPropagation());

  whatsappBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    let msg = "طلب جديد:%0A";
    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.quantity;
      msg += `- ${item.name} × ${item.quantity} ($${item.price})%0A`;
    });

    msg += `%0Aالمجموع: $${total}`;
    window.open("https://wa.me/96171049583?text=" + msg, "_blank");

    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    renderCartItems();
    cartModal.style.display = "none";
  });

  updateCartCount();
});
