import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPayments, simulatePayment } from '../services/api';

function formatCOP(v) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
}

export default function Payments() {
  const { loanId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [form, setForm] = useState({ payment_method: 'nequi', transaction_reference: '' });
  const [error, setError] = useState('');

  const load = () => getPayments(loanId).then(r => setPayments(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, [loanId]);

  const handlePay = async (paymentId) => {
    if (!form.transaction_reference) { setError('Ingresa la referencia'); return; }
    setError('');
    try {
      await simulatePayment(paymentId, form);
      setPaying(null);
      setForm({ payment_method: 'nequi', transaction_reference: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar pago');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/loans" className="text-xl font-bold">💧 GotaAGota Bank</Link>
      </nav>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cuotas del préstamo #{loanId}</h1>
        {loading ? <p>Cargando...</p> : (
          <div className="space-y-4">
            {payments.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Cuota {p.installment_number} — {formatCOP(p.amount_due)}</p>
                    <p className="text-xs text-gray-400">Vence: {new Date(p.due_date).toLocaleDateString('es-CO')}</p>
                    {p.transaction_reference && (
                      <p className="text-xs text-gray-400">Ref: {p.transaction_reference}</p>
                    )}
                  </div>
                  <div>
                    {p.status === 'pending' ? (
                      <button onClick={() => setPaying(p.id)}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-emerald-700">
                        Pagar
                      </button>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">✓ Pagado</span>
                    )}
                  </div>
                </div>

                {paying === p.id && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <select value={form.payment_method}
                      onChange={e => setForm({ ...form, payment_method: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option value="nequi">Nequi 📱</option>
                      <option value="pse">PSE 🏦</option>
                    </select>
                    <input type="text" placeholder="Número / referencia"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={form.transaction_reference}
                      onChange={e => setForm({ ...form, transaction_reference: e.target.value })} />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => handlePay(p.id)}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
                        Confirmar pago simulado
                      </button>
                      <button onClick={() => setPaying(null)}
                        className="px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        Cancelar
                      </button>
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
