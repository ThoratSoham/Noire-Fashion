// js/view_profile.js
function renderProfile() {
    const app = document.getElementById('app');

    if (!auth.isLoggedIn) {
        app.innerHTML = `
            <div style="text-align:center; padding: 100px;">
                <h2>Access Denied</h2>
                <p>Please sign in to view your profile.</p>
                <button onclick="auth.showModal()" style="margin-top:20px; padding: 10px 20px; background:#000; color:#fff; border:none; cursor:pointer;">Sign In</button>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="section profile-view" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: 350px 1fr; gap: 40px;">
                <!-- Profile Info & Upload Column -->
                <div class="profile-sidebar">
                    <div style="background: #fff; padding: 30px; border: 1px solid #eee; margin-bottom: 30px;">
                        <h2 style="margin-bottom:20px;">Member Profile</h2>
                        <div id="profile-status" style="margin-bottom:20px; font-size:0.9rem;"></div>
                        <form id="spa-profile-form">
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Email</label>
                                <input type="text" value="${auth.user.email}" disabled style="background:#f9f9f9; color:#999; width: 100%; border: 1px solid #ddd; padding: 10px;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Name</label>
                                <input type="text" id="profile-name" value="${auth.user.user_metadata?.full_name || ''}" style="width: 100%; border: 1px solid #ddd; padding: 10px;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Country</label>
                                <input type="text" id="profile-country" placeholder="e.g. United Kingdom" style="width: 100%; border: 1px solid #ddd; padding: 10px;">
                            </div>
                            <button type="submit" id="save-profile-btn" style="width:100%; padding:12px; background:#000; color:#fff; border:none; cursor:pointer; font-weight:600;">Update Profile</button>
                        </form>
                    </div>

                    <div style="background: #000; padding: 30px; color: #fff;">
                        <h2 style="font-family:'Playfair Display', serif; margin-bottom:20px; color: #fff;">Share New Look</h2>
                        <form id="upload-form">
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; font-weight:600;">Image Link</label>
                                <input type="text" id="post-image" placeholder="Paste URL" required style="width:100%; padding:10px; border:1px solid #333; background:#111; color:#fff;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; font-weight:600;">Title</label>
                                <input type="text" id="post-title" placeholder="Description" required style="width:100%; padding:10px; border:1px solid #333; background:#111; color:#fff;">
                            </div>
                            <div style="margin-bottom:15px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; font-weight:600;">Description (Optional)</label>
                                <textarea id="post-desc" placeholder="Tell us more about this look" style="width:100%; padding:10px; border:1px solid #333; background:#111; color:#fff; resize:none;" rows="2"></textarea>
                            </div>
                            <div style="margin-bottom:20px;">
                                <label style="display:block; margin-bottom:5px; font-size:0.8rem; font-weight:600;">Shop Link</label>
                                <input type="text" id="post-link" placeholder="Amazon/Product URL" required style="width:100%; padding:10px; border:1px solid #333; background:#111; color:#fff;">
                            </div>
                            <button type="submit" id="submit-post-btn" style="width:100%; padding:15px; background:#fff; color:#000; border:none; cursor:pointer; font-weight:700;">Post to WearLoop</button>
                        </form>
                    </div>
                </div>

                <!-- Wearloop Section Column -->
                <div class="profile-wearloop">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h2 style="font-family:'Playfair Display', serif;">My WearLoop Feed</h2>
                    </div>
                    <div id="user-wearloop-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                        <div style="text-align:center; padding: 40px; color: #888;">Loading your posts...</div>
                    </div>
                </div>
            </div>

            <!-- Extra Section Below -->
            <div style="margin-top: 60px; border-top: 1px solid #eee; padding-top: 60px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;">
                    <div>
                        <h2 style="font-family:'Playfair Display', serif; margin-bottom: 5px;">My Saved Items</h2>
                        <p style="color: #666; font-size: 0.9rem;">Items you've added to your collection.</p>
                    </div>
                    <a href="#cart" style="color: #000; font-weight: 600; text-decoration: none; border-bottom: 1px solid #000;">Manage Collection</a>
                </div>
                <div id="profile-saved-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    <!-- Saved items loaded here -->
                </div>
            </div>

            <div style="margin-top:80px; text-align:center; border-top: 1px solid #eee; padding-top:40px;">
                <button id="logout-btn" style="background:none; border:none; color:#ff6b6b; cursor:pointer; font-weight:600;">Sign Out Partition Account</button>
            </div>
        </div>
    `;

    loadProfileData();
    renderUserWearloop(true); // Initial load
    renderSavedCollection();

    let currentEditPostId = null;

    // Profile Form Logic
    const profileForm = document.getElementById('spa-profile-form');
    if (profileForm) {
        profileForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('save-profile-btn');
            const status = document.getElementById('profile-status');
            btn.disabled = true;
            btn.textContent = 'Saving...';
            try {
                await profile.save({
                    name: document.getElementById('profile-name').value,
                    country: document.getElementById('profile-country').value
                });
                status.textContent = '✓ Updated';
                status.style.color = '#4CAF50';
            } catch (err) {
                status.textContent = '× Error';
                status.style.color = '#ff6b6b';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Update Profile';
            }
        };
    }

    // Inline Upload/Edit Logic
    const uploadForm = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-post-btn');

    if (uploadForm && submitBtn) {
        const formTitle = uploadForm.parentElement.querySelector('h2');
        uploadForm.onsubmit = async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = currentEditPostId ? 'Saving Changes...' : 'Posting...';

            const postData = {
                title: document.getElementById('post-title').value,
                description: document.getElementById('post-desc').value,
                image_url: document.getElementById('post-image').value,
                product_link: document.getElementById('post-link').value
            };

            try {
                if (currentEditPostId) {
                    await auth.updatePost(currentEditPostId, postData);
                    currentEditPostId = null;
                    if (formTitle) formTitle.textContent = 'Share New Look';
                    submitBtn.textContent = 'Post to WearLoop';
                    renderUserWearloop(true); // Complete refresh for edits
                } else {
                    const newPost = await auth.createPost(postData);
                    // Instant UI Update: Manually prepend to grid
                    const grid = document.getElementById('user-wearloop-grid');
                    if (grid) {
                        const emptyMsg = grid.querySelector('div[style*="text-align:center"]');
                        if (emptyMsg) emptyMsg.remove();
                        const card = createPostCard({ ...newPost, post_analytics: [] });
                        grid.prepend(card);
                    }
                }
                uploadForm.reset();
            } catch (err) {
                console.error('[Profile] Post error:', err);
                alert('Posting failed: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = currentEditPostId ? 'Save Changes' : 'Post to WearLoop';
            }
        };
    }

    // Global edit handler
    window.editPostInline = (post) => {
        currentEditPostId = post.id;
        const form = document.getElementById('upload-form');
        if (!form) return;

        document.getElementById('post-title').value = post.title;
        document.getElementById('post-desc').value = post.description || '';
        document.getElementById('post-image').value = post.image_url;
        document.getElementById('post-link').value = post.product_link;

        const title = form.parentElement.querySelector('h2');
        const btn = document.getElementById('submit-post-btn');
        if (title) title.textContent = 'Edit WearLoop Post';
        if (btn) btn.textContent = 'Save Changes';

        form.scrollIntoView({ behavior: 'smooth' });
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await window.supabaseClient.auth.signOut();
            window.location.hash = '#home';
        };
    }

    document.addEventListener('cartUpdated', () => renderSavedCollection());
}

async function renderSavedCollection() {
    const grid = document.getElementById('profile-saved-grid');
    if (!grid) return;

    // Use existing cart logic if reachable
    if (typeof cart === 'undefined') return;

    const savedIds = cart.items; // Assuming cart.items is an array of IDs
    const savedProducts = products.filter(p => savedIds.includes(p.id));

    if (savedProducts.length === 0) {
        grid.innerHTML = '<p style="color:#888;">No saved items yet.</p>';
        return;
    }

    grid.innerHTML = savedProducts.map(p => `
        <div style="border: 1px solid #eee; background: #fff; padding: 10px;">
            <img src="${p.image}" style="width:100%; aspect-ratio:1; object-fit:cover;">
            <div style="margin-top: 10px; font-weight: 600; font-size: 0.85rem; height: 32px; overflow: hidden;">${p.title}</div>
            <a href="${p.link}" target="_blank" style="display:block; text-align:center; padding: 8px; background: #000; color:#fff; text-decoration:none; font-size:0.75rem; margin-top:10px;">Shop Now</a>
        </div>
    `).join('');
}

let userPostsPage = 0;
const userPostsLimit = 6;
let cachedUserPosts = [];

async function renderUserWearloop(forceRefresh = false) {
    const grid = document.getElementById('user-wearloop-grid');
    if (!grid) return;

    if (forceRefresh) {
        userPostsPage = 0;
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Refreshing feed...</div>';
        cachedUserPosts = await auth.getUserPosts();
    }

    if (cachedUserPosts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #888;">No looks shared yet. Share your first one!</div>';
        return;
    }

    if (userPostsPage === 0) grid.innerHTML = '';

    const start = userPostsPage * userPostsLimit;
    const end = start + userPostsLimit;
    const pagePosts = cachedUserPosts.slice(start, end);

    pagePosts.forEach(post => {
        grid.appendChild(createPostCard(post));
    });

    // Infinite Scroll "Load More"
    let loadMore = document.getElementById('load-more-posts');
    if (end < cachedUserPosts.length) {
        if (!loadMore) {
            loadMore = document.createElement('button');
            loadMore.id = 'load-more-posts';
            loadMore.textContent = 'Load More Looks';
            Object.assign(loadMore.style, {
                gridColumn: '1/-1', padding: '15px', background: '#f5f5f5', border: '1px solid #eee',
                cursor: 'pointer', marginTop: '20px', fontWeight: '600', fontFamily: 'inherit'
            });
            loadMore.onclick = () => {
                userPostsPage++;
                renderUserWearloop();
            };
        }
        grid.appendChild(loadMore);
    } else if (loadMore) {
        loadMore.remove();
    }
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.border = '1px solid #eee';
    card.style.background = '#fff';
    card.dataset.id = post.id;

    const views = post.post_analytics?.filter(a => a.event_type === 'view').length || 0;
    const clicks = post.post_analytics?.filter(a => a.event_type === 'click').length || 0;

    card.innerHTML = `
        <div style="position:relative;">
            <img src="${post.image_url}" style="width:100%; aspect-ratio:1; object-fit:cover; display:block;" onerror="this.src='https://ui-avatars.com/api/?name=Look&background=f5f5f5'">
            <div style="position:absolute; top:10px; right:10px; display:flex; gap:5px;">
                <button class="edit-post" style="background:rgba(255,255,255,0.9); border:none; width:30px; height:30px; cursor:pointer;" title="Edit">✏️</button>
                <button class="delete-post" style="background:rgba(255,255,255,0.9); border:none; width:30px; height:30px; cursor:pointer;" title="Delete">🗑️</button>
            </div>
        </div>
        <div style="padding: 15px;">
            <h3 style="font-size: 0.9rem; margin-bottom: 5px; height: 38px; overflow: hidden;">${post.title}</h3>
            <div style="display:flex; justify-content: space-between; font-size: 0.7rem; color: #888; border-top: 1px solid #f5f5f5; padding-top:10px; margin-top:10px;">
                <span>👁️ ${views} Views</span>
                <span>🖱️ ${clicks} Clicks</span>
            </div>
        </div>
    `;

    card.querySelector('.edit-post').onclick = () => window.editPostInline(post);
    card.querySelector('.delete-post').onclick = async () => {
        if (confirm('Delete this post?')) {
            try {
                await auth.deletePost(post.id);
                renderUserWearloop(true);
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return card;
}


async function loadProfileData() {
    const data = await profile.load();
    if (data) {
        if (document.getElementById('profile-country')) document.getElementById('profile-country').value = data.country || '';
        if (document.getElementById('profile-name')) document.getElementById('profile-name').value = data.name || (auth.user.user_metadata?.full_name || '');
    }
}
