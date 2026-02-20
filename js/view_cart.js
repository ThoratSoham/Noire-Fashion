// js/view_cart.js
function renderCart() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="section" style="padding: 60px 20px; max-width: 800px; margin: 0 auto;">
            <div class="cart-header">
                <h1>My Collection</h1>
                <p id="cart-count">Loading your treasures...</p>
            </div>
            <div id="cart-grid" class="grid" style="grid-template-columns: 1fr;">
                <!-- Cart items here -->
            </div>
        </div>
    `;

    updateCartUI();
}

async function updateCartUI() {
    const grid = document.getElementById('cart-grid');
    const countEl = document.getElementById('cart-count');
    if (!grid) return;

    if (!auth.isLoggedIn) {
        grid.innerHTML = `
            <div style="text-align:center; padding: 40px; border: 1px dashed #ccc;">
                <p>Sign in to view your saved fashion collection.</p>
                <button onclick="auth.showModal()" style="margin-top:20px; padding: 10px 20px; background:#000; color:#fff; border:none; cursor:pointer;">Sign In</button>
            </div>
        `;
        countEl.textContent = "Guest Access";
        return;
    }

    const items = cart.items || [];
    countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''} saved`;

    if (items.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; padding: 80px; background:#fafafa; border: 1px solid #eee;">
                <div style="font-size: 3rem; margin-bottom: 10px;">+</div>
                <p>Your collection is empty.</p>
                <a href="#home" style="display:inline-block; margin-top:20px; color:#000; font-weight:700;">Explore Curated Products</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    items.forEach(productId => {
        const p = products.find(x => x.id === productId);
        if (!p) return;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.style.display = 'flex';
        row.style.gap = '20px';
        row.style.background = '#fff';
        row.style.padding = '20px';
        row.style.marginBottom = '15px';
        row.style.alignItems = 'center';
        row.style.border = '1px solid #eee';

        row.innerHTML = `
            <img src="${p.image}" style="width: 100px; height: 100px; object-fit: cover;">
            <div style="flex:1;">
                <h3 style="font-size:1.1rem;">${p.title}</h3>
                <p style="font-size:0.9rem; color:#666;">$${p.price}</p>
            </div>
            <div style="display:flex; gap:10px;">
                <a href="${p.link}" target="_blank" style="padding: 8px 15px; background:#000; color:#fff; text-decoration:none; font-size:0.8rem;">Shop</a>
                <button class="remove-cart-btn" data-id="${p.id}" style="padding: 8px 15px; background:#ff6b6b; color:#fff; border:none; cursor:pointer; font-size:0.8rem;">Remove</button>
            </div>
        `;
        grid.appendChild(row);
    });

    // Remove handlers
    grid.querySelectorAll('.remove-cart-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = parseInt(e.target.dataset.id);
            await cart.remove(id);
            updateCartUI();
        };
    });
}

// Ensure cart updates trigger UI refresh if we are on the cart page
document.addEventListener('cartUpdated', () => {
    if (window.location.hash === '#cart') updateCartUI();
});
