// js/view_sets.js
function renderSetsView() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <header class="page-header" style="text-align:center; padding: 60px 20px; background: #fdfdfd;">
            <h1 style="font-size: 3rem; margin-bottom: 10px; letter-spacing: 2px;">OUTFIT SETS</h1>
            <p style="color: #666; font-style: italic; font-size: 1.1rem; margin-bottom: 30px;">Curated combinations designed to complete your look</p>
            
            <div class="filter-controls" style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                <label for="gender-filter" style="font-weight: 600; font-size: 0.9rem;">Filter by:</label>
                <select id="gender-filter" style="padding: 10px 20px; border: 1px solid #000; background: #fff; cursor: pointer; font-family: inherit; font-size: 0.9rem; border-radius: 4px; outline: none;">
                    <option value="All">All Styles</option>
                    <option value="Male">Men's Sets</option>
                    <option value="Female">Women's Sets</option>
                </select>
            </div>
        </header>

        <section id="wearloop-sets-section" class="sets-section" style="background: transparent; border: none; padding-top: 40px;">
            <div id="sets-container" class="sets-grid">
                <!-- Sets rendered via sets.js -->
            </div>
        </section>
    `;

    // Initialize/Render sets logic
    if (typeof renderSets === 'function') {
        renderSets();

        // Deep link handling for sets (scroll to set if id in hash)
        const hash = window.location.hash;
        if (hash.includes('set=')) {
            const setId = hash.split('set=')[1];
            setTimeout(() => {
                const el = document.querySelector(`.set-expand-container[data-id="${setId}"]`);
                if (el) {
                    const card = el.closest('.set-card');
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.outline = "2px solid #000";
                    card.style.borderRadius = "8px";

                    // Automatically expand the set so users see the items immediately
                    const toggleBtn = card.querySelector('.toggle-set-btn');
                    if (toggleBtn && toggleBtn.textContent.includes('View')) {
                        toggleBtn.click();
                    }
                }
            }, 500);
        }

        // Attach filter listener
        const filter = document.getElementById('gender-filter');
        if (filter) {
            filter.onchange = (e) => {
                renderSets(e.target.value);
            };
        }
    }
}
