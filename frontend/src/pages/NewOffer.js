import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOffer } from '../services/api';

export default function NewOffer() {
  const [form, setForm] = useState({ total_amount: '', interest_rate: '', term_months: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createOffer({
        total_amount: parseFloat(form.total_amount),
        interest_rate: parseFloat(form.interest_rate) / 100,
        term_months: parseInt(form.term_months),
        description: form.description,
      });
      navigate('/offers/mine');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al publicar oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4">
        <Link to="/dashboard" className="text-xl font-bold">💧 GotaAGota Bank</Link>
      </nav>
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Publicar oferta de préstamo</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto total (COP)</label>
              <input type="number" min="50000" step="1000"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ej: 1000000"
                value={form.total_amount}
                onChange={e => setForm({ ...form, total_amount: e.target.value })}
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de interés mensual (%)</label>
              <input type="number" min="0.1" max="100" step="0.1"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ej: 3 (para 3%)"
                value={form.interest_rate}
                onChange={e => setForm({ ...form, interest_rate: e.target.value })}
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses)</label>
              <input type="number" min="1" max="24"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ej: 3"
                value={form.term_months}
                onChange={e => setForm({ ...form, term_months: e.target.value })}
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
              <textarea
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                rows={3}
                placeholder="Cuéntale a los prestatarios sobre tu oferta..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
              {loading ? 'Publicando...' : 'Publicar oferta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
