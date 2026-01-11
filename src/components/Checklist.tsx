import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Edit3, X, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import confetti from 'canvas-confetti';

interface ChecklistProps {
  taskId: string;
  items: ChecklistItemType[];
  onXpGain: (amount: number) => void;
  onTaskComplete: () => void;
}

const Checklist = ({ taskId, items, onXpGain, onTaskComplete }: ChecklistProps) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newSubTexts, setNewSubTexts] = useState<Record<string, string>>({});
  const [activeSubInput, setActiveSubInput] = useState<string | null>(null);
  const [collapsedSubLists, setCollapsedSubLists] = useState<Record<string, boolean>>({});
  const [editingSub, setEditingSub] = useState<{ parentId: string; subId: string } | null>(null);
  const [editSubText, setEditSubText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);
  const addSubInputRef = useRef<HTMLInputElement>(null);
  
  const {
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    addSubChecklistItem,
    deleteSubChecklistItem,
    toggleSubChecklistItem,
    updateSubChecklistItem,
  } = useTaskStore();

  const completedCount = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addChecklistItem(taskId, newItemText.trim());
    setNewItemText('');
  };

  const handleAddSubItem = (parentId: string) => {
    const text = (newSubTexts[parentId] || '').trim();
    if (!text) return;
    addSubChecklistItem(taskId, parentId, text);
    setNewSubTexts((prev) => ({ ...prev, [parentId]: '' }));
    setActiveSubInput(null);
    setCollapsedSubLists((prev) => ({ ...prev, [parentId]: false }));
  };

  const handleToggleSubItem = (parentId: string, subId: string) => {
    toggleSubChecklistItem(taskId, parentId, subId);
  };

  const handleDeleteSubItem = (parentId: string, subId: string) => {
    deleteSubChecklistItem(taskId, parentId, subId);
  };

  const handleStartEditSub = (parentId: string, sub: ChecklistItemType) => {
    setEditingSub({ parentId, subId: sub.id });
    setEditSubText(sub.text);
  };

  const handleSaveSubEdit = () => {
    if (!editingSub) return;
    updateSubChecklistItem(taskId, editingSub.parentId, editingSub.subId, { text: editSubText });
    setEditingSub(null);
    setEditSubText('');
  };

  const handleCancelSubEdit = () => {
    setEditingSub(null);
    setEditSubText('');
  };

  const handleOpenSubInput = (parentId: string) => {
    setActiveSubInput(parentId);
    setCollapsedSubLists((prev) => ({ ...prev, [parentId]: false }));
  };

  const handleCancelSubInput = () => {
    if (activeSubInput) {
      setNewSubTexts((prev) => ({ ...prev, [activeSubInput]: '' }));
    }
    setActiveSubInput(null);
  };

  const toggleSubListVisibility = (parentId: string) => {
    setCollapsedSubLists((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const handleToggle = (itemId: string) => {
    const { xpGained, taskCompleted } = toggleChecklistItem(taskId, itemId);
    
    if (xpGained > 0) {
      onXpGain(xpGained);
    }
    
    if (taskCompleted) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#A855F7', '#D946EF', '#22C55E'],
      });
      onTaskComplete();
    }
  };

  const handleStartEdit = (item: ChecklistItemType) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = (itemId: string) => {
    if (editText.trim()) {
      updateChecklistItem(taskId, itemId, { text: editText.trim() });
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  useEffect(() => {
    if (editingId) {
      inputRef.current?.focus();
    }
  }, [editingId]);

  useEffect(() => {
    if (editingSub) {
      subInputRef.current?.focus();
    }
  }, [editingSub]);

  useEffect(() => {
    if (activeSubInput) {
      addSubInputRef.current?.focus();
    }
  }, [activeSubInput]);

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      {items.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-primary">
              {completedCount}/{items.length} ({Math.round(progress)}%)
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                progress === 100 
                  ? 'bg-gradient-to-r from-success to-emerald-400' 
                  : 'xp-bar-gradient'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {progress === 100 && (
              <div className="absolute inset-0 shimmer" />
            )}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              className={`group rounded-lg transition-colors ${
                item.completed ? 'bg-success/10' : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex flex-1 items-start gap-2 p-2">
                {editingId === item.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(item.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="h-7 text-sm bg-muted border-border/50"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(item.id)}
                      className="h-6 w-6 hover:bg-success/20"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="h-6 w-6 hover:bg-destructive/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      <motion.div
                        whileTap={{ scale: 0.8 }}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-success border-success'
                            : 'border-muted-foreground/40 hover:border-primary'
                        }`}
                      >
                        <AnimatePresence>
                          {item.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </button>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-sm transition-all ${
                            item.completed
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {item.text}
                        </span>
                        {!collapsedSubLists[item.id] && activeSubInput !== item.id && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenSubInput(item.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Adicionar sub-item"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {item.subItems && item.subItems.length > 0 && (
                        <div className="mt-2 pl-6 space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSubListVisibility(item.id)}
                            className="mb-1 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition"
                          >
                            {collapsedSubLists[item.id] ? (
                              <ChevronRight className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            {collapsedSubLists[item.id] ? 'Mostrar sub-itens' : 'Ocultar sub-itens'}
                            <span className="text-[10px] uppercase tracking-widest">
                              ({item.subItems.length})
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {!collapsedSubLists[item.id] &&
                              item.subItems.map((sub) => {
                                const isEditingSub =
                                  editingSub?.parentId === item.id && editingSub?.subId === sub.id;
                                return (
                                  <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    {isEditingSub ? (
                                      <>
                                        <Input
                                          ref={subInputRef}
                                          value={editSubText}
                                          onChange={(e) => setEditSubText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveSubEdit();
                                            if (e.key === 'Escape') handleCancelSubEdit();
                                          }}
                                          className="h-7 text-xs bg-muted border-border/50"
                                        />
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={handleSaveSubEdit}
                                          className="h-6 w-6 hover:bg-success/20"
                                        >
                                          <Check className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={handleCancelSubEdit}
                                          className="h-6 w-6 hover:bg-destructive/20"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleToggleSubItem(item.id, sub.id)}
                                          className="flex-shrink-0 focus:outline-none"
                                        >
                                          <motion.div
                                            whileTap={{ scale: 0.8 }}
                                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                              sub.completed
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-muted-foreground/30 hover:border-primary'
                                            }`}
                                          >
                                            {sub.completed && <Minus className="w-3 h-3" />}
                                          </motion.div>
                                        </button>
                                        <span
                                          className={`flex-1 text-xs ${
                                            sub.completed ? 'text-muted-foreground line-through' : ''
                                          }`}
                                        >
                                          {sub.text}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleStartEditSub(item.id, sub)}
                                            className="h-5 w-5 hover:bg-primary/20"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteSubItem(item.id, sub.id)}
                                            className="h-5 w-5 hover:bg-destructive/20 text-destructive"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </motion.div>
                                );
                              })}
                          </AnimatePresence>
                        </div>
                      )}

                      {activeSubInput === item.id && (
                        <div className="mt-1 pl-6">
                          <div className="flex items-center gap-2">
                            <Input
                              ref={addSubInputRef}
                              placeholder="Sub-item"
                              value={newSubTexts[item.id] || ''}
                              onChange={(e) =>
                                setNewSubTexts((prev) => ({ ...prev, [item.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSubItem(item.id);
                                }
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  handleCancelSubInput();
                                }
                              }}
                              className="h-7 text-xs bg-background/30 border border-border/40"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleAddSubItem(item.id)}
                              className="h-7 w-7 text-primary hover:bg-primary/10"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={handleCancelSubInput}
                              className="h-7 w-7 text-muted-foreground hover:bg-muted/20"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(item)}
                        className="h-6 w-6 hover:bg-primary/20"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteChecklistItem(taskId, item.id)}
                        className="h-6 w-6 hover:bg-destructive/20 text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="flex items-center gap-2">
        <div className="flex-shrink-0 w-5 h-5 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <Plus className="w-3 h-3 text-muted-foreground/50" />
        </div>
        <Input
          placeholder="Adicionar item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 h-8 text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
        />
      </form>
    </div>
  );
};

export default Checklist;
