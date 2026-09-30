"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { VILLAGES, CONSENT_LABEL, Village } from "@/lib/villages";

export default function GeoSonicMap({ onPlay }: { onPlay: (v: Village) => void }) {
  const [active, setActive] = useState<Village | null>(null);

  return (
    <section>
      <h2 className="font-serif text-2xl mb-1">The Geo-Sonic Map</h2>
      <p className="text-sm mb-5" style={{ color: "var(--sub)" }}>
        Every pulse is a voice still speaking. Tap a village to listen.
      </p>

      <div className="rounded-[18px] border p-4 sm:p-6" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
        <svg viewBox="0 0 400 560" className="w-full h-[420px] sm:h-[480px]">
          <path
            d="M60,20 C40,120 30,220 55,300 C75,380 60,460 90,540 L170,540 C150,440 165,340 150,260 C140,180 165,90 190,20 Z"
            fill="var(--linen-2)"
            stroke="var(--line)"
            strokeWidth={1.5}
          />
          <path
            d="M60,20 C40,120 30,220 55,300 C75,380 60,460 90,540"
            fill="none"
            stroke="#E5A93C"
            strokeWidth={2}
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity={0.8}
          />
          <text x={72} y={90} fontFamily="var(--font-fraunces),serif" fontSize={13} fill="var(--sub)" opacity={0.8}>Bardez</text>
          <text x={60} y={290} fontFamily="var(--font-fraunces),serif" fontSize={13} fill="var(--sub)" opacity={0.8}>Tiswadi</text>
          <text x={95} y={470} fontFamily="var(--font-fraunces),serif" fontSize={13} fill="var(--sub)" opacity={0.8}>Salcete</text>

          {VILLAGES.map((v) => {
            const c = CONSENT_LABEL[v.consent].color;
            return (
              <g key={v.id} style={{ cursor: "pointer" }} onClick={() => setActive(v)}>
                <circle className="ping-ring" cx={v.x} cy={v.y} r={8} fill="none" stroke={c} strokeWidth={2} />
                <circle className="ping-ring d2" cx={v.x} cy={v.y} r={8} fill="none" stroke={c} strokeWidth={2} />
                <motion.circle whileHover={{ scale: 1.2 }} cx={v.x} cy={v.y} r={7} fill={c} />
                <circle cx={v.x} cy={v.y} r={3} fill="var(--linen)" />
                <text x={v.x + 14} y={v.y + 4} fontSize={12} fill="var(--text)" fontFamily="var(--font-fraunces),serif">
                  {v.village.split(" (")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs" style={{ borderColor: "var(--line)", color: "var(--sub)" }}>
          {(["public", "family", "researcher"] as const).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: CONSENT_LABEL[k].color }} />
              {CONSENT_LABEL[k].label} — {CONSENT_LABEL[k].note}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-40 overflow-y-auto px-6 pb-10"
              style={{ background: "var(--bg)", paddingTop: "calc(env(safe-area-inset-top,0px) + 1.5rem)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            >
              <button onClick={() => setActive(null)} className="mb-4 text-sm flex items-center gap-1" style={{ color: "var(--sub)" }}>
                <X size={14} /> close
              </button>
              <p className="text-xs" style={{ color: "var(--sub)" }}>{active.village} · age {active.age}</p>
              <h3 className="font-serif text-2xl mt-1" style={{ color: "#8B261E" }}>{active.name}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--sub)" }}>{active.topic}</p>

              <div
                className="inline-flex items-center gap-2 mt-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "var(--linen-2)", color: CONSENT_LABEL[active.consent].color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: CONSENT_LABEL[active.consent].color }} />
                {CONSENT_LABEL[active.consent].label}
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--sub)" }}>{CONSENT_LABEL[active.consent].note}</p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--sub)" }}>English</p>
                  <p className="text-sm leading-relaxed">{active.english}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--sub)" }}>Romi Konkani</p>
                  <p className="text-sm leading-relaxed italic">{active.romi}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--sub)" }}>Devanagari</p>
                  <p className="text-sm leading-relaxed font-dev">{active.devanagari}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onPlay(active);
                  setActive(null);
                }}
                className="mt-6 w-full py-3 rounded-full text-white text-sm font-medium"
                style={{ background: "#A33226" }}
              >
                Play this recording ▸
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
