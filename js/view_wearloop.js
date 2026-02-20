// js/view_wearloop.js
function renderWearLoop() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <header class="page-header" style="text-align:center; padding: 40px 20px;">
            <h1 style="font-size: 2.5rem; letter-spacing: 2px;">WEARLOOP</h1>
            <p style="color: #666;">Your viral fashion discovery feed</p>
        </header>

        <div class="feed-tabs" style="display:flex; justify-content:center; gap:30px; border-bottom:1px solid #eee; background:#fff; position:sticky; top:60px; z-index:100;">
            <button class="tab-btn active" data-tab="foryou" style="padding:15px; background:none; border:none; border-bottom:2px solid #000; font-weight:700; cursor:pointer;">For You</button>
            <button class="tab-btn" data-tab="trending" style="padding:15px; background:none; border:none; color:#888; cursor:pointer;">Trending</button>
        </div>

        <section id="wearloop-feed" class="feed-container">
            <div id="wearloop-grid" class="grid" style="grid-template-columns: 1fr; max-width: 600px;">
                <div style="text-align:center; padding: 50px;">Curating your feed...</div>
            </div>
        </section>
    `;

    // Initialize WearLoop logic
    if (typeof wearloop !== 'undefined') {
        wearloop.init();
    }
}
