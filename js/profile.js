// js/profile.js
const profile = {
    data: {},

    load: async function () {
        // Wait for auth if not ready
        if (!auth.isInitialized) await auth.init();

        if (!auth.isLoggedIn || !auth.user) {
            console.warn('[Profile] Cannot load: user not logged in.');
            return null;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', auth.user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = "not found"
                throw error;
            }
            this.data = data || {};
            return this.data;
        } catch (err) {
            console.error('[Profile] Load error:', err);
            return null;
        }
    },

    save: async function (profileData) {
        if (!auth.isLoggedIn || !auth.user) {
            auth.showModal();
            return;
        }

        try {
            const { error } = await window.supabaseClient
                .from('profiles')
                .upsert(
                    { id: auth.user.id, ...profileData, email: auth.user.email },
                    { onConflict: 'id' }
                );

            if (error) throw error;
            this.data = { ...this.data, ...profileData };
            console.log('[Profile] Saved successfully.');
        } catch (err) {
            console.error('[Profile] Save error:', err);
            alert('Could not save profile.');
        }
    }
};
