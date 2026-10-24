import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOffers } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatCOP(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
}

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getOffers().then(r => setOffers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">💧 GotaAGota Bank</Link>
        <Link to="/offers/new" className="bg-white text-emerald-700 px-4 py-1 rounded-lg font-semibold text-sm hover:bg-gray-100">
          + Publicar oferta
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ofertas disponibles</h1>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-500">No hay ofertas disponibles en este momento.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg text-emerald-700">{formatCOP(offer.available_amount)}</p>
                    <p className="text-xs text-gray-400">disponibles de {formatCOP(offer.total_amount)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    offer.status === 'open' ? 'bg-green-100 text-green-700' :
                    offer.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{offer.status}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📊 Tasa: <strong>{(offer.interest_rate * 100).toFixed(1)}%</strong> mensual</p>
                  <p>📅 Plazo: <strong>{offer.term_months} meses</strong></p>
                  <p>👤 Por: <strong>{offer.lender_name}</strong></p>
                  {offer.description && <p className="text-xs text-gray-400 mt-2">{offer.description}</p>}
                </div>
                {offer.lender_id !== user?.id && (
                  <Link to={`/offers/${offer.id}/request`}
                    className="mt-4 block text-center bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">
                    Solicitar préstamo
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
