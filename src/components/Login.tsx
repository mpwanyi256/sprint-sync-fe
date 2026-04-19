'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, selectAuthLoading } from '@/store/slices/auth';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Pane - Form */}
      <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          <div className='flex flex-col items-center lg:items-start'>
            <div className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600'>
                <Image
                  src='/icon/logo.svg'
                  alt='SprintSync Logo'
                  width={24}
                  height={24}
                  className='h-6 w-6 brightness-0 invert'
                  priority
                />
              </div>
              <span className='text-2xl font-bold tracking-tight text-gray-900'>
                SprintSync
              </span>
            </div>
            <h2 className='mt-8 text-2xl font-semibold leading-9 tracking-tight text-gray-900'>
              Welcome back
            </h2>
            <p className='mt-2 text-sm leading-6 text-gray-500'>
              Enter your details to access your account.
            </p>
          </div>

          <div className='mt-10'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 outline-none'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Password
                  </label>
                  <div className='text-sm'>
                    <a
                      href='#'
                      className='font-semibold text-blue-600 hover:text-blue-500 transition-colors'
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200 outline-none'
                    placeholder='••••••••'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                >
                  {loading ? (
                    <Loader2 className='h-5 w-5 animate-spin' />
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Pane - Visuals */}
      <div className='relative hidden w-0 flex-1 lg:block overflow-hidden bg-slate-900'>
        {/* Decorative background elements */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-90' />
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80")] bg-cover bg-center mix-blend-overlay opacity-40' />

        {/* Glassmorphism content */}
        <div className='absolute inset-0 flex flex-col justify-center items-center p-12'>
          <div className='max-w-lg rounded-2xl bg-white/10 p-10 backdrop-blur-lg border border-white/20 shadow-2xl'>
            <h2 className='text-3xl font-bold text-white mb-6'>
              Streamline your workflow
            </h2>
            <p className='text-lg text-blue-100 leading-relaxed'>
              Join the new generation of agile teams. SprintSync provides you
              with all the tools you need to manage sprints, collaborate
              seamlessly, and ship faster.
            </p>
            <div className='mt-8 flex items-center gap-4'>
              <div className='flex -space-x-3'>
                <div className='h-10 w-10 rounded-full border-2 border-indigo-500 bg-indigo-400' />
                <div className='h-10 w-10 rounded-full border-2 border-indigo-500 bg-blue-400' />
                <div className='h-10 w-10 rounded-full border-2 border-indigo-500 bg-purple-400' />
              </div>
              <p className='text-sm font-medium text-white'>
                Designed for small to medium teams who want to level up their
                agile game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
