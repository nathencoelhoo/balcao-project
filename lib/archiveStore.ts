import { Consent } from "@/lib/villages";

const DB_NAME = "balcao-archive";
const STORE = "recordings";
const DB_VERSION = 1;

export type ArchiveRecording = {
  id: string;
  blob: Blob;
  mimeType: string;
  durationSec: number;
  consent: Consent;
  transcript: string | null;
  createdAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveRecording(rec: ArchiveRecording): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(rec);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllRecordings(): Promise<ArchiveRecording[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as ArchiveRecording[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getArchiveStats(): Promise<{ count: number; totalSeconds: number }> {
  try {
    const all = await getAllRecordings();
    const totalSeconds = all.reduce((s, r) => s + (r.durationSec || 0), 0);
    return { count: all.length, totalSeconds };
  } catch {
    return { count: 0, totalSeconds: 0 };
  }
}

/** Fired on window whenever a recording is saved, so other components can refresh live stats. */
export const RECORDING_SAVED_EVENT = "balcao:recording-saved";
