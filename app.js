const PRODUCTS = [
  { id: "p1", name: "Smoked Brisket Plate", desc: "12-hour brisket, slaw, pickles, cornbread.", price: 850.00, image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop" },
  { id: "p2", name: "Green Chile Burger",   desc: "Half-pound patty, roasted chile, cheddar, brioche.", price: 450.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
  { id: "p3", name: "Miso Mushroom Ramen",  desc: "Rich broth, fresh noodles, soft egg.", price: 550.00, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600&auto=format&fit=crop" },
  { id: "p4", name: "Charred Corn Salad",   desc: "Corn, cotija, lime, chile, herbs.", price: 320.00, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop" },
  { id: "p5", name: "Buttermilk Chicken",   desc: "Crispy thighs, hot honey, pickles.", price: 480.00, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop" },
  { id: "p6", name: "Olive Oil Citrus Cake", desc: "Tender cake, orange glaze, sea salt.", price: 250.00, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop" }
];

const cart = new Map();
const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function renderMenu() {
  const grid = $("#grid");
  grid.innerHTML = "";
  for (const p of PRODUCTS) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <span class="price">₱${money(p.price)}</span>
          <button data-add="${p.id}">ADD</button>
        </div>
      </div>`;
    grid.appendChild(card);
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
  box.innerHTML = items.map(({ product, qty }) => `
    <div class="cart-item">
      <div class="meta">
        <strong>${product.name}</strong>
        <small>₱${money(product.price)} each</small>
      </div>
      <div class="qty">
        <button data-dec="${product.id}">&minus;</button>
        <span>${qty}</span>
        <button data-inc="${product.id}">+</button>
      </div>
    </div>`).join("");
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  toast(`Added ${PRODUCTS.find((p) => p.id === id).name}`);
}

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}

function openCart(open) {
  $("#cartPanel").classList.toggle("hidden", !open);
}

function checkout() {
  const { count, total } = cartSnapshot();
  if (count === 0) { toast("Cart is empty."); return; }
  toast(`Order placed — ₱${money(total)}. Thank you!`);
  cart.clear();
  renderCart();
  openCart(false);
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(add.dataset.add);

  const inc = e.target.closest("[data-inc]");
  if (inc) return changeQty(inc.dataset.inc, 1);

  const dec = e.target.closest("[data-dec]");
  if (dec) return changeQty(dec.dataset.dec, -1);
});

$("#cartBtn").addEventListener("click", () => openCart(true));
$("#closeCart").addEventListener("click", () => openCart(false));
$("#checkoutBtn").addEventListener("click", checkout);

renderMenu();
renderCart();
