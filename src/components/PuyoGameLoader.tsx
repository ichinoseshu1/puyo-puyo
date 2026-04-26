'use client';

import dynamic from 'next/dynamic';

// ssr:false は Server Component では使えないため Client Component に分離
const PuyoGame = dynamic(() => import('./PuyoGame'), { ssr: false });

export default function PuyoGameLoader() {
  return <PuyoGame />;
}
