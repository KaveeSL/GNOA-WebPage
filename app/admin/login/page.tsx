"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AnimatedContent from '@/components/animated-content';
import CustomIcon from '@/components/custom-icon';
import { LockIcon, ShieldCheckIcon, SparkleIcon } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth/verify')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          router.push('/admin/dashboard');
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        // Show detailed error message if available
        const errorMsg = data.message 
          ? `${data.error}: ${data.message}` 
          : data.error || 'Login failed';
        setError(errorMsg);
      }
    } catch (error) {
      setError('An error occurred. Please try again. Check your server logs for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <AnimatedContent distance={30} delay={0.1} className="mb-8 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/assets/gnoalogo.png" alt="GNOA Logo" width={50} height={50} className="h-12 w-auto" />
                <div className="p-4 rounded-full bg-white/50 backdrop-blur-md" style={{ backgroundColor: 'rgba(118, 39, 39, 0.1)' }}>
                  <ShieldCheckIcon size={32} style={{ color: '#762727' }} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: '#762727' }}>
                  GNOA Admin
                </h1>
                <p className="text-zinc-500 text-sm">Secure access to content management</p>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={30} delay={0.2}>
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-6 md:p-8 border-2 transition-all duration-300 hover:shadow-xl" style={{ borderColor: '#762727' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all pl-10"
                      style={{ borderColor: '#762727' }}
                      placeholder="Enter your username"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <SparkleIcon size={18} style={{ color: '#762727', opacity: 0.6 }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all pl-10"
                      style={{ borderColor: '#762727' }}
                      placeholder="Enter your password"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <LockIcon size={18} style={{ color: '#762727', opacity: 0.6 }} />
                    </div>
                  </div>
                </div>

                {error && (
                  <AnimatedContent>
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon size={16} />
                        <span>{error}</span>
                      </div>
                    </div>
                  </AnimatedContent>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#762727' }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon size={18} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={30} delay={0.3} className="mt-6 text-center">
            <p className="text-xs text-zinc-500">
              Government Nursing Officers' Association
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              © 2026 GNOA. All rights reserved.
            </p>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
