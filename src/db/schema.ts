import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const trainingSessions = sqliteTable('training_sessions', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  type: text('type').notNull(),
  routine_id: text('routine_id'),
  duration_minutes: integer('duration_minutes').notNull(),
  notes: text('notes'),
  score: integer('score').notNull().default(0),
  created_at: text('created_at').notNull(),
});

export const trainingQuestionnaireAnswers = sqliteTable('training_questionnaire_answers', {
  id: text('id').primaryKey(),
  session_id: text('session_id')
    .notNull()
    .references(() => trainingSessions.id),
  energy: integer('energy').notNull(),
  fatigue: integer('fatigue').notNull(),
  muscle_soreness: integer('muscle_soreness').notNull(),
  completed: integer('completed').notNull(),
  mood: integer('mood').notNull(),
  notes: text('notes'),
});

export const sleepLogs = sqliteTable('sleep_logs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  sleep_time: text('sleep_time').notNull(),
  wake_time: text('wake_time').notNull(),
  duration_minutes: integer('duration_minutes').notNull(),
  quality: integer('quality').notNull(),
  wake_ups: integer('wake_ups').notNull().default(0),
  wake_feeling: integer('wake_feeling').notNull(),
  notes: text('notes'),
  score: integer('score').notNull().default(0),
});

export const dailyCheckins = sqliteTable('daily_checkins', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  energy: integer('energy').notNull(),
  stress: integer('stress').notNull(),
  mood: integer('mood').notNull(),
  trained_today: integer('trained_today').notNull().default(0),
  session_id: text('session_id').references(() => trainingSessions.id),
  notes: text('notes'),
  daily_score: integer('daily_score').notNull().default(0),
});

export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  routine_id: text('routine_id')
    .notNull()
    .references(() => routines.id),
  name: text('name').notNull(),
  sets: integer('sets').notNull(),
  reps: text('reps').notNull(),
  rest_seconds: integer('rest_seconds'),
  notes: text('notes'),
  order: integer('order').notNull(),
});
