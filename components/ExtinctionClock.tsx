"use client";

import { useEffect, useState } from "react";
import { getArchiveStats, RECORDING_SAVED_EVENT } from "@/lib/archiveStore";

function fmtMinutes(totalSeconds: number) {
  const mins = totalSeconds / 60;
  if (mins < 1) return `${Math.round(totalSeconds)}s`;
  return `${mins.toFixed(1)} min`;
}

export default function ExtinctionClock() {
  const [stats, setStats] = useState({ count: 0, totalSeconds: 0 });

  useEffect(() => {
    let mounted = true;
    const refresh = () => getArchiveStats().then((s) => mounted && setStats(s));
    refresh();
    window.addEventListener(RECORDING_SAVED_EVENT, refresh);
    return () => {
      mounted = false;
      window.removeEventListener(RECORDING_SAVED_EVENT, refresh);
    };
  }, []);

  return (
    <section className="rounded-[18px] p-6 sm:p-9 text-[#F1E9DC]" style={{ background: "linear-gradient(160deg,#1E1E1E,#2b1a14)" }}>
      <p className="text-xs tracking-wide opacity-70">why this archive exists, in real numbers</p>
      <div className="mt-4 grid sm:grid-cols-2 gap-6 sm:gap-10 items-end">
        <div>
          <p className="font-serif text-5xl sm:text-6xl font-semibold tabular-nums" style={{ color: "#F1C453" }}>
            {stats.count}
          </p>
          <p className="text-sm mt-1 opacity-80">
            {stats.count === 1 ? "voice" : "voices"} actually recorded and saved in this browser&rsquo;s archive
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-serif text-3xl sm:text-4xl font-semibold tabular-nums" style={{ color: "#F1C453" }}>
            {fmtMinutes(stats.totalSeconds)}
          </p>
          <p className="text-sm mt-1 opacity-80">of oral history secured so far — record one below to add to it</p>
        </div>
      </div>
      <p className="text-xs mt-5 pt-4 border-t opacity-60" style={{ borderColor: "rgba(255,255,255,.12)" }}>
        For context: roughly 964,305 people in Goa were recorded as Konkani speakers in the{" "}
        <a
          href="https://en.wikipedia.org/wiki/Konkani_people"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          2011 Census of India
        </a>
        , out of about 2.3 million Konkani mother-tongue speakers nationwide. Goa media has also reported a decline
        of roughly 200,000 Konkani speakers between the 2001 and 2011 censuses, tied to script and education policy
        (
        <a href="https://www.heraldgoa.in/?p=436801" target="_blank" rel="noreferrer" className="underline">
          O Heraldo, 2024
        </a>
        ). No census breaks either figure down by village or by age, which is exactly the gap this archive exists to
        fill, one recording at a time.
      </p>
    </section>
  );
}
