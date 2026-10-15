import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(()=>{
    fetch('/api/admin/users').then(r=>r.json()).then(setUsers).catch(console.error)
  },[])

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u=> (
          <div key={u.id} className="bg-white p-4 rounded shadow">
            <div className="font-medium">{u.email}</div>
            <div className="text-sm text-gray-500">Role: {u.role} — Balance: ${u.balance}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
