// src/components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
// ✅ Import fungsi baru dari firebase helper
import { signInWithGooglePopup, createUser, signIn } from '@/firebase/client';
import Link from 'next/link';

// Ikon Google (tidak berubah)
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="24" height="24">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.12C34.553 5.166 29.694 3 24 3C12.955 3 4 11.955 4 23s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.553 5.166 29.694 3 24 3C16.318 3 9.656 6.915 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.382 35.049 44 30.011 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export function AuthForm() {
  // ✅ State untuk toggle form, input, loading, dan notifikasi
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Hanya untuk register
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        // --- LOGIKA REGISTER ---
        await createUser(email, password);
        // Anda bisa menambahkan logika menyimpan username ke Firestore di sini
        setSuccess('🎉 Registrasi berhasil! Anda akan diarahkan...');
        setTimeout(() => (window.location.href = '/'), 2000);
      } else {
        // --- LOGIKA LOGIN ---
        await signIn(email, password);
        setSuccess('✅ Login berhasil! Anda akan diarahkan...');
        setTimeout(() => (window.location.href = '/'), 2000);
      }
    } catch (err: any) {
      // --- PENANGANAN ERROR ---
      let message = 'Terjadi kesalahan. Silakan coba lagi.';
      switch (err.code) {
        case 'auth/weak-password':
          message = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
          break;
        case 'auth/email-already-in-use':
          message = 'Email ini sudah terdaftar. Silakan login.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Email atau password salah.';
          break;
      }
      setError(message);
      alert(message); // Tampilkan alert error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setError(null);
      await signInWithGooglePopup();
      window.location.href = '/';
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Login dengan Google gagal. Silakan coba lagi.');
      alert('Login Google gagal, cek console');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-16">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {isRegistering ? 'Create an Account' : 'Welcome back!'}
        </h1>
        <p className="text-gray-600 mb-8">
          <Link href={'/'} className="text-blue-500 hover:underline">Home</Link>
          {' | '}
          {isRegistering
            ? 'Create creative poems and short stories'
            : 'Login to continue your journey'}
        </p>

        {/* --- FORM UTAMA --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {!isRegistering && (
            <div className="text-right">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">
                Forgot Password?
              </a>
            </div>
          )}

          {/* --- NOTIFIKASI SUCCESS & ERROR --- */}
          {success && <p className="text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </Button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-200" />
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <hr className="flex-grow border-t border-gray-200" />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="social"
            aria-label="Login with Google"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="cursor-pointer"
          >
            {loadingGoogle ? 'Loading...' : <GoogleIcon />}
          </Button>
        </div>

        {/* --- TOMBOL TOGGLE --- */}
        <p className="text-center text-sm text-gray-600 mt-8">
          {isRegistering ? 'Already have an account?' : "Not a member?"}{' '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
              setSuccess(null);
            }}
            className="font-semibold text-black hover:underline focus:outline-none"
          >
            {isRegistering ? 'Login now' : 'Register now'}
          </button>
        </p>
      </div>
    </div>
  );
}