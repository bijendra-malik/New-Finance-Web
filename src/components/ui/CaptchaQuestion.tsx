import { useMemo } from "react";

const DECOYS = "abcdefghijkmnpqrstuvwxyz023456789#%&*+=?";

/** FNV-1a, so the same question always gets the same jitter. */
const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** Small xorshift generator: pure, and repeatable for a given seed. */
const seededRandom = (seed: number): (() => number) => {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
};

interface CaptchaQuestionProps {
  question: string;
  className?: string;
}

interface Glyph {
  key: string;
  char: string;
  decoy: string;
  rotate: number;
  lift: number;
  scale: number;
  offsetX: number;
  skew: number;
}

/**
 * Draws the backend's question character by character, each glyph nudged and
 * rotated on its own, with an invisible throwaway character between them — so
 * the rendered text no longer reads as a plain expression in the DOM.
 */
const CaptchaQuestion = ({ question, className = "" }: CaptchaQuestionProps) => {
  const glyphs = useMemo<Glyph[]>(() => {
    const random = seededRandom(hashString(question));
    return Array.from(question).map((char, index) => ({
      key: `${index}-${char}`,
      char,
      decoy: DECOYS[Math.floor(random() * DECOYS.length)],
      rotate: (random() - 0.5) * 22,
      lift: (random() - 0.5) * 5,
      scale: 0.9 + random() * 0.24,
      offsetX: (random() - 0.5) * 2.4,
      skew: (random() - 0.5) * 14,
    }));
  }, [question]);

  return (
    <span
      role="img"
      aria-label="Security question"
      className={`inline-flex select-none items-center font-mono text-sm font-bold text-slate-800 ${className}`}
    >
      {glyphs.map((glyph) => (
        <span key={glyph.key} className="inline-flex items-center">
          <span
            aria-hidden="true"
            className="inline-block whitespace-pre"
            style={{
              transform: `translate(${glyph.offsetX}px, ${glyph.lift}px) rotate(${glyph.rotate}deg) skewX(${glyph.skew}deg) scale(${glyph.scale})`,
            }}
          >
            {glyph.char}
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block overflow-hidden text-[0px] leading-none opacity-0"
            style={{ width: 0 }}
          >
            {glyph.decoy}
          </span>
        </span>
      ))}
    </span>
  );
};

export default CaptchaQuestion;
