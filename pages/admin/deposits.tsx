import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';

export default function Deposits() {
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(()=>{
    fetch('/api/admin/transactions').then(r=>r.json()).then(setTxs).catch(console.error)
  },[])

  async function approve(id:string){
    await fetch(`/api/admin/transactions`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id, status:'SUCCESS'})});
    setTxs(txs.map(t=> t.id===id?{...t,status:'SUCCESS'}:t))
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Deposits / Transactions</h2>
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
    </AdminLayout>
  );
}
