import { create } from 'zustand';
import { eq } from 'drizzle-orm';

import { db } from '../db/index';
import { routines, exercises } from '../db/schema';

type Routine = typeof routines.$inferSelect;
type Exercise = typeof exercises.$inferSelect;

interface CreateRoutineDTO {
  name: string;
  type: string;
  description?: string | null;
}

interface UpdateRoutineDTO {
  name?: string;
  type?: string;
  description?: string | null;
}

interface CreateExerciseDTO {
  routine_id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds?: number | null;
  notes?: string | null;
  order: number;
}

interface UpdateExerciseDTO {
  name?: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number | null;
  notes?: string | null;
  order?: number;
}

interface RoutineState {
  routines: Routine[];
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

interface RoutineActions {
  getAllRoutines: () => Promise<void>;
  getRoutineById: (id: string) => Promise<Routine | undefined>;
  createRoutine: (dto: CreateRoutineDTO) => Promise<void>;
  updateRoutine: (id: string, dto: UpdateRoutineDTO) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  getExercisesByRoutineId: (routineId: string) => Promise<Exercise[]>;
  createExercise: (dto: CreateExerciseDTO) => Promise<void>;
  updateExercise: (id: string, dto: UpdateExerciseDTO) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

export const useRoutineStore = create<RoutineState & RoutineActions>((set, get) => ({
  routines: [],
  exercises: [],
  loading: false,
  error: null,

  getAllRoutines: async () => {
    set({ loading: true, error: null });
    try {
      const allRoutines = await db.select().from(routines);
      set({ routines: allRoutines, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getRoutineById: async (id) => {
    try {
      const results = await db
        .select()
        .from(routines)
        .where(eq(routines.id, id));
      return results[0];
    } catch (e) {
      set({ error: (e as Error).message });
      return undefined;
    }
  },

  createRoutine: async (dto) => {
    set({ loading: true, error: null });
    try {
      const now = new Date().toISOString();
      await db.insert(routines).values({
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        ...dto,
      });
      await get().getAllRoutines();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateRoutine: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      await db
        .update(routines)
        .set({ ...dto, updated_at: new Date().toISOString() })
        .where(eq(routines.id, id));
      await get().getAllRoutines();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteRoutine: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.delete(exercises).where(eq(exercises.routine_id, id));
      await db.delete(routines).where(eq(routines.id, id));
      await get().getAllRoutines();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getExercisesByRoutineId: async (routineId) => {
    try {
      const results = await db
        .select()
        .from(exercises)
        .where(eq(exercises.routine_id, routineId));
      set({ exercises: results });
      return results;
    } catch (e) {
      set({ error: (e as Error).message });
      return [];
    }
  },

  createExercise: async (dto) => {
    set({ loading: true, error: null });
    try {
      await db.insert(exercises).values({
        id: crypto.randomUUID(),
        ...dto,
      });
      await get().getExercisesByRoutineId(dto.routine_id);
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateExercise: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const current = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, id));
      await db.update(exercises).set(dto).where(eq(exercises.id, id));
      if (current[0]) {
        await get().getExercisesByRoutineId(current[0].routine_id);
      }
      set({ loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteExercise: async (id) => {
    set({ loading: true, error: null });
    try {
      const current = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, id));
      await db.delete(exercises).where(eq(exercises.id, id));
      if (current[0]) {
        await get().getExercisesByRoutineId(current[0].routine_id);
      }
      set({ loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
