"use client";

import { useState, useCallback } from "react";

interface FlipCardProps {
  question: string;
  answer: string;
  index: number;
}

export default function FlipCard({ question, answer, index }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);

  return (
    <div style={{ perspective: "1000px" }} className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleFlip}
        className="relative h-52 sm:h-72 md:h-80 w-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 card-base flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 glow-amber"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-3 left-4 sm:top-4 sm:left-5 flex items-center gap-2">
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber/10 text-[10px] sm:text-xs font-medium text-amber">
              {index + 1}
            </span>
          </div>
          <div className="absolute top-3 right-4 sm:top-4 sm:right-5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted">
            Question
          </div>
          <p className="font-display text-lg sm:text-xl md:text-2xl leading-relaxed text-chalk text-center max-w-lg px-2">
            {question}
          </p>
          <div className="absolute bottom-3 sm:bottom-5 text-[9px] sm:text-xs tracking-wider text-muted/60 uppercase">
            Tap to reveal answer
          </div>
        </div>

        <div
          className="absolute inset-0 card-base flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border-amber/30"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute top-3 left-4 sm:top-4 sm:left-5 flex items-center gap-2">
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-sage/10 text-[10px] sm:text-xs font-medium text-sage">
              {index + 1}
            </span>
          </div>
          <div className="absolute top-3 right-4 sm:top-4 sm:right-5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-sage">
            Answer
          </div>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-chalk text-center max-w-lg px-2">
            {answer}
          </p>
          <div className="absolute bottom-3 sm:bottom-5 text-[9px] sm:text-xs tracking-wider text-muted/60 uppercase">
            Tap to see question
          </div>
        </div>
      </div>
    </div>
  );
}