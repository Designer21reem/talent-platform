'use client';

import { motion } from 'framer-motion';
import { Upload, User, Building2, Sparkles, FolderGit2, FileText, CheckCircle2, Target } from 'lucide-react';

// Deterministic (not Math.random) so server and client render identical
// markup on first paint — avoids a hydration mismatch.
function seeded(count, fn) {
  return Array.from({ length: count }, (_, i) => fn(i));
}

const BUBBLES = seeded(16, (i) => ({
  id: i,
  left: (i * 47) % 100,
  size: 3 + (i % 4),
  delay: (i * 0.65) % 10,
  duration: 10 + (i % 5) * 1.6,
  rise: 480 + (i % 4) * 60,
}));

function RisingBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BUBBLES.map((b) => (
        <motion.span
          key={b.id}
          className="absolute rounded-full bg-brand"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, bottom: 0 }}
          animate={{ y: [0, -b.rise], opacity: [0, 0.9, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// Upload CV — one or two large, soft upload glyphs breathing in place
// rather than a swarm of particles; calmer, on-theme for "drop a file here".
const UPLOAD_ICONS = [
  { left: 12, top: 22, size: 64, delay: 0 },
  { left: 82, top: 62, size: 48, delay: 1.4 },
];

function UploadPulse() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {UPLOAD_ICONS.map((u, i) => (
        <motion.div
          key={i}
          className="absolute text-brand"
          style={{ left: `${u.left}%`, top: `${u.top}%` }}
          animate={{ opacity: [0.08, 0.22, 0.08], scale: [0.9, 1.05, 0.9], y: [0, -12, 0] }}
          transition={{ duration: 6, delay: u.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Upload size={u.size} />
        </motion.div>
      ))}
    </div>
  );
}

// CV Builder — faint drifting labels for the fields a candidate is about to
// fill in, so the background quietly previews the page's purpose.
const CV_WORDS = [
  { word: 'Name', icon: User, left: 8, top: 18, delay: 0, duration: 12 },
  { word: 'Company', icon: Building2, left: 78, top: 14, delay: 1.5, duration: 14 },
  { word: 'Skills', icon: Sparkles, left: 20, top: 68, delay: 3, duration: 13 },
  { word: 'Project', icon: FolderGit2, left: 65, top: 72, delay: 4.5, duration: 15 },
  { word: 'Experience', icon: FileText, left: 45, top: 12, delay: 2.2, duration: 16 },
  { word: 'CV', icon: FileText, left: 90, top: 45, delay: 6, duration: 11 },
];

function FloatingCVWords() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {CV_WORDS.map((w, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center gap-2 text-brand font-semibold whitespace-nowrap"
          style={{ left: `${w.left}%`, top: `${w.top}%`, fontSize: 19 }}
          animate={{ opacity: [0, 0.4, 0], y: [0, -30, -60] }}
          transition={{ duration: w.duration, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <w.icon size={18} />
          {w.word}
        </motion.div>
      ))}
    </div>
  );
}

// Assessment — slow-pulsing check/target rings, evoking skills being
// measured and validated.
const ASSESSMENT_ICONS = [
  { icon: CheckCircle2, left: 14, top: 24, size: 40, delay: 0 },
  { icon: Target, left: 84, top: 20, size: 46, delay: 1.2 },
  { icon: CheckCircle2, left: 76, top: 70, size: 32, delay: 2.4 },
  { icon: Target, left: 22, top: 66, size: 30, delay: 3.6 },
];

function AssessmentPulse() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ASSESSMENT_ICONS.map((a, i) => (
        <motion.div
          key={i}
          className="absolute text-brand"
          style={{ left: `${a.left}%`, top: `${a.top}%` }}
          animate={{ opacity: [0.06, 0.2, 0.06], scale: [1, 1.15, 1] }}
          transition={{ duration: 5.5, delay: a.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <a.icon size={a.size} />
        </motion.div>
      ))}
    </div>
  );
}

function ScanlineSweep() {
  return (
    <motion.div
      className="absolute inset-y-0 w-32 -skew-x-12 pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(201,155,37,0.16), transparent)' }}
      animate={{ left: ['-15%', '115%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
    />
  );
}

// Sign-in screen — two beams sweep toward each other from opposite edges;
// since both cover the same distance in the same linear-eased duration,
// they meet at the midpoint exactly halfway through each cycle, which is
// when CrossBurst below is timed to scatter.
const CROSS_CYCLE = 6;

function CrossingScanlines() {
  return (
    <>
      <motion.div
        className="absolute inset-y-0 w-28 -skew-x-12 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,155,37,0.2), transparent)' }}
        animate={{ left: ['-15%', '115%'] }}
        transition={{ duration: CROSS_CYCLE, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-y-0 w-28 skew-x-12 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(228,182,56,0.2), transparent)' }}
        animate={{ left: ['115%', '-15%'] }}
        transition={{ duration: CROSS_CYCLE, repeat: Infinity, ease: 'linear' }}
      />
    </>
  );
}

const BURST_PARTICLES = seeded(12, (i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 70 + (i % 3) * 30;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    size: 3 + (i % 3),
  };
});

// Fires a ring of particles from the center, timed to the moment the two
// scanlines above cross — scatters outward and fades, then waits for the
// next crossing.
function CrossBurst() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BURST_PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-brand-light"
          style={{ left: '50%', top: '50%', width: p.size, height: p.size }}
          animate={{ x: [0, p.dx], y: [0, p.dy], opacity: [0, 1, 0], scale: [0.4, 1, 0.3] }}
          transition={{
            duration: 1.3,
            delay: CROSS_CYCLE / 2,
            repeat: Infinity,
            repeatDelay: CROSS_CYCLE - 1.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Soft diagonal gold ribbons with a shimmer of light traveling down each —
// the "luxurious" backdrop feel, built from our own palette.
const RIBBONS = [
  { left: -12, width: 16, opacity: 0.14, delay: 0 },
  { left: 12, width: 9, opacity: 0.1, delay: 0.8 },
  { left: 52, width: 13, opacity: 0.13, delay: 1.6 },
  { left: 76, width: 8, opacity: 0.09, delay: 2.4 },
];

function LuxuryRibbons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {RIBBONS.map((r, i) => (
        <div
          key={i}
          className="absolute -inset-y-1/4 rotate-[-28deg] overflow-hidden"
          style={{
            left: `${r.left}%`,
            width: `${r.width}%`,
            background: `linear-gradient(180deg, transparent, rgba(228,182,56,${r.opacity}), rgba(201,155,37,${r.opacity}), transparent)`,
          }}
        >
          <motion.div
            className="absolute inset-x-0 h-1/3"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(255,246,224,0.4), transparent)' }}
            animate={{ top: ['-40%', '140%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: r.delay, repeatDelay: 2.5 }}
          />
        </div>
      ))}
    </div>
  );
}

const SPARKLES = seeded(18, (i) => ({
  id: i,
  left: (i * 13 + 5) % 100,
  top: (i * 37 + 7) % 100,
  size: 2 + (i % 3),
  delay: (i * 0.35) % 4,
  duration: 2 + (i % 3) * 0.6,
}));

function SparkleTwinkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {SPARKLES.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-brand-light"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function AuthGateParticles() {
  return (
    <>
      <LuxuryRibbons />
      <RisingBubbles />
      <SparkleTwinkles />
      <CrossBurst />
    </>
  );
}

// Home — thin gold wave threads with a "comet" of light traveling along
// each, plus a soft pulsing glow where they gather. Drawn in a fixed
// viewBox and stretched to fill (preserveAspectRatio="none") since these
// are abstract curves, not artwork that needs pixel-exact proportions.
const WAVE_PATHS = [
  'M -100 370 C 200 230, 380 510, 650 310 S 1000 130, 1500 290',
  'M -100 270 C 250 370, 420 90, 700 230 S 1050 390, 1500 170',
  'M -100 470 C 220 410, 460 610, 720 450 S 1080 290, 1500 430',
];

function FlowingWaves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1400 900"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <linearGradient id="tv-wave-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c99b25" stopOpacity="0" />
          <stop offset="50%" stopColor="#e4b638" stopOpacity="1" />
          <stop offset="100%" stopColor="#c99b25" stopOpacity="0" />
        </linearGradient>
      </defs>
      {WAVE_PATHS.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="rgba(201,155,37,0.16)" strokeWidth="1.5" />
          <motion.path
            d={d}
            stroke="url(#tv-wave-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0.18, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 7 + i * 1.8, repeat: Infinity, ease: 'linear', delay: i * 1.1 }}
          />
        </g>
      ))}
    </svg>
  );
}

function WaveGlow() {
  return (
    <motion.div
      animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[15%] left-[8%] w-40 h-40 bg-brand-light/50 rounded-full blur-3xl"
    />
  );
}

function LuxuryWaves() {
  return (
    <>
      <FlowingWaves />
      <WaveGlow />
      <RisingBubbles />
    </>
  );
}

const VARIANT_PARTICLES = {
  default: RisingBubbles,
  upload: UploadPulse,
  builder: FloatingCVWords,
  assessment: AssessmentPulse,
  authgate: AuthGateParticles,
  waves: LuxuryWaves,
};

// Shared animated hero backdrop — grid + drifting gold blobs + a scanline
// sweep, with a page-specific particle layer on top. Render inside a
// `relative overflow-hidden` section; this fills it via `absolute inset-0`.
export function HeroBackground({ variant = 'default' }) {
  const Particles = VARIANT_PARTICLES[variant] ?? RisingBubbles;
  const Scanline = variant === 'authgate' ? CrossingScanlines : variant === 'waves' ? null : ScanlineSweep;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 tv-grid-bg" />
      <motion.div
        animate={{
          x: [0, 40, -10, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.15, 1.05, 1],
          opacity: [0.55, 0.8, 0.6, 0.55],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -10, 0],
          scale: [1, 1.1, 1.2, 1],
          opacity: [0.4, 0.6, 0.45, 0.4],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-0 left-0 w-72 h-72 bg-brand-dark/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-144 h-144 bg-brand/10 rounded-full blur-3xl"
      />
      {Scanline && <Scanline />}
      <Particles />
    </div>
  );
}
