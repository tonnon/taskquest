import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column as ColumnType } from '@/types/task';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

const Column = ({ column, tasks }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const columnStyles = {
    todo: 'bg-column-todo',
    'in-progress': 'bg-column-progress',
    done: 'bg-column-done',
  };

  const accentStyles = {
    todo: 'from-blue-500/20 to-transparent',
    'in-progress': 'from-amber-500/20 to-transparent',
    done: 'from-success/20 to-transparent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col rounded-2xl ${columnStyles[column.id]} border border-border/30 overflow-hidden min-h-[500px] ${
        isOver ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`relative p-4 bg-gradient-to-b ${accentStyles[column.id]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{column.icon}</span>
            <h2 className="font-semibold text-lg">{column.title}</h2>
          </div>
          <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Add Task Button (only in todo column) */}
        {column.id === 'todo' && (
          <AddTaskForm />
        )}

        {/* Empty State */}
        {tasks.length === 0 && column.id !== 'todo' && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-2 opacity-30">{column.icon}</div>
            <p className="text-sm text-muted-foreground">
              {column.id === 'in-progress' 
                ? 'Arraste tarefas para cá' 
                : 'Tarefas concluídas aparecem aqui'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Column;
