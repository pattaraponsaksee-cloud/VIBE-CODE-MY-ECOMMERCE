// --- Databases ---
const PRODUCTS = [
    {
        id: 1,
        name: "MindFlow Focus",
        category: "vitamins",
        description: "ช่วยกระตุ้นสมาธิ การจดจ่อขั้นสูง (Flow State) และเสริมสร้างประสิทธิภาพการทำงานของสมองระหว่างวัน",
        price: 1490,
        type: "physical",
        badge: "วิตามินบำรุงสมอง",
        badgeClass: "physical",
        icon: "🧠",
        image: "assets/mindflow_focus.png"
    },
    {
        id: 2,
        name: "SleepSync Rest",
        category: "vitamins",
        description: "ฟื้นฟูสมองยามค่ำคืน ช่วยในการจัดระบบความจำ (Memory Consolidation) และหลับสนิทระดับ REM Sleep",
        price: 1290,
        type: "physical",
        badge: "ฟื้นฟูขณะหลับ",
        badgeClass: "physical",
        icon: "🌙",
        image: "assets/sleepsync_rest.png"
    },
    {
        id: 3,
        name: "ZenState Calm",
        category: "vitamins",
        description: "ลดความตึงเครียดของสมอง เพิ่มความนิ่งและความคิดสร้างสรรค์ภายใต้สภาวะกดดัน",
        price: 1190,
        type: "physical",
        badge: "ผ่อนคลายและลดเครียด",
        badgeClass: "physical",
        icon: "🧘",
        image: "assets/zenstate_calm.png"
    },
    {
        id: 4,
        name: "Ultimate Cognitive Planner 2026",
        category: "planners",
        description: "สมุดแพลนเนอร์สไตล์สมองใส ออกแบบพิเศษเพื่อจัดตารางความคิด (Time Blocking) และจดจ่อเป้าหมายรายวัน (PDF for Goodnotes)",
        price: 350,
        type: "digital",
        badge: "Digital Planner",
        badgeClass: "digital",
        icon: "📅",
        image: "assets/cognitive_planner.png"
    },
    {
        id: 5,
        name: "Mindmap & Focus Sheets Bundle",
        category: "planners",
        description: "เทมเพลตวางแผนความคิดและแผ่น Time-blocking ชนิดดิจิทัล ดาวน์โหลดใช้งานซ้ำได้ตลอดชีพ",
        price: 190,
        type: "digital",
        badge: "Digital Download",
        badgeClass: "digital",
        icon: "✍️",
        image: "assets/mindmap_bundle.png"
    }
];

const REVIEWS = [
    {
        stars: 5,
        text: "“หลังจากลองกิน MindFlow Focus ร่วมกับใช้สมุด Planner วางตารางงาน รู้สึกว่าจดจ่อได้ดีขึ้นมาก ไม่วอกแวกเลย งานเสร็จไวขึ้นเยอะ แนะนำเซ็ตนี้จริง ๆ ครับ”",
        author: "คุณชลสิทธิ์ พ.",
        title: "นักพัฒนาซอฟต์แวร์อิสระ"
    },
    {
        stars: 5,
        text: "“ตัว SleepSync ดีมากค่ะ หลับลึกขึ้น ตื่นมารู้สึกหัวไบร์ท ไม่ตื้อ ส่วนตัวแพลนเนอร์ใช้ใน iPad สะดวกมาก ลิงก์กดง่าย สีสันสวยงามคุ้มค่ามากค่ะ”",
        author: "คุณมนัสวี ว.",
        title: "กราฟิกดีไซเนอร์และคอนเทนต์ครีเอเตอร์"
    },
    {
        stars: 5,
        text: "“วิตามินเสริมบำรุงสมองร่วมกับการจัดลำดับความสำคัญในแต่ละวัน เปลี่ยนชีวิตคนสมาธิสั้นอย่างผมได้เยอะมากครับ รีวิวห้าดาวจากผู้ใช้งานจริง”",
        author: "ดร. กิตติพงษ์ ส.",
        title: "อาจารย์มหาวิทยาลัย"
    }
];

// --- State Management ---
let cart = [];
let activeCategory = "all";
let currentReviewIndex = 0;

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderReview(currentReviewIndex);
    setupEventListeners();
    updateCartUI();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Category Filtering
    const tabButtons = document.querySelectorAll(".filter-tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tabButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            activeCategory = e.target.dataset.category;
            renderProducts();
        });
    });

    // Carousel Navigation
    document.getElementById("prev-review-btn").addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex - 1 + REVIEWS.length) % REVIEWS.length;
        renderReview(currentReviewIndex);
    });
    document.getElementById("next-review-btn").addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex + 1) % REVIEWS.length;
        renderReview(currentReviewIndex);
    });

    // Cart Drawer Toggle
    const cartToggleBtns = document.querySelectorAll(".cart-toggle-trigger");
    cartToggleBtns.forEach(btn => {
        btn.addEventListener("click", toggleCartDrawer);
    });

    // Checkout Modal Toggles
    document.getElementById("checkout-trigger").addEventListener("click", openCheckoutModal);
    document.getElementById("close-modal-btn").addEventListener("click", closeCheckoutModal);
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
        if (e.target.id === "modal-overlay") closeCheckoutModal();
    });

    // Checkout Form Submit
    document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);
}

// --- Render Products ---
function renderProducts() {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    const filtered = PRODUCTS.filter(p => activeCategory === "all" || p.category === activeCategory);

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div>
                <span class="product-badge ${product.badgeClass}">${product.badge}</span>
                <div class="product-image-container">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : `<span class="product-icon-fallback">${product.icon}</span>`}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
            </div>
            <div class="product-footer">
                <div class="product-price">฿${product.price.toLocaleString()}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" aria-label="Add to cart">
                    <i class="ri-shopping-cart-2-line"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Render Review ---
function renderReview(index) {
    const review = REVIEWS[index];
    const starsHtml = '<i class="ri-star-fill"></i>'.repeat(review.stars);
    
    document.getElementById("review-stars-container").innerHTML = starsHtml;
    document.getElementById("review-text-element").innerText = review.text;
    document.getElementById("review-author-name").innerText = review.author;
    document.getElementById("review-author-title").innerText = review.title;
}

// --- Cart Operations ---
window.addToCart = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.product.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCartUI();
    
    // Automatically open drawer to show feedback
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("drawer-overlay");
    if (!drawer.classList.contains("open")) {
        drawer.classList.add("open");
        overlay.classList.add("open");
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartUI();
};

window.changeQuantity = function(productId, delta) {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
};

function toggleCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("drawer-overlay");
    drawer.classList.toggle("open");
    overlay.classList.toggle("open");
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = "";

    // Update Badges Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(el => {
        el.innerText = totalCount;
        el.style.display = totalCount > 0 ? "flex" : "none";
    });

    // Check if cart has physical or digital items
    const hasPhysical = cart.some(item => item.product.type === "physical");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <i class="ri-shopping-bag-line"></i>
                <p>ยังไม่มีสินค้าในตะกร้าของคุณ</p>
            </div>
        `;
        document.getElementById("checkout-trigger").disabled = true;
        document.getElementById("checkout-trigger").style.opacity = "0.5";
    } else {
        document.getElementById("checkout-trigger").disabled = false;
        document.getElementById("checkout-trigger").style.opacity = "1";
        
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div class="cart-item-image" style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                    ${item.product.image ? `<img src="${item.product.image}" alt="${item.product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 1.8rem;">${item.product.icon}</span>`}
                </div>
                <div class="cart-item-details">
                    <div>
                        <div class="cart-item-title">${item.product.name}</div>
                        <div class="cart-item-meta">
                            <div class="cart-item-qty">
                                <button class="qty-btn" onclick="changeQuantity(${item.product.id}, -1)">−</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="changeQuantity(${item.product.id}, 1)">+</button>
                            </div>
                            <button class="cart-item-remove" onclick="removeFromCart(${item.product.id})">ลบ</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="cart-item-price">฿${(item.product.price * item.quantity).toLocaleString()}</div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingFee = (hasPhysical && subtotal > 0) ? 50 : 0;
    const total = subtotal + shippingFee;

    document.getElementById("cart-subtotal").innerText = `฿${subtotal.toLocaleString()}`;
    document.getElementById("cart-shipping").innerText = shippingFee === 0 ? "ฟรี" : `฿${shippingFee.toLocaleString()}`;
    document.getElementById("cart-total").innerText = `฿${total.toLocaleString()}`;
}

// --- Checkout Flow ---
function openCheckoutModal() {
    toggleCartDrawer(); // Close the cart side panel
    const modal = document.getElementById("modal-overlay");
    modal.classList.add("open");

    // Dynamic Form adjustments based on cart contents
    const hasPhysical = cart.some(item => item.product.type === "physical");
    const addressGroup = document.getElementById("address-form-group");
    const addressInput = document.getElementById("checkout-address");
    const formNoteText = document.getElementById("form-note-text");

    if (hasPhysical) {
        addressGroup.style.display = "block";
        addressInput.required = true;
        formNoteText.innerText = "สินค้าวิตามินของคุณจะจัดส่งทางไปรษณีย์ และไฟล์แพลนเนอร์จะส่งให้ทางอีเมลทันทีหลังสั่งซื้อ";
    } else {
        addressGroup.style.display = "none";
        addressInput.required = false;
        formNoteText.innerText = "ออเดอร์ของคุณประกอบด้วยไฟล์ดิจิทัลเท่านั้น จะได้รับลิงก์ดาวน์โหลดทันทีและทางอีเมล";
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById("modal-overlay");
    modal.classList.remove("open");
    
    // Reset to form view if it was showing success
    setTimeout(() => {
        document.getElementById("checkout-form").style.display = "block";
        document.getElementById("checkout-success-view").style.display = "none";
        document.getElementById("checkout-form").reset();
    }, 400);
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("checkout-name").value;
    const email = document.getElementById("checkout-email").value;

    // Show Success State
    document.getElementById("checkout-form").style.display = "none";
    const successView = document.getElementById("checkout-success-view");
    successView.style.display = "block";

    // Setup success details
    document.getElementById("success-customer-name").innerText = name;
    document.getElementById("success-customer-email").innerText = email;

    // Generate download links if any digital planners were bought
    const digitalItems = cart.filter(item => item.product.type === "digital");
    const downloadBox = document.getElementById("digital-downloads-container");

    if (digitalItems.length > 0) {
        downloadBox.style.display = "block";
        const listContainer = document.getElementById("success-downloads-list");
        listContainer.innerHTML = "";
        
        digitalItems.forEach(item => {
            const link = document.createElement("a");
            link.href = "#";
            link.className = "download-link";
            link.innerHTML = `
                <span>${item.product.name} (PDF File)</span>
                <i class="ri-download-cloud-2-line"></i>
            `;
            link.addEventListener("click", (evt) => {
                evt.preventDefault();
                alert(`กำลังจำลองการดาวน์โหลดไฟล์: ${item.product.name}`);
            });
            listContainer.appendChild(link);
        });
    } else {
        downloadBox.style.display = "none";
    }

    // Clear cart
    cart = [];
    updateCartUI();
}
