export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
  subItems?: ChecklistItem[];
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  checklist: ChecklistItem[];
  xpReward: number;
  createdAt: Date;
  completedAt?: Date;
};

export type Column = {
  id: TaskStatus;
  title: string;
  icon: string;
};

export type UserProgress = {
  totalXp: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXp: number;
  tasksCompleted: number;
  checklistsCompleted: number;
  customFrameUrl?: string; // URL for AI-generated frame
};

export type Habit = {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  lastCompletedDate: string | null;
  streak: number;
  createdAt: string;
};

export type HabitDayProgress = {
  date: string;
  completedHabitIds: string[];
  bonusGranted: boolean;
};

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'A Fazer', icon: '📋' },
  { id: 'in-progress', title: 'Em Progresso', icon: '⚡' },
  { id: 'done', title: 'Concluído', icon: '✨' },
];

export const XP_VALUES = {
  CHECKLIST_ITEM: 5,
  TASK_COMPLETE: 25,
  BONUS_ALL_ITEMS: 15,
  HABIT_COMPLETE: 10,
  HABIT_ALL_COMPLETE_BONUS: 35,
};

export const calculateLevel = (totalXp: number): { level: number; xpToNextLevel: number; currentLevelXp: number } => {
  // XP needed per level: 100, 150, 225, 337, ... (1.5x each level)
  let level = 1;
  let xpForCurrentLevel = 100;
  let remainingXp = totalXp;

  while (remainingXp >= xpForCurrentLevel) {
    remainingXp -= xpForCurrentLevel;
    level++;
    xpForCurrentLevel = Math.floor(xpForCurrentLevel * 1.5);
  }

  return {
    level,
    xpToNextLevel: xpForCurrentLevel,
    currentLevelXp: remainingXp,
  };
};

export type ArtifactRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ArtifactUnlockCondition =
  | { type: 'habit_streak'; streak: number }
  | { type: 'tasks_completed'; total: number }
  | { type: 'xp_total'; xp: number }
  | { type: 'checklists_completed'; total: number };

export type ArtifactEffect =
  | { type: 'avatar_glow'; gradient: string }
  | { type: 'board_glow'; gradient: string };

export type Artifact = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: ArtifactRarity;
  unlockCondition: ArtifactUnlockCondition;
  effects: ArtifactEffect[];
};

export type ArtifactCollectionState = {
  unlockedIds: string[];
  equippedArtifactId: string | null;
};
