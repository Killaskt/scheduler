export interface Task {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  scheduledAt?: string | Date | null;
  completedAt?: string | Date | null;
  placeId?: string | null;
  isHabit?: boolean;
  habitConfig?: Partial<{
    streak: number;
    cadence: 'daily' | 'weekly' | 'monthly';
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Place {
  id: string;
  name: string;
  address?: string;
  hours?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface HabitConfig {
  id: string;
  title: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  reminderAt?: string | Date | null;
}

export interface StorageAdapter {
  getTasks: () => Promise<Task[]>;
  saveTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // ...other persistence methods as needed
}

export type ViewMode = 'calendar' | 'tasks' | 'habits';
