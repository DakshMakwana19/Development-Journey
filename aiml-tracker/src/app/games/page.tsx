'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Keyboard, Brain, Trophy, Coins, RotateCcw, ArrowRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { awardXP } from '@/lib/game-store';
import { useReward } from '@/components/RewardPopup';

/**
 * Mini Games — Typing Speed Challenge + Memory Match
 * Rewards coins and XP for high scores.
 */

const TYPING_PROMPTS = [
  'The quick brown fox jumps over the lazy dog near the riverbank.',
  'Machine learning algorithms learn patterns from data automatically.',
  'Binary search reduces time complexity to logarithmic scale.',
  'Dynamic programming breaks problems into overlapping subproblems.',
  'Neural networks are inspired by the human brain architecture.',
  'Consistent practice is the key to mastering any skill effectively.',
  'A recursive function calls itself with a smaller subproblem.',
  'Graph algorithms explore nodes and edges in structured data.',
];

const MEMORY_EMOJIS = ['🧠', '⚡', '🔥', '💎', '🎯', '🚀', '🌟', '🎮'];

// ======================== TYPING SPEED GAME ========================

function TypingGame({ onBack }: { onBack: () => void }) {
  const reward = useReward();
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)]);
  }, []);

  const handleChange = (val: string) => {
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);

    if (val.length >= text.length) {
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const words = text.split(' ').length;
      const calcWpm = Math.round(words / elapsed);
      setWpm(calcWpm);

      let correct = 0;
      for (let i = 0; i < text.length; i++) {
        if (val[i] === text[i]) correct++;
      }
      const acc = Math.round((correct / text.length) * 100);
      setAccuracy(acc);
      setFinished(true);

      // Reward based on WPM
      const xp = Math.min(100, Math.round(calcWpm * 0.8));
      const coins = Math.round(xp * 0.3);
      const result = awardXP(xp, coins);
      reward.showXP(result.xpGained, result.coinsGained);
    }
  };

  const restart = () => {
    setText(TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)]);
    setInput('');
    setStarted(false);
    setFinished(false);
    setWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center font-medium transition-colors"
        style={{ gap: '6px', fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
        ← Back to Games
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '32px' }}>
        <div className="flex items-center" style={{ gap: '12px', marginBottom: '24px' }}>
          <div className="rounded-xl flex items-center justify-center" style={{ width: '44px', height: '44px', background: 'rgba(99,140,255,0.12)' }}>
            <Keyboard size={22} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div>
            <h2 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Typing Speed Challenge</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Type the text below as fast as you can</p>
          </div>
        </div>

        {/* Display text with character highlighting */}
        <div className="rounded-xl" style={{ padding: '24px', marginBottom: '20px', background: 'var(--bg-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          {text.split('').map((char, i) => {
            let color = 'var(--text-secondary)';
            if (i < input.length) {
              color = input[i] === char ? 'var(--accent-green)' : 'var(--accent-rose)';
            }
            return <span key={i} style={{ color, transition: 'color 0.1s' }}>{char}</span>;
          })}
        </div>

        {!finished ? (
          <input
            ref={inputRef}
            value={input}
            onChange={e => handleChange(e.target.value)}
            placeholder="Start typing here..."
            autoFocus
            className="w-full"
            style={{ fontSize: '1rem', padding: '14px 18px' }}
          />
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center" style={{ padding: '24px' }}>
            <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '24px' }}>
              <div className="rounded-xl" style={{ padding: '20px', background: 'var(--bg-tertiary)' }}>
                <p className="font-bold" style={{ fontSize: '2rem', color: 'var(--accent-blue)' }}>{wpm}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Words/min</p>
              </div>
              <div className="rounded-xl" style={{ padding: '20px', background: 'var(--bg-tertiary)' }}>
                <p className="font-bold" style={{ fontSize: '2rem', color: accuracy >= 90 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{accuracy}%</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Accuracy</p>
              </div>
            </div>
            <button onClick={restart} className="btn-primary flex items-center justify-center mx-auto" style={{ gap: '8px' }}>
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ======================== MEMORY MATCH GAME ========================

interface MemoryCard {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const reward = useReward();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const lockRef = useRef(false);

  const initGame = useCallback(() => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    lockRef.current = false;
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (id: number) => {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      const cardA = cards.find(c => c.id === a)!;
      const cardB = cards.find(c => c.id === b)!;

      if (cardA.emoji === (cards.find(c => c.id === id)?.emoji || '')) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a || c.id === b ? { ...c, matched: true } : c
          ));
          const newMatches = matches + 1;
          setMatches(newMatches);
          setFlippedIds([]);
          lockRef.current = false;

          if (newMatches + 1 >= MEMORY_EMOJIS.length) {
            setGameWon(true);
            const xp = Math.max(20, 100 - (moves * 2));
            const coins = Math.round(xp * 0.4);
            const result = awardXP(xp, coins);
            reward.showXP(result.xpGained, result.coinsGained);
          }
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center font-medium transition-colors"
        style={{ gap: '6px', fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
        ← Back to Games
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '32px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="rounded-xl flex items-center justify-center" style={{ width: '44px', height: '44px', background: 'rgba(167,139,250,0.12)' }}>
              <Brain size={22} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div>
              <h2 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Memory Match</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Find all matching pairs</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{moves} moves</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{matches}/{MEMORY_EMOJIS.length} pairs</p>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-4" style={{ gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
          {cards.map(card => (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              whileTap={{ scale: 0.95 }}
              className="aspect-square rounded-xl flex items-center justify-center transition-all"
              style={{
                fontSize: '1.6rem',
                background: card.flipped || card.matched ? 'var(--bg-tertiary)' : 'var(--bg-elevated)',
                border: `2px solid ${card.matched ? 'var(--accent-green)40' : card.flipped ? 'var(--accent-purple)40' : 'var(--border-primary)'}`,
                cursor: card.matched ? 'default' : 'pointer',
                boxShadow: card.matched ? '0 0 12px rgba(126,231,135,0.15)' : 'none',
              }}
            >
              <AnimatePresence mode="wait">
                {(card.flipped || card.matched) ? (
                  <motion.span key="emoji" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span key="hidden" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.2 }}
                    style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Win state */}
        {gameWon && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginTop: '24px' }}>
            <p className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--accent-green)', marginBottom: '8px' }}>🎉 You Win!</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Completed in {moves} moves</p>
            <button onClick={initGame} className="btn-primary flex items-center justify-center mx-auto" style={{ gap: '8px' }}>
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ======================== GAMES HUB ========================

const GAMES = [
  { id: 'typing', title: 'Typing Speed', description: 'Test your typing speed and accuracy', icon: '⌨️', color: 'var(--accent-blue)', reward: 'Up to 100 XP' },
  { id: 'memory', title: 'Memory Match', description: 'Find all matching emoji pairs', icon: '🧠', color: 'var(--accent-purple)', reward: 'Up to 100 XP' },
];

export default function GamesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <AppLayout>
      <PageHeader
        title="Mini Games"
        subtitle="Take a break and earn rewards"
        icon={<Gamepad2 size={22} className="text-white" />}
      />

      {activeGame === 'typing' && <TypingGame onBack={() => setActiveGame(null)} />}
      {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame(null)} />}

      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(game.id)}
              className="card cursor-pointer group"
              style={{ padding: '28px' }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>{game.icon}</span>
              <h3 className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>{game.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold" style={{ fontSize: '0.72rem', color: game.color }}>{game.reward}</span>
                <div className="flex items-center font-medium transition-colors group-hover:translate-x-1"
                  style={{ gap: '4px', fontSize: '0.8rem', color: game.color, transition: 'transform 0.2s' }}>
                  Play <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Coming Soon placeholder cards */}
          {['Quiz Battle', 'Reflex Game', 'Puzzle Challenge'].map((name, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="card" style={{ padding: '28px', opacity: 0.4 }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '16px' }}>🔒</span>
              <h3 className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>{name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Coming soon</p>
            </motion.div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
