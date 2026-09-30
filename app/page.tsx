"use client";

import { useState } from "react";
import ExtinctionClock from "@/components/ExtinctionClock";
import RadioSubtitle from "@/components/RadioSubtitle";
import GeoSonicMap from "@/components/GeoSonicMap";
import ElderRecorder from "@/components/ElderRecorder";
import { VILLAGES, Village } from "@/lib/villages";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState<Village>(VILLAGES[0]);

  return (
    <>
      <div className="tape-edge w-full" />

      <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide" style={{ color: "var(--sub)" }}>
            a living archive of Konkani oral history
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1" style={{ color: "#8B261E" }}>
            Balcão
          </h1>
        </div>
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="text-sm px-3 py-2 rounded-full border"
          style={{ borderColor: "var(--line)", color: "var(--sub)" }}
        >
          ◐ theme
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 space-y-16">
        <ExtinctionClock />
        <RadioSubtitle village={nowPlaying} />
        <GeoSonicMap onPlay={setNowPlaying} />
        <ElderRecorder />
      </main>

      <footer className="max-w-5xl mx-auto px-5 sm:px-8 pb-10 pt-4 text-center">
        <p className="text-xs" style={{ color: "var(--sub)" }}>
          © 2026 Balcão · Stories worth keeping alive.
        </p>
      </footer>
    </>
  );
}
