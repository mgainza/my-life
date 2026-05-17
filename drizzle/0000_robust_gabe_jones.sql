CREATE TABLE `daily_checkins` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`energy` integer NOT NULL,
	`stress` integer NOT NULL,
	`mood` integer NOT NULL,
	`trained_today` integer DEFAULT 0 NOT NULL,
	`session_id` text,
	`notes` text,
	`daily_score` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`name` text NOT NULL,
	`sets` integer NOT NULL,
	`reps` text NOT NULL,
	`rest_seconds` integer,
	`notes` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sleep_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`sleep_time` text NOT NULL,
	`wake_time` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`quality` integer NOT NULL,
	`wake_ups` integer DEFAULT 0 NOT NULL,
	`wake_feeling` integer NOT NULL,
	`notes` text,
	`score` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `training_questionnaire_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`energy` integer NOT NULL,
	`fatigue` integer NOT NULL,
	`muscle_soreness` integer NOT NULL,
	`completed` integer NOT NULL,
	`mood` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`session_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`routine_id` text,
	`duration_minutes` integer NOT NULL,
	`notes` text,
	`score` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
