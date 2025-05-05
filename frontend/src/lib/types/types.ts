
export interface User {
  id: number;
  username: string;
}

export interface Task {
  id?: number;
  title: string;
  description: string | null;
  status: 'todo' | 'done';
  visibility: 'private' | 'global';
  user?: User;
  owner_username?: string;
  created_at?: string;
  updated_at?: string;
}

export type TaskFilter = 'all' | 'todo' | 'done';