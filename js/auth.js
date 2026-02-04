// Handles login, logout, session management
const auth = {
    modal: null,
    isLoggedIn: false,
    user: null,

    init() {
        this.createModal();
        this.checkSession();
        this.updateNav();
    },

    createModal() {
        // Subtle modal for magic link login
        const modalHTML = `
            <div id="login-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">
                <div style="background:#fff; padding:30px; border:1px solid #ddd; max-width:400px; width:90%; text-align:center; font-family:'Montserrat', sans-serif;">
                    <h3 style="font-family:'Playfair Display', serif; margin-bottom:15px;">Save Your Collection</h3>
                    <p style="font-size:0.9rem; color:#666; margin-bottom:20px;">Choose how to sign in and access your saved pieces anytime.</p>
                    
                    <button id="google-signin-btn" style="background:#4285F4; color:#fff; padding:12px 20px; border:none; cursor:pointer; width:100%; margin-bottom:10px; font-weight:500; border-radius:4px;">Sign in with Google</button>
                    
                    <div style="position:relative; margin:15px 0;">
                        <div style="position:absolute; top:50%; width:100%; height:1px; background:#ddd;"></div>
                        <span style="position:relative; background:#fff; padding:0 10px; color:#999; font-size:0.8rem;">OR</span>
                    </div>
                    
                    <input id="email-input" type="email" placeholder="your@email.com" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:0;">
                    <button id="send-link-btn" style="background:#000; color:#fff; padding:10px 20px; border:none; cursor:pointer; width:100%;">Send Magic Link</button>
                    <p id="auth-message" style="font-size:0.8rem; color:#d00; margin-top:10px;"></p>
                    <button id="close-modal" style="background:none; border:none; color:#666; cursor:pointer; margin-top:10px;">Close</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('login-modal');

        // Event listeners
        document.getElementById('send-link-btn').addEventListener('click', () => this.sendMagicLink());
        document.getElementById('google-signin-btn').addEventListener('click', () => this.signInWithGoogle());
        document.getElementById('close-modal').addEventListener('click', () => this.hideModal());
        document.getElementById('email-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMagicLink();
        });
    },

    async sendMagicLink() {
        const email = document.getElementById('email-input').value.trim();
        if (!email) return this.showMessage('Please enter a valid email.');
        
        if (!window.supabaseClient) {
            this.showMessage('System is loading... please try again in a moment.');
            return;
        }

        try {
            const { error } = await window.supabaseClient.auth.signInWithOtp({ email });
            if (error) throw error;
            this.showMessage('Check your email for a secure link. It may take a minute to arrive.');
        } catch (err) {
            console.error('Magic link error:', err);
            this.showMessage('Email error: ' + (err.message || 'Something went wrong. Try again.'));
        }
    },

    async signInWithGoogle() {
        if (!window.supabaseClient) {
            this.showMessage('System is loading... please try again in a moment.');
            return;
        }
        
        try {
            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error('Google signin error:', err);
            this.showMessage('Google signin failed: ' + (err.message || 'Please try again.'));
        }
    },

    showMessage(msg) {
        document.getElementById('auth-message').textContent = msg;
    },

    showModal(callback) {
        this.modal.style.display = 'flex';
        this.postLoginCallback = callback;  // For auto-adding to cart after login
    },

    hideModal() {
        this.modal.style.display = 'none';
        this.postLoginCallback = null;
    },

    async checkSession() {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            this.isLoggedIn = true;
            this.user = session.user;
            await this.ensureUserProfile();
            if (this.postLoginCallback) this.postLoginCallback();
        }

        // Listen for auth changes
        window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.isLoggedIn = true;
                this.user = session.user;
                await this.ensureUserProfile();
                this.hideModal();
                this.updateNav();
                if (this.postLoginCallback) this.postLoginCallback();
            } else if (event === 'SIGNED_OUT') {
                this.isLoggedIn = false;
                this.user = null;
                this.updateNav();
            }
        });
    },

    async ensureUserProfile() {
        // Upsert user profile on login
        const { error } = await window.supabaseClient
            .from('users')
            .upsert({ id: this.user.id, email: this.user.email });
        if (error) console.error('Profile upsert failed:', error);
    },

    updateNav() {
        const nav = document.querySelector('nav .logo').parentElement;
        // Remove existing auth elements
        nav.querySelectorAll('.auth-link').forEach(el => el.remove());

        if (this.isLoggedIn) {
            nav.insertAdjacentHTML('beforeend', `
                <a href="/cart.html" class="auth-link" style="margin:0 15px;">Collection</a>
                <span class="auth-link" style="font-size:0.8rem; color:#666; margin:0 15px;">${this.user.email}</span>
                <a href="#" id="logout-link" class="auth-link" style="margin:0 15px;">Logout</a>
            `);
            document.getElementById('logout-link').addEventListener('click', () => this.logout());
        } else {
            nav.insertAdjacentHTML('beforeend', `
                <a href="#" id="login-link" class="auth-link" style="margin:0 15px;">Save Collection</a>
            `);
            document.getElementById('login-link').addEventListener('click', () => this.showModal());
        }
    },

    async logout() {
        await window.supabaseClient.auth.signOut();
    }
};

// Init on page load
document.addEventListener('DOMContentLoaded', () => auth.init());
