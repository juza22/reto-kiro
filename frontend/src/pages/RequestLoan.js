import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOfferDetail, requestLoan } from '../services/api';

function formatCOP(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
}

export default function RequestLoan() {
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [form, setForm] = useState({ amount: '', payment_method: 'nequi', payment_reference: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOfferDetail(offerId).then(r => setOffer(r.data));
  }, [offerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestLoan({
        offer_id: parseInt(offerId),
        amount: parseFloat(form.amount),
        payment_method: form.payment_method,
        payment_reference: form.payment_reference,
      });
      navigate('/loans');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al solicitar préstamo');
    } finally {
      setLoading(false);
    }
  };

  if (!offer) return <div className="p-8 text-center text-gray-500">Cargando oferta...</div>;

  const monthlyInterest = parseFloat(form.amount) * offer.interest_rate || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4">
        <Link to="/offers" className="text-xl font-bold">💧 GotaAGota Bank</Link>
      </nav>
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Solicitar préstamo</h1>

        {/* Resumen oferta */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Prestamista:</strong> {offer.lender_name} ·
            <strong> Tasa:</strong> {(offer.interest_rate * 100).toFixed(1)}%/mes ·
            <strong> Plazo:</strong> {offer.term_months} meses ·
            <strong> Disponible:</strong> {formatCOP(offer.available_amount)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto a solicitar (máx. {formatCOP(offer.available_amount)})
              </label>
              <input type="number" min="1000" max={offer.available_amount} step="1000"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required />
              {form.amount > 0 && (
                <p className="text-xs text-emerald-600 mt-1">
                  Pagarás {formatCOP(monthlyInterest)}/mes de interés + capital en última cuota
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
              <select
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.payment_method}
                onChange={e => setForm({ ...form, payment_method: e.target.value })}>
                <option value="nequi">Nequi 📱</option>
                <option value="pse">PSE 🏦</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.payment_method === 'nequi' ? 'Número de Nequi' : 'Referencia PSE'}
              </label>
              <input type="text"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder={form.payment_method === 'nequi' ? '3001234567' : 'REF-12345'}
                value={form.payment_reference}
                onChange={e => setForm({ ...form, payment_reference: e.target.value })}
                required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
              {loading ? 'Enviando solicitud...' : 'Solicitar préstamo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
