// js/home.js
function renderHome() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <section class="hero">
            <h1>NOIRÉ</h1>
            <p>Affordable luxury, crafted in minimal elegance.</p>
            <div class="hero-btns">
                <a href="#home" onclick="document.getElementById('collection').scrollIntoView({behavior:'smooth'})" class="cta-button">Explore Collection</a>
                <a href="#wearloop" class="cta-button secondary">Try WearLoop</a>
            </div>
        </section>

        <section class="wearloop-teaser" style="background: #fff; padding: 60px 20px; text-align: center; border-bottom: 1px solid #eee;">
            <div style="max-width: 720px; margin: 0 auto;">
                <span style="letter-spacing: 2px; color: #888; font-size: 0.75rem; font-weight: 700;">INTRODUCING</span>
                <h2 style="font-size: 2.2rem; margin: 10px 0 16px;">The WearLoop Experience</h2>
                <p style="color: #666; margin-bottom: 28px; font-size: 0.95rem; line-height: 1.7; max-width: 560px; margin-left: auto; margin-right: auto;">
                    Discover fashion through an infinite community feed. Shop viral looks, follow top creators, and find your next vibe.
                </p>
                <a href="#wearloop" style="display: inline-block; padding: 14px 36px; background: #000; color: #fff; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Start Scrolling</a>
            </div>
        </section>

        <section id="collection" class="section collection">
            <div class="search-filters">
                <input type="text" id="search-input" placeholder="Search products...">
                <button id="search-button">Search</button>
            </div>
            <div id="product-grid" class="grid"></div>
        </section>
    `;

    // Initialize products display — newest (highest id) first
    const sortedProducts = products.slice().sort((a, b) => b.id - a.id);
    renderProducts(sortedProducts);

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

    // Filter Logic
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
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding: 40px; color: #888;">No products found.</p>`;
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
        <div class="product-img-wrapper">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="card-body">
            <h3>${p.title}</h3>
            <div class="desc-fade">${p.description}</div>
            <div class="price">$${p.price}</div>
            <div class="card-actions">
                <a href="${p.link}" target="_blank" class="cta-button" style="background:#000; color:#fff; font-size: 0.8rem; padding: 10px; width:100%;">Buy on Amazon</a>
                <div class="btn-row">
                    <button class="share-btn" data-link="${siteLink}" style="flex:1; padding: 9px 6px; border: 1px solid #ddd; background: #eee; cursor: pointer; font-family: inherit; font-size: 0.78rem;">Share</button>
                    <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" data-id="${p.id}" style="flex:2; padding: 9px 6px; border: 1px solid #000; background: ${isInCart ? '#4CAF50' : '#fff'}; color: ${isInCart ? '#fff' : '#000'}; cursor: pointer; font-family: inherit; font-size: 0.78rem;">
                        ${isInCart ? 'Added' : 'Add to Collection'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Touch/tap: toggle expanded description on mobile
    const descEl = card.querySelector('.desc-fade');
    if (descEl) {
        descEl.addEventListener('click', () => {
            descEl.classList.toggle('expanded');
        });
    }

    return card;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for HTTP / file:// origins where Clipboard API is blocked
    return new Promise((resolve, reject) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(ta);
            resolve();
        } catch (err) {
            document.body.removeChild(ta);
            reject(err);
        }
    });
}

function attachProductListeners(container) {
    // Share button logic
    container.querySelectorAll('.share-btn').forEach(btn => {
        btn.onclick = (e) => {
            const link = e.currentTarget.dataset.link;
            const btnEl = e.currentTarget;
            copyToClipboard(link).then(() => {
                const originalText = btnEl.textContent;
                btnEl.textContent = "Copied!";
                setTimeout(() => { btnEl.textContent = originalText; }, 1500);
            }).catch(() => {
                alert('Could not copy link. Please copy it manually:\n' + link);
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
            btnEl.textContent = 'Added';
            btnEl.style.background = '#4CAF50';
            btnEl.style.color = '#fff';
            btnEl.classList.add('added');
        };
    });
}
