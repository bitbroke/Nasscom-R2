"use client";

import { useState, useCallback, useRef } from "react";
import type { SugoiMood } from "./sugoi-avatar";

interface UseSugoiMood {
  mood: SugoiMood;
  clickCount: number;
  isEnraged: boolean;
  handleClick: () => void;
}

/**
 * Sugoi patience state machine.
 * - 0 clicks: normal
 * - 1-2 clicks: happy
 * - 3-5 clicks: annoyed (sweat drop)
 * - >5 clicks: enraged — red eyes, shaking, UI locked for 4s
 */
export function useSugoiMood(): UseSugoiMood {
  const [mood, setMood] = useState<SugoiMood>("normal");
  const [clickCount, setClickCount] = useState(0);
  const [isEnraged, setIsEnraged] = useState(false);
  const cooldownRef = useRef(false);

  const handleClick = useCallback(() => {
    if (cooldownRef.current) return;

    setClickCount((prev) => {
      const next = prev + 1;

      if (next > 5) {
        // ENRAGED — lock for 4 seconds
        setMood("enraged");
        setIsEnraged(true);
        cooldownRef.current = true;

        setTimeout(() => {
          setMood("normal");
          setIsEnraged(false);
          cooldownRef.current = false;
          setClickCount(0);
        }, 4000);
      } else if (next >= 3) {
        setMood("annoyed");
      } else if (next >= 1) {
        setMood("happy");
      }

      return next;
    });
  }, []);

  return { mood, clickCount, isEnraged, handleClick };
}
