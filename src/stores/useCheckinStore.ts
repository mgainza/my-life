import { create } from 'zustand';
import { eq } from 'drizzle-orm';

import { db } from '../db/index';
import { dailyCheckins } from '../db/schema';

type DailyCheckin = typeof dailyCheckins.$inferSelect;

interface CreateCheckinDTO {
  date: string;
  energy: number;
  stress: number;
  mood: number;
  trained_today?: number;
  session_id?: string | null;
  notes?: string | null;
  daily_score?: number;
}

interface UpdateCheckinDTO {
  date?: string;
  energy?: number;
  stress?: number;
  mood?: number;
  trained_today?: number;
  session_id?: string | null;
  notes?: string | null;
  daily_score?: number;
}

interface CheckinState {
  checkins: DailyCheckin[];
  loading: boolean;
  error: string | null;
}

interface CheckinActions {
  getAllCheckins: () => Promise<void>;
  getCheckinById: (id: string) => Promise<DailyCheckin | undefined>;
  createCheckin: (dto: CreateCheckinDTO) => Promise<void>;
  updateCheckin: (id: string, dto: UpdateCheckinDTO) => Promise<void>;
  deleteCheckin: (id: string) => Promise<void>;
}

export const useCheckinStore = create<CheckinState & CheckinActions>((set, get) => ({
  checkins: [],
  loading: false,
  error: null,

  getAllCheckins: async () => {
    set({ loading: true, error: null });
    try {
      const checkins = await db.select().from(dailyCheckins);
      set({ checkins, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getCheckinById: async (id) => {
    try {
      const results = await db
        .select()
        .from(dailyCheckins)
        .where(eq(dailyCheckins.id, id));
      return results[0];
    } catch (e) {
      set({ error: (e as Error).message });
      return undefined;
    }
  },

  createCheckin: async (dto) => {
    set({ loading: true, error: null });
    try {
      await db.insert(dailyCheckins).values({
        id: crypto.randomUUID(),
        trained_today: 0,
        daily_score: 0,
        ...dto,
      });
      await get().getAllCheckins();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateCheckin: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      await db.update(dailyCheckins).set(dto).where(eq(dailyCheckins.id, id));
      await get().getAllCheckins();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteCheckin: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.delete(dailyCheckins).where(eq(dailyCheckins.id, id));
      await get().getAllCheckins();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
