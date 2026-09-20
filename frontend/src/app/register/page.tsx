"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
