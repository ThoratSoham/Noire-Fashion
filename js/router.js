// js/router.js
const router = {
    app: null,

    init: function () {
        this.app = document.getElementById('app');
        window.addEventListener('hashchange', () => this.renderRoute());
        window.addEventListener('load', () => this.renderRoute());
        this.renderRoute();
    },

    renderRoute: function () {
        const hash = window.location.hash.replace('#', '') || 'home';
        const [route, params] = hash.split('?');
        console.log(`[Router] Navigating to: ${route}`);

        // Scrutinize if we need to clean up previous view intervals or listeners here
        this.app.innerHTML = '';

        switch (route) {
            case 'home':
                renderHome();
                break;
            case 'cart':
                renderCart();
                break;
            case 'wearloop':
                renderWearLoop();
                break;
            case 'profile':
                renderProfile();
                break;
            default:
                this.render404();
        }

        // Ensure nav stays in sync
        if (typeof auth !== 'undefined') auth.updateNav();

        // Scroll to top on navigation
        window.scrollTo(0, 0);
    },

    render404: function () {
        this.app.innerHTML = `
            <div style="text-align:center; padding: 100px;">
                <h1>404</h1>
                <p>Page not found.</p>
                <a href="#home" style="color: #000;">Back to Home</a>
            </div>
        `;
    }
};

// Initialize router after dom is ready and auth is checked
document.addEventListener('DOMContentLoaded', () => {
    router.init();
});
