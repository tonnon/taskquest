import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, ChecklistItem, UserProgress, calculateLevel, XP_VALUES } from '@/types/task';
import { saveUserTasks, saveUserProgress, getUserData, subscribeToUserData } from '@/services/firestoreService';

interface TaskStore {
  tasks: Task[];
  userProgress: UserProgress;
  userId: string | null;
  isLoading: boolean;
  isSynced: boolean;
  
  // User actions
  setUserId: (userId: string | null) => void;
  loadUserData: (userId: string) => Promise<void>;
  
  // Task actions
  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  
  // Checklist actions
  addChecklistItem: (taskId: string, text: string) => void;
  updateChecklistItem: (taskId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => { xpGained: number; taskCompleted: boolean };
  
  // XP actions
  addXp: (amount: number) => boolean;
  
  // Sync
  syncToFirestore: () => void;
}

const initialProgress: UserProgress = {
  totalXp: 0,
  level: 1,
  xpToNextLevel: 100,
  currentLevelXp: 0,
  tasksCompleted: 0,
  checklistsCompleted: 0,
};

let syncTimeout: NodeJS.Timeout | null = null;

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      userProgress: initialProgress,
      userId: null,
      isLoading: false,
      isSynced: false,

      setUserId: (userId) => {
        set({ userId });
        if (!userId) {
          set({ tasks: [], userProgress: initialProgress, isSynced: false });
        }
      },

      loadUserData: async (userId) => {
        set({ isLoading: true });
        try {
          const data = await getUserData(userId);
          set({
            tasks: data.tasks,
            userProgress: data.progress || initialProgress,
            isSynced: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ isLoading: false });
        }
      },

      syncToFirestore: () => {
        const { userId, tasks, userProgress } = get();
        if (!userId) return;

        // Debounce sync
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(async () => {
          try {
            await Promise.all([
              saveUserTasks(userId, tasks),
              saveUserProgress(userId, userProgress),
            ]);
          } catch (error) {
            console.error('Error syncing to Firestore:', error);
          }
        }, 500);
      },

      addTask: (title, description) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          description,
          status: 'todo',
          checklist: [],
          xpReward: XP_VALUES.TASK_COMPLETE,
          createdAt: new Date(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        get().syncToFirestore();
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
        get().syncToFirestore();
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        get().syncToFirestore();
      },

      moveTask: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  completedAt: status === 'done' ? new Date() : undefined,
                }
              : task
          ),
        }));
        get().syncToFirestore();
      },

      addChecklistItem: (taskId, text) => {
        const newItem: ChecklistItem = {
          id: uuidv4(),
          text,
          completed: false,
        };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, checklist: [...task.checklist, newItem] }
              : task
          ),
        }));
        get().syncToFirestore();
      },

      updateChecklistItem: (taskId, itemId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  checklist: task.checklist.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : task
          ),
        }));
        get().syncToFirestore();
      },

      deleteChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  checklist: task.checklist.filter((item) => item.id !== itemId),
                }
              : task
          ),
        }));
        get().syncToFirestore();
      },

      toggleChecklistItem: (taskId, itemId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return { xpGained: 0, taskCompleted: false };

        const item = task.checklist.find((i) => i.id === itemId);
        if (!item) return { xpGained: 0, taskCompleted: false };

        const wasCompleted = item.completed;
        const newCompleted = !wasCompleted;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((i) =>
                    i.id === itemId ? { ...i, completed: newCompleted } : i
                  ),
                }
              : t
          ),
        }));

        let xpGained = 0;
        let taskCompleted = false;

        if (newCompleted) {
          xpGained += XP_VALUES.CHECKLIST_ITEM;
          
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              checklistsCompleted: state.userProgress.checklistsCompleted + 1,
            },
          }));

          const updatedTask = get().tasks.find((t) => t.id === taskId);
          if (updatedTask && updatedTask.checklist.every((i) => i.completed) && updatedTask.checklist.length > 0) {
            xpGained += XP_VALUES.TASK_COMPLETE + XP_VALUES.BONUS_ALL_ITEMS;
            taskCompleted = true;
            
            get().moveTask(taskId, 'done');
            
            set((state) => ({
              userProgress: {
                ...state.userProgress,
                tasksCompleted: state.userProgress.tasksCompleted + 1,
              },
            }));
          }

          get().addXp(xpGained);
        }

        get().syncToFirestore();
        return { xpGained, taskCompleted };
      },

      addXp: (amount) => {
        const currentProgress = get().userProgress;
        const newTotalXp = currentProgress.totalXp + amount;
        const { level, xpToNextLevel, currentLevelXp } = calculateLevel(newTotalXp);
        const leveledUp = level > currentProgress.level;

        set({
          userProgress: {
            ...currentProgress,
            totalXp: newTotalXp,
            level,
            xpToNextLevel,
            currentLevelXp,
          },
        });

        get().syncToFirestore();
        return leveledUp;
      },
    }),
    {
      name: 'task-quest-storage',
    }
  )
);
