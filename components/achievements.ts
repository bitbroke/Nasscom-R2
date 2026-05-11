"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/** Achievement definition */
export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "attached_logs", title: "Actually Attached Logs", emoji: "🏆", description: "You attached logs! Sugoi is genuinely impressed." },
  { id: "restarted_first", title: "Restarted Before Asking", emoji: "🏆", description: "You tried rebooting first! A true professional." },
  { id: "first_ticket", title: "First Blood", emoji: "⚔️", description: "Your first ticket has been submitted to the council!" },
  { id: "speed_demon", title: "Speed Demon", emoji: "💨", description: "Submitted within 10 seconds of page load. Eager, aren't we?" },
  { id: "air_gapped", title: "Trust Issues", emoji: "🔒", description: "You enabled Air-Gapped mode. Paranoid, but wise." },
  { id: "dark_mode", title: "Embraced the Darkness", emoji: "🌙", description: "Welcome to the gothic side, Master~" },
  { id: "poked_sugoi", title: "Sugoi's Patience", emoji: "😤", description: "You poked Sugoi until she got angry. Happy now?" },
];

interface UseAchievements {
  earned: Achievement[];
  latestToast: Achievement | null;
  checkAchievement: (id: string) => void;
  dismissToast: () => void;
}

export function useAchievements(): UseAchievements {
  const [earned, setEarned] = useState<Achievement[]>([]);
  const [latestToast, setLatestToast] = useState<Achievement | null>(null);
  const earnedIds = useRef<Set<string>>(new Set());
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const checkAchievement = useCallback((id: string) => {
    if (earnedIds.current.has(id)) return;
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    earnedIds.current.add(id);
    setEarned(prev => [...prev, ach]);
    setLatestToast(ach);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLatestToast(null), 4000);
  }, []);

  const dismissToast = useCallback(() => setLatestToast(null), []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  return { earned, latestToast, checkAchievement, dismissToast };
}

/** RPG Bug enemy names by category */
const BUG_NAMES: Record<string, string> = {
  "Network": "The DNS Ghost 👻",
  "Database": "Ancient Deadlock Serpent 🐍",
  "Software": "The Null Pointer Phantom 💀",
  "Hardware": "Cursed Printer Demon 🖨️",
  "Security": "Zero-Day Shadow 🕶️",
  "Access": "The Permission Wraith 🔐",
  "Email": "Spam Lord Supreme 📧",
  "Performance": "Memory Leak Hydra 🐉",
  "Other": "Unknown Error Slime 🟢",
};

const BATTLE_ATTACKS = [
  "Sugoi used PATCH UPDATE! It's super effective!",
  "Sugoi cast RECURSIVE FIX! The bug is confused!",
  "Sugoi deployed HOTFIX BEAM! Critical hit!",
  "Sugoi activated STACK OVERFLOW WISDOM! It's devastating!",
  "Sugoi unleashed RUBBER DUCK DEBUG! The bug flinches!",
];

export function getBugName(category: string | null): string {
  if (!category) return BUG_NAMES["Other"];
  for (const [key, name] of Object.entries(BUG_NAMES)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return name;
  }
  return BUG_NAMES["Other"];
}

export function getBattleAttack(): string {
  return BATTLE_ATTACKS[Math.floor(Math.random() * BATTLE_ATTACKS.length)];
}
