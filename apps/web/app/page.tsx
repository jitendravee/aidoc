import { Hero } from '@/components/home/hero';
import React from 'react'

export default function Page() {
  return (
    <main className="w-full">
      <div className="max-w-360 mx-auto px-30 py-8">
        <Hero />
      </div>
    </main>
  );
}