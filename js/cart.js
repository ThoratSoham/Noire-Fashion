// js/cart.js
const cart = {
    items: [],  // Array of product IDs saved by the user

    isSaved: function (id) {
        return this.items.includes(id);
    },

    getSavedItems: function () {
        return this.items;
    },

    fetch: async function () {
        if (!auth.isLoggedIn || !auth.user) {
            this.items = [];
            return;
        }
        try {
            const { data, error } = await window.supabaseClient
                .from('carts')
                .select('product_id')
                .eq('user_id', auth.user.id);

            if (error) throw error;
            this.items = data.map(row => row.product_id);
        } catch (err) {
            console.error('Cart fetch error:', err);
            throw err;
        }
    },

    add: async function (id) {
        if (!auth.isLoggedIn || !auth.user) {
            throw new Error('You must be logged in to add items to your cart.');
        }
        if (this.isSaved(id)) {
            throw new Error('Item already in cart.');
        }
        try {
            const { error } = await window.supabaseClient
                .from('carts')
                .insert({ user_id: auth.user.id, product_id: id });

            if (error) throw error;
            this.items.push(id);
            console.log(`Product ${id} added to cart for user ${auth.user.email}`);  // Add logging
        } catch (err) {
            console.error('Cart add error:', err);
            throw err;
        }
    },

    remove: async function (id) {
        if (!auth.isLoggedIn || !auth.user) {
            throw new Error('You must be logged in to remove items from your cart.');
        }
        try {
            const { error } = await window.supabaseClient
                .from('carts')
                .delete()
                .eq('user_id', auth.user.id)
                .eq('product_id', id);

            if (error) throw error;
            this.items = this.items.filter(itemId => itemId !== id);
        } catch (err) {
            console.error('Cart remove error:', err);
            throw err;
        }
    }
};
