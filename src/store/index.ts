import { create } from 'zustand';
import { produce } from 'immer';
import { Task, Place, HabitConfig } from '@/types'; // Assuming types are defined in @/types

interface AppState {
  tasks: Task[];
  places: Place[];
  viewMode: 'calendar' | 'tasks' | 'habits';
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  addPlace: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  
  setViewMode: (mode: 'calendar' | 'tasks' | 'habits') => void;
  setSelectedDate: (date: Date) => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  tasks: [],
  places: [],
  viewMode: 'calendar',
  selectedDate: new Date(),
  isLoading: false,
  error: null,

  addTask: (taskData) =>
    set(produce((state: AppState) => {
      const newTask: Task = {
        ...taskData,
        id: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.tasks.push(newTask);
    })),

  updateTask: (id, updates) =>
    set(produce((state: AppState) => {
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        Object.assign(task, updates, { updatedAt: new Date() });
      }
    })),

  deleteTask: (id) =>
    set(produce((state: AppState) => {
      state.tasks = state.tasks.filter((t) => t.id !== id);
    })),

  toggleTaskComplete: (id) =>
    set(produce((state: AppState) => {
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.completedAt = task.completedAt ? undefined : new Date();
        task.updatedAt = new Date();
      }
    })),

  addPlace: (placeData) =>
    set(produce((state: AppState) => {
      const newPlace: Place = {
        ...placeData,
        id: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.places.push(newPlace);
    })),

  updatePlace: (id, updates) =>
    set(produce((state: AppState) => {
      const place = state.places.find((p) => p.id === id);
      if (place) {
        Object.assign(place, updates, { updatedAt: new Date() });
      }
    })),

  deletePlace: (id) =>
    set(produce((state: AppState) => {
      state.places = state.places.filter((p) => p.id !== id);
    })),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
