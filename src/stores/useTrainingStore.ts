import { create } from 'zustand';
import { eq } from 'drizzle-orm';

import { db } from '../db/index';
import { trainingSessions, trainingQuestionnaireAnswers } from '../db/schema';

type TrainingSession = typeof trainingSessions.$inferSelect;
type TrainingAnswer = typeof trainingQuestionnaireAnswers.$inferSelect;

interface CreateTrainingSessionDTO {
  date: string;
  type: string;
  routine_id?: string | null;
  duration_minutes: number;
  notes?: string | null;
  score?: number;
}

interface UpdateTrainingSessionDTO {
  date?: string;
  type?: string;
  routine_id?: string | null;
  duration_minutes?: number;
  notes?: string | null;
  score?: number;
}

interface CreateTrainingAnswerDTO {
  session_id: string;
  energy: number;
  fatigue: number;
  muscle_soreness: number;
  completed: number;
  mood: number;
  notes?: string | null;
}

interface UpdateTrainingAnswerDTO {
  energy?: number;
  fatigue?: number;
  muscle_soreness?: number;
  completed?: number;
  mood?: number;
  notes?: string | null;
}

interface TrainingState {
  sessions: TrainingSession[];
  answers: TrainingAnswer[];
  loading: boolean;
  error: string | null;
}

interface TrainingActions {
  getAllSessions: () => Promise<void>;
  getSessionById: (id: string) => Promise<TrainingSession | undefined>;
  createSession: (dto: CreateTrainingSessionDTO) => Promise<void>;
  updateSession: (id: string, dto: UpdateTrainingSessionDTO) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  getAllAnswers: () => Promise<void>;
  getAnswerBySessionId: (sessionId: string) => Promise<TrainingAnswer | undefined>;
  createAnswer: (dto: CreateTrainingAnswerDTO) => Promise<void>;
  updateAnswer: (id: string, dto: UpdateTrainingAnswerDTO) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
}

export const useTrainingStore = create<TrainingState & TrainingActions>((set, get) => ({
  sessions: [],
  answers: [],
  loading: false,
  error: null,

  getAllSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await db.select().from(trainingSessions);
      set({ sessions, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getSessionById: async (id) => {
    try {
      const results = await db
        .select()
        .from(trainingSessions)
        .where(eq(trainingSessions.id, id));
      return results[0];
    } catch (e) {
      set({ error: (e as Error).message });
      return undefined;
    }
  },

  createSession: async (dto) => {
    set({ loading: true, error: null });
    try {
      await db.insert(trainingSessions).values({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        score: 0,
        ...dto,
      });
      await get().getAllSessions();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateSession: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      await db
        .update(trainingSessions)
        .set(dto)
        .where(eq(trainingSessions.id, id));
      await get().getAllSessions();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await db
        .delete(trainingQuestionnaireAnswers)
        .where(eq(trainingQuestionnaireAnswers.session_id, id));
      await db.delete(trainingSessions).where(eq(trainingSessions.id, id));
      await get().getAllSessions();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getAllAnswers: async () => {
    set({ loading: true, error: null });
    try {
      const answers = await db.select().from(trainingQuestionnaireAnswers);
      set({ answers, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getAnswerBySessionId: async (sessionId) => {
    try {
      const results = await db
        .select()
        .from(trainingQuestionnaireAnswers)
        .where(eq(trainingQuestionnaireAnswers.session_id, sessionId));
      return results[0];
    } catch (e) {
      set({ error: (e as Error).message });
      return undefined;
    }
  },

  createAnswer: async (dto) => {
    set({ loading: true, error: null });
    try {
      await db.insert(trainingQuestionnaireAnswers).values({
        id: crypto.randomUUID(),
        ...dto,
      });
      await get().getAllAnswers();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateAnswer: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      await db
        .update(trainingQuestionnaireAnswers)
        .set(dto)
        .where(eq(trainingQuestionnaireAnswers.id, id));
      await get().getAllAnswers();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteAnswer: async (id) => {
    set({ loading: true, error: null });
    try {
      await db
        .delete(trainingQuestionnaireAnswers)
        .where(eq(trainingQuestionnaireAnswers.id, id));
      await get().getAllAnswers();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
