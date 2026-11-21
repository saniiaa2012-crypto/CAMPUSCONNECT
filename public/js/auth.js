// Authentication & Persona Management Controller
const Auth = {
  currentUser: null,

  async init() {
    const token = localStorage.getItem('cc_token');
    if (token) {
      try {
        const res = await API.get('/auth/me');
        if (res.success && res.user) {
          this.currentUser = res.user;
          localStorage.setItem('cc_user', JSON.stringify(res.user));
        } else {
          this.clearSession();
        }
      } catch (err) {
        this.clearSession();
      }
    } else {
      // Auto-login as Aryan Sharma (Student) by default on first visit for seamless evaluation!
      const cached = localStorage.getItem('cc_user');
      if (!cached) {
        await this.switchPersona('usr_student_1', false);
      } else {
        try {
          this.currentUser = JSON.parse(cached);
        } catch (e) {
          this.currentUser = null;
        }
      }
    }

    this.renderNavbarAuth();
    this.setupAuthModal();
  },

  getUser() {
    return this.currentUser;
  },

  isLoggedIn() {
    return Boolean(this.currentUser);
  },

  clearSession() {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    this.currentUser = null;
    this.renderNavbarAuth();
  },

  async login(email, password) {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('cc_user', JSON.stringify(res.user));
        this.currentUser = res.user;
        this.renderNavbarAuth();
        Toast.success('Welcome Back!', res.message);
        this.closeAuthModal();
        if (window.onAuthChange) window.onAuthChange(this.currentUser);
        return res;
      }
    } catch (err) {
      Toast.error('Login Failed', err.message);
      throw err;
    }
  },

  async register(data) {
    try {
      const res = await API.post('/auth/register', data);
      if (res.success) {
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('cc_user', JSON.stringify(res.user));
        this.currentUser = res.user;
        this.renderNavbarAuth();
        Toast.success('Account Created!', `Welcome to CampusConnect, ${res.user.name}`);
        this.closeAuthModal();
        if (window.onAuthChange) window.onAuthChange(this.currentUser);
        return res;
      }
    } catch (err) {
      Toast.error('Registration Failed', err.message);
      throw err;
    }
  },

  logout() {
    this.clearSession();
    Toast.info('Logged Out', 'You have been signed out successfully.');
    if (window.onAuthChange) window.onAuthChange(null);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },

  async switchPersona(personaId, showToast = true) {
    try {
      const res = await API.post('/auth/switch-demo-persona', { personaId });
      if (res.success) {
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('cc_user', JSON.stringify(res.user));
        this.currentUser = res.user;
        this.renderNavbarAuth();
        if (showToast) {
          Toast.success('Persona Switched', `Now logged in as: ${res.user.name} (${res.user.role})`);
        }
        if (window.onAuthChange) window.onAuthChange(this.currentUser);
        return res;
      }
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  },

  configureBackendUrl() {
    const current = localStorage.getItem('cc_backend_api_url') || '';
    const newUrl = prompt('Enter your Render Backend URL (e.g. https://campusconnect-backend.onrender.com):', current);
    if (newUrl !== null) {
      API.setBaseUrl(newUrl);
      Toast.success('Backend URL Updated', `Now pointing to: ${API.getBaseUrl()}`);
      setTimeout(() => window.location.reload(), 1000);
    }
  },

  renderNavbarAuth() {
    const authContainer = document.getElementById('navbar-auth-section');
    if (!authContainer) return;

    if (this.currentUser) {
      const roleBadges = {
        student: { label: 'Student', color: 'bg-[#eeecff] text-[#5341cd]' },
        faculty: { label: 'Dean / Faculty', color: 'bg-[#fff3e0] text-[#e67e22]' },
        recruiter: { label: 'Recruiter', color: 'bg-[#e6f8f4] text-[#00b894]' }
      };
      const badge = roleBadges[this.currentUser.role] || roleBadges.student;

      authContainer.innerHTML = `
        <!-- Demo Persona Quick Selector -->
        <div class="relative group hidden sm:block">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-semibold text-primary transition-all">
            <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
            <span>Switch Role</span>
            <span class="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <div class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 hidden group-hover:block z-50">
            <div class="text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">Demo Quick Personas</div>
            <button onclick="Auth.switchPersona('usr_student_1')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2.5 ${this.currentUser.role === 'student' ? 'bg-primary/10 font-bold' : ''}">
              <img src="/assets/student-portrait.png" class="w-7 h-7 rounded-full object-cover">
              <div>
                <p class="text-xs font-semibold text-gray-800">Aryan Sharma</p>
                <p class="text-[10px] text-gray-500">Student • DTU 3rd Year</p>
              </div>
            </button>
            <button onclick="Auth.switchPersona('usr_faculty_1')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2.5 ${this.currentUser.role === 'faculty' ? 'bg-primary/10 font-bold' : ''}">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" class="w-7 h-7 rounded-full object-cover">
              <div>
                <p class="text-xs font-semibold text-gray-800">Prof. Ananya Iyer</p>
                <p class="text-[10px] text-gray-500">Dean Facilities & Welfare</p>
              </div>
            </button>
            <button onclick="Auth.switchPersona('usr_recruiter_1')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2.5 ${this.currentUser.role === 'recruiter' ? 'bg-primary/10 font-bold' : ''}">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" class="w-7 h-7 rounded-full object-cover">
              <div>
                <p class="text-xs font-semibold text-gray-800">Rohan Mehta</p>
                <p class="text-[10px] text-gray-500">Recruiter • Gurugram Tech</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Dashboard Link -->
        <a href="/dashboard.html" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors">
          <span class="material-symbols-outlined text-[18px] text-primary">dashboard</span>
          <span>Dashboard</span>
        </a>

        <!-- User Profile Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all">
            <img src="${this.currentUser.avatar || '/assets/student-portrait.png'}" class="w-9 h-9 rounded-full object-cover ring-2 ring-primary/40">
            <span class="hidden md:inline text-xs font-semibold text-gray-800 max-w-[100px] truncate">${this.currentUser.name}</span>
            <span class="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
          </button>
          <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 hidden group-hover:block z-50">
            <div class="px-3 py-2 border-b border-gray-100 mb-1">
              <p class="text-xs font-bold text-gray-900 truncate">${this.currentUser.name}</p>
              <p class="text-[11px] text-gray-500 truncate">${this.currentUser.email}</p>
              <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color}">${badge.label}</span>
            </div>
            <a href="/dashboard.html" class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-surface-container-low rounded-lg transition-colors">
              <span class="material-symbols-outlined text-[16px] text-primary">account_circle</span>
              My Dashboard
            </a>
            <button onclick="Auth.configureBackendUrl()" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <span class="material-symbols-outlined text-[16px] text-indigo-500">settings_ethernet</span>
              Set Backend URL
            </button>
            <button onclick="Auth.logout()" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <span class="material-symbols-outlined text-[16px] text-red-500">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button onclick="Auth.openAuthModal('login')" class="hidden md:inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-surface-container-low transition-colors">
          Sign In
        </button>
        <button onclick="Auth.openAuthModal('register')" class="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all">
          Get Started
        </button>
      `;
    }
  },

  setupAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 z-[9999] hidden flex items-center justify-center p-4 modal-overlay';
    modal.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative transform transition-all">
        <button onclick="Auth.closeAuthModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary text-[28px]">school</span>
            <span class="font-headline font-bold text-xl text-primary">CampusConnect</span>
          </div>
          <h3 id="auth-modal-title" class="text-xl font-bold text-gray-900">Sign in to your account</h3>
          <p id="auth-modal-sub" class="text-xs text-gray-500 mt-1">One operating system for Indian campus life</p>
        </div>

        <!-- 1-Click Demo Login Pill Buttons -->
        <div class="bg-surface-container-low rounded-2xl p-3 mb-5 border border-primary/10">
          <p class="text-[11px] font-bold text-primary uppercase tracking-wider mb-2 text-center">⚡ Instant 1-Click Demo Sign-in</p>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="Auth.switchPersona('usr_student_1'); Auth.closeAuthModal();" class="p-2 rounded-xl bg-white hover:border-primary border border-gray-200 text-center transition-all shadow-sm">
              <span class="block text-xs font-bold text-gray-800">Student</span>
              <span class="block text-[10px] text-gray-500">Aryan (DTU)</span>
            </button>
            <button onclick="Auth.switchPersona('usr_faculty_1'); Auth.closeAuthModal();" class="p-2 rounded-xl bg-white hover:border-primary border border-gray-200 text-center transition-all shadow-sm">
              <span class="block text-xs font-bold text-gray-800">Faculty</span>
              <span class="block text-[10px] text-gray-500">Prof. Ananya</span>
            </button>
            <button onclick="Auth.switchPersona('usr_recruiter_1'); Auth.closeAuthModal();" class="p-2 rounded-xl bg-white hover:border-primary border border-gray-200 text-center transition-all shadow-sm">
              <span class="block text-xs font-bold text-gray-800">Recruiter</span>
              <span class="block text-[10px] text-gray-500">Rohan Mehta</span>
            </button>
          </div>
        </div>

        <div class="relative flex py-2 items-center mb-4">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="flex-shrink mx-3 text-xs text-gray-400 font-medium">Or continue with email</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <form id="auth-form" onsubmit="Auth.handleAuthSubmit(event)" class="space-y-3.5">
          <div id="auth-name-group" class="hidden">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" id="auth-name" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Aryan Sharma">
          </div>

          <div id="auth-role-group" class="hidden">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Your Role</label>
            <select id="auth-role" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white">
              <option value="student">Student</option>
              <option value="faculty">Faculty / Campus Admin</option>
              <option value="recruiter">Recruiter / Local Business</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">College or Work Email</label>
            <input type="email" id="auth-email" required class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="aryan@campusconnect.edu">
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" id="auth-password" required class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="••••••••">
          </div>

          <button type="submit" id="auth-submit-btn" class="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-md">
            Sign In
          </button>
        </form>

        <p class="text-center text-xs text-gray-500 mt-4">
          <span id="auth-toggle-prompt">Don't have an account?</span>
          <button type="button" id="auth-toggle-btn" onclick="Auth.toggleAuthMode()" class="text-primary font-bold ml-1 hover:underline">
            Register now
          </button>
        </p>
      </div>
    `;

    document.body.appendChild(modal);
  },

  authMode: 'login',

  openAuthModal(mode = 'login') {
    this.authMode = mode;
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    this.updateAuthModalUI();
    modal.classList.remove('hidden');
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
  },

  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'register' : 'login';
    this.updateAuthModalUI();
  },

  updateAuthModalUI() {
    const isReg = this.authMode === 'register';
    document.getElementById('auth-modal-title').textContent = isReg ? 'Create your account' : 'Sign in to your account';
    document.getElementById('auth-modal-sub').textContent = isReg ? 'Join thousands of students and faculty' : 'One operating system for Indian campus life';
    document.getElementById('auth-name-group').classList.toggle('hidden', !isReg);
    document.getElementById('auth-role-group').classList.toggle('hidden', !isReg);
    document.getElementById('auth-submit-btn').textContent = isReg ? 'Create Account' : 'Sign In';
    document.getElementById('auth-toggle-prompt').textContent = isReg ? 'Already registered?' : "Don't have an account?";
    document.getElementById('auth-toggle-btn').textContent = isReg ? 'Sign in' : 'Register now';
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (this.authMode === 'register') {
      const name = document.getElementById('auth-name').value;
      const role = document.getElementById('auth-role').value;
      await this.register({ name, email, password, role });
    } else {
      await this.login(email, password);
    }
  }
};

window.Auth = Auth;
document.addEventListener('DOMContentLoaded', () => Auth.init());
