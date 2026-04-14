// ============================
// NAVBAR - Mobile Menu Toggle
// ============================
const navLinks = document.querySelectorAll(".nav-menu .nav-link")
const menuOpenButton = document.querySelector("#menu-open-button")
const menuCloseButton = document.querySelector("#menu-close-button")

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
  document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click ());

navLinks.forEach(link => {
  link.addEventListener("click", () => menuOpenButton.click ());
});

// ============================
// SWIPER - Testimonials Slider
// ============================
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    },
  }
});

// ============================
// ANIMASI SCROLL
// ============================
// Menggunakan Intersection Observer untuk mendeteksi elemen saat di-scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      // Jika elemen terlihat di layar
      if (entry.isIntersecting) {
          entry.target.classList.add('show-animate');
      }
      // Opsional: Jika ingin animasi ulang saat scroll ke atas, uncomment baris bawah
      // else { entry.target.classList.remove('show-animate'); }
  });
});

// Kumpulan elemen yang punya class 'animate-on-scroll'
const hiddenElements = document.querySelectorAll('.animate-on-scroll');
hiddenElements.forEach((el) => observer.observe(el));

// ============================
// ORDER NOW - Smooth Scroll
// ============================
const orderNowBtn = document.querySelector('#btn-order-now');
if (orderNowBtn) {
  orderNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const menuSection = document.querySelector('#menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ============================
// MENU CATEGORY FILTER
// ============================
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active class pada tombol filter
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;

    menuItems.forEach((item, index) => {
      // Hapus animasi sebelumnya
      item.classList.remove('fade-in');

      if (category === 'all' || item.dataset.category === category) {
        // Tampilkan item yang sesuai kategori
        item.classList.remove('hide');
        // Tambahkan animasi fade-in dengan delay bertahap
        setTimeout(() => {
          item.classList.add('fade-in');
        }, index * 60);
      } else {
        // Sembunyikan item yang tidak sesuai
        item.classList.add('hide');
      }
    });
  });
});

// ============================
// SHOPPING CART SYSTEM
// ============================
let cart = [];

// DOM Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsList = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const cartEmptyMsg = document.getElementById('cart-empty-msg');
const cartFooter = document.getElementById('cart-footer');
const floatingCartBtn = document.getElementById('floating-cart-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');

// Open/Close Cart Sidebar
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

floatingCartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Show Toast Notification
function showToast(message) {
  toastMessage.textContent = message;
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 2500);
}

// Format Rupiah
function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Add to Cart
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price: parseInt(price), qty: 1 });
  }
  updateCartUI();
  showToast(`"${name}" ditambahkan ke keranjang!`);

  // Bump animation on floating button
  floatingCartBtn.classList.add('bump');
  setTimeout(() => floatingCartBtn.classList.remove('bump'), 400);
}

// Remove from Cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// Update Quantity
function updateQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(name);
      return;
    }
  }
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  // Clear list
  cartItemsList.innerHTML = '';

  // Calculate total count and price
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update cart count badge
  cartCountEl.textContent = totalItems;

  // Show/hide empty message and footer
  if (cart.length === 0) {
    cartEmptyMsg.style.display = 'flex';
    cartFooter.style.display = 'none';
  } else {
    cartEmptyMsg.style.display = 'none';
    cartFooter.style.display = 'block';
  }

  // Build cart items
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRupiah(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateQty('${item.name}', -1)" title="Kurangi">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty('${item.name}', 1)" title="Tambah">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name}')" title="Hapus">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItemsList.appendChild(li);
  });

  // Update total
  cartTotalEl.textContent = formatRupiah(totalPrice);
}

// Add to Cart button click handlers
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    addToCart(name, price);
  });
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong!');
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Build order summary
  let orderSummary = '🛒 RINGKASAN PESANAN\n';
  orderSummary += '─'.repeat(30) + '\n';
  cart.forEach(item => {
    orderSummary += `☕ ${item.name} x${item.qty} — ${formatRupiah(item.price * item.qty)}\n`;
  });
  orderSummary += '─'.repeat(30) + '\n';
  orderSummary += `📦 Total Item: ${totalItems}\n`;
  orderSummary += `💰 Total: ${formatRupiah(totalPrice)}\n\n`;
  orderSummary += 'Terima kasih sudah memesan di Stéva Coffee! ☕';

  alert(orderSummary);

  // Clear cart after checkout
  cart = [];
  updateCartUI();
  closeCart();
  showToast('Pesanan berhasil! Terima kasih ☕');
});

// Initialize cart UI on page load
updateCartUI();