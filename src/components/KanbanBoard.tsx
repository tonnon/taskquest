import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, COLUMNS, TaskStatus } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import Column from './Column';
import TaskCard from './TaskCard';
import LevelUpModal from './LevelUpModal';
import KanbanSkeleton from './KanbanSkeleton';

const KanbanBoard = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const { user: authUser } = useAuth();
  const {
    tasks,
    moveTask,
    userProgress,
    isLoading,
    isSynced,
    userId,
    _hasHydrated,
    levelUpTrigger,
    ackLevelUp,
  } = useTaskStore(
    useShallow((state) => ({
      tasks: state.tasks,
      moveTask: state.moveTask,
      userProgress: state.userProgress,
      isLoading: state.isLoading,
      isSynced: state.isSynced,
      userId: state.userId,
      _hasHydrated: state._hasHydrated,
      levelUpTrigger: state.levelUpTrigger,
      ackLevelUp: state.ackLevelUp,
    }))
  );

  // Stricter loading check: must be hydrated, 
  // userId must match current auth user, AND level must be > 0
  // We don't wait for isSynced/isLoading to avoid the "Level 1 flash" on refresh
  const isDataReady = 
    _hasHydrated && 
    authUser && 
    userId === authUser.uid && 
    userProgress.level > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Show level up modal only when trigger changes
  useEffect(() => {
    if (!isSynced || levelUpTrigger === 0) return;
    setShowLevelUp(true);
  }, [levelUpTrigger, isSynced]);

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const isColumn = COLUMNS.some((col) => col.id === overId);
    
    if (isColumn) {
      moveTask(taskId, overId as TaskStatus);
    } else {
      // Dropped on another task - find which column it belongs to
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        moveTask(taskId, overTask.status);
      }
    }
  };

  if (!isDataReady) {
    return <KanbanSkeleton />;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3">
              <TaskCard task={activeTask} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal
            level={userProgress.level}
            onClose={() => {
              setShowLevelUp(false);
              ackLevelUp();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default KanbanBoard;
