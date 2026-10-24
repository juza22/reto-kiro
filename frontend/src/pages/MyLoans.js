import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyLoans } from '../services/api';

function formatCOP(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
}

const statusLabel = {
  pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  approved: { text: 'Aprobado', color: 'bg-blue-100 text-blue-700' },
  active: { text: 'Activo', color: 'bg-green-100 text-green-700' },
  paid: { text: 'Pagado', color: 'bg-gray-100 text-gray-600' },
  rejected: { text: 'Rechazado', color: 'bg-red-100 text-red-600' },
};

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLoans().then(r => setLoans(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">💧 GotaAGota Bank</Link>
        <Link to="/offers" className="text-sm text-white underline">Ver ofertas</Link>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis préstamos</h1>
        {loading ? <p className="text-gray-500">Cargando...</p> :
          loans.length === 0 ? <p className="text-gray-500">Aún no tienes préstamos.</p> :
          <div className="space-y-4">
            {loans.map(loan => {
              const s = statusLabel[loan.status] || { text: loan.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <div key={loan.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-emerald-700 text-lg">{formatCOP(loan.amount)}</p>
                    <p className="text-sm text-gray-500">Oferta #{loan.offer_id} · Solicitud #{loan.id}</p>
                    <p className="text-xs text-gray-400">{loan.payment_method?.toUpperCase()} · {loan.payment_reference}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.color}`}>{s.text}</span>
                    {loan.status === 'active' && (
                      <div>
                        <Link to={`/loans/${loan.id}/payments`}
                          className="block text-xs text-center bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700">
                          Ver cuotas
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}
