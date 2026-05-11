"use client";

import { useEffect, useState } from "react";

const KAOMOJIS = [
  "(ᵕ—ᴗ—)",
  "(☉_☉)",
  "(◕ᴗ◕✿)",
  "(=^・ω・^=)",
  "(⁠ ⁠╹⁠▽⁠╹⁠ ⁠)",
  "(⁠≧⁠▽⁠≦⁠)",
  "(⁠ ⁠˶⁠ ⁠❛⁠ ⁠ᴗ⁠ ⁠❛⁠ ⁠˶⁠ ⁠)",
  "ʕ•ᴥ•ʔ",
  "(⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)",
  "₍ᐢ..ᐢ₎",
  "✧(≖ ◡ ≖✿)",
  "(⁠ ⁠ᵔ⁠ᴗ⁠ᵔ⁠ ⁠)",
];

interface KaomojiItem {
  id: number;
  text: string;
  left: number;
  top: number;
  delay: number;
  duration: number;
  drift: number;
}

export default function FloatingKaomojis() {
  const [items, setItems] = useState<KaomojiItem[]>([]);

  useEffect(() => {
    const generated: KaomojiItem[] = [];
    for (let i = 0; i < 18; i++) {
      generated.push({
        id: i,
        text: KAOMOJIS[i % KAOMOJIS.length],
        left: Math.random() * 95,
        top: 60 + Math.random() * 50,
        delay: Math.random() * 12,
        duration: 18 + Math.random() * 16,
        drift: (i % 3) + 1,
      });
    }
    setItems(generated);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="kaomoji-bg" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="kaomoji"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            animationName: `kaomoji-drift-${item.drift}`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            fontSize: `${1.1 + Math.random() * 0.6}rem`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
