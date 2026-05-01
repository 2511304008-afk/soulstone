/* ===== SOULSTONE JEWELLERY - script.js ===== */

// ── Sparkle Canvas ──────────────────────────────────────────────
const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");
let sparticles = [];
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas(); window.addEventListener("resize", resizeCanvas);
function createSpark(x, y) {
  sparticles.push({ x: x || Math.random() * canvas.width, y: y || Math.random() * canvas.height, r: Math.random() * 2 + .5, alpha: Math.random(), vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, fade: Math.random() * .015 + .003, grow: Math.random() > .5, maxR: Math.random() * 2 + 1 });
}
for (let i = 0; i < 80; i++) createSpark();
function animateSparks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparticles.forEach((s, i) => {
    s.x += s.vx; s.y += s.vy;
    s.alpha += s.grow ? s.fade : -s.fade;
    if (s.alpha <= 0 || s.alpha >= 1) s.grow = !s.grow;
    if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) { sparticles.splice(i, 1); createSpark(); return; }
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${s.alpha})`; ctx.fill();
  });
  requestAnimationFrame(animateSparks);
}
animateSparks();

// ── Navbar ───────────────────────────────────────────────────────
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
window.addEventListener("scroll", () => { navbar.classList.toggle("scrolled", scrollY > 60); });
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  hamburger.classList.remove("active"); navLinks.classList.remove("open");
}));

// ── Search ───────────────────────────────────────────────────────
const searchToggle = document.getElementById("searchToggle");
const searchWrapper = document.getElementById("searchWrapper");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
searchToggle.addEventListener("click", () => { searchWrapper.classList.add("active"); searchInput.focus(); });
searchClose.addEventListener("click", () => { searchWrapper.classList.remove("active"); searchInput.value = ""; });

// ── Cart ─────────────────────────────────────────────────────────
let cart = [];
const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function openCart() { cartSidebar.classList.add("open"); overlay.classList.add("active"); }
function closeCart() { cartSidebar.classList.remove("open"); overlay.classList.remove("active"); }
cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; } else { cart.push({ name, price, qty: 1 }); }
  renderCart(); openCart(); showToast(`${name} added to cart!`);
}
window.addToCart = addToCart;

function renderCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><span>◆</span><p>Your cart is empty</p></div>`; return;
  }
  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">₹${item.price.toLocaleString("en-IN")} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
    </div>`).join("");
}
function removeFromCart(idx) { cart.splice(idx, 1); renderCart(); }
window.removeFromCart = removeFromCart;

// ── Toast ────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ── Product Filter ────────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    const filter = this.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

// ── Testimonial Slider ────────────────────────────────────────────
let currentSlide = 0;
const slider = document.getElementById("testimonialSlider");
const slides = slider.querySelectorAll(".testimonial-slide");
const dotsContainer = document.getElementById("sliderDots");
const total = slides.length;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(n) {
  currentSlide = (n + total) % total;
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsContainer.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}
document.getElementById("sliderPrev").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("sliderNext").addEventListener("click", () => goToSlide(currentSlide + 1));
setInterval(() => goToSlide(currentSlide + 1), 5000);

// Touch swipe for slider
let touchStartX = 0;
slider.addEventListener("touchstart", e => touchStartX = e.touches[0].clientX);
slider.addEventListener("touchend", e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
});

// ── AOS (Animate on Scroll) ───────────────────────────────────────
const aosEls = document.querySelectorAll("[data-aos]");
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("aos-animate"); aosObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
aosEls.forEach(el => aosObserver.observe(el));

// ── Contact Form ──────────────────────────────────────────────────
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  btn.textContent = "Sending…"; btn.disabled = true;
  setTimeout(() => {
    document.getElementById("formSuccess").classList.add("show");
    btn.textContent = "Send Message ✦"; btn.disabled = false;
    this.reset();
  }, 1800);
});

// ── Newsletter ────────────────────────────────────────────────────
document.getElementById("newsletterForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("newsletterSuccess").classList.add("show");
  this.reset();
});

// ── Smooth Active Nav on Scroll ───────────────────────────────────
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const y = scrollY + 120;
  sections.forEach(sec => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
      navLinks.querySelectorAll("a").forEach(a => {
        a.style.color = a.getAttribute("href") === "#" + sec.id ? "var(--gold)" : "";
      });
    }
  });
});

// ═══════════════════════════════════════════════
// SOULSTONE CHATBOT ASSISTANT
// ═══════════════════════════════════════════════
const chatFab       = document.getElementById("chatbotFab");
const chatWindow    = document.getElementById("chatbotWindow");
const chatCloseBtn  = document.getElementById("chatClose");
const chatMessages  = document.getElementById("chatMessages");
const chatForm      = document.getElementById("chatForm");
const chatInputEl   = document.getElementById("chatInput");
const chatChips     = document.getElementById("chatChips");
const chatNotifBadge = document.getElementById("chatNotif");

let chatOpen = false;

// ── Open / Close ─────────────────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  chatWindow.classList.toggle("open", chatOpen);
  chatNotifBadge.classList.add("hide");
  if (chatOpen && chatMessages.children.length === 0) startChat();
}
chatFab.addEventListener("click", toggleChat);
chatCloseBtn.addEventListener("click", () => { chatOpen = false; chatWindow.classList.remove("open"); });

// ── Greeting ──────────────────────────────────
function startChat() {
  setTimeout(() => addBotMsg("Namaste! ✨ Welcome to <strong>Soulstone Jewellery</strong>. I'm your personal jewellery advisor — here to help you find the perfect piece, answer questions, or place a custom order. How can I help you today?"), 400);
}

// ── Add messages ─────────────────────────────
function addBotMsg(html) {
  const wrap = document.createElement("div");
  wrap.className = "chat-msg bot";
  wrap.innerHTML = `<div class="msg-avatar">◆</div><div class="msg-bubble">${html}</div>`;
  chatMessages.appendChild(wrap);
  scrollChat();
}
function addUserMsg(text) {
  const wrap = document.createElement("div");
  wrap.className = "chat-msg user";
  wrap.innerHTML = `<div class="msg-bubble">${escHtml(text)}</div><div class="msg-avatar">👤</div>`;
  chatMessages.appendChild(wrap);
  scrollChat();
}
function showTyping() {
  const t = document.createElement("div");
  t.className = "chat-msg bot"; t.id = "typingMsg";
  t.innerHTML = `<div class="msg-avatar">◆</div><div class="chat-typing"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(t); scrollChat(); return t;
}
function scrollChat() { chatMessages.scrollTop = chatMessages.scrollHeight; }
function escHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

// ── Knowledge Base ─────────────────────────────
const KB = [
  {
    keys: ["collection","shop","product","browse","jewellery","jewelry","piece"],
    reply: "We have stunning collections across four categories:<br><br>💎 <strong>Necklaces</strong> – from ₹2,800<br>👂 <strong>Earrings</strong> – from ₹1,800<br>💍 <strong>Rings</strong> – from ₹2,200<br>📿 <strong>Bracelets</strong> – from ₹2,500<br><br>👉 <a href='#collection'>Browse our full collection here</a>"
  },
  {
    keys: ["necklace","pendant","chain","luna","halo"],
    reply: "Our most-loved necklaces:<br><br>⭐ <strong>Luna Pendant Necklace</strong> – ₹4,200 (Bestseller!)<br>✨ <strong>Halo Chain Necklace</strong> – ₹5,800<br><br>Each is handcrafted in 18K rose gold with ethically sourced gemstones. Want to know more about a specific piece?"
  },
  {
    keys: ["earring","ear","dew","pearl","hoop","drop"],
    reply: "Our earring collection features:<br><br>🌸 <strong>Rose Dew Earrings</strong> – ₹2,800 (New arrival!)<br>🤍 <strong>Pearl Hoop Earrings</strong> – ₹2,200<br><br>Handset with natural pearls and rose gold accents. Light enough for everyday, gorgeous enough for occasions!"
  },
  {
    keys: ["bracelet","charm","celeste","bangle","wrist"],
    reply: "Our bracelets are delicate yet statement-worthy:<br><br>✦ <strong>Celeste Charm Bracelet</strong> – ₹3,500 (was ₹4,200)<br><br>Adjustable fit, rose gold plated with tiny gemstone charms. Perfect as a gift or self-treat! 💕"
  },
  {
    keys: ["ring","bloom","floral","finger","band"],
    reply: "Our rings are like wearable art:<br><br>🌸 <strong>Bloom Floral Ring</strong> – ₹3,100<br><br>Hand-engraved floral motif in rose gold with a tiny diamond-cut centre stone. Available in sizes 5–12. Want sizing help?"
  },
  {
    keys: ["custom","personalise","personalize","engrave","bespoke","initials","birthstone","design"],
    reply: "Yes, we <strong>love</strong> custom orders! 💎<br><br>You can personalise any piece with:<br>• Name or initials engraving<br>• Birthstone selection<br>• Custom chain length<br>• Mixed metals (gold + rose gold)<br><br>Custom orders take 10–14 working days. <a href='#contact'>Contact us</a> to start your design journey!"
  },
  {
    keys: ["price","cost","afford","budget","cheap","expensive","how much"],
    reply: "Our pieces are priced to reflect true handmade quality:<br><br>💰 Earrings – ₹1,800 to ₹3,500<br>💰 Necklaces – ₹2,800 to ₹8,500<br>💰 Bracelets – ₹2,200 to ₹5,500<br>💰 Rings – ₹2,000 to ₹6,000<br><br>We also offer <strong>10% off</strong> on your first order — use code <strong>SOUL10</strong> at checkout!"
  },
  {
    keys: ["ship","deliver","delivery","dispatch","courier","days","when"],
    reply: "📦 <strong>Shipping Details:</strong><br><br>• Standard delivery: <strong>5–7 working days</strong><br>• Express delivery: <strong>2–3 working days</strong> (₹199 extra)<br>• <strong>Free shipping</strong> on all orders above ₹2,000<br>• We ship across India & internationally 🌍"
  },
  {
    keys: ["return","exchange","refund","broken","damage","wrong"],
    reply: "We stand behind every piece we make 💪<br><br>✅ <strong>7-day easy returns</strong> on all standard orders<br>✅ Free exchange within 14 days<br>✅ Lifetime polishing & repair service<br><br>Just <a href='#contact'>reach out to us</a> and we'll make it right — always."
  },
  {
    keys: ["contact","reach","call","email","phone","whatsapp","chat"],
    reply: "You can reach our team at:<br><br>📧 hello@soulstonejewellery.com<br>📞 +91 98765 43210<br>📍 Bandra West, Mumbai<br><br>We're available Mon–Sat, 10am–7pm IST. Our team typically replies within 2 hours! 💬"
  },
  {
    keys: ["material","gold","silver","sterling","metal","gemstone","stone","eco","ethical"],
    reply: "We believe beauty should be <strong>responsible</strong> 🌿<br><br>All our jewellery is made with:<br>• Recycled & certified 18K / 22K gold<br>• Sterling silver (925 hallmarked)<br>• Ethically sourced natural gemstones<br>• Nickel-free, hypoallergenic finishes<br><br>Safe for sensitive skin!"
  },
  {
    keys: ["care","clean","maintain","store","tarnish","polish"],
    reply: "To keep your Soulstone jewellery radiant:<br><br>✨ Store in the provided velvet pouch<br>✨ Avoid contact with water & perfume<br>✨ Wipe gently with a soft cloth<br>✨ Bring it in for a <strong>free professional polish</strong> anytime!<br><br>With proper care, your piece will last a lifetime 💫"
  },
  {
    keys: ["gift","gifting","present","birthday","wedding","anniversary","valentine"],
    reply: "Soulstone makes <strong>the most memorable gifts</strong> 🎁<br><br>• Beautiful luxury gift packaging included free<br>• Handwritten gift note option<br>• Custom engraving for that personal touch<br>• Same-day dispatch available for express orders<br><br>Need help choosing? Tell me who you're gifting and your budget — I'll suggest the perfect piece! 💕"
  },
  {
    keys: ["discount","offer","coupon","code","promo","sale"],
    reply: "Here are our current offers 🎉<br><br>🌟 <strong>SOUL10</strong> – 10% off your first order<br>🌟 Free shipping on orders over ₹2,000<br>🌟 Subscribe to our newsletter for exclusive deals<br><br>Special seasonal sales are announced on our Instagram — follow us to never miss an offer! 💛"
  },
  {
    keys: ["about","story","brand","founder","mumbai","since","2018"],
    reply: "Soulstone Jewellery was born in <strong>2018 in Mumbai</strong> 🪷<br><br>Founded by master artisans with decades of experience, we create jewellery that carries soul — handmade, one piece at a time. Over 2,500+ happy clients and 180+ unique designs later, we're still crafting with the same love as day one.<br><br><a href='#about'>Read our full story →</a>"
  },
  {
    keys: ["hello","hi","hey","namaste","hii","good morning","good evening"],
    reply: "Hello! ✨ So lovely to have you here. I'm your Soulstone jewellery guide. What can I help you with today — finding a piece, custom orders, or something else?"
  },
  {
    keys: ["thank","thanks","great","awesome","perfect","wonderful"],
    reply: "You're so welcome! 💛 It's my pleasure to help. If you have any other questions or need help choosing a piece, I'm right here. Happy shopping! ◆"
  },
  {
    keys: ["bye","goodbye","see you","later","ok bye"],
    reply: "Goodbye! 💎 Thank you for visiting Soulstone Jewellery. Wishing you a beautiful day — come back anytime! 🌸"
  }
];

// ── Match & Respond ────────────────────────────
function getBotResponse(input) {
  const q = input.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.keys.some(k => q.includes(k))) return entry.reply;
  }
  return "That's a great question! 💬 I'm still learning, but our team can help you personally.<br><br>📧 hello@soulstonejewellery.com<br>📞 +91 98765 43210<br><br>Or <a href='#contact'>send us a message here</a> and we'll reply within 2 hours! ✨";
}

function handleUserInput(text) {
  if (!text.trim()) return;
  addUserMsg(text);
  chatInputEl.value = "";
  const typingEl = showTyping();
  const delay = 900 + Math.random() * 600;
  setTimeout(() => {
    typingEl.remove();
    addBotMsg(getBotResponse(text));
  }, delay);
}

// ── Form submit ───────────────────────────────
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  handleUserInput(chatInputEl.value);
});

// ── Quick-reply chips ─────────────────────────
chatChips.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    if (!chatOpen) toggleChat();
    handleUserInput(chip.dataset.msg);
  });
});
