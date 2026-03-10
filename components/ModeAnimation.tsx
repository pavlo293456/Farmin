'use client'

import { useEffect, useState } from 'react'

export type AppMode = 'farms' | 'kombucha' | 'beer'

interface ModeAnimationProps {
  mode: AppMode
  onComplete: () => void
}

export default function ModeAnimation({ mode, onComplete }: ModeAnimationProps) {
  const [phase, setPhase] = useState<'enter' | 'action' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('action'), 300)
    const t2 = setTimeout(() => setPhase('exit'), 1800)
    const t3 = setTimeout(() => onComplete(), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        transition: 'opacity 0.5s ease',
        opacity: phase === 'exit' ? 0 : 1,
      }}
    >
      {mode === 'farms'    && <FarmAnimation    phase={phase} />}
      {mode === 'kombucha' && <KombuchaAnimation phase={phase} />}
      {mode === 'beer'     && <BeerAnimation     phase={phase} />}

      <style>{`
        @keyframes leafFall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shake {
          0%,100% { transform: rotate(0deg) scale(1); }
          15%  { transform: rotate(-8deg) scale(1.05); }
          30%  { transform: rotate(8deg)  scale(1.08); }
          45%  { transform: rotate(-6deg) scale(1.05); }
          60%  { transform: rotate(6deg)  scale(1.08); }
          75%  { transform: rotate(-4deg) scale(1.05); }
          90%  { transform: rotate(4deg)  scale(1.02); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes bubbleRise {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.8; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        @keyframes fillUp {
          0%   { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0% 0 0 0); }
        }
        @keyframes foam {
          0%,100% { transform: scaleX(1); }
          50%     { transform: scaleX(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
          50%     { box-shadow: 0 0 60px rgba(255,255,255,0.7); }
        }
      `}</style>
    </div>
  )
}

// ── FARM ANIMATION ────────────────────────────────────────────────
function FarmAnimation({ phase }: { phase: string }) {
  const leaves = ['🍃', '🌿', '🍀', '🌱', '🍃', '🌿', '🍀', '🌱', '🍃', '🌿', '🍀', '🌱']
  return (
    <>
      {/* Background tint */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(45,106,79,0.15) 0%, transparent 70%)',
        transition: 'opacity 0.4s', opacity: phase === 'action' ? 1 : 0,
      }} />
      {/* Falling leaves */}
      {phase === 'action' && leaves.map((leaf, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${5 + (i * 8)}%`,
          top: '-40px',
          fontSize: `${18 + (i % 3) * 8}px`,
          animation: `leafFall ${1.2 + (i % 4) * 0.3}s ease-in forwards`,
          animationDelay: `${i * 0.08}s`,
        }}>{leaf}</div>
      ))}
      {/* Centre badge */}
      <div style={{
        background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
        borderRadius: '24px', padding: '24px 40px',
        boxShadow: '0 20px 60px rgba(45,106,79,0.5)',
        animation: phase === 'action' ? 'fadeInUp 0.4s ease forwards, pulse-glow 1s ease infinite' : undefined,
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.3s',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🌾</div>
        <div style={{ color: 'white', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>Farm Mode</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>Showing farms & markets</div>
      </div>
    </>
  )
}

// ── KOMBUCHA ANIMATION ────────────────────────────────────────────
function KombuchaAnimation({ phase }: { phase: string }) {
  const bubbles = [0, 1, 2, 3, 4, 5]
  const [popped, setPopped] = useState(false)
  useEffect(() => {
    if (phase === 'action') {
      const t = setTimeout(() => setPopped(true), 900)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(8,145,178,0.12) 0%, transparent 70%)',
        transition: 'opacity 0.4s', opacity: phase === 'action' ? 1 : 0,
      }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Bottle */}
        <div style={{
          fontSize: '80px', lineHeight: 1,
          animation: phase === 'action' && !popped
            ? 'shake 0.9s ease-in-out forwards'
            : phase === 'action' && popped
            ? 'pop 0.5s ease-out forwards'
            : undefined,
          filter: 'drop-shadow(0 8px 24px rgba(8,145,178,0.5))',
        }}>🧃</div>

        {/* Bubbles rising after pop */}
        {popped && bubbles.map(i => (
          <div key={i} style={{
            position: 'absolute',
            bottom: '60px',
            left: `${30 + i * 8}%`,
            fontSize: `${8 + (i % 3) * 4}px`,
            animation: `bubbleRise ${0.6 + i * 0.15}s ease-out forwards`,
            animationDelay: `${i * 0.08}s`,
          }}>🫧</div>
        ))}

        {/* Label */}
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
          borderRadius: '20px', padding: '16px 32px',
          boxShadow: '0 16px 48px rgba(8,145,178,0.5)',
          animation: phase === 'action' ? 'fadeInUp 0.4s 0.2s ease both' : undefined,
          opacity: phase === 'enter' ? 0 : undefined,
          textAlign: 'center',
        }}>
          <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>Kombucha Mode</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>Local fermented goodness</div>
        </div>
      </div>
    </>
  )
}

// ── BEER ANIMATION ────────────────────────────────────────────────
function BeerAnimation({ phase }: { phase: string }) {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(217,119,6,0.12) 0%, transparent 70%)',
        transition: 'opacity 0.4s', opacity: phase === 'action' ? 1 : 0,
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Beer glass fill animation */}
        <div style={{ position: 'relative', width: '100px', height: '120px' }}>
          {/* Glass outline */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '8px 8px 16px 16px',
            border: '3px solid rgba(217,119,6,0.6)',
            background: 'rgba(255,255,255,0.05)',
          }} />
          {/* Beer fill */}
          <div style={{
            position: 'absolute', bottom: '3px', left: '3px', right: '3px',
            height: 'calc(100% - 6px)',
            borderRadius: '6px 6px 13px 13px',
            background: 'linear-gradient(to top, #d97706, #fbbf24)',
            animation: phase === 'action' ? 'fillUp 1.0s ease-out 0.2s both' : undefined,
            clipPath: 'inset(100% 0 0 0)',
          }} />
          {/* Foam */}
          <div style={{
            position: 'absolute', top: '0px', left: '3px', right: '3px', height: '22px',
            borderRadius: '6px 6px 0 0',
            background: 'rgba(255,255,255,0.9)',
            animation: phase === 'action' ? 'fillUp 0.4s ease-out 1s both, foam 0.6s ease-in-out 1.2s infinite' : undefined,
            clipPath: 'inset(100% 0 0 0)',
          }} />
          {/* Glass emoji overlay for polish */}
          <div style={{
            position: 'absolute', top: '-24px', right: '-24px',
            fontSize: '40px', lineHeight: 1,
            filter: 'drop-shadow(0 4px 12px rgba(217,119,6,0.5))',
          }}>🍺</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          borderRadius: '20px', padding: '16px 32px',
          boxShadow: '0 16px 48px rgba(217,119,6,0.5)',
          animation: phase === 'action' ? 'fadeInUp 0.4s 0.3s ease both' : undefined,
          opacity: phase === 'enter' ? 0 : undefined,
          textAlign: 'center',
        }}>
          <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>Craft Beer Mode</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>Edmonton breweries</div>
        </div>
      </div>
    </>
  )
}
