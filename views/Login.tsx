import React, { useState } from 'react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  setCurrentView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({ email: '' });

    if (!/\S+@\S+\.\S+/.test(email)) {
        setFormErrors({ email: 'Format email tidak valid.' });
        return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // onAuthStateChanged in AuthContext will handle redirect
    } catch (err: any) {
      setError('Email atau kata sandi salah.');
      console.error(err);
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
        await signInWithGoogle();
    } catch (err: any) {
        setError('Gagal masuk dengan Google. Silakan coba lagi.');
        console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-xl font-bold text-gray-800 cursor-pointer" onClick={() => setCurrentView(View.Home)}>Kampung Digital</h1>
          <p className="text-center text-sm font-medium text-gray-500 leading-tight">Tangerang Selatan</p>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke akun Anda
          </h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <p role="alert" className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</p>}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                    <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <button type="button" className="font-medium text-blue-600 hover:text-blue-500">Lupa kata sandi?</button>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </div>
            </form>
             <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
                    </div>
                </div>
                <div className="mt-6">
                    <button onClick={handleGoogleSignIn} disabled={loading}
                        className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Sign in with Google</span>
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.23,4.14-4.082,5.571l6.19,5.238C42.02,35.622,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                        Google
                    </button>
                </div>
            </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <button onClick={() => setCurrentView(View.Register)} className="font-medium text-blue-600 hover:text-blue-500">
            Daftar sekarang
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;