'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  const up = () => {
    setCount(count + 1);
  }

  const down = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4x1 font-bold mb-8">Contador</h1>

      <div className='text-6x1 font-mono mb-8 text-blue-400'>
        {count}
      </div>

      <div className='flex gap-4'>
        <button
          onClick={down}
          className='px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold transition'
        >
          Diminuir -
        </button>

        <button
          onClick={up}
          className='px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition'
        >
          Aumentar +
        </button>
      </div>

      <button
        onClick={() => setCount(0)}
        className='mt-6 text-gray-400 hover:text-white underline'
      >
        Resetar
      </button>
    </main>
  );
}