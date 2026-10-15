import { useState } from 'react';

export default function LoginPage(){
  const [email,setEmail]=useState('admin@local.com');
  const [password,setPassword]=useState('admin123');

  async function submit(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data = await res.json();
    if(data.success) window.location.href='/admin';
    else alert('Login failed')
  }

  return (
    <main className="max-w-md mx-auto py-20">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white rounded p-2">Sign In</button>
        </form>
      </div>
    </main>
  )
}
