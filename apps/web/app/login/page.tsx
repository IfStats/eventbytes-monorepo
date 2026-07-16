'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Yesterday's logic: Manual email/password sign-in
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (!error) {
      router.push('/dashboard')
      router.refresh() // Helps ensure the session cookie is picked up
    } else {
      alert(error.message)
    }
  }

  return (
    // Revert your CSS/Layout back to the previous design here
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 border rounded shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4">Organizer Login</h1>
        <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-2 mb-2 border" 
            onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 mb-4 border" 
            onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Sign In
        </button>
      </form>
    </div>
  )
}
