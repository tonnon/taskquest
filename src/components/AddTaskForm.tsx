import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTaskStore } from '@/store/taskStore';

interface AddTaskFormProps {
  onClose?: () => void;
}

const AddTaskForm = ({ onClose }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTask(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    setIsOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    onClose?.();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 text-foreground gap-2 h-12 rounded-xl transition-all hover:shadow-glow-sm"
              variant="ghost"
            >
              <Plus className="w-5 h-5" />
              Nova Tarefa
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Nova Tarefa</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-7 w-7 rounded-lg hover:bg-destructive/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/50 border-border/50 focus:border-primary/50 rounded-lg"
              autoFocus
            />
            
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 border-border/50 focus:border-primary/50 rounded-lg resize-none min-h-[60px]"
              rows={2}
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-lg"
              >
                Criar
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddTaskForm;
