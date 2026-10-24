import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLenderDashboard, getBorrowerDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [lender, setLender] = useState(null);
  const [borrower, setBorrower] = useState(null);

  useEffect(() => {
    getLenderDashboard().then(r => setLender(r.data)).catch(() => {});
    getBorrowerDashboard().then(r => setBorrower(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <span className="text-xl font-bold">💧 GotaAGota Bank</span>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hola, {user?.full_name}</span>
          <button onClick={logout} className="bg-white text-emerald-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100">
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '📋 Ver Ofertas', to: '/offers' },
            { label: '➕ Publicar Oferta', to: '/offers/new' },
            { label: '💳 Mis Préstamos', to: '/loans' },
            { label: '📊 Mis Ofertas', to: '/offers/mine' },
          ].map(({ label, to }) => (
            <Link key={to} to={to}
              className="bg-white rounded-xl shadow p-4 text-center font-semibold text-emerald-700 hover:bg-emerald-50 transition border border-emerald-100">
              {label}
            </Link>
          ))}
        </div>

        {/* Stats Prestamista */}
        {lender && (
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-3">Como Prestamista</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Ofertas publicadas', value: lender.total_offers },
                { label: 'Préstamos activos', value: lender.active_loans_count },
                { label: 'Total prestado', value: formatCOP(lender.total_lent_cop) },
                { label: 'Por cobrar', value: formatCOP(lender.expected_return_cop) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl shadow p-4 border-l-4 border-emerald-400">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-emerald-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Prestatario */}
        {borrower && (
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-3">Como Prestatario</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Préstamos activos', value: borrower.active_loans },
                { label: 'Préstamos pagados', value: borrower.paid_loans },
                { label: 'Cuotas pendientes', value: borrower.pending_installments },
                { label: 'Deuda total', value: formatCOP(borrower.total_debt_cop) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-400">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-blue-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
