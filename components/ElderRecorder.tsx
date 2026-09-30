"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, AlertCircle } from "lucide-react";
import { CONSENT_LABEL, Consent } from "@/lib/villages";
import { saveRecording, RECORDING_SAVED_EVENT } from "@/lib/archiveStore";

type Phase = "idle" | "requesting" | "recording" | "saving" | "saved" | "denied" | "error";

// Speech Recognition isn't in standard DOM types across browsers — declare the minimal shape we use.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function fmtTime(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ElderRecorder() {
  const [consent, setConsent] = useState<Consent>("public");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(28).fill(4));
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSpeechSupported(!!getSpeechRecognition());
    return () => cleanupStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanupStream() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    try {
      recogRef.current?.stop();
    } catch {}
  }

  function drawWaveform() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const bucketSize = Math.floor(data.length / 28) || 1;
    const next = Array.from({ length: 28 }, (_, i) => {
      let sum = 0;
      for (let j = 0; j < bucketSize; j++) sum += data[i * bucketSize + j] || 0;
      const avg = sum / bucketSize;
      return Math.max(4, (avg / 255) * 60);
    });
    setBars(next);
    rafRef.current = requestAnimationFrame(drawWaveform);
  }

  async function startRecording() {
    setErrorMsg(null);
    setAudioURL(null);
    setTranscript("");
    setPhase("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Real waveform via Web Audio analysis of the live mic stream.
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      // Real audio capture.
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => handleStop(recorder.mimeType || "audio/webm");
      recorder.start();
      recorderRef.current = recorder;

      // Real (English-only) live transcription, where the browser supports it.
      const SR = getSpeechRecognition();
      if (SR) {
        const recog = new SR();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";
        recog.onresult = (e: any) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
          setTranscript(text);
        };
        recog.onerror = () => {};
        recog.start();
        recogRef.current = recog;
      }

      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      drawWaveform();
      setPhase("recording");
    } catch (err) {
      setPhase("denied");
      setErrorMsg(
        "Microphone access was denied or unavailable. Enable microphone permission for this site in your browser settings to record."
      );
    }
  }

  function stopRecording() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setBars(Array(28).fill(4));
    setPhase("saving");
    try {
      recogRef.current?.stop();
    } catch {}
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
  }

  async function handleStop(mimeType: string) {
    const blob = new Blob(chunksRef.current, { type: mimeType });
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    try {
      await saveRecording({
        id: crypto.randomUUID(),
        blob,
        mimeType,
        durationSec: elapsed,
        consent,
        transcript: transcript.trim() || null,
        createdAt: Date.now(),
      });
      window.dispatchEvent(new Event(RECORDING_SAVED_EVENT));
      setPhase("saved");
    } catch {
      setErrorMsg("Recording captured, but saving it to your browser's local archive failed.");
      setPhase("error");
    }
  }

  function toggleRecord() {
    if (phase === "recording") stopRecording();
    else if (phase !== "requesting" && phase !== "saving") startRecording();
  }

  const isRecording = phase === "recording";
  const statusText: Record<Phase, string> = {
    idle: "Tap to start speaking",
    requesting: "Requesting microphone access…",
    recording: "Listening — real mic input",
    saving: "Saving to your local archive…",
    saved: "Saved to your browser's archive",
    denied: "Microphone access needed",
    error: "Something went wrong",
  };

  return (
    <section>
      <h2 className="font-serif text-2xl mb-1">Your Voice, Kept Forever</h2>
      <p className="text-sm mb-5" style={{ color: "var(--sub)" }}>
        Real microphone capture, saved to this browser&rsquo;s local archive.
      </p>

      <div className="rounded-[18px] border p-6 sm:p-10 text-center" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
        <p className="text-xs font-medium mb-3" style={{ color: "var(--sub)" }}>before you speak — who may hear this?</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(["public", "family", "researcher"] as Consent[]).map((c) => (
            <button
              key={c}
              onClick={() => setConsent(c)}
              disabled={isRecording}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50"
              style={{
                borderColor: "var(--line)",
                background: consent === c ? "#A33226" : "transparent",
                color: consent === c ? "#fff" : "var(--text)",
              }}
            >
              {CONSENT_LABEL[c].label}
            </button>
          ))}
        </div>

        <motion.button
          onClick={toggleRecord}
          whileTap={{ scale: 0.94 }}
          disabled={phase === "requesting" || phase === "saving"}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto flex items-center justify-center text-white disabled:opacity-60"
          style={{
            background: "#A33226",
            boxShadow: isRecording ? "0 0 0 0 rgba(163,50,38,.55), 0 8px 30px rgba(163,50,38,.5)" : undefined,
            animation: isRecording ? "micPulse 1.6s ease-in-out infinite" : undefined,
          }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <Square size={34} fill="white" /> : <Mic size={40} />}
        </motion.button>

        <p className="mt-4 text-sm font-medium flex items-center justify-center gap-1.5" style={{ color: "var(--sub)" }}>
          {(phase === "denied" || phase === "error") && <AlertCircle size={14} />}
          {statusText[phase]}
          {isRecording && <span className="tabular-nums">· {fmtTime(elapsed)}</span>}
        </p>
        {errorMsg && <p className="text-xs mt-1" style={{ color: "#A33226" }}>{errorMsg}</p>}

        <div className="flex items-end justify-center gap-1 h-16 mt-6" style={{ opacity: isRecording ? 1 : 0.25 }}>
          {bars.map((h, i) => (
            <div key={i} className="w-1 rounded" style={{ height: h, background: "#A33226", transition: "height .07s ease" }} />
          ))}
        </div>

        {phase === "saved" && (
          <div className="mt-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--linen-2)", color: "var(--text)" }}>
                access: {CONSENT_LABEL[consent].label}
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--linen-2)", color: "var(--sub)" }}>
                dialect tagging: not yet available (no Konkani model exists)
              </span>
            </div>

            {audioURL && (
              <audio controls src={audioURL} className="w-full mb-3">
                Your browser does not support audio playback.
              </audio>
            )}

            {transcript ? (
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--sub)" }}>
                  automatic English speech-to-text — experimental, inaccurate for Konkani speech
                </p>
                <p className="text-sm leading-relaxed">{transcript}</p>
              </div>
            ) : speechSupported ? (
              <p className="text-xs" style={{ color: "var(--sub)" }}>No speech was detected for live transcription, but your audio was saved.</p>
            ) : (
              <p className="text-xs" style={{ color: "var(--sub)" }}>
                Live transcription isn&rsquo;t supported in this browser (try Chrome) — your audio is still saved.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
