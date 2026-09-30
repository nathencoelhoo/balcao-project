"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Village } from "@/lib/villages";

type Script = "romi" | "devanagari";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Cache measured durations per village across plays, since speechSynthesis gives no upfront length.
const measuredDurations: Record<string, number> = {};

export default function RadioSubtitle({ village }: { village: Village }) {
  const [script, setScript] = useState<Script>("romi");
  const [playing, setPlaying] = useState(false);
  const [wordIdx, setWordIdx] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [supported, setSupported] = useState(true);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = village[script].split(" ");
  const duration = measuredDurations[village.id];

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    stop();
    setWordIdx(-1);
    setElapsed(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [village, script]);

  useEffect(() => () => stop(), []);

  function stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (tickRef.current) clearInterval(tickRef.current);
    setPlaying(false);
  }

  function togglePlay() {
    if (!supported) return;
    if (playing) {
      window.speechSynthesis.cancel();
      if (tickRef.current) clearInterval(tickRef.current);
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(village.english);
    utter.rate = 0.95;

    utter.onboundary = (e) => {
      if (e.name !== "word") return;
      const progress = e.charIndex / village.english.length;
      setWordIdx(Math.min(words.length - 1, Math.floor(progress * words.length)));
    };
    utter.onstart = () => {
      startRef.current = Date.now();
      setPlaying(true);
      tickRef.current = setInterval(() => setElapsed((Date.now() - startRef.current) / 1000), 100);
    };
    utter.onend = () => {
      measuredDurations[village.id] = (Date.now() - startRef.current) / 1000;
      if (tickRef.current) clearInterval(tickRef.current);
      setPlaying(false);
      setWordIdx(words.length - 1);
    };
    utter.onerror = () => {
      if (tickRef.current) clearInterval(tickRef.current);
      setPlaying(false);
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  return (
    <section className="rounded-[18px] border p-5 sm:p-7 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
      <div className="flex items-center justify-between border-b pb-3 mb-5" style={{ borderColor: "var(--line)" }}>
        <h2 className="font-serif text-lg" style={{ color: "var(--sub)" }}>
          The Elder&rsquo;s Voice — narration preview
        </h2>
        <div className="flex rounded-full p-1" style={{ background: "var(--linen-2)" }}>
          {(["romi", "devanagari"] as Script[]).map((s) => (
            <button
              key={s}
              onClick={() => setScript(s)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={{
                color: script === s ? "#8B261E" : "var(--sub)",
                background: script === s ? "var(--card)" : "transparent",
              }}
            >
              {s === "romi" ? "Romi" : "देवनागरी"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--text)" }}>
          <span className="font-medium">{village.name}</span>
          <span style={{ color: "var(--sub)" }}> · {village.village}</span>
        </p>
        <p className="text-xs tabular-nums" style={{ color: "var(--sub)" }}>
          {fmt(elapsed)} / {duration ? fmt(duration) : "--:--"}
        </p>
      </div>

      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <div
          className="rounded-full w-32 h-32 sm:w-36 sm:h-36 relative mx-auto shrink-0 flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 30%, #3a2a22, #17110d 70%)",
            border: "3px solid #E5A93C",
            boxShadow: "inset 0 6px 18px rgba(0,0,0,.6), 0 10px 30px rgba(0,0,0,.35)",
          }}
        >
          <motion.div
            className="absolute w-1 h-14 rounded-full origin-bottom"
            style={{ background: "#E5A93C", bottom: "50%", left: "calc(50% - 2px)" }}
            animate={{ rotate: playing ? 40 : -40 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          />
          <button
            onClick={togglePlay}
            disabled={!supported}
            aria-label={playing ? "Pause narration" : "Play narration"}
            className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-50"
            style={{ background: "#A33226" }}
          >
            {playing ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
          </button>
        </div>

        <div>
          {!supported && (
            <p className="text-xs mb-2" style={{ color: "#A33226" }}>
              Speech synthesis isn&rsquo;t supported in this browser — try Chrome, Edge, or Safari.
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={script}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className={`text-lg sm:text-xl leading-relaxed min-h-[6rem] ${script === "devanagari" ? "font-dev" : ""}`}
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  style={{
                    color: i <= wordIdx && playing ? "#8B261E" : "inherit",
                    fontWeight: i === wordIdx && playing ? 600 : 400,
                    transition: "color .2s",
                  }}
                >
                  {w}{" "}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="text-sm mt-3 italic" style={{ color: "var(--sub)" }}>
            &ldquo;{village.english}&rdquo;
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--sub)" }}>
            Narration reads the English translation aloud; no browser ships a Konkani voice yet, so timing above is
            estimated from real speech progress, not word-for-word alignment.
          </p>
        </div>
      </div>
    </section>
  );
}
