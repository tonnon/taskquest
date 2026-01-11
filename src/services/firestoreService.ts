import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  Timestamp,
  type DocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Task, UserProgress, Habit, HabitDayProgress } from '@/types/task';

// Convert Task dates for Firestore
const taskToFirestore = (task: Task) => ({
  id: task.id,
  title: task.title,
  description: task.description ?? null,
  status: task.status,
  checklist: task.checklist,
  xpReward: task.xpReward,
  createdAt: Timestamp.fromDate(new Date(task.createdAt)),
  completedAt: task.completedAt ? Timestamp.fromDate(new Date(task.completedAt)) : null,
});

// Convert Firestore data to Task
const firestoreToTask = (data: any): Task => ({
  id: data.id,
  title: data.title,
  description: data.description ?? undefined,
  status: data.status,
  checklist: data.checklist || [],
  xpReward: data.xpReward,
  createdAt: data.createdAt?.toDate() || new Date(),
  completedAt: data.completedAt?.toDate() || undefined,
});

const habitToFirestore = (habit: Habit) => ({
  ...habit,
});

const firestoreToHabit = (data: any): Habit => ({
  id: data.id,
  title: data.title,
  description: data.description ?? undefined,
  xpReward: data.xpReward,
  lastCompletedDate: data.lastCompletedDate ?? null,
  streak: data.streak ?? 0,
  createdAt: data.createdAt ?? new Date().toISOString(),
});

export type FirestoreUserData = {
  tasks: Task[];
  progress: UserProgress | null;
  avatarUrl: string | null;
  habits: Habit[];
  habitProgress: HabitDayProgress | null;
};

// Save all tasks for a user
export const saveUserTasks = async (userId: string, tasks: Task[]) => {
  const userDoc = doc(db, 'users', userId);
  const tasksData = tasks.map(taskToFirestore);
  await setDoc(userDoc, { tasks: tasksData }, { merge: true });
};

export const saveUserHabits = async (userId: string, habits: Habit[]) => {
  const userDoc = doc(db, 'users', userId);
  const habitsData = habits.map(habitToFirestore);
  await setDoc(userDoc, { habits: habitsData }, { merge: true });
};

export const saveUserHabitProgress = async (userId: string, habitProgress: HabitDayProgress | null) => {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { habitProgress }, { merge: true });
};

// Save user progress
export const saveUserProgress = async (userId: string, progress: UserProgress) => {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { progress }, { merge: true });
};

export const saveUserAvatarUrl = async (userId: string, avatarUrl: string | null) => {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { avatarUrl }, { merge: true });
};

export const uploadUserAvatarImage = async (userId: string, file: File) => {
  const avatarRef = ref(storage, `avatars/${userId}`);
  await uploadBytes(avatarRef, file);
  return getDownloadURL(avatarRef);
};

// Get user data (tasks + progress)
export const getUserData = async (userId: string): Promise<FirestoreUserData> => {
  const userDoc = doc(db, 'users', userId);
  const snapshot = await getDoc(userDoc);
  
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      tasks: (data.tasks || []).map(firestoreToTask),
      progress: data.progress || null,
      avatarUrl: data.avatarUrl || null,
      habits: (data.habits || []).map(firestoreToHabit),
      habitProgress: data.habitProgress || null,
    };
  }
  
  return { tasks: [], progress: null, avatarUrl: null, habits: [], habitProgress: null };
};

// Subscribe to user data changes
type UserSnapshotPayload = {
  data: FirestoreUserData;
  exists: boolean;
  fromCache: boolean;
  snapshot: DocumentSnapshot<DocumentData>;
};

export const subscribeToUserData = (
  userId: string, 
  callback: (payload: UserSnapshotPayload) => void
) => {
  const userDoc = doc(db, 'users', userId);
  
  return onSnapshot(userDoc, (snapshot) => {
    const exists = snapshot.exists();
    const fromCache = snapshot.metadata.fromCache;
    const data = snapshot.data();

    const parsedData: FirestoreUserData = exists && data
      ? {
          tasks: (data.tasks || []).map(firestoreToTask),
          progress: data.progress || null,
          avatarUrl: data.avatarUrl || null,
          habits: (data.habits || []).map(firestoreToHabit),
          habitProgress: data.habitProgress || null,
        }
      : { tasks: [], progress: null, avatarUrl: null, habits: [], habitProgress: null };

    callback({
      data: parsedData,
      exists,
      fromCache,
      snapshot,
    });
  });
};
