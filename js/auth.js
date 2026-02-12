// js/auth.js
const auth = {
    isLoggedIn: false,
    user: null,
    modal: null,
    overlay: null,

    init: function() {
        // Check for existing session
        const session = window.supabaseClient.auth.getSession();
        session.then(({ data: { session } }) => {
            if (session) {
                this.isLoggedIn = true;
                this.user = session.user;
                this.updateNav();
            } else {
                this.updateNav();
            }
        });

        // Listen for auth state changes
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.isLoggedIn = true;
                this.user = session.user;
                this.updateNav();
                // Close modal if open
                if (this.modal) {
                    this.modal.remove();
                    this.overlay.remove();
                    this.modal = null;
                    this.overlay = null;
                }
            } else if (event === 'SIGNED_OUT') {
                this.isLoggedIn = false;
                this.user = null;
                this.updateNav();
            }
        });
    },

    updateNav: function() {
        const authLinks = document.getElementById('auth-links');
        authLinks.innerHTML = '';

        if (this.isLoggedIn) {
            // Cart icon + Collection link
            const cartLink = document.createElement('a');
            cartLink.href = 'cart.html';
            cartLink.innerHTML = `
                <svg class="cart-icon" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
                Collection
            `;
            authLinks.appendChild(cartLink);

            // User email
            const emailSpan = document.createElement('span');
            emailSpan.textContent = this.user.email;
            emailSpan.style.margin = '0 15px';
            emailSpan.style.color = '#fff';
            authLinks.appendChild(emailSpan);

            // Logout button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
            authLinks.appendChild(logoutBtn);
        } else {
            // Save Collection link (prompts login)
            const saveLink = document.createElement('a');
            saveLink.href = '#';
            saveLink.textContent = 'Save Collection';
            saveLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
            authLinks.appendChild(saveLink);
        }
    },

    showModal: function(callback) {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.overlay.style.zIndex = '1000';
        this.overlay.style.display = 'flex';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.justifyContent = 'center';
        this.overlay.addEventListener('click', () => this.closeModal());

        // Create modal
        this.modal = document.createElement('div');
        this.modal.style.backgroundColor = '#fff';
        this.modal.style.padding = '20px';
        this.modal.style.borderRadius = '0';
        this.modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        this.modal.style.maxWidth = '400px';
        this.modal.style.width = '90%';
        this.modal.style.textAlign = 'center';
        this.modal.addEventListener('click', (e) => e.stopPropagation()); // Prevent overlay click

        this.modal.innerHTML = `
            <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 20px;">Sign In to Save Your Collection</h3>
            <p style="margin-bottom: 20px; color: #666;">Choose your sign-in method.</p>
            
            <!-- Google Login Button -->
            <button id="google-login-btn" style="background: #4285F4; color: #fff; padding: 10px 20px; border: none; cursor: pointer; font-size: 1rem; margin-bottom: 20px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 20px; height: 20px; margin-right: 10px;" viewBox="0 0 24 24">
                    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Login with Google
            </button>
            
            <p style="margin: 20px 0; color: #666;">Or</p>
            
            <!-- Email Login -->
            <p style="margin-bottom: 20px; color: #666;">Enter your email for a magic link (no password needed).</p>
            <input type="email" id="auth-email" placeholder="your@email.com" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 0; font-size: 1rem;">
            <button id="send-link-btn" style="background: #000; color: #fff; padding: 10px 20px; border: none; cursor: pointer; font-size: 1rem;">Send Magic Link</button>
            <p id="auth-message" style="margin-top: 20px; color: #666;"></p>
        `;

        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.modal);

        // Google login button
        document.getElementById('google-login-btn').addEventListener('click', async () => {
    const messageEl = document.getElementById('auth-message');
    console.log('Google login clicked');  // Add this
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "https://noire-fashion.github.io/Noire-Website/"
            }
        });
        console.log('OAuth response:', data, error);  // Add this
        if (error) {
            messageEl.textContent = 'Google login failed: ' + error.message;
            console.error('OAuth error:', error);
        } else {
            this.pendingCallback = callback;
        }
    } catch (err) {
        messageEl.textContent = 'Something went wrong: ' + err.message;
        console.error('Catch error:', err);
    }
});

        // Send link button (unchanged)
        document.getElementById('send-link-btn').addEventListener('click', async () => {
            const email = document.getElementById('auth-email').value.trim();
            const messageEl = document.getElementById('auth-message');

            if (!email) {
                messageEl.textContent = 'Please enter a valid email.';
                return;
            }

            try {
                const { error } = await window.supabaseClient.auth.signInWithOtp({
                    email: email,
                    options: {
                        shouldCreateUser: true,
                    }
                });

                if (error) {
                    messageEl.textContent = 'Error sending link. Try again.';
                    console.error(error);
                } else {
                    messageEl.textContent = 'Magic link sent! Check your email.';
                    // Store callback for after login
                    this.pendingCallback = callback;
                }
            } catch (err) {
                messageEl.textContent = 'Something went wrong. Try again.';
                console.error(err);
            }
        });

        // Handle post-login callback
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session && this.pendingCallback) {
                this.pendingCallback();
                this.pendingCallback = null;
            }
        });
    },

    closeModal: function() {
        if (this.modal) {
            this.modal.remove();
            this.overlay.remove();
            this.modal = null;
            this.overlay = null;
        }
    },

    logout: function() {
        window.supabaseClient.auth.signOut();
    }
};
