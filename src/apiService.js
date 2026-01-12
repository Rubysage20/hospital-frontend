// src/apiService.js
const API_BASE_URL = 'https://hospital-backend-production-2e60.up.railway.app/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function for fetch with auth
const authFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  console.log('Making request to:', url);
  console.log('With headers:', headers);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  console.log('Response status:', response.status);

  // Only redirect if we actually get a 401/403 AND we're trying to access protected resources
  if ((response.status === 401 || response.status === 403)) {
    console.error('Got 401/403 error. Response:', await response.text());
    
    // Don't redirect immediately - let the calling code handle empty arrays
    if (localStorage.getItem('token')) {
      console.error('Authentication failed with valid token, logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
    throw new Error('Unauthorized');
  }

  return response;
};

// API Service
export const apiService = {
  login: async (credentials) => {
    console.log('Attempting login...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      throw new Error('Login Failed');
    }

    const data = await response.json();
    console.log('Login successful, received token');
    return data;
  },

  // Doctors
  getDoctors: () => authFetch(`${API_BASE_URL}/doctors`).then(r => r.json()).catch((e) => { console.error('getDoctors error:', e); return []; }),
  createDoctor: (data) => authFetch(`${API_BASE_URL}/doctors`, { method: 'POST', body: JSON.stringify(data) }),
  updateDoctor: (id, data) => authFetch(`${API_BASE_URL}/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDoctor: (id) => authFetch(`${API_BASE_URL}/doctors/${id}`, { method: 'DELETE' }),

  // Patients
  getPatients: () => authFetch(`${API_BASE_URL}/patients`).then(r => r.json()).catch((e) => { console.error('getPatients error:', e); return []; }),
  createPatient: (data) => authFetch(`${API_BASE_URL}/patients`, { method: 'POST', body: JSON.stringify(data) }),
  updatePatient: (id, data) => authFetch(`${API_BASE_URL}/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePatient: (id) => authFetch(`${API_BASE_URL}/patients/${id}`, { method: 'DELETE' }),

  // Employees
  getEmployees: () => authFetch(`${API_BASE_URL}/employees`).then(r => r.json()).catch((e) => { console.error('getEmployees error:', e); return []; }),
  createEmployee: (data) => authFetch(`${API_BASE_URL}/employees`, { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) => authFetch(`${API_BASE_URL}/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id) => authFetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: () => authFetch(`${API_BASE_URL}/appointments`).then(r => r.json()).catch((e) => { console.error('getAppointments error:', e); return []; }),
  createAppointment: (data) => authFetch(`${API_BASE_URL}/appointments`, { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, data) => authFetch(`${API_BASE_URL}/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAppointment: (id) => authFetch(`${API_BASE_URL}/appointments/${id}`, { method: 'DELETE' }),

  // Payroll
  getPayrollSummary: () => authFetch(`${API_BASE_URL}/payroll/summary`).then(r => r.json()).catch((e) => { console.error('getPayrollSummary error:', e); return null; }),
};

export default apiService;