// Handles cart operations (add, remove, fetch)
const cart = {
    items: [],  // Local cache for quick UI

    async add(productId) {
        if (!auth.isLoggedIn) {
            auth.showModal(() => this.add(productId));  // Trigger login, then retry
            return;
        }

        try {
            const { error } = await window.supabaseClient
                .from('carts')
                .insert({ user_id: auth.user.id, product_id: productId });
            if (error && error.code !== '23505') throw error;  // Ignore unique constraint errors
            this.items.push(productId);  // Update local cache
            alert('Added to your collection.');  // Subtle feedback
        } catch (err) {
            alert('Something didn’t work. Please try again.');
        }
    },

    async remove(productId) {
        try {
            await window.supabaseClient
                .from('carts')
                .delete()
                .eq('user_id', auth.user.id)
                .eq('product_id', productId);
            this.items = this.items.filter(id => id !== productId);
        } catch (err) {
            alert('Something didn’t work. Please try again.');
        }
    },

    async fetch() {
        if (!auth.isLoggedIn) return [];
        try {
            const { data, error } = await window.supabaseClient
                .from('carts')
                .select('product_id')
                .eq('user_id', auth.user.id);
            if (error) throw error;
            this.items = data.map(item => item.product_id);
            return this.items;
        } catch (err) {
            console.error('Fetch cart failed:', err);
            return [];
        }
    },

    isSaved(productId) {
        return this.items.includes(productId);
    }
};
