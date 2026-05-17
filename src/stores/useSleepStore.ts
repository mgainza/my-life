import { create } from 'zustand';
import { eq } from 'drizzle-orm';

import { db } from '../db/index';
import { sleepLogs } from '../db/schema';

type SleepLog = typeof sleepLogs.$inferSelect;

interface CreateSleepLogDTO {
  date: string;
  sleep_time: string;
  wake_time: string;
  duration_minutes: number;
  quality: number;
  wake_ups?: number;
  wake_feeling: number;
  notes?: string | null;
  score?: number;
}

interface UpdateSleepLogDTO {
  date?: string;
  sleep_time?: string;
  wake_time?: string;
  duration_minutes?: number;
  quality?: number;
  wake_ups?: number;
  wake_feeling?: number;
  notes?: string | null;
  score?: number;
}

interface SleepState {
  logs: SleepLog[];
  loading: boolean;
  error: string | null;
}

interface SleepActions {
  getAllLogs: () => Promise<void>;
  getLogById: (id: string) => Promise<SleepLog | undefined>;
  createLog: (dto: CreateSleepLogDTO) => Promise<void>;
  updateLog: (id: string, dto: UpdateSleepLogDTO) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
}

export const useSleepStore = create<SleepState & SleepActions>((set, get) => ({
  logs: [],
  loading: false,
  error: null,

  getAllLogs: async () => {
    set({ loading: true, error: null });
    try {
      const logs = await db.select().from(sleepLogs);
      set({ logs, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getLogById: async (id) => {
    try {
      const results = await db
        .select()
        .from(sleepLogs)
        .where(eq(sleepLogs.id, id));
      return results[0];
    } catch (e) {
      set({ error: (e as Error).message });
      return undefined;
    }
  },

  createLog: async (dto) => {
    set({ loading: true, error: null });
    try {
      await db.insert(sleepLogs).values({
        id: crypto.randomUUID(),
        wake_ups: 0,
        score: 0,
        ...dto,
      });
      await get().getAllLogs();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateLog: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      await db.update(sleepLogs).set(dto).where(eq(sleepLogs.id, id));
      await get().getAllLogs();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteLog: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.delete(sleepLogs).where(eq(sleepLogs.id, id));
      await get().getAllLogs();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
