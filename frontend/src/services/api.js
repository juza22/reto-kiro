import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_URL });

// Inyectar token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Ofertas
export const getOffers = () => api.get('/offers');
export const getMyOffers = () => api.get('/offers/mine');
export const createOffer = (data) => api.post('/offers', data);
export const getOfferDetail = (id) => api.get(`/offers/${id}`);

// Préstamos
export const requestLoan = (data) => api.post('/loans', data);
export const approveloan = (id) => api.post(`/loans/${id}/approve`);
export const getMyLoans = () => api.get('/loans/mine');
export const getLoansForOffer = (offerId) => api.get(`/loans/offer/${offerId}`);

// Pagos
export const getPayments = (loanId) => api.get(`/payments/${loanId}`);
export const simulatePayment = (paymentId, data) => api.post(`/payments/${paymentId}/pay`, data);

// Dashboard
export const getLenderDashboard = () => api.get('/dashboard/lender');
export const getBorrowerDashboard = () => api.get('/dashboard/borrower');
