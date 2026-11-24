const PRODUCTS = [
  { id: "p1", name: "Classic Burger", desc: "Beef patty, cheddar, lettuce, tomato, house sauce.", price: 150.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" }
];

const FORMSPREE_URL = "https://formspree.io/f/mgakpqar";

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
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}

function openCart(open) {
  $("#cartPanel").classList.toggle("hidden", !open);
  if (!open) {
    // Reset back to cart view when closing
    $("#cartItems").style.display = "block";
    $("#checkoutForm").style.display = "none";
    $("#cartFooter").style.display = "block";
  }
}

// Show the form
$("#checkoutBtn").addEventListener("click", () => {
  if (cart.size === 0) { toast("Cart is empty."); return; }
  $("#cartItems").style.display = "none";
  $("#cartFooter").style.display = "none";
  $("#checkoutForm").style.display = "block";
});

// Submit Order
$("#submitOrderBtn").addEventListener("click", async () => {
  const name = $("#custName").value.trim();
  const phone = $("#custPhone").value.trim();
  const address = $("#custAddress").value.trim();

  if (!name || !phone || !address) {
    toast("Please fill in all fields.");
    return;
  }

  const { count, total, items } = cartSnapshot();
  const orderDetails = items.map(i => `${i.qty}x ${i.product.name}`).join("\n");
  
  const btn = $("#submitOrderBtn");
  btn.textContent = "SENDING...";
  btn.disabled = true;

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: `🍔 New Order from ${name}!`,
        _replyto: phone.includes("@") ? phone : undefined,
        "Customer Name": name,
        "Contact Number": phone,
        "Delivery Address": address,
        "Order Details": orderDetails,
        "Total Amount": `₱${money(total)}`
      })
    });

    if (response.ok) {
      toast(`Order placed for ${name}! We will contact you soon.`);
      cart.clear();
      renderCart();
      openCart(false);
      $("#custName").value = "";
      $("#custPhone").value = "";
      $("#custAddress").value = "";
    } else {
      toast("Error sending order. Please try again.");
    }
  } catch (err) {
    toast("Network error. Please try again.");
  } finally {
    btn.textContent = "PLACE ORDER";
    btn.disabled = false;
  }
});

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

renderMenu();
renderCart();


