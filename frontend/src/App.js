import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import NewOffer from './pages/NewOffer';
import MyOffers from './pages/MyOffers';
import RequestLoan from './pages/RequestLoan';
import MyLoans from './pages/MyLoans';
import Payments from './pages/Payments';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/offers" element={<PrivateRoute><Offers /></PrivateRoute>} />
          <Route path="/offers/new" element={<PrivateRoute><NewOffer /></PrivateRoute>} />
          <Route path="/offers/mine" element={<PrivateRoute><MyOffers /></PrivateRoute>} />
          <Route path="/offers/:offerId/request" element={<PrivateRoute><RequestLoan /></PrivateRoute>} />
          <Route path="/loans" element={<PrivateRoute><MyLoans /></PrivateRoute>} />
          <Route path="/loans/:loanId/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
