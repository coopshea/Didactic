'use client';

import { Auth } from '../../components/Auth';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 transition-colors duration-200">
      <h1 className="text-4xl font-bold mb-12">Authentication</h1>
      <Auth />
    </div>
  );
}