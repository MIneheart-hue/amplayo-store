const PRODUCTS = [];

const cart = new Map();
const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function renderMenu() {
  const grid = $("#grid");
  grid.innerHTML = "";
  
  if (PRODUCTS.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>COOKING SOMETHING UP...</h3>
        <p>We are currently updating our menu. Please check back soon for delicious meals!</p>
      </div>
    `;
    return;
  }
}

function cartSnapshot() {
  const items = [...cart.entries()].map(([id, qty]) => ({
    product: PRODUCTS.find((p) => p.id === id),
    qty,
  }));
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, total, count };
}

function renderCart() {
  const { items, total, count } = cartSnapshot();
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);

  const box = $("#cartItems");
  if (items.length === 0) {
    box.innerHTML = `<p style="color:var(--muted); font-family: system-ui, sans-serif;">Your cart is empty.</p>`;
    return;
  }
}

function openCart(open) {
  $("#cartPanel").classList.toggle("hidden", !open);
  if (!open) {
    $("#cartItems").style.display = "block";
    $("#checkoutForm").style.display = "none";
    $("#cartFooter").style.display = "block";
  }
}

$("#checkoutBtn").addEventListener("click", () => {
  if (cart.size === 0) { toast("Cart is empty."); return; }
  $("#cartItems").style.display = "none";
  $("#cartFooter").style.display = "none";
  $("#checkoutForm").style.display = "block";
});

$("#cartBtn").addEventListener("click", () => openCart(true));
$("#closeCart").addEventListener("click", () => openCart(false));

renderMenu();
renderCart();
