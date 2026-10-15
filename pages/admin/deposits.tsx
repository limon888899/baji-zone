import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';

export default function Deposits() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  useEffect(()=>{
    refresh();
  },[])

  async function refresh(){
    setLoading(true);
    const r = await fetch('/api/admin/transactions');
    const data = await r.json();
    setTxs(data);
    setLoading(false);
  }

  async function approve(id:string){
    await fetch(`/api/admin/transactions`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id, status:'SUCCESS'})});
    refresh();
  }

  async function autoApprove(){
    if(!confirm('Auto-approve pending deposits older than configured minutes?')) return;
    setAutoLoading(true);
    const res = await fetch('/api/admin/auto-approve',{method:'POST'});
    const data = await res.json();
    alert(data.success ? `Approved ${data.approved} transactions` : 'Auto-approve failed');
    setAutoLoading(false);
    refresh();
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Deposits / Transactions</h2>
      <div className="mb-4 flex gap-3">
        <button onClick={refresh} className="px-3 py-2 bg-slate-200 rounded">Refresh</button>
        <button onClick={autoApprove} className="px-3 py-2 bg-green-600 text-white rounded" disabled={autoLoading}>{autoLoading? 'Approving...': 'Auto-approve pending'}</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {txs.map(tx=> (
            <div key={tx.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{tx.userId} — ${tx.amount}</div>
                <div className="text-sm text-gray-500">{tx.type} — {tx.status}</div>
              </div>
              <div>
                {tx.status==='PENDING' && <button onClick={()=>approve(tx.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
