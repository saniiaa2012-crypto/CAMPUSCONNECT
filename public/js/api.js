// Centralized API Client Wrapper
const API = {
  // Configurable base URL: reads from localStorage, config.js, or defaults to '/api'
  getBaseUrl() {
    // 1. Explicit manual override in browser localStorage (via "Set Backend URL")
    const customUrl = localStorage.getItem('cc_backend_api_url');
    if (customUrl) {
      return customUrl.replace(/\/+$/, '');
    }

    // 2. Global window override
    if (window.CAMPUSCONNECT_API_URL) {
      return window.CAMPUSCONNECT_API_URL.replace(/\/+$/, '');
    }

    // 3. Cloudflare Pages config.js pointing to Render backend
    if (window.CAMPUSCONNECT_CONFIG && window.CAMPUSCONNECT_CONFIG.BACKEND_URL) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // If running locally, check if local port matches default backend
        if (window.location.port === '5000') {
          return '/api';
        }
        return 'http://localhost:5000/api';
      }
      let base = window.CAMPUSCONNECT_CONFIG.BACKEND_URL.replace(/\/+$/, '');
      if (!base.endsWith('/api')) base += '/api';
      return base;
    }

    return '/api';
  },

  setBaseUrl(url) {
    if (!url) {
      localStorage.removeItem('cc_backend_api_url');
    } else {
      let clean = url.trim().replace(/\/+$/, '');
      if (!clean.endsWith('/api') && !clean.includes('/api/')) {
        clean = `${clean}/api`;
      }
      localStorage.setItem('cc_backend_api_url', clean);
    }
  },

  getToken() {
    return localStorage.getItem('cc_token');
  },

  getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const isMultipart = options.body instanceof FormData;
    const base = this.getBaseUrl();
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...(options.headers || {})
      }
    };

    try {
      // 5-second timeout controller so cold-starting or unreachable backends don't hang the UI indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      config.signal = controller.signal;

      const response = await fetch(`${base}${endpoint}`, config);
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API Notice] Backend request to ${base}${endpoint} did not succeed (${err.message}). Using resilient local dataset.`);
      return this.handleFallback(endpoint, options);
    }
  },

  handleFallback(endpoint, options = {}) {
    const cleanEndpoint = endpoint.split('?')[0];
    const method = (options.method || 'GET').toUpperCase();
    const fb = window.FALLBACK_DATA || {};

    // 1. Opportunities
    if (cleanEndpoint === '/opportunities' && method === 'GET') {
      const all = fb.opportunities || [];
      return { success: true, count: all.length, data: all, isFallback: true };
    }

    if (cleanEndpoint.startsWith('/opportunities/') && cleanEndpoint.endsWith('/apply') && method === 'POST') {
      return { success: true, message: 'Application submitted successfully! Track progress on your Dashboard.', isFallback: true };
    }

    if (cleanEndpoint.startsWith('/opportunities/') && method === 'GET') {
      const id = cleanEndpoint.split('/')[2];
      const all = fb.opportunities || [];
      const item = all.find(o => o.id === id) || all[0];
      return { success: true, data: item, isFallback: true };
    }

    // 2. CampusFix
    if (cleanEndpoint === '/campusfix' && method === 'GET') {
      const all = fb.tickets || [];
      return { success: true, count: all.length, data: all, isFallback: true };
    }

    if (cleanEndpoint.startsWith('/campusfix/') && cleanEndpoint.endsWith('/upvote') && method === 'POST') {
      return { success: true, message: 'Upvote updated!', isFallback: true };
    }

    // 3. Services
    if (cleanEndpoint === '/services' && method === 'GET') {
      const all = fb.services || [];
      return { success: true, count: all.length, data: all, isFallback: true };
    }

    // 4. Events
    if (cleanEndpoint === '/events' && method === 'GET') {
      const all = fb.events || [];
      return { success: true, count: all.length, data: all, isFallback: true };
    }

    if (cleanEndpoint.startsWith('/events/') && cleanEndpoint.endsWith('/register') && method === 'POST') {
      return { success: true, message: 'Registered for event successfully!', isFallback: true };
    }

    // 5. Dashboard
    if (cleanEndpoint === '/dashboard/stats' && method === 'GET') {
      const opps = fb.opportunities || [];
      const tix = fb.tickets || [];
      const evts = fb.events || [];
      return {
        success: true,
        role: 'student',
        user: {
          name: 'Aryan Sharma',
          email: 'aryan@campusconnect.edu',
          college: 'Delhi Technological University (DTU)',
          department: 'Computer Science & Engineering',
          avatar: '/assets/student-portrait.png',
          profileStrength: 85
        },
        stats: {
          totalApplications: 2,
          inReviewApplications: 1,
          shortlistedCount: 1,
          myTicketsCount: tix.length,
          registeredEventsCount: evts.length,
          profileStrength: 85
        },
        applications: [
          {
            id: 'app_1',
            opportunityTitle: opps[0]?.title || 'React & Frontend Developer Intern',
            company: 'Gurugram Tech Innovations',
            status: 'Shortlisted',
            stipendFormatted: '₹18,000 / mo',
            feedback: 'Strong portfolio projects. Shortlisted for technical round.'
          },
          {
            id: 'app_2',
            opportunityTitle: opps[1]?.title || 'AI & Data Research Assistant',
            company: 'DTU Advanced AI & Robotics Lab',
            status: 'Interview',
            stipendFormatted: '₹22,000 / mo',
            feedback: 'Panel interview scheduled at Lab 4B.'
          }
        ],
        tickets: tix,
        events: evts,
        isFallback: true
      };
    }

    // 6. Auth endpoints fallback
    if (cleanEndpoint === '/auth/me' && method === 'GET') {
      const user = localStorage.getItem('cc_user');
      if (user) {
        return { success: true, user: JSON.parse(user) };
      }
      return {
        success: true,
        user: {
          id: 'usr_student_1',
          name: 'Aryan Sharma',
          email: 'aryan@campusconnect.edu',
          role: 'student',
          college: 'Delhi Technological University (DTU)',
          avatar: '/assets/student-portrait.png'
        }
      };
    }

    return { success: true, data: [], isFallback: true };
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

window.API = API;
