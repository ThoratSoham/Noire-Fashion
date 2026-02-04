// Handles optional user profile (name, gender preference)
const profile = {
    isComplete: false,

    async load() {
        if (!auth.isLoggedIn) return;
        try {
            const { data, error } = await window.supabaseClient
                .from('users')
                .select('*')
                .eq('id', auth.user.id)
                .single();
            if (error) throw error;
            this.isComplete = !!(data.name && data.gender_preference);
            // Update nav with red dot if incomplete
            const profileLink = document.querySelector('#profile-link');
            if (profileLink && !this.isComplete) {
                profileLink.style.textDecoration = 'underline';
                profileLink.style.color = '#d00';  // Subtle red
                profileLink.title = 'Complete your profile to improve recommendations';
            }
        } catch (err) {
            console.error('Load profile failed:', err);
        }
    },

    async update(updates) {
        try {
            await window.supabaseClient
                .from('users')
                .update(updates)
                .eq('id', auth.user.id);
            this.isComplete = !!(updates.name && updates.gender_preference);
        } catch (err) {
            alert('Something didn’t work. Please try again.');
        }
    }
};
