// js/sets.js

const sets = [
    {
        id: 1,
        title: "Casual Office Wear",
        description: "Beige Top + Black Pant + Black Heels",
        image: "https://i.pinimg.com/736x/66/dc/9e/66dc9e9793142708373ef010f5c9498b.jpg",
        productIds: [27, 28, 29],
        gender: "Female"
    },
    {
        id: 2,
        title: "Classic Party Wear",
        description: "Elegant Top with Skirt and Heels",
        image: "https://i.pinimg.com/736x/a4/49/7c/a4497c078d98fe3ffc870d10ec57c91d.jpg",
        productIds: [30, 31, 32],
        gender: "Female"
    },
    {
        id: 3,
        title: "Winters Bottom wear",
        description: "Slit Skirt with Leggings, Leg-Warmers and Chunky Boots",
        image: "https://i.pinimg.com/736x/fc/8f/d3/fc8fd3213562ccc3739cc65ba36e79d9.jpg",
        productIds: [33, 34, 35, 36],
        gender: "Female"
    },
    {
        id: 4,
        title: "Modern Male Streetwear",
        description: "Black Polo T-Shirt, Black Pant, Grey Shoes with a Stainless Steel Watch",
        image: "https://i.pinimg.com/736x/00/7c/58/007c58380f5d4ba09fb9bdf8ad2ffb0b.jpg",
        productIds: [39, 40, 41, 42],
        gender: "Male"
    },
    {
        id: 5,
        title: "Casual Wear",
        description: "Brown Polo, Beige Pant, Brown Shoes with a Stainless Steel Watch",
        image: "https://i.pinimg.com/736x/60/08/a2/6008a2494eafbbdc2fede26265634f9a.jpg",
        productIds: [43, 44, 45, 46],
        gender: "Male"
    }

];

function renderSets(filter = 'All') {
    const container = document.getElementById('sets-container');
    if (!container) return;

    container.innerHTML = '';
    const filteredSets = filter === 'All' ? sets : sets.filter(s => s.gender === filter);

    if (filteredSets.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #888;">No sets found for this category.</p>';
        return;
    }

    filteredSets.forEach(set => {
        const card = createSetCard(set);
        container.appendChild(card);
    });
}

function createSetCard(set) {
    // Dynamic price calculation from products.js
    const setProducts = set.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

    // Sum prices - defaulting to 0 if not found
    const totalAmount = setProducts.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2);
    const itemCount = setProducts.length;

    const card = document.createElement('div');
    card.className = 'set-card';

    card.innerHTML = `
        <div class="set-image-wrapper">
            <img src="${set.image}" alt="${set.title}">
            <div class="set-badge">OUTFIT SET</div>
        </div>
        <div class="set-content">
            <h3>${set.title}</h3>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${set.description}</p>
            <div class="set-price">$${totalAmount} <span style="font-weight: 400; font-size: 0.85rem; color: #888;">(${itemCount} items)</span></div>
            <div class="set-actions">
                <button class="cta-button toggle-set-btn" style="flex: 1; background: #fff; color: #000; border: 1px solid #000; font-size: 0.8rem; padding: 12px;">View Items</button>
                <button class="cta-button add-set-cart-btn" style="flex: 1; background: #000; color: #fff; border: none; font-size: 0.8rem; padding: 12px;">Add Full Set to Cart</button>
            </div>
        </div>
        <div class="set-expand-container">
            <div class="nested-grid">
                <!-- Products injected here -->
            </div>
        </div>
    `;

    const expandContainer = card.querySelector('.set-expand-container');
    const grid = card.querySelector('.nested-grid');
    const toggleBtn = card.querySelector('.toggle-set-btn');
    const addBtn = card.querySelector('.add-set-cart-btn');

    toggleBtn.onclick = () => {
        const isActive = expandContainer.classList.contains('active');

        if (!isActive) {
            // Populate items if empty
            if (grid.children.length === 0) {
                setProducts.forEach(p => {
                    const pCard = createProductCard(p);
                    grid.appendChild(pCard);
                });
                attachProductListeners(grid);
            }
            expandContainer.classList.add('active');
            toggleBtn.textContent = 'Hide Items';

            // Scroll into view gently
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            expandContainer.classList.remove('active');
            toggleBtn.textContent = 'View Items';
        }
    };

    addBtn.onclick = async () => {
        if (!auth.isLoggedIn) {
            alert('Please sign in to save this set!');
            auth.showModal();
            return;
        }

        addBtn.disabled = true;
        const originalText = addBtn.textContent;
        addBtn.textContent = 'Adding Set...';

        try {
            // Sequential add to handle potential DB locks/concurrency nicely
            for (const p of setProducts) {
                await cart.add(p.id);
            }

            // Single success toast/alert logic
            showNotification('Full outfit added to cart!');

            addBtn.textContent = '✓ Added to Collection';
            addBtn.style.background = '#4CAF50';

            setTimeout(() => {
                addBtn.textContent = originalText;
                addBtn.style.background = '#000';
                addBtn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error('[Sets] Bulk add error:', err);
            alert('Could not add some items. Check your connection.');
            addBtn.disabled = false;
            addBtn.textContent = originalText;
        }
    };

    return card;
}

// Utility for notification (if not exists)
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #000;
        color: #fff;
        padding: 12px 30px;
        border-radius: 30px;
        z-index: 10001;
        font-weight: 600;
        font-size: 0.9rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: toastFadeIn 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    // Simple fade animation via keyframe injection if not in CSS
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = `
            @keyframes toastFadeIn {
                from { opacity: 0; bottom: 10px; }
                to { opacity: 1; bottom: 30px; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
