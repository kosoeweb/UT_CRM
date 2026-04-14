// auth.js
async function checkLogin() {
    // 1. Session ရှိမရှိ စစ်ဆေးခြင်း
    const { data: { session } } = await supabase.auth.getSession();
    const currentPage = window.location.pathname.split('/').pop();

    if (!session) {
        // Login မဝင်ထားရင် login.html ကို ပို့မည်
        if (currentPage !== 'login.html') {
            window.location.href = 'login.html';
        }
        return;
    }

    if (currentPage === 'login.html') {
        window.location.href = 'index.html'; // Login ဝင်ပြီးသားဆိုရင် Home ကို ပြန်ပို့မည်
        return;
    }

    // 2. User Role ကို Database မှ ဆွဲယူခြင်း
    const userEmail = session.user.email;
    const { data: profile } = await supabase.from('crm_profiles').select('role').eq('email', userEmail).single();
    const role = profile ? profile.role : 'user'; // Default ကို user အဖြစ်ထားမည်

    // 3. Permission ကန့်သတ်ချက်များ သတ်မှတ်ခြင်း
    applyPermissions(role, currentPage);
}

function applyPermissions(role, currentPage) {
    if (role === 'user') {
        // --- User Tier အတွက် ကန့်သတ်ချက်များ ---

        // (၁) CRM Settings Tab ကို ဖျောက်မည် (index.html တွင်)
        const settingsTab = document.querySelector('a[href="#settings"]');
        if (settingsTab) settingsTab.parentElement.style.display = 'none';

        // (၂) Dashboard Menu ကို ဖျောက်မည်
        const dashLink = document.querySelector('a[href="dashboard.html"]');
        if (dashLink) dashLink.style.display = 'none';

        // (၃) URL ကနေ dashboard.html ကို တိုက်ရိုက်ဝင်လာရင် တားမည်
        if (currentPage === 'dashboard.html') {
            Swal.fire('Access Denied', 'You do not have permission to view the dashboard.', 'error')
            .then(() => { window.location.href = 'portal.html'; });
        }
    }
}

// Logout လုပ်ရန် Function
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// စာမျက်နှာ ပွင့်လာတာနဲ့ Login စစ်ဆေးမည်
window.addEventListener('DOMContentLoaded', checkLogin);