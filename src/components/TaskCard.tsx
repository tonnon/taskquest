import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import Checklist from './Checklist';
import XpPopup from './XpPopup';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard = ({ task, isDragging }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [xpPopup, setXpPopup] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedCount = task.checklist.filter((item) => item.completed).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  const handleXpGain = (amount: number) => {
    setXpPopup({ amount, visible: true });
    setTimeout(() => setXpPopup({ amount: 0, visible: false }), 1500);
  };

  const handleTaskComplete = () => {
    // Additional celebration effects could go here
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDragging ? 0.8 : 1, 
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging 
          ? '0 20px 40px rgba(139, 92, 246, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative glass-card rounded-xl overflow-hidden card-hover ${
        isComplete ? 'border-success/30' : 'border-border/50'
      }`}
    >
      {/* Progress indicator at top */}
      {totalCount > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/50">
          <motion.div
            className={`h-full ${isComplete ? 'bg-success' : 'xp-bar-gradient'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* XP Popup */}
      <AnimatePresence>
        {xpPopup.visible && (
          <XpPopup amount={xpPopup.amount} />
        )}
      </AnimatePresence>

      <div className="p-4 pt-5">
        {/* Header */}
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 rounded hover:bg-muted/50 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-base leading-tight ${
                isComplete ? 'text-success' : 'text-foreground'
              }`}>
                {isComplete && <Sparkles className="inline w-4 h-4 mr-1" />}
                {task.title}
              </h3>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {totalCount > 0 && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isComplete 
                      ? 'bg-success/20 text-success' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {completedCount}/{totalCount}
                  </span>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteTask(task.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Checklist Toggle */}
        {task.checklist.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Ocultar checklist
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Mostrar checklist
              </>
            )}
          </button>
        )}

        {/* Checklist */}
        <AnimatePresence>
          {(isExpanded || task.checklist.length === 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/30">
                <Checklist
                  taskId={task.id}
                  items={task.checklist}
                  onXpGain={handleXpGain}
                  onTaskComplete={handleTaskComplete}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskCard;
