import dynamic from 'next/dynamic';

// ssr:false でゲームをクライアント専用にする（Math.random()のハイドレーションミスマッチ回避）
const PuyoGame = dynamic(() => import('@/components/PuyoGame'), { ssr: false });

export default function Home() {
  return <PuyoGame />;
}
