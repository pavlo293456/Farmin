'use client'

import { useEffect, useState, useRef } from 'react'

export type AppMode = 'farms' | 'kombucha' | 'beer'

interface ModeAnimationProps {
  mode: AppMode
  onComplete: () => void
}

export default function ModeAnimation({ mode, onComplete }: ModeAnimationProps) {
  const [phase, setPhase] = useState<'enter' | 'action' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('action'), 200)
    const t2 = setTimeout(() => setPhase('exit'), mode === 'kombucha' ? 3200 : 1800)
    const t3 = setTimeout(() => onComplete(), mode === 'kombucha' ? 3800 : 2400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete, mode])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      transition: 'opacity 0.6s ease',
      opacity: phase === 'exit' ? 0 : 1,
    }}>
      {mode === 'farms'    && <FarmAnimation    phase={phase} />}
      {mode === 'kombucha' && <KombuchaParty    phase={phase} />}
      {mode === 'beer'     && <BeerAnimation    phase={phase} />}

      <style>{`
        @keyframes leafFall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
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

        /* ── KOMBUCHA PARTY KEYFRAMES ── */
        @keyframes partyBg {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bottleBounce {
          0%,100% { transform: translateY(0)    rotate(-3deg) scale(1);    }
          20%     { transform: translateY(-30px) rotate(5deg)  scale(1.1);  }
          40%     { transform: translateY(-10px) rotate(-5deg) scale(1.05); }
          60%     { transform: translateY(-25px) rotate(4deg)  scale(1.08); }
          80%     { transform: translateY(-5px)  rotate(-3deg) scale(1.03); }
        }
        @keyframes bottleSpin {
          0%   { transform: rotate(0deg)   scale(1); }
          100% { transform: rotate(720deg) scale(1.2); }
        }
        @keyframes pop {
          0%   { transform: scale(1);   opacity: 1; }
          40%  { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(3);   opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg)   translateX(0);    opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg) translateX(var(--drift)); opacity: 0; }
        }
        @keyframes bubbleFloat {
          0%   { transform: translateY(0)     scale(1)    rotate(0deg);   opacity: 0.9; }
          50%  { transform: translateY(-40px) scale(1.1)  rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(-90px) scale(0.5)  rotate(360deg); opacity: 0;   }
        }
        @keyframes textParty {
          0%,100% { transform: scale(1)    rotate(0deg);  color: #06b6d4; }
          16%     { transform: scale(1.1)  rotate(-3deg); color: #f59e0b; }
          33%     { transform: scale(0.95) rotate(2deg);  color: #ec4899; }
          50%     { transform: scale(1.12) rotate(-2deg); color: #8b5cf6; }
          66%     { transform: scale(0.97) rotate(3deg);  color: #10b981; }
          83%     { transform: scale(1.08) rotate(-1deg); color: #f97316; }
        }
        @keyframes starSpin {
          0%   { transform: rotate(0deg)   scale(0); opacity: 0; }
          30%  { transform: rotate(180deg) scale(1.2); opacity: 1; }
          70%  { transform: rotate(360deg) scale(1);   opacity: 1; }
          100% { transform: rotate(540deg) scale(0);   opacity: 0; }
        }
        @keyframes rainbowBorder {
          0%   { border-color: #06b6d4; box-shadow: 0 0 30px #06b6d4; }
          16%  { border-color: #f59e0b; box-shadow: 0 0 40px #f59e0b; }
          33%  { border-color: #ec4899; box-shadow: 0 0 30px #ec4899; }
          50%  { border-color: #8b5cf6; box-shadow: 0 0 40px #8b5cf6; }
          66%  { border-color: #10b981; box-shadow: 0 0 30px #10b981; }
          83%  { border-color: #f97316; box-shadow: 0 0 40px #f97316; }
          100% { border-color: #06b6d4; box-shadow: 0 0 30px #06b6d4; }
        }
        @keyframes disco {
          0%   { background: radial-gradient(circle at 20% 30%, rgba(6,182,212,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.2), transparent 50%); }
          25%  { background: radial-gradient(circle at 70% 20%, rgba(236,72,153,0.25), transparent 50%), radial-gradient(circle at 30% 80%, rgba(139,92,246,0.2), transparent 50%); }
          50%  { background: radial-gradient(circle at 50% 60%, rgba(16,185,129,0.25), transparent 50%), radial-gradient(circle at 50% 20%, rgba(249,115,22,0.2), transparent 50%); }
          75%  { background: radial-gradient(circle at 80% 40%, rgba(6,182,212,0.25), transparent 50%), radial-gradient(circle at 20% 60%, rgba(245,158,11,0.2), transparent 50%); }
          100% { background: radial-gradient(circle at 20% 30%, rgba(6,182,212,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.2), transparent 50%); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-8deg); }
          50%     { transform: rotate(8deg);  }
        }
        @keyframes floatAround {
          0%   { transform: translate(0, 0)      rotate(0deg);   }
          25%  { transform: translate(20px, -30px) rotate(90deg);  }
          50%  { transform: translate(-15px,-50px) rotate(180deg); }
          75%  { transform: translate(25px, -20px) rotate(270deg); }
          100% { transform: translate(0, 0)      rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ── KOMBUCHA PARTY ─────────────────────────────────────────────────
function KombuchaParty({ phase }: { phase: string }) {
  const [popped, setPopped] = useState(false)
  const [showParty, setShowParty] = useState(false)

  useEffect(() => {
    if (phase === 'action') {
      setTimeout(() => setPopped(true), 1000)
      setTimeout(() => setShowParty(true), 1200)
    }
  }, [phase])

  const confettiItems = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    emoji: ['🧃', '🫧', '✨', '🌟', '💫', '🎉', '🎊', '🫧', '⭐', '🌈'][i % 10],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${1.5 + Math.random() * 2}s`,
    drift: `${(Math.random() - 0.5) * 120}px`,
    size: `${14 + Math.floor(Math.random() * 20)}px`,
  }))

  const floatingBubbles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${5 + i * 6}%`,
    bottom: `${10 + Math.random() * 30}%`,
    delay: `${Math.random() * 1}s`,
    size: `${10 + Math.floor(Math.random() * 18)}px`,
    duration: `${1 + Math.random() * 1.5}s`,
  }))

  const orbitingEmojis = ['🍋', '🫐', '🍓', '🍵', '🌿', '🍯']

  return (
    <>
      {/* Full screen disco background */}
      <div style={{
        position: 'fixed', inset: 0,
        animation: phase === 'action' ? 'disco 0.8s ease-in-out infinite' : undefined,
        transition: 'opacity 0.3s',
        opacity: phase === 'action' ? 1 : 0,
      }} />

      {/* Confetti rain */}
      {showParty && confettiItems.map((c) => (
        <div key={c.id} style={{
          position: 'fixed', top: '-30px', left: c.left,
          fontSize: c.size,
          animation: `confettiFall ${c.duration} ease-in forwards`,
          animationDelay: c.delay,
          '--drift': c.drift,
          zIndex: 9998,
        } as React.CSSProperties}>{c.emoji}</div>
      ))}

      {/* Floating bubbles from bottom */}
      {showParty && floatingBubbles.map((b) => (
        <div key={b.id} style={{
          position: 'fixed', left: b.left, bottom: b.bottom,
          fontSize: b.size,
          animation: `bubbleFloat ${b.duration} ease-out infinite`,
          animationDelay: b.delay,
        }}>🫧</div>
      ))}

      {/* Centre stage */}
      <div style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px', zIndex: 10000,
      }}>

        {/* Orbiting flavour emojis */}
        {showParty && orbitingEmojis.map((emoji, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '180px', height: '180px',
            top: '50%', left: '50%',
            marginTop: '-90px', marginLeft: '-90px',
            animation: `floatAround ${2 + i * 0.3}s linear infinite`,
            animationDelay: `${i * 0.3}s`,
          }}>
            <div style={{
              position: 'absolute',
              top: `${50 + 45 * Math.sin(i * Math.PI / 3)}%`,
              left: `${50 + 45 * Math.cos(i * Math.PI / 3)}%`,
              fontSize: '22px',
              transform: 'translate(-50%,-50%)',
              animation: 'wiggle 0.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }}>{emoji}</div>
          </div>
        ))}

        {/* THE BOTTLE */}
        <div style={{
          fontSize: '90px', lineHeight: 1,
          filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.8))',
          animation: phase === 'action' && !popped
            ? 'bottleBounce 1.0s ease-in-out infinite'
            : popped
            ? 'bottleSpin 0.8s ease-out forwards'
            : undefined,
          position: 'relative', zIndex: 10001,
        }}>🧃</div>

        {/* Stars burst on pop */}
        {popped && Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: '24px',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) translate(${Math.cos(i * Math.PI / 4) * 80}px, ${Math.sin(i * Math.PI / 4) * 80}px)`,
            animation: 'starSpin 1s ease-out forwards',
            animationDelay: `${i * 0.06}s`,
          }}>{'⭐🌟✨💫🎊🎉🫧🌈'[i]}</div>
        ))}

        {/* Party card */}
        {showParty && (
          <div style={{
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #67e8f9 100%)',
            borderRadius: '24px',
            padding: '20px 40px',
            border: '3px solid #06b6d4',
            animation: 'rainbowBorder 0.6s linear infinite, fadeInUp 0.4s ease forwards',
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              fontSize: '26px', fontWeight: 900,
              letterSpacing: '-0.5px',
              animation: 'textParty 0.6s linear infinite',
              marginBottom: '4px',
            }}>
              🎉 KOMBUCHA PARTY MODE 🎉
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
              the gut is about to party 🫧✨
            </div>

            {/* Wiggling mini bottles */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              {['🧃','🧃','🧃','🧃','🧃'].map((b, i) => (
                <span key={i} style={{
                  fontSize: '20px',
                  display: 'inline-block',
                  animation: 'wiggle 0.3s ease-in-out infinite',
                  animationDelay: `${i * 0.08}s`,
                }}>{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ── FARM ANIMATION ────────────────────────────────────────────────
function FarmAnimation({ phase }: { phase: string }) {
  const leaves = ['🍃','🌿','🍀','🌱','🍃','🌿','🍀','🌱','🍃','🌿','🍀','🌱']
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(45,106,79,0.15) 0%, transparent 70%)',
        transition: 'opacity 0.4s', opacity: phase === 'action' ? 1 : 0,
      }} />
      {phase === 'action' && leaves.map((leaf, i) => (
        <div key={i} style={{
          position: 'fixed', left: `${5 + i * 8}%`, top: '-40px',
          fontSize: `${18 + (i % 3) * 8}px`,
          animation: `leafFall ${1.2 + (i % 4) * 0.3}s ease-in forwards`,
          animationDelay: `${i * 0.08}s`,
        }}>{leaf}</div>
      ))}
      <div style={{
        background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
        borderRadius: '24px', padding: '24px 40px',
        boxShadow: '0 20px 60px rgba(45,106,79,0.5)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.3s',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🌾</div>
        <div style={{ color: 'white', fontWeight: 800, fontSize: '22px' }}>Farm Mode</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>Showing farms & markets</div>
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
        <div style={{ position: 'relative', width: '100px', height: '120px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '8px 8px 16px 16px',
            border: '3px solid rgba(217,119,6,0.6)', background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', bottom: '3px', left: '3px', right: '3px',
            height: 'calc(100% - 6px)', borderRadius: '6px 6px 13px 13px',
            background: 'linear-gradient(to top, #d97706, #fbbf24)',
            animation: phase === 'action' ? 'fillUp 1.0s ease-out 0.2s both' : undefined,
            clipPath: 'inset(100% 0 0 0)',
          }} />
          <div style={{
            position: 'absolute', top: '0px', left: '3px', right: '3px', height: '22px',
            borderRadius: '6px 6px 0 0', background: 'rgba(255,255,255,0.9)',
            animation: phase === 'action' ? 'fillUp 0.4s ease-out 1s both, foam 0.6s ease-in-out 1.2s infinite' : undefined,
            clipPath: 'inset(100% 0 0 0)',
          }} />
          <div style={{ position: 'absolute', top: '-24px', right: '-24px', fontSize: '40px', lineHeight: 1 }}>🍺</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          borderRadius: '20px', padding: '16px 32px',
          boxShadow: '0 16px 48px rgba(217,119,6,0.5)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.3s 0.3s',
          textAlign: 'center',
        }}>
          <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>Craft Beer Mode</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>Edmonton breweries</div>
        </div>
      </div>
    </>
  )
}
