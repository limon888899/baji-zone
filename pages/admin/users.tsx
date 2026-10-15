import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(()=>{
    fetch('/api/admin/users').then(r=>r.json()).then(setUsers).catch(console.error)
  },[])

  async function adjustBalance(userId:string){
    const amtStr = prompt('Enter amount to adjust (use negative to subtract)');
    if(!amtStr) return;
    const amt = Number(amtStr);
    if(Number.isNaN(amt)) return alert('Invalid amount');
    const reason = prompt('Reason for adjustment') || 'manual';

    const res = await fetch('/api/admin/adjust-balance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId, amount: amt, reason})});
    const data = await res.json();
    if(data.success){
      alert('Adjusted');
      // refresh users
      fetch('/api/admin/users').then(r=>r.json()).then(setUsers).catch(console.error)
    } else alert('Failed');
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u=> (
          <div key={u.id} className="bg-white p-4 rounded shadow">
            <div className="font-medium">{u.email}</div>
            <div className="text-sm text-gray-500">Role: {u.role} — Balance: ${u.balance}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>adjustBalance(u.id)} className="px-3 py-1 bg-indigo-600 text-white rounded">Adjust Balance</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
