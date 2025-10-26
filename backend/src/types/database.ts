/**
 * Database type definitions for DebateHub
 * These types match the database schema defined in Knex migrations
 */

// Enum types
export type DebateMode = 'unmoderated' | 'moderated';
export type DebateStatus = 'waiting' | 'active' | 'concluded';
export type ParticipantSide = 'for' | 'against' | 'neutral';

// Source type for fact checks
export interface FactCheckSource {
  url: string;
  title?: string;
  domain?: string;
}

// Rating history entry
export interface RatingHistoryEntry {
  date: string;
  rating: number;
}

/**
 * Users table
 */
export interface User {
  id: string; // UUID
  username: string;
  email: string;
  password_hash: string;
  rating: number;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Insert type for users (without auto-generated fields)
 */
export interface UserInsert {
  id?: string;
  username: string;
  email: string;
  password_hash: string;
  rating?: number;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Update type for users (all fields optional)
 */
export interface UserUpdate {
  username?: string;
  email?: string;
  password_hash?: string;
  rating?: number;
  avatar_url?: string | null;
  bio?: string | null;
  updated_at?: Date;
}

/**
 * Debates table
 */
export interface Debate {
  id: string; // UUID
  topic: string;
  description: string | null;
  mode: DebateMode;
  status: DebateStatus;
  created_by: string; // UUID reference to users
  winner_id: string | null; // UUID reference to users
  created_at: Date;
  concluded_at: Date | null;
}

/**
 * Insert type for debates
 */
export interface DebateInsert {
  id?: string;
  topic: string;
  description?: string | null;
  mode: DebateMode;
  status?: DebateStatus;
  created_by: string;
  winner_id?: string | null;
  created_at?: Date;
  concluded_at?: Date | null;
}

/**
 * Update type for debates
 */
export interface DebateUpdate {
  topic?: string;
  description?: string | null;
  mode?: DebateMode;
  status?: DebateStatus;
  winner_id?: string | null;
  concluded_at?: Date | null;
}

/**
 * Debate Participants table
 */
export interface DebateParticipant {
  id: string; // UUID
  debate_id: string; // UUID reference to debates
  user_id: string; // UUID reference to users
  side: ParticipantSide;
  joined_at: Date;
}

/**
 * Insert type for debate participants
 */
export interface DebateParticipantInsert {
  id?: string;
  debate_id: string;
  user_id: string;
  side: ParticipantSide;
  joined_at?: Date;
}

/**
 * Update type for debate participants
 */
export interface DebateParticipantUpdate {
  side?: ParticipantSide;
}

/**
 * Messages table
 */
export interface Message {
  id: string; // UUID
  debate_id: string; // UUID reference to debates
  user_id: string; // UUID reference to users
  content: string;
  is_flagged: boolean;
  created_at: Date;
}

/**
 * Insert type for messages
 */
export interface MessageInsert {
  id?: string;
  debate_id: string;
  user_id: string;
  content: string;
  is_flagged?: boolean;
  created_at?: Date;
}

/**
 * Update type for messages
 */
export interface MessageUpdate {
  content?: string;
  is_flagged?: boolean;
}

/**
 * Fact Checks table
 */
export interface FactCheck {
  id: string; // UUID
  message_id: string; // UUID reference to messages
  claim: string;
  verification_result: string | null;
  confidence_score: number | null; // 0-1
  sources: FactCheckSource[] | null; // JSONB
  created_at: Date;
}

/**
 * Insert type for fact checks
 */
export interface FactCheckInsert {
  id?: string;
  message_id: string;
  claim: string;
  verification_result?: string | null;
  confidence_score?: number | null;
  sources?: FactCheckSource[] | null;
  created_at?: Date;
}

/**
 * Update type for fact checks
 */
export interface FactCheckUpdate {
  claim?: string;
  verification_result?: string | null;
  confidence_score?: number | null;
  sources?: FactCheckSource[] | null;
}

/**
 * User Stats table
 */
export interface UserStats {
  user_id: string; // UUID reference to users (primary key)
  total_debates: number;
  wins: number;
  losses: number;
  draws: number;
  rating_history: RatingHistoryEntry[] | null; // JSONB
  updated_at: Date;
}

/**
 * Insert type for user stats
 */
export interface UserStatsInsert {
  user_id: string;
  total_debates?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  rating_history?: RatingHistoryEntry[] | null;
  updated_at?: Date;
}

/**
 * Update type for user stats
 */
export interface UserStatsUpdate {
  total_debates?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  rating_history?: RatingHistoryEntry[] | null;
  updated_at?: Date;
}

/**
 * Database table mapping
 */
export interface Database {
  users: User;
  debates: Debate;
  debate_participants: DebateParticipant;
  messages: Message;
  fact_checks: FactCheck;
  user_stats: UserStats;
}

/**
 * Type helper for getting table names
 */
export type TableName = keyof Database;
