// js/auth.js
const auth = {
    isLoggedIn: false,
    user: null,
    isInitialized: false,
    _initPromise: null,
    _statusCallbacks: [],

    // Subscription for auth status changes
    onAuthChange: function (callback) {
        this._statusCallbacks.push(callback);
        // Immediate trigger if already initialized
        if (this.isInitialized) {
            callback(this.isLoggedIn ? 'SIGNED_IN' : 'SIGNED_OUT', this.user);
        }
        return () => {
            this._statusCallbacks = this._statusCallbacks.filter(c => c !== callback);
        };
    },

    // Central initialization
    init: async function () {
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            console.log('[Auth] Initializing standard flow...');

            // 1. Set up permanent listener (singleton)
            window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                console.log(`[Auth] Event: ${event}`, session ? `User: ${session.user.email}` : 'No session');

                this.user = session?.user || null;
                this.isLoggedIn = !!session;
                this.isInitialized = true;

                if (this.isLoggedIn) {
                    await this.ensureUserProfile(this.user);
                }

                this.updateNav();

                // Notify all subscribers
                this._statusCallbacks.forEach(cb => cb(event, session));
            });

            // 2. Resolve initial session
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            this.user = session?.user || null;
            this.isLoggedIn = !!session;
            this.isInitialized = true;

            this.updateNav();
            return session;
        })();

        return this._initPromise;
    },

    ensureUserProfile: async function (user) {
        if (!user) return;
        try {
            const { error } = await window.supabaseClient
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email.split('@')[0]
                }, { onConflict: 'id' });

            if (error) console.error('[Auth] Profile sync error:', error);
        } catch (err) {
            console.error('[Auth] ensureUserProfile failed:', err);
        }
    },

    updateNav: function () {
        const authLinks = document.getElementById('auth-links');
        if (!authLinks) return;

        authLinks.style.display = 'flex';
        authLinks.style.alignItems = 'center';
        authLinks.style.justifyContent = 'flex-end';
        authLinks.style.gap = '20px';
        authLinks.innerHTML = '';

        // WearLoop Link
        const wearLoopLink = document.createElement('a');
        wearLoopLink.href = '#wearloop';
        wearLoopLink.innerHTML = '<span style="font-weight:700;">WearLoop</span>';
        authLinks.appendChild(wearLoopLink);

        // Sets Link
        const setsLink = document.createElement('a');
        setsLink.href = '#sets';
        setsLink.innerHTML = '<span style="font-weight:500;">Sets</span>';
        authLinks.appendChild(setsLink);

        if (this.isLoggedIn && this.user) {
            // Profile / Avatar
            const avatar = document.createElement('a');
            avatar.href = '#profile';
            avatar.className = 'avatar';
            const name = this.user.user_metadata?.full_name || this.user.email || 'U';
            avatar.textContent = name.charAt(0).toUpperCase();
            avatar.title = name;
            Object.assign(avatar.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', background: '#333', color: '#fff',
                width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #fff'
            });
            authLinks.appendChild(avatar);

            // Collection / Cart
            const cartLink = document.createElement('a');
            cartLink.href = '#cart';
            cartLink.className = 'cart-link';
            cartLink.style.display = 'flex';
            cartLink.style.alignItems = 'center';
            cartLink.innerHTML = `
                <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor; margin-right:5px;">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                My Collection
            `;
            authLinks.appendChild(cartLink);

            // Logout
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = async (e) => {
                e.preventDefault();
                await window.supabaseClient.auth.signOut();
                // Redirect and force re-render if already on home
                if (window.location.hash === '#home' || !window.location.hash) {
                    if (typeof router !== 'undefined') router.renderRoute();
                    else window.location.reload();
                } else {
                    window.location.hash = '#home';
                }
            };
            authLinks.appendChild(logoutBtn);
        } else {
            const loginLink = document.createElement('a');
            loginLink.href = '#';
            loginLink.textContent = 'Save Collection';
            loginLink.onclick = (e) => {
                e.preventDefault();
                this.showModal();
            };
            authLinks.appendChild(loginLink);
        }
    },

    showModal: function () {
        if (document.getElementById('auth-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'auth-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '1000', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        });
        overlay.onclick = () => overlay.remove();

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: '#fff', padding: '40px', maxWidth: '400px', width: '90%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        });
        modal.onclick = (e) => e.stopPropagation();

        modal.innerHTML = `
            <h2 style="margin-bottom: 10px;">Membership</h2>
            <p style="margin-bottom: 30px; color: #666;">Sign in to save your personal collection.</p>
            
            <button id="google-login-btn" style="background: #fff; color: #000; padding: 12px; border: 1px solid #000; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; font-weight: 500;">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width: 18px; margin-right: 10px;">
                Continue with Google
            </button>
            
            <div style="margin: 20px 0; color: #ccc;">or</div>
            
            <input type="email" id="auth-email" placeholder="Email Address" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; outline: none;">
            <button id="send-link-btn" style="background: #000; color: #fff; padding: 12px; border: none; cursor: pointer; width: 100%; font-weight: 500;">Send Magic Link</button>
            <p id="auth-message" style="margin-top: 20px; font-size: 0.9rem; color: #d93025;"></p>
        `;

        document.body.appendChild(overlay);
        overlay.appendChild(modal);

        const redirectTo = window.location.origin + window.location.pathname;

        // Google Login
        document.getElementById('google-login-btn').onclick = async () => {
            const btn = document.getElementById('google-login-btn');
            btn.disabled = true;
            btn.textContent = 'Redirecting...';

            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo }
            });

            if (error) {
                document.getElementById('auth-message').textContent = error.message;
                btn.disabled = false;
                btn.textContent = 'Continue with Google';
            }
        };

        // Magic Link
        document.getElementById('send-link-btn').onclick = async () => {
            const email = document.getElementById('auth-email').value.trim();
            const btn = document.getElementById('send-link-btn');
            const message = document.getElementById('auth-message');

            if (!email) {
                message.textContent = 'Please enter your email.';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Sending...';

            const { error } = await window.supabaseClient.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: redirectTo }
            });

            if (error) {
                message.textContent = error.message;
                btn.disabled = false;
                btn.textContent = 'Send Magic Link';
            } else {
                message.style.color = '#1e8e3e';
                message.textContent = 'Check your email for the magic link!';
            }
        };
    },

    // Activity Tracking (Helper for WearLoop)
    trackActivity: async function (postId, type, content = null) {
        if (!this.isLoggedIn) return;
        const isNumeric = !isNaN(postId) && !isNaN(parseFloat(postId));
        const data = {
            user_id: this.user.id,
            type,
            content
        };
        if (isNumeric) data.post_id_int = parseInt(postId);
        else data.post_id_str = String(postId);

        try {
            await window.supabaseClient.from('wearloop_activities').upsert(data, {
                onConflict: 'user_id,post_id_int,post_id_str,type'
            });
        } catch (err) { console.error('[Auth] Activity error:', err); }
    },

    removeActivity: async function (postId, type) {
        if (!this.isLoggedIn) return;
        const isNumeric = !isNaN(postId) && !isNaN(parseFloat(postId));
        let query = window.supabaseClient.from('wearloop_activities').delete()
            .eq('user_id', this.user.id).eq('type', type);

        if (isNumeric) query = query.eq('post_id_int', parseInt(postId));
        else query = query.eq('post_id_str', String(postId));

        try {
            await query;
        } catch (err) { console.error('[Auth] Activity removal error:', err); }
    },

    getUserActivities: async function () {
        if (!this.isLoggedIn) return [];
        try {
            const { data } = await window.supabaseClient.from('wearloop_activities')
                .select('*').eq('user_id', this.user.id);
            // Map back to a consistent post_id for simpler frontend logic
            return (data || []).map(a => ({
                ...a,
                post_id: a.post_id_int ? String(a.post_id_int) : a.post_id_str
            }));
        } catch (err) { return []; }
    },

    // WearLoop Post Management
    getUserPosts: async function () {
        if (!this.isLoggedIn) return [];
        try {
            const { data } = await window.supabaseClient
                .from('wearloop_posts')
                .select('*, post_analytics(event_type)')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false });
            return data || [];
        } catch (err) {
            console.error('[Auth] Error fetching user posts:', err);
            return [];
        }
    },

    createPost: async function (postData) {
        if (!this.isLoggedIn) throw new Error('Must be logged in to post');
        try {
            const { data, error } = await window.supabaseClient
                .from('wearloop_posts')
                .insert({ ...postData, user_id: this.user.id })
                .select();
            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('[Auth] Error creating post:', err);
            throw err;
        }
    },

    updatePost: async function (postId, postData) {
        if (!this.isLoggedIn) throw new Error('Must be logged in to edit');
        try {
            const { error } = await window.supabaseClient
                .from('wearloop_posts')
                .update(postData)
                .eq('id', postId)
                .eq('user_id', this.user.id);
            if (error) throw error;
        } catch (err) {
            console.error('[Auth] Error updating post:', err);
            throw err;
        }
    },

    deletePost: async function (postId) {
        if (!this.isLoggedIn) throw new Error('Must be logged in to delete');
        try {
            const { error } = await window.supabaseClient
                .from('wearloop_posts')
                .delete()
                .eq('id', postId)
                .eq('user_id', this.user.id);
            if (error) throw error;
        } catch (err) {
            console.error('[Auth] Error deleting post:', err);
            throw err;
        }
    },

    trackPostEvent: async function (postId, eventType) {
        try {
            await window.supabaseClient.from('post_analytics').insert({
                post_id: postId,
                event_type: eventType
            });
        } catch (err) {
            // Silently fail for analytics
            console.warn('[Analytics] Failed to track event:', eventType, postId);
        }
    }
};
