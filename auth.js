// auth.js
async function checkLogin() {
    // 1. Session ရှိမရှိ စစ်ဆေးခြင်း
    const { data: { session } } = await supabase.auth.getSession();
    const currentPage = window.location.pathname.split('/').pop();

    if (!session) {
        if (currentPage !== 'login.html') {
            window.location.href = 'login.html';
        }
        return;
    }

    if (currentPage === 'login.html') {
        window.location.href = 'index.html'; 
        return;
    }

    const userEmail = session.user.email;
    let role = 'user'; // Default 

    // 2. Role ကို Database မှ ဆွဲယူခြင်း (Error ပါရင် Console မှာပြမည်)
    try {
        const { data: profile, error } = await supabase.from('crm_profiles').select('role').eq('email', userEmail).single();
        if (profile && profile.role) {
            role = profile.role.toLowerCase();
        }
        if (error) console.error("Role Fetch Error:", error);
    } catch(e) {
        console.error("Profile Fetch Exception:", e);
    }

    // 3. UI တွင် Account Info နှင့် Logout ခလုတ်ကို အလိုအလျောက် တပ်ဆင်ခြင်း
    setupUserInterface(userEmail, role);

    // 4. Permission ကန့်သတ်ချက်များ သတ်မှတ်ခြင်း
    applyPermissions(role, currentPage);
}

function setupUserInterface(email, role) {
    // Navbar ရဲ့ ညာဘက်ဆုံး div ကို ရှာမည် (Logout ခလုတ်တွေ ရှိနေရင် အရင်ဖျက်မည်)
    const navDiv = document.querySelector('.navbar .container-fluid > div:last-child');
    if (!navDiv) return;

    // အဟောင်းတွေ (စမ်းထားတဲ့ Logout ခလုတ်တွေ) ရှိရင် ရှင်းပစ်မယ်
    const oldLogout = navDiv.querySelector('button');
    if(oldLogout) oldLogout.remove();
    const oldInfo = navDiv.querySelector('.user-info-badge');
    if(oldInfo) oldInfo.remove();

    // Account Info နဲ့ Logout ခလုတ်ကို ညီညီညာညာ ဖန်တီးထည့်သွင်းမည်
    navDiv.classList.add('d-flex', 'align-items-center');
    
    let badgeColor = role === 'admin' ? 'bg-danger' : 'bg-secondary';
    
    let userInfoHtml = `
        <div class="user-info-badge ms-3 me-2 text-end" style="line-height: 1.1;">
            <small class="text-white fw-bold d-block">${email}</small>
            <span class="badge ${badgeColor}" style="font-size: 0.65rem; letter-spacing: 0.5px;">${role.toUpperCase()} TIER</span>
        </div>
        <button onclick="logout()" class="btn btn-warning btn-sm fw-bold shadow-sm" title="Logout">
            <i class="bi bi-box-arrow-right"></i> Log Out
        </button>
    `;
    
    navDiv.insertAdjacentHTML('beforeend', userInfoHtml);
}

function applyPermissions(role, currentPage) {
    if (role === 'user') {
        // --- User Tier အတွက် ကန့်သတ်ချက်များ ---

        // (၁) CRM Settings Tab ကို ဖျောက်မည် (index.html တွင်)
        const settingsTab = document.querySelector('a[href="#settings"]');
        if (settingsTab) settingsTab.parentElement.style.display = 'none';

        // (၂) Dashboard Menu များကို ဖျောက်မည် (Navbar တွင်)
        const dashLinks = document.querySelectorAll('a[href="dashboard.html"]');
        dashLinks.forEach(link => link.style.display = 'none');

        // (၃) URL ကနေ dashboard.html ကို တိုက်ရိုက်ဝင်လာရင် တားမည်
        if (currentPage === 'dashboard.html' || currentPage === 'dashboard.html#') {
            Swal.fire('Access Denied', 'You do not have permission to view the dashboard.', 'error')
            .then(() => { window.location.href = 'portal.html'; });
        }
    }
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// စာမျက်နှာ ပွင့်လာတာနဲ့ Login စစ်ဆေးမည်
window.addEventListener('DOMContentLoaded', checkLogin);