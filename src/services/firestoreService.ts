import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, UserProgress } from '@/types/task';

// Convert Task dates for Firestore
const taskToFirestore = (task: Task) => ({
  ...task,
  createdAt: Timestamp.fromDate(new Date(task.createdAt)),
  completedAt: task.completedAt ? Timestamp.fromDate(new Date(task.completedAt)) : null,
});

// Convert Firestore data to Task
const firestoreToTask = (data: any): Task => ({
  ...data,
  createdAt: data.createdAt?.toDate() || new Date(),
  completedAt: data.completedAt?.toDate() || undefined,
});

// Save all tasks for a user
export const saveUserTasks = async (userId: string, tasks: Task[]) => {
  const userDoc = doc(db, 'users', userId);
  const tasksData = tasks.map(taskToFirestore);
  await setDoc(userDoc, { tasks: tasksData }, { merge: true });
};

// Save user progress
export const saveUserProgress = async (userId: string, progress: UserProgress) => {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { progress }, { merge: true });
};

// Get user data (tasks + progress)
export const getUserData = async (userId: string) => {
  const userDoc = doc(db, 'users', userId);
  const snapshot = await getDoc(userDoc);
  
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      tasks: (data.tasks || []).map(firestoreToTask),
      progress: data.progress || null,
    };
  }
  
  return { tasks: [], progress: null };
};

// Subscribe to user data changes
export const subscribeToUserData = (
  userId: string, 
  callback: (data: { tasks: Task[]; progress: UserProgress | null }) => void
) => {
  const userDoc = doc(db, 'users', userId);
  
  return onSnapshot(userDoc, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        tasks: (data.tasks || []).map(firestoreToTask),
        progress: data.progress || null,
      });
    } else {
      callback({ tasks: [], progress: null });
    }
  });
};
