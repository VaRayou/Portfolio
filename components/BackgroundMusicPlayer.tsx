"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

function useClientOnly() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function BackgroundMusicPlayer() {
  const mounted = useClientOnly();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    const handleToggle = () => {
      setPlaying((p) => {
        const next = !p;
        if (next) {
          audioRef.current?.play().catch(() => {});
        } else {
          audioRef.current?.pause();
        }
        return next;
      });
    };

    window.addEventListener("toggle-music", handleToggle);
    return () => {
      window.removeEventListener("toggle-music", handleToggle);
      audioRef.current?.pause();
    };
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setPlaying((p) => !p);
  };

  return (
    <motion.button
      id="music-toggle-btn"
      onClick={toggle}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 6, duration: 0.5 }}
      className={`fixed right-4 bottom-24 z-[400] w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
        playing
          ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400 music-playing"
          : "bg-white/[0.04] border-white/10 text-white/40 hover:text-white/70 hover:bg-white/[0.08]"
      }`}
      aria-label={playing ? "Pause music" : "Play background music"}
      title={playing ? "Pause Music" : "Play Music"}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.div
            key="playing"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="paused"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
