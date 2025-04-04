export interface User {
  id: number;
  username: string;
  password: string;
  img_url?: string;
  salt: string;
  bio: string;
  admin: boolean;
  blocked: boolean;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Attendee {
  id: number;
  username: string;
  img_url?: string;
}

export type EventType = "race" | "fun-run" | "training" | "hang";
export const EventTypes = ["race", "fun-run", "training", "hang"];

export interface OTRCEvent {
  id: number;
  name: string;
  type: EventType;
  poster: number;
  time: Date;
  description: string;
  img_url?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Comment {
  id: number;
  commenter: number;
  event_id: number;
  message: string;
}

export interface IDParam {
  id: number;
}

export interface IAuthBody {
  username: string;
  password: string;
  email?: string;
}

export interface ISimpleReply {
  200: { user_id: number };
  "4xx": { error: string };
  "5xx": { error: any };
}

export interface IUserReply {
  200: User;
  "4xx": { error: string };
  "5xx": { error: any };
}

export interface IUsersReply {
  200: User[];
  "4xx": { error: string };
  "5xx": { error: any };
}
