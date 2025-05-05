export interface Task {
    id?: number;
    title: string;
    description: string | null;
    status: 'todo' | 'done';
    created_at?: string;
    updated_at?: string;
  }
  
  export type TaskFilter = 'all' | 'todo' | 'done';