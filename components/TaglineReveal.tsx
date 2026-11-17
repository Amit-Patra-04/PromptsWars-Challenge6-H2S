'use client';

import React, { useEffect, useRef, useState } from 'react';

const TAGLINE_TEXT =
  'When toxic winter inversion blankets your neighborhood, targeted indoor physics and timed routines protect your children from irreversible particulate exposure.';

export default function TaglineReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = TAGLINE_TEXT.split(' ');
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user accessibility preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        if (!containerRef.current) {
          rafId = null;
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress as section passes through viewport center
        // Starts when top is at 75% of viewport, finishes when top is at 25% of viewport
        const startTrigger = windowHeight * 0.75;
        const endTrigger = windowHeight * 0.25;

        if (rect.top > startTrigger) {
          setActiveWordIndex(-1);
        } else if (rect.top < endTrigger) {
          setActiveWordIndex(words.length);
        } else {
          const progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
          const clamped = Math.max(0, Math.min(1, progress));
          const index = Math.floor(clamped * words.length);
          setActiveWordIndex(index);
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [words.length, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="py-800 px-100 flex flex-col items-center justify-center text-center my-400"
      aria-label="Core Purpose Statement"
    >
      <div className="max-w-[680px]">
        <span className="caption-4 text-neutral-400 font-mono tracking-widest uppercase block mb-200">
          Public Health Philosophy
        </span>
        <h2 className="heading-3 leading-tight tracking-tight">
          {words.map((word, idx) => {
            const isLit = prefersReducedMotion || idx <= activeWordIndex;
            return (
              <span
                key={idx}
                className={`inline-block mr-[0.3em] transition-colors duration-500 ease-base ${
                  isLit ? 'text-white' : 'text-neutral-600'
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
