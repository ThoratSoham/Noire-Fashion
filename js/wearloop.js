// js/wearloop.js
const wearloop = {
    userActivities: [],

    init: async function () {
        const feedGrid = document.getElementById('wearloop-grid');
        if (!feedGrid) return;

        let page = 0;
        const postsPerPage = 6;
        let isLoading = false;
        let currentTab = 'foryou';
        let activePosts = [];

        // Fetch existing activities if logged in
        if (auth.isLoggedIn) {
            this.userActivities = await auth.getUserActivities();
            console.log('[WearLoop] Loaded user activities:', this.userActivities.length);
        }

        // Combine products and outfitSets
        const basePosts = [
            ...outfitSets.map(s => ({ ...s, type: 'set', popularity: Math.random() * 100 })),
            ...products.filter(p => p.creatorId).map(p => ({ ...p, type: 'single', popularity: Math.random() * 80 }))
        ];

        const filterAndSortPosts = () => {
            let filtered = [...basePosts];
            if (currentTab === 'trending') {
                filtered.sort((a, b) => b.popularity - a.popularity);
            } else if (currentTab === 'following') {
                filtered = filtered.filter(p => [1, 2].includes(p.creatorId));
            } else {
                filtered.sort(() => Math.random() - 0.5);
            }
            activePosts = filtered;
            page = 0;
            feedGrid.innerHTML = '';
            loadMore();
        };

        const renderPost = (post) => {
            const creator = creators.find(c => c.id === post.creatorId) || creators[0];
            const card = document.createElement('div');
            card.className = 'post-card';

            const isSet = post.type === 'set';
            const tagsHtml = post.tags.map(t => `<span class="tag">${t}</span>`).join(' ');

            // Check if user has liked/saved this post
            const isLiked = this.userActivities.some(a => a.post_id === String(post.id) && a.type === 'like');
            const isSaved = this.userActivities.some(a => a.post_id === String(post.id) && a.type === 'save');

            card.innerHTML = `
                <div class="post-header">
                    <img src="${creator.avatar}" class="creator-avatar" alt="${creator.name}">
                    <div class="creator-info">
                        <div class="creator-name">${creator.name} ${creator.verified ? '✓' : ''}</div>
                        <div style="font-size: 0.8rem; color: #666;">${creator.handle}</div>
                    </div>
                </div>
                <div class="post-media" style="position:relative;">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" style="width:100%; display:block;">
                    ${isSet ? '<div style="position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.9); color:#000; padding:4px 8px; font-size:0.7rem; font-weight:700; border:1px solid #000;">OUTFIT SET</div>' : ''}
                </div>
                <div class="post-actions">
                    <div class="main-actions">
                        <span class="action-btn heart-btn ${isLiked ? 'liked' : ''}" title="Like">❤️</span>
                        <span class="action-btn comment-btn" title="Comment">💬</span>
                        <span class="action-btn save-btn ${isSaved ? 'saved' : ''}" title="Save">🔖</span>
                    </div>
                    <a href="${isSet ? '#' : post.link}" 
                       class="shop-btn-pill" 
                       target="${isSet ? '_self' : '_blank'}"
                       onclick="${isSet ? `openOutfitSet('${post.id}')` : ''}">
                       🛒 ${isSet ? 'Explore Set' : 'Shop Now'}
                    </a>
                </div>
                <div class="post-info">
                    <div style="font-weight: 600; font-size: 0.95rem; margin-bottom:5px;">${post.title}</div>
                    <div class="post-tags">${tagsHtml}</div>
                </div>
            `;

            // Interaction logic with Persistence
            const interact = async (e, type) => {
                if (!auth.isLoggedIn) {
                    alert(`Please log in to ${type} posts!`);
                    auth.showModal();
                    return;
                }
                const btn = e.target;
                const isCurrentlyActive = btn.classList.contains(type === 'like' ? 'liked' : 'saved');

                if (isCurrentlyActive) {
                    btn.classList.remove(type === 'like' ? 'liked' : 'saved');
                    await auth.removeActivity(String(post.id), type);
                } else {
                    btn.classList.add(type === 'like' ? 'liked' : 'saved');
                    await auth.trackActivity(String(post.id), type);
                }
            };

            const heartBtn = card.querySelector('.heart-btn');
            const saveBtn = card.querySelector('.save-btn');

            heartBtn.addEventListener('click', (e) => interact(e, 'like'));
            saveBtn.addEventListener('click', (e) => interact(e, 'save'));

            return card;
        };

        const loadMore = () => {
            if (isLoading) return;
            isLoading = true;
            const start = page * postsPerPage;
            const end = start + postsPerPage;
            const slice = activePosts.slice(start, end);
            if (slice.length === 0) {
                if (page === 0) feedGrid.innerHTML = '<div style="text-align:center; width:100%; padding:80px; color:#888;">No posts yet in this category.</div>';
                isLoading = false;
                return;
            }
            if (page === 0) feedGrid.innerHTML = '';
            slice.forEach(post => {
                feedGrid.appendChild(renderPost(post));
            });
            page++;
            isLoading = false;
        };

        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab = btn.dataset.tab;
                filterAndSortPosts();
            });
        });

        // Infinity Scroll Observer
        let sentinel = document.getElementById('wearloop-sentinel');
        if (!sentinel) {
            sentinel = document.createElement('div');
            sentinel.id = 'wearloop-sentinel';
            sentinel.style.height = '40px';
            feedGrid.after(sentinel);
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) loadMore();
        }, { threshold: 0.1 });
        observer.observe(sentinel);

        // Search logic
        const searchInput = document.getElementById('feed-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                if (query === '') {
                    filterAndSortPosts();
                    return;
                }
                const filtered = basePosts.filter(p => {
                    const creator = creators.find(c => c.id === p.creatorId);
                    return p.title.toLowerCase().includes(query) ||
                        p.tags.some(t => t.toLowerCase().includes(query)) ||
                        (creator && creator.name.toLowerCase().includes(query));
                });
                feedGrid.innerHTML = '';
                filtered.forEach(p => feedGrid.appendChild(renderPost(p)));
            });
        }

        // Initial Load
        filterAndSortPosts();
    }
};

// Outfit Set Modal (Global)
window.openOutfitSet = (setId) => {
    const set = outfitSets.find(s => s.id === setId);
    const setProducts = products.filter(p => set.products.includes(p.id));
    const modal = document.createElement('div');
    modal.className = 'overlay show';
    modal.innerHTML = `
        <div style="background:#fff; max-width:500px; width:90%; padding:30px; border: 1px solid #000; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.2);">
            <span style="position:absolute; top:10px; right:20px; font-size:2rem; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">×</span>
            <h2 style="font-family:'Playfair Display', serif; margin-bottom:20px;">${set.title}</h2>
            <div style="display:grid; gap:15px;">
                ${setProducts.map(p => `
                    <div style="display:flex; gap:15px; align-items:center; border-bottom:1px solid #eee; padding-bottom:10px;">
                        <img src="${p.image}" style="width:60px; height:60px; object-fit:cover;">
                        <div style="flex:1;">
                            <div style="font-weight:600; font-size:0.9rem;">${p.title}</div>
                            <div style="color:#666; font-size:0.8rem;">$${p.price}</div>
                        </div>
                        <a href="${p.link}" target="_blank" class="shop-btn-pill" style="font-size:0.7rem;">Buy Now</a>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};
