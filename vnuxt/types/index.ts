export interface OTRCEvent {
  id: number;
  name: string;
  type: string;
  poster: number;
  time: Date;
  description?: string;
  img_url?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  comments: Comment[];
  attendees: User[];
}

export interface EventInfo {
  name: string;
  type: string;
  time: Date;
  description?: string;
}

export interface OTRCEventCard {
  id: number;
  name: string;
  type: string;
  poster: number;
  time: Date;
  description?: string;
  img_url?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  comment_count: number;
  attendees: User[];
}

export interface Comment {
  id: number;
  event_id: number;
  commenter: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface User {
  id: number;
  username: string;
  img_url?: string;
}
