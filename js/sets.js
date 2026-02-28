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
    },
    {
        id: 6,
        title: "Modern Smart Casual – Olive Shirt with White Wide Trousers",
        description: "Stylish smart-casual combo with an olive button-down shirt, relaxed white trousers, statement sneakers, and bold accessories. Ideal for brunch, evening outings, or polished everyday wear.",
        image: "https://i.pinimg.com/474x/72/88/81/728881e4216faa3f5d5ca64960e160fe.jpg",
        productIds: [47, 48, 49, 50, 51],
        gender: "Male"
    },
    {
        id: 7,
        title: "Minimal Everyday Chic – Ribbed Top with Relaxed Denim & Sneakers",
        description: "Clean and effortless outfit featuring a fitted ribbed long sleeve top paired with high-rise wide leg jeans and chunky sneakers",
        image: "https://i.pinimg.com/736x/83/a0/2a/83a02ad45c82487c159f721c3b0ec48e.jpg",
        productIds: [52, 53, 54],
        gender: "Female"
    },
    {
        id: 8,
        title: "Urban Boston Casual Set",
        description: "Navy graphic tee styled with light-wash jeans, white sneakers, chain, and sunglasses — a clean, relaxed street-style everyday outfit",
        image: "https://i.pinimg.com/736x/d8/7a/e1/d87ae140da11fecc760236bbbef1c8a9.jpg",
        productIds: [55, 56, 57, 58, 59],
        gender: "Male"
    },
    {
        id: 9,
        title: "Rustic Grace Skirt Set",
        description: "Soft fitted top paired with a flowy lavender printed midi skirt and white sneakers — a calm, countryside-inspired look with effortless elegance.",
        image: "https://i.pinimg.com/736x/4b/60/bf/4b60bf1d942b0285cd3368641eb030c6.jpg",
        productIds: [52, 60, 61],
        gender: "Female"
    },
    {
        id: 10,
        title: "Safari Chic",
        description: "A neutral, sophisticated look featuring a tan zebra-print button-down tucked into flowing white wide-leg trousers, cinched with a classic brown leather belt.",
        image: "https://i.pinimg.com/736x/68/c4/a8/68c4a8bb487691ca1698e7c9f6eb33d0.jpg",
        productIds: [76, 77],
        gender: "Female"
    },
    {
        id: 11,
        title: "Parisian Casual",
        description: "Effortless street style combining a breezy yellow striped shirt with cream pleated trousers and sporty sneakers for a polished day on the town.",
        image: "https://i.pinimg.com/736x/08/64/ca/0864cad9d8e77df084779f4aca944714.jpg",
        productIds: [74, 75],
        gender: "Female"
    },
    {
        id: 12,
        title: "Modern Professional",
        description: "A sharp, office-ready ensemble pairing a crisp blue-and-white striped shirt with high-waisted black trousers and a matching slim belt.",
        image: "https://i.pinimg.com/736x/c4/8e/eb/c48eeb2ccaa526c51adf500f6fa82371.jpg",
        productIds: [72, 73],
        gender: "Female"
    },
    {
        id: 13,
        title: "Relaxed Layering",
        description: "A versatile weekend look showcasing a blue striped button-up layered over a basic white tee, finished with khaki chinos and clean white sneakers.",
        image: "https://i.pinimg.com/736x/dc/c5/e9/dcc5e969dd984a2c71394f33bc7e5acf.jpg",
        productIds: [69, 70, 71],
        gender: "Male"
    },
    {
        id: 14,
        title: "Bold Minimalist",
        description: "A sleek aesthetic featuring a rich burgundy camp-collar shirt tucked into light grey pleated trousers for a polished yet approachable vibe.",
        image: "https://i.pinimg.com/474x/ed/46/3f/ed463f8858048655a0d9dcb5d0fc95d1.jpg",
        productIds: [67, 68],
        gender: "Male"
    },
    {
        id: 15,
        title: "Preppy Edge",
        description: "A playful take on classic style, featuring a pink striped long-sleeve shirt and black tailored trousers, grounded by casual black-and-white sneakers.",
        image: "https://i.pinimg.com/736x/85/a8/bc/85a8bccf9ba8bd4e7ba53216478d78d1.jpg",
        productIds: [64, 65, 66],
        gender: "Male"
    },
    {
        id: 16,
        title: "Urban Cream Drift",
        description: "Neutral cream knit with relaxed dark trousers and clean sneakers for a minimal street look.",
        image: "outfit_male_cream_street.jpg",
        productIds: [91, 92, 93, 94, 95, 21],
        gender: "Male"
    },
    {
        id: 17,
        title: "Midnight Muse",
        description: "Structured black jumpsuit with puff sleeves, styled sleek and modern.",
        image: "outfit_female_black_jumpsuit.jpg",
        productIds: [89, 90, 73],
        gender: "Female"
    }




];

function renderSets(filter = 'All') {
    const container = document.getElementById('sets-container');
    if (!container) return;

    container.innerHTML = '';
    const filteredSets = (filter === 'All' ? sets : sets.filter(s => s.gender === filter))
        .slice().sort((a, b) => b.id - a.id);

    if (filteredSets.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #888;">No sets found for this category.</p>';
        return;
    }

    filteredSets.forEach(set => {
        const card = createSetCard(set);
        container.appendChild(card);
    });

    // Attach listeners for sharing and other set-specific actions
    attachSetListeners(container);
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

    const siteLink = `${window.location.origin}${window.location.pathname}#sets?set=${set.id}`;

    card.innerHTML = `
        <div class="set-image-wrapper copy-trigger" style="cursor: pointer;" title="Click to copy set link">
            <img src="${set.image}" alt="${set.title}">
            <div class="set-badge">OUTFIT SET</div>
        </div>
        <div class="set-content">
            <h3 class="copy-trigger" style="cursor: pointer;" title="Click to copy set link">${set.title}</h3>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${set.description}</p>
            <div class="set-price">$${totalAmount} <span style="font-weight: 400; font-size: 0.85rem; color: #888;">(${itemCount} items)</span></div>
            <div class="set-actions" style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px;">
                    <button class="cta-button toggle-set-btn" style="flex: 1; background: #fff; color: #000; border: 1px solid #000; font-size: 0.8rem; padding: 10px; font-weight: 600;">View Items</button>
                    <button class="share-set-btn" data-link="${siteLink}" style="flex: 1; padding: 10px; border: 1px solid #ddd; background: #eee; cursor: pointer; font-size: 0.8rem; font-family: inherit;">Share</button>
                </div>
                <button class="cta-button add-set-cart-btn" style="background: #000; color: #fff; border: none; font-size: 0.8rem; padding: 12px; width: 100%;">Add Full Set to Collection</button>
            </div>
        </div>
        <div class="set-expand-container" data-id="${set.id}">
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

function attachSetListeners(container) {
    // Shared copy function
    const copyLink = (link, element) => {
        navigator.clipboard.writeText(link).then(() => {
            const originalText = element.textContent;
            const isButton = element.tagName === 'BUTTON';

            if (isButton) {
                element.textContent = "Copied!";
                setTimeout(() => { element.textContent = originalText; }, 1500);
            }
            showNotification('Link copied to clipboard!');
        });
    };

    // Share button logic for sets
    container.querySelectorAll('.share-set-btn').forEach(btn => {
        btn.onclick = (e) => {
            copyLink(e.currentTarget.dataset.link, e.currentTarget);
        };
    });

    // Card-level triggers for "automatic" copying
    container.querySelectorAll('.copy-trigger').forEach(el => {
        el.onclick = (e) => {
            // Find the share link from the buttons in the same card
            const card = e.currentTarget.closest('.set-card');
            const shareBtn = card.querySelector('.share-set-btn');
            if (shareBtn) {
                copyLink(shareBtn.dataset.link, e.currentTarget);
            }
        };
    });
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
