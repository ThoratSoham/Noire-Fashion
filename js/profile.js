// js/profile.js
const profile = {
    data: {},

    load: async function () {
        if (!auth.isLoggedIn || !auth.user) {
            throw new Error('You must be logged in to load your profile.');
        }
        try {
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', auth.user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found", which is ok for new users
                throw error;
            }
            this.data = data || {};
            return this.data;
        } catch (err) {
            console.error('Profile load error:', err);
            throw err;
        }
    },

    save: async function (profileData) {
        if (!auth.isLoggedIn || !auth.user) {
            throw new Error('You must be logged in to save your profile.');
        }
        try {
            const { error } = await window.supabaseClient
                .from('profiles')
                .upsert({ user_id: auth.user.id, ...profileData });

            if (error) throw error;
            this.data = { ...this.data, ...profileData };
        } catch (err) {
            console.error('Profile save error:', err);
            throw err;
        }
    }
};