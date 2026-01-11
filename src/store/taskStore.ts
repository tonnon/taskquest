import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User } from 'firebase/auth';
import {
  Task,
  TaskStatus,
  ChecklistItem,
  UserProgress,
  calculateLevel,
  XP_VALUES,
  Habit,
  HabitDayProgress,
} from '@/types/task';
import {
  saveUserTasks,
  saveUserHabits,
  saveUserHabitProgress,
  saveUserProgress,
  getUserData,
  saveUserAvatarUrl,
  uploadUserAvatarImage,
  subscribeToUserData,
} from '@/services/firestoreService';

interface TaskStore {
  tasks: Task[];
  userProgress: UserProgress;
  userId: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  isSynced: boolean;
  _hasHydrated: boolean;
  levelUpTrigger: number;
  habits: Habit[];
  habitProgress: HabitDayProgress;

  // User actions
  setUserId: (userId: string | null) => void;
  loadUserData: (userId: string) => Promise<void>;
  setAvatarUrl: (avatarUrl: string | null) => void;
  updateAvatar: (file: File) => Promise<void>;
  syncAvatarFromAuth: (user: User) => Promise<void>;

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
  addSubChecklistItem: (taskId: string, parentItemId: string, text: string) => void;
  deleteSubChecklistItem: (taskId: string, parentItemId: string, subItemId: string) => void;
  toggleSubChecklistItem: (taskId: string, parentItemId: string, subItemId: string) => void;
  updateSubChecklistItem: (
    taskId: string,
    parentItemId: string,
    subItemId: string,
    updates: Pick<ChecklistItem, 'text'>
  ) => void;

  // XP actions
  addXp: (amount: number) => boolean;
  ackLevelUp: () => void;

  // Habit actions
  toggleHabitCompletion: (habitId: string) => void;
  addHabit: (habit: { title: string; description?: string }) => void;
  updateHabit: (habitId: string, updates: { title?: string; description?: string }) => void;
  deleteHabit: (habitId: string) => void;

  // Sync
  syncToFirestore: () => void;
  toggleTaskCompletion: (taskId: string) => number; // Returns XP gained
  setCustomFrameUrl: (url: string | null) => void;
}

const initialProgress: UserProgress = {
  totalXp: 0,
  level: 0, // sentinel until data loads
  xpToNextLevel: 100,
  currentLevelXp: 0,
  tasksCompleted: 0,
  checklistsCompleted: 0,
};

let syncTimeout: NodeJS.Timeout | null = null;
let userDataUnsubscribe: (() => void) | null = null;

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
const getTodayKey = () => formatDateKey(new Date());
const getDateFromKey = (key: string) => new Date(`${key}T00:00:00`);
const getYesterdayKey = (referenceKey = getTodayKey()) => {
  const date = getDateFromKey(referenceKey);
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
};

const createHabit = (title: string, description?: string, xpReward = XP_VALUES.HABIT_COMPLETE): Habit => ({
  id: uuidv4(),
  title,
  description,
  xpReward,
  lastCompletedDate: null,
  streak: 0,
  createdAt: new Date().toISOString(),
});

const DEFAULT_HABIT_BLUEPRINTS: Array<{ title: string; description: string }> = [
  { title: 'Planejar o dia', description: 'Revise suas tarefas pela manhã' },
  { title: 'Fazer uma pausa ativa', description: 'Alongue-se ou caminhe por 5 minutos' },
];

const buildDefaultHabits = () => DEFAULT_HABIT_BLUEPRINTS.map((habit) => createHabit(habit.title, habit.description));

const ensureTodayHabitProgress = (progress: HabitDayProgress | null, todayKey: string): HabitDayProgress => {
  if (!progress || progress.date !== todayKey) {
    return {
      date: todayKey,
      completedHabitIds: [],
      bonusGranted: false,
    };
  }
  return {
    ...progress,
    completedHabitIds: [...progress.completedHabitIds],
  };
};

const initialHabits = buildDefaultHabits();
const initialHabitProgress = ensureTodayHabitProgress(null, getTodayKey());
const createChecklistItem = (text: string): ChecklistItem => ({
  id: uuidv4(),
  text,
  completed: false,
  subItems: [],
});

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      userProgress: initialProgress,
      userId: null,
      avatarUrl: null,
      isLoading: true,
      isSynced: false,
      _hasHydrated: false,
      levelUpTrigger: 0,
      habits: initialHabits,
      habitProgress: initialHabitProgress,

      setUserId: (userId) => {
        const currentState = get();

        if (!userId) {
          if (userDataUnsubscribe) {
            userDataUnsubscribe();
            userDataUnsubscribe = null;
          }
          if (syncTimeout) {
            clearTimeout(syncTimeout);
            syncTimeout = null;
          }
          set({
            userId: null,
            tasks: [],
            userProgress: initialProgress,
            avatarUrl: null,
            habits: initialHabits,
            habitProgress: initialHabitProgress,
            isSynced: false,
            isLoading: false,
            levelUpTrigger: 0,
          });
          return;
        }

        if (currentState.userId === userId) {
          return;
        }

        set({
          userId,
          tasks: [],
          userProgress: initialProgress,
          avatarUrl: null,
          habits: initialHabits,
          habitProgress: initialHabitProgress,
          isSynced: false,
          isLoading: true,
          levelUpTrigger: 0,
        });
      },

      loadUserData: async (userId) => {
        if (!userId) return;

        set({ isLoading: true });

        try {
          const data = await getUserData(userId);
          const todayKey = getTodayKey();
          const habitProgress = ensureTodayHabitProgress(data.habitProgress, todayKey);
          const habits = data.habits.length > 0 ? data.habits : buildDefaultHabits();
          const progress = data.progress && data.progress.level > 0 ? data.progress : initialProgress;

          set({
            tasks: data.tasks,
            userProgress: progress,
            avatarUrl: data.avatarUrl,
            habits,
            habitProgress,
            isSynced: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ isLoading: false, isSynced: false });
        }

        if (userDataUnsubscribe) {
          userDataUnsubscribe();
          userDataUnsubscribe = null;
        }

        userDataUnsubscribe = subscribeToUserData(userId, ({ data }) => {
          const todayKey = getTodayKey();
          const habitProgress = ensureTodayHabitProgress(data.habitProgress, todayKey);
          const habits = data.habits.length > 0 ? data.habits : buildDefaultHabits();

          set((state) => ({
            tasks: data.tasks,
            userProgress: data.progress || state.userProgress,
            avatarUrl: data.avatarUrl,
            habits,
            habitProgress,
            isSynced: true,
            isLoading: false,
          }));
        });
      },

      setAvatarUrl: (avatarUrl) => set({ avatarUrl }),

      updateAvatar: async (file) => {
        const { userId } = get();
        if (!userId) return;

        try {
          const downloadUrl = await uploadUserAvatarImage(userId, file);
          await saveUserAvatarUrl(userId, downloadUrl);
          set({ avatarUrl: downloadUrl });
        } catch (error) {
          console.error('Error updating avatar:', error);
          throw error;
        }
      },

      syncAvatarFromAuth: async (user) => {
        const { userId, avatarUrl } = get();
        if (!userId || user.uid !== userId) return;

        const fallbackAvatar = '/placeholder.svg';
        const providerIds = user.providerData.map((provider) => provider.providerId);
        const isGoogleUser = providerIds.includes('google.com');
        const googlePhoto = user.photoURL || null;
        const hasCustomAvatar = avatarUrl && avatarUrl !== fallbackAvatar && avatarUrl !== googlePhoto;

        if (hasCustomAvatar) return;

        const desiredAvatar = isGoogleUser && googlePhoto ? googlePhoto : fallbackAvatar;
        if (!desiredAvatar || avatarUrl === desiredAvatar) return;

        set({ avatarUrl: desiredAvatar });

        try {
          await saveUserAvatarUrl(userId, desiredAvatar);
        } catch (error) {
          console.error('Error syncing avatar from auth:', error);
        }
      },

      syncToFirestore: () => {
        const { userId, tasks, userProgress, habits, habitProgress } = get();
        if (!userId) return;

        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(async () => {
          try {
            await Promise.all([
              saveUserTasks(userId, tasks),
              saveUserProgress(userId, userProgress),
              saveUserHabits(userId, habits),
              saveUserHabitProgress(userId, habitProgress),
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
          description: description?.trim() || undefined,
          status: 'todo',
          checklist: [],
          xpReward: XP_VALUES.TASK_COMPLETE,
          createdAt: new Date(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        get().syncToFirestore();
      },

      addSubChecklistItem: (taskId, parentItemId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const newItem = createChecklistItem(trimmed);
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === parentItemId
                  ? {
                      ...item,
                      subItems: item.subItems ? [...item.subItems, newItem] : [newItem],
                    }
                  : item
              ),
            };
          }),
        }));
        get().syncToFirestore();
      },

      deleteSubChecklistItem: (taskId, parentItemId, subItemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === parentItemId
                  ? {
                      ...item,
                      subItems: item.subItems?.filter((sub) => sub.id !== subItemId),
                    }
                  : item
              ),
            };
          }),
        }));
        get().syncToFirestore();
      },

      toggleSubChecklistItem: (taskId, parentItemId, subItemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === parentItemId
                  ? {
                      ...item,
                      subItems: item.subItems?.map((sub) =>
                        sub.id === subItemId ? { ...sub, completed: !sub.completed } : sub
                      ),
                    }
                  : item
              ),
            };
          }),
        }));
        get().syncToFirestore();
      },

      updateSubChecklistItem: (taskId, parentItemId, subItemId, updates) => {
        const normalizedText =
          updates.text !== undefined ? updates.text.trim() : undefined;
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === parentItemId
                  ? {
                      ...item,
                      subItems: item.subItems?.map((sub) =>
                        sub.id === subItemId
                          ? {
                              ...sub,
                              ...(normalizedText !== undefined ? { text: normalizedText } : {}),
                            }
                          : sub
                      ),
                    }
                  : item
              ),
            };
          }),
        }));
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
        const trimmed = text.trim();
        if (!trimmed) return;
        const newItem = createChecklistItem(trimmed);
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
        const wasChecklistComplete =
          task.checklist.length > 0 && task.checklist.every((i) => i.completed);

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
        let checklistCompleted = false;

        if (newCompleted) {
          xpGained += XP_VALUES.CHECKLIST_ITEM;

          set((state) => ({
            userProgress: {
              ...state.userProgress,
              checklistsCompleted: state.userProgress.checklistsCompleted + 1,
            },
          }));

          const updatedTask = get().tasks.find((t) => t.id === taskId);
          if (
            updatedTask &&
            updatedTask.checklist.length > 0 &&
            updatedTask.checklist.every((i) => i.completed)
          ) {
            xpGained += XP_VALUES.BONUS_ALL_ITEMS;
            checklistCompleted = true;
          }

          get().addXp(xpGained);
        } else {
          xpGained -= XP_VALUES.CHECKLIST_ITEM;

          set((state) => ({
            userProgress: {
              ...state.userProgress,
              checklistsCompleted: Math.max(0, state.userProgress.checklistsCompleted - 1),
            },
          }));

          if (wasChecklistComplete) {
            xpGained -= XP_VALUES.BONUS_ALL_ITEMS;
          }

          get().addXp(xpGained);
        }

        get().syncToFirestore();
        return { xpGained, taskCompleted: checklistCompleted };
      },

      toggleTaskCompletion: (taskId) => {
        const { tasks } = get();
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return 0;

        const newStatus = task.status === 'done' ? 'todo' : 'done';
        let xpDelta = 0;

        if (newStatus === 'done') {
          xpDelta = XP_VALUES.TASK_COMPLETE;
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              tasksCompleted: state.userProgress.tasksCompleted + 1,
            },
          }));
        } else {
          xpDelta = -XP_VALUES.TASK_COMPLETE;
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              tasksCompleted: Math.max(0, state.userProgress.tasksCompleted - 1),
            },
          }));
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'done' ? new Date() : undefined,
                }
              : t
          ),
        }));

        get().addXp(xpDelta);
        get().syncToFirestore();
        return xpDelta;
      },

      addXp: (amount) => {
        const currentProgress = get().userProgress;
        const newTotalXp = Math.max(0, currentProgress.totalXp + amount);
        const { level, xpToNextLevel, currentLevelXp } = calculateLevel(newTotalXp);
        const leveledUp = amount > 0 && level > currentProgress.level;

        set({
          userProgress: {
            ...currentProgress,
            totalXp: newTotalXp,
            level,
            xpToNextLevel,
            currentLevelXp,
          },
          levelUpTrigger: leveledUp ? Date.now() : get().levelUpTrigger,
        });

        get().syncToFirestore();
        return leveledUp;
      },

      ackLevelUp: () => {
        set({ levelUpTrigger: 0 });
      },

      toggleHabitCompletion: (habitId) => {
        const todayKey = getTodayKey();
        let xpDelta = 0;

        set((state) => {
          const habitIndex = state.habits.findIndex((habit) => habit.id === habitId);
          if (habitIndex === -1) return state;

          const habit = state.habits[habitIndex];
          const updatedHabits = [...state.habits];
          const habitProgress = ensureTodayHabitProgress(state.habitProgress, todayKey);
          const isCompleted = habitProgress.completedHabitIds.includes(habitId);
          let updatedCompleted = [...habitProgress.completedHabitIds];
          let bonusGranted = habitProgress.bonusGranted;

          if (isCompleted) {
            updatedCompleted = updatedCompleted.filter((id) => id !== habitId);
            if (habit.lastCompletedDate === todayKey) {
              updatedHabits[habitIndex] = {
                ...habit,
                lastCompletedDate: null,
                streak: Math.max(0, habit.streak - 1),
              };
            } else {
              updatedHabits[habitIndex] = habit;
            }
            xpDelta -= habit.xpReward;
            if (bonusGranted) {
              bonusGranted = false;
              xpDelta -= XP_VALUES.HABIT_ALL_COMPLETE_BONUS;
            }
          } else {
            updatedCompleted = [...updatedCompleted, habitId];
            const yesterdayKey = getYesterdayKey(todayKey);
            const newStreak = habit.lastCompletedDate === yesterdayKey ? habit.streak + 1 : 1;
            updatedHabits[habitIndex] = {
              ...habit,
              lastCompletedDate: todayKey,
              streak: newStreak,
            };
            xpDelta += habit.xpReward;
            if (!bonusGranted && updatedCompleted.length === updatedHabits.length) {
              bonusGranted = true;
              xpDelta += XP_VALUES.HABIT_ALL_COMPLETE_BONUS;
            }
          }

          return {
            ...state,
            habits: updatedHabits,
            habitProgress: {
              date: todayKey,
              completedHabitIds: updatedCompleted,
              bonusGranted,
            },
          };
        });

        if (xpDelta !== 0) {
          get().addXp(xpDelta);
        } else {
          get().syncToFirestore();
        }
      },

      addHabit: ({ title, description }) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        const normalizedDescription = description?.trim() || undefined;
        const newHabit = createHabit(trimmedTitle, normalizedDescription, XP_VALUES.HABIT_COMPLETE);
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
        get().syncToFirestore();
      },

      updateHabit: (habitId, updates) => {
        set((state) => {
          const normalizedTitle = typeof updates.title === 'string' ? updates.title.trim() : undefined;
          const normalizedDescription =
            updates.description !== undefined ? updates.description.trim() || undefined : undefined;

          return {
            habits: state.habits.map((habit) =>
              habit.id === habitId
                ? {
                    ...habit,
                    ...(normalizedTitle ? { title: normalizedTitle } : {}),
                    ...(updates.description !== undefined ? { description: normalizedDescription } : {}),
                  }
                : habit
            ),
          };
        });
        get().syncToFirestore();
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== habitId),
          habitProgress: {
            ...state.habitProgress,
            completedHabitIds: state.habitProgress.completedHabitIds.filter((id) => id !== habitId),
          },
        }));
        get().syncToFirestore();
      },

      setCustomFrameUrl: (url) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            customFrameUrl: url || undefined,
          },
        }));
        get().syncToFirestore();
      },
    }),
    {
      name: 'task-quest-v2-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          state.isSynced = false;
          state.isLoading = true;
        }
      },
      partialize: (state) => ({
        tasks: state.tasks,
        userProgress: state.userProgress,
        userId: state.userId,
        avatarUrl: state.avatarUrl,
        habits: state.habits,
        habitProgress: state.habitProgress,
      }),
    }
  )
);
