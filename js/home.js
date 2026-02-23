// js/home.js
function renderHome() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <section class="hero">
            <h1>NOIRÉ</h1>
            <p>Affordable luxury, crafted in minimal elegance.</p>
            <div class="hero-btns">
                <a href="#home" onclick="document.getElementById('collection').scrollIntoView({behavior:'smooth'})" class="cta-button">Explore Collection</a>
                <a href="#wearloop" class="cta-button secondary" style="background:#fff; color:#000; border:1px solid #000; margin-left:10px;">Try WearLoop</a>
            </div>
        </section>

        <section class="wearloop-teaser" style="background: #fff; padding: 60px 20px; text-align: center; border-bottom: 1px solid #eee;">
            <div style="max-width: 800px; margin: 0 auto;">
                <span style="letter-spacing: 2px; color: #888; font-size: 0.8rem; font-weight: 700;">INTRODUCING</span>
                <h2 style="font-size: 2.5rem; margin: 10px 0 20px;">The WearLoop Experience</h2>
                <p style="color: #666; margin-bottom: 30px;">
                    Discover fashion through an infinite community feed. Shop viral looks, follow top creators, and find your next vibe.
                </p>
                <a href="#wearloop" style="display: inline-block; padding: 15px 40px; background: #000; color: #fff; text-decoration: none; font-weight: 600;">Start Scrolling</a>
            </div>
        </section>

        <section id="collection" class="section collection" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
            <div class="search-filters" style="display: flex; gap: 10px; margin-bottom: 40px; justify-content: center;">
                <input type="text" id="search-input" placeholder="Search products..." style="padding: 10px; width: 300px; border: 1px solid #ddd;">
                <button id="search-button" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer;">Search</button>
            </div>
            <div id="product-grid" class="grid"></div>
        </section>

            <div id="product-grid" class="grid"></div>
        </section>
    `;

    // Initialize products display
    renderProducts(products);

    // Deep link handling (scroll to product if id in hash)
    const hash = window.location.hash;
    if (hash.includes('product=')) {
        const productId = hash.split('product=')[1];
        setTimeout(() => {
            const el = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
            if (el) {
                el.closest('.product-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.closest('.product-card').style.outline = "2px solid #000";
            }
        }, 500);
    }

    // Filter Logic (Event Delegation preferred, but for now simple attach)
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = products.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    };

    searchBtn.onclick = handleSearch;
    searchInput.oninput = handleSearch;
}

function renderProducts(list) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (!list.length) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;">No products found.</p>`;
        return;
    }

    list.forEach(p => {
        const card = createProductCard(p);
        grid.appendChild(card);
    });

    // Share button logic (delegated or re-attached)
    attachProductListeners(grid);
}

function createProductCard(p) {
    const card = document.createElement("div");
    card.className = "product-card";
    const isInCart = cart.isSaved(p.id);
    const siteLink = `${window.location.origin}${window.location.pathname}#home?product=${p.id}`;

    card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div style="padding:15px;">
            <h3>${p.title}</h3>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${p.description}</p>
            <div class="price" style="font-weight: 700; margin-bottom: 15px;">$${p.price}</div>
            <div style="display:flex; flex-direction: column; gap:10px;">
                <a href="${p.link}" target="_blank" class="cta-button" style="background:#000; color:#fff; font-size: 0.8rem; padding: 10px;">Buy on Amazon</a>
                <div style="display:flex; gap:10px;">
                    <button class="share-btn" data-link="${siteLink}" style="flex:1; padding: 10px; border: 1px solid #ddd; background: #eee; cursor: pointer;">Share</button>
                    <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" data-id="${p.id}" style="flex:2; padding: 10px; border: 1px solid #000; background: ${isInCart ? '#4CAF50' : '#fff'}; color: ${isInCart ? '#fff' : '#000'}; cursor: pointer;">
                        ${isInCart ? 'Added' : 'Add to Collection'}
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function attachProductListeners(container) {
    // Share button logic
    container.querySelectorAll('.share-btn').forEach(btn => {
        btn.onclick = (e) => {
            const link = e.currentTarget.dataset.link;
            navigator.clipboard.writeText(link).then(() => {
                const originalText = e.currentTarget.textContent;
                e.currentTarget.textContent = "Copied!";
                setTimeout(() => { e.currentTarget.textContent = originalText; }, 1500);
            });
        };
    });

    // Add to cart listener
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = parseInt(e.target.dataset.id);
            if (!auth.isLoggedIn) {
                alert("Please log in to save items!");
                auth.showModal();
                return;
            }
            const btnEl = e.target;
            await cart.add(id);
            // Visual feedback instead of full re-render if possible
            btnEl.textContent = 'Added';
            btnEl.style.background = '#4CAF50';
            btnEl.style.color = '#fff';
            btnEl.classList.add('added');
        };
    });
}
