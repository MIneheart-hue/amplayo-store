const PRODUCTS = [];

const cart = new Map();
const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function renderMenu() {
  const grid = $("#grid");
  grid.innerHTML = `<p style="font-family: system-ui, sans-serif; color: #666; grid-column: 1 / -1; text-align: center; margin-top: 2rem; font-size: 1.2rem;">No products available yet. Check back soon!</p>`;
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

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) return;

  const inc = e.target.closest("[data-inc]");
  if (inc) return;

  const dec = e.target.closest("[data-dec]");
  if (dec) return;
});

$("#cartBtn").addEventListener("click", () => $("#cartPanel").classList.remove("hidden"));
$("#closeCart").addEventListener("click", () => $("#cartPanel").classList.add("hidden"));
$("#checkoutBtn").addEventListener("click", () => {
  $("#cartPanel").classList.add("hidden");
});

renderMenu();
renderCart();
