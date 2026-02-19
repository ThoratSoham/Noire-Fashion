// js/auth.js
const auth = {
    isLoggedIn: false,
    user: null,
    isInitialized: false,
    _initPromise: null,
    _listenerRegistered: false,
    _onSignIn: [],  // Callbacks for next sign-in
    _onSignOut: [], // Callbacks for next sign-out
    _statusCallbacks: [], // Callbacks for ANY auth change

    // Ensure user exists in the 'profiles' table
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

            if (error) {
                console.error('Error ensuring user profile:', error);
            } else {
                console.log('User profile synchronized.');
            }
        } catch (err) {
            console.error('ensureUserProfile failed:', err);
        }
    },

    // Central init — call this at the start of every page
    init: async function () {
        if (this._initPromise) return this._initPromise;

        this._initPromise = new Promise(async (resolve) => {
            console.log('[Auth] Initializing...');

            // 1. Set up the PERMANENT listener first
            if (!this._listenerRegistered) {
                this._listenerRegistered = true;
                window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                    console.log(`[Auth] Event: ${event}`, session ? `User: ${session.user.email}` : 'No session');

                    const wasLoggedIn = this.isLoggedIn;
                    this.user = session?.user || null;
                    this.isLoggedIn = !!session;

                    if (this.isLoggedIn) {
                        await this.ensureUserProfile(this.user);
                    }

                    // Global UI update
                    this.updateNav();

                    // Execute specific event callbacks
                    if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && this.isLoggedIn)) {
                        const callbacks = [...this._onSignIn];
                        this._onSignIn = [];
                        callbacks.forEach(cb => cb(session));
                    } else if (event === 'SIGNED_OUT') {
                        const callbacks = [...this._onSignOut];
                        this._onSignOut = [];
                        callbacks.forEach(cb => cb());
                    }

                    // Broad status change listeners
                    this._statusCallbacks.forEach(cb => cb(event, session));

                    // First time initialization resolve
                    if (!this.isInitialized) {
                        this.isInitialized = true;
                        resolve(session);
                    }
                });
            }

            // 2. Immediate session check to speed up initial load
            try {
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                if (session && !this.isInitialized) {
                    // onAuthStateChange might not have fired yet for INITIAL_SESSION
                    this.user = session.user;
                    this.isLoggedIn = true;
                    this.isInitialized = true;
                    this.updateNav();
                    resolve(session);
                } else if (!session && !this.isInitialized) {
                    // Wait a moment for onAuthStateChange to possibly catch a redirect session
                    // Supabase detectSessionInUrl: true usually triggers quickly
                    setTimeout(() => {
                        if (!this.isInitialized) {
                            this.isInitialized = true;
                            this.updateNav();
                            resolve(null);
                        }
                    }, 500);
                }
            } catch (err) {
                console.warn('[Auth] getSession error:', err);
                if (!this.isInitialized) {
                    this.isInitialized = true;
                    resolve(null);
                }
            }
        });

        return this._initPromise;
    },

    // Subscribe to auth changes
    onAuthChange: function (callback) {
        this._statusCallbacks.push(callback);
        // If already initialized, trigger callback once immediately
        if (this.isInitialized) {
            callback(this.isLoggedIn ? 'SIGNED_IN' : 'SIGNED_OUT', this.user ? { user: this.user } : null);
        }
        return () => {
            this._statusCallbacks = this._statusCallbacks.filter(c => c !== callback);
        };
    },

    updateNav: function () {
        const authLinks = document.getElementById('auth-links');
        if (!authLinks) return;

        authLinks.innerHTML = '';
        if (this.isLoggedIn && this.user) {
            // Profile link / Avatar
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.textContent = (this.user.email || 'U').charAt(0).toUpperCase();
            avatar.title = this.user.email;
            avatar.onclick = () => window.location.href = 'profile.html';
            authLinks.appendChild(avatar);

            // Collection / Cart
            const cartLink = document.createElement('a');
            cartLink.href = 'cart.html';
            cartLink.className = 'cart-link';
            cartLink.innerHTML = `
                <svg class="cart-icon" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Collection
            `;
            authLinks.appendChild(cartLink);

            // Logout
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
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

    showModal: function (callback) {
        if (this.modal) return; // Already showing

        this.pendingCallback = callback || null;

        // Overlay
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '1000', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        });
        this.overlay.onclick = () => this.closeModal();

        // Modal
        this.modal = document.createElement('div');
        Object.assign(this.modal.style, {
            backgroundColor: '#fff', padding: '40px', maxWidth: '400px', width: '90%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        });
        this.modal.onclick = (e) => e.stopPropagation();

        this.modal.innerHTML = `
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

        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.modal);

        // Google
        document.getElementById('google-login-btn').onclick = async () => {
            const btn = document.getElementById('google-login-btn');
            btn.disabled = true;
            btn.textContent = 'Redirecting...';

            // Handle GitHub Pages Subdirectory
            const siteUrl = window.location.origin + window.location.pathname;
            console.log('[Auth] OAuth Redirect URL:', siteUrl);

            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: siteUrl }
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

            const siteUrl = window.location.origin + window.location.pathname;

            const { error } = await window.supabaseClient.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: siteUrl }
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

    closeModal: function () {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.modal = null;
        }
    },

    logout: async function () {
        const { error } = await window.supabaseClient.auth.signOut();
        if (error) console.error('Logout error:', error);
        window.location.href = 'index.html'; // Direct refresh to clear state
    }
};
