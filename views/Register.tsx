import React, { useState } from 'react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../src/services/api';

interface RegisterProps {
  setCurrentView: (view: View) => void;
}

const Register: React.FC<RegisterProps> = ({ setCurrentView }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'umkm_owner' | 'customer'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const { register } = useAuth();

  const validateForm = () => {
    const errors = { displayName: '', email: '', password: '', confirmPassword: '', role: '' };
    let isValid = true;

    if (displayName.trim().length < 3) {
      errors.displayName = 'Nama harus diisi (minimal 3 karakter).';
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format email tidak valid.';
      isValid = false;
    }

    if (password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter.';
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = 'Kata sandi harus mengandung setidaknya satu huruf besar.';
      isValid = false;
    } else if (!/(?=.*\d)/.test(password)) {
      errors.password = 'Kata sandi harus mengandung setidaknya satu angka.';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
      isValid = false;
    }

    if (!selectedRole) {
      errors.role = 'Pilih jenis akun yang sesuai.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await register(displayName, email, password, selectedRole);
      // onAuthStateChanged in AuthContext will handle redirect
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan masuk.');
      } else {
        setError('Gagal mendaftar. Silakan coba lagi.');
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-xl font-bold text-gray-800 cursor-pointer" onClick={() => setCurrentView(View.Home)}>Kampung Digital</h1>
          <p className="text-center text-sm font-medium text-gray-500 leading-tight">Tangerang Selatan</p>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Buat akun baru
          </h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p role="alert" className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</p>}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Nama Lengkap / Nama Usaha</label>
              <input id="displayName" name="displayName" type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              {formErrors.displayName && <p className="text-red-500 text-xs mt-1">{formErrors.displayName}</p>}
            </div>
            <div>
              <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Alamat Email</label>
              <input id="email-register" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <input id="password-register" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
              <input id="confirm-password" name="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
            </div>
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Jenis Akun</label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="role-customer"
                    name="role"
                    type="radio"
                    value="customer"
                    checked={selectedRole === 'customer'}
                    onChange={(e) => setSelectedRole(e.target.value as 'customer')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="role-customer" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-green-600 mr-2">shopping_cart</span>
                      <div>
                        <div className="font-semibold">Customer</div>
                        <div className="text-xs text-gray-500">Untuk berbelanja produk UMKM di TangselMart</div>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="role-umkm"
                    name="role"
                    type="radio"
                    value="umkm_owner"
                    checked={selectedRole === 'umkm_owner'}
                    onChange={(e) => setSelectedRole(e.target.value as 'umkm_owner')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="role-umkm" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-blue-600 mr-2">storefront</span>
                      <div>
                        <div className="font-semibold">UMKM Owner</div>
                        <div className="text-xs text-gray-500">Untuk menjual produk dan mengelola bisnis</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button onClick={() => setCurrentView(View.Login)} className="font-medium text-blue-600 hover:text-blue-500">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;