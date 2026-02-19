// js/cart.js
const cart = {
    items: [], // Array of product IDs

    // Initialize cart state listeners
    init: function () {
        auth.onAuthChange((event, session) => {
            if (session) {
                this.fetch();
            } else {
                this.items = [];
            }
        });
    },

    isSaved: function (id) {
        return this.items.includes(id);
    },

    fetch: async function () {
        if (!auth.isLoggedIn || !auth.user) {
            this.items = [];
            document.dispatchEvent(new CustomEvent('cartUpdated'));
            return;
        }
        try {
            console.log(`[Cart] Fetching bits for user: ${auth.user.id}`);
            const { data, error } = await window.supabaseClient
                .from('carts')
                .select('product_id')
                .eq('user_id', auth.user.id);

            if (error) throw error;
            this.items = data.map(row => row.product_id);
            console.log('[Cart] Items loaded:', this.items.length);
            document.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error('[Cart] Fetch error:', err);
        }
    },

    add: async function (id) {
        if (!auth.isLoggedIn || !auth.user) {
            auth.showModal(); // Prompt login
            return;
        }
        if (this.isSaved(id)) return;

        try {
            const { error } = await window.supabaseClient
                .from('carts')
                .insert({ user_id: auth.user.id, product_id: id });

            if (error) throw error;
            this.items.push(id);
            console.log(`[Cart] Added product ${id}`);
            document.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error('[Cart] Add error:', err);
            alert('Could not add to cart. Please try again.');
        }
    },

    remove: async function (id) {
        if (!auth.isLoggedIn || !auth.user) return;

        try {
            const { error } = await window.supabaseClient
                .from('carts')
                .delete()
                .eq('user_id', auth.user.id)
                .eq('product_id', id);

            if (error) throw error;
            this.items = this.items.filter(itemId => itemId !== id);
            console.log(`[Cart] Removed product ${id}`);
            document.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error('[Cart] Remove error:', err);
        }
    }
};

// Auto-init cart listeners
cart.init();
