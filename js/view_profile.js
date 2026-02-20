// js/view_profile.js
function renderProfile() {
    const app = document.getElementById('app');

    if (!auth.isLoggedIn) {
        app.innerHTML = `
            <div style="text-align:center; padding: 100px;">
                <h2>Access Denied</h2>
                <p>Please sign in to view your profile.</p>
                <button onclick="auth.showModal()" style="margin-top:20px; padding: 10px 20px; background:#000; color:#fff; border:none; cursor:pointer;">Sign In</button>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="section profile-view" style="padding: 60px 20px;">
            <div class="profile-form">
                <h2 style="text-align:center; margin-bottom:30px;">Member Profile</h2>
                <div id="profile-status" style="margin-bottom:20px; text-align:center; font-size:0.9rem;"></div>
                <form id="spa-profile-form">
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Email</label>
                        <input type="text" value="${auth.user.email}" disabled style="background:#f9f9f9; color:#999;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Name</label>
                        <input type="text" id="profile-name" value="${auth.user.user_metadata?.full_name || ''}">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#666;">Country</label>
                        <input type="text" id="profile-country" placeholder="e.g. United Kingdom">
                    </div>
                    <button type="submit" id="save-profile-btn">Update Profile</button>
                </form>
                
                <div style="margin-top:40px; border-top: 1px solid #eee; padding-top:20px; text-align:center;">
                    <button onclick="auth.logout()" style="background:none; border:none; color:#ff6b6b; cursor:pointer; font-weight:600;">Sign Out</button>
                </div>
            </div>
        </div>
    `;

    loadProfileData();

    document.getElementById('spa-profile-form').onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-profile-btn');
        const status = document.getElementById('profile-status');

        btn.disabled = true;
        btn.textContent = 'Saving...';

        const data = {
            name: document.getElementById('profile-name').value,
            country: document.getElementById('profile-country').value
        };

        try {
            await profile.save(data);
            status.textContent = '✓ Profile updated successfully';
            status.style.color = '#4CAF50';
        } catch (err) {
            status.textContent = '× Error saving profile';
            status.style.color = '#ff6b6b';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Update Profile';
        }
    };
}

async function loadProfileData() {
    const data = await profile.load();
    if (data) {
        if (document.getElementById('profile-country')) document.getElementById('profile-country').value = data.country || '';
        if (document.getElementById('profile-name')) document.getElementById('profile-name').value = data.name || (auth.user.user_metadata?.full_name || '');
    }
}
