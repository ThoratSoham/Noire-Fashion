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
            <p style="margin-bottom: 20px; color: #666;">Enter your email for a magic link (no password needed).</p>
            <input type="email" id="auth-email" placeholder="your@email.com" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 0; font-size: 1rem;">
            <button id="send-link-btn" style="background: #000; color: #fff; padding: 10px 20px; border: none; cursor: pointer; font-size: 1rem;">Send Magic Link</button>
            <p id="auth-message" style="margin-top: 20px; color: #666;"></p>
        `;

        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.modal);

        // Send link button
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
