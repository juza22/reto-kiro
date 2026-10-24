import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOffers, getLoansForOffer, approveloan } from '../services/api';

function formatCOP(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
}

export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMyOffers().then(async r => {
      setOffers(r.data);
      const reqs = {};
      for (const offer of r.data) {
        try {
          const res = await getLoansForOffer(offer.id);
          reqs[offer.id] = res.data;
        } catch {}
      }
      setRequests(reqs);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (requestId) => {
    try {
      await approveloan(requestId);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al aprobar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">💧 GotaAGota Bank</Link>
        <Link to="/offers/new" className="bg-white text-emerald-700 px-4 py-1 rounded-lg font-semibold text-sm hover:bg-gray-100">
          + Nueva oferta
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis ofertas publicadas</h1>
        {loading ? <p>Cargando...</p> : offers.length === 0 ? (
          <p className="text-gray-500">No has publicado ninguna oferta aún.</p>
        ) : (
          <div className="space-y-6">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg text-emerald-700">
                      {formatCOP(offer.total_amount)} · {(offer.interest_rate * 100).toFixed(1)}%/mes · {offer.term_months} meses
                    </p>
                    <p className="text-sm text-gray-400">Disponible: {formatCOP(offer.available_amount)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full h-fit font-medium ${
                    offer.status === 'open' ? 'bg-green-100 text-green-700' :
                    offer.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{offer.status}</span>
                </div>

                {/* Solicitudes */}
                {requests[offer.id]?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Solicitudes recibidas:</p>
                    <div className="space-y-2">
                      {requests[offer.id].map(req => (
                        <div key={req.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3 text-sm">
                          <div>
                            <span className="font-medium">{req.borrower_name}</span> solicita {formatCOP(req.amount)}
                            <span className="text-xs text-gray-400 ml-2">({req.payment_method?.toUpperCase()} · {req.payment_reference})</span>
                          </div>
                          {req.status === 'pending' ? (
                            <button onClick={() => handleApprove(req.id)}
                              className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-emerald-700">
                              Aprobar
                            </button>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              req.status === 'active' ? 'bg-green-100 text-green-700' :
                              req.status === 'paid' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                            }`}>{req.status}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
