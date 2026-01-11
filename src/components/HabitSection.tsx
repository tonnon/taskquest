import { useAuth } from '@/contexts/AuthContext';
import { useShallow } from 'zustand/react/shallow';
import { Sparkles, Flame, CheckCircle2, Clock, PenSquare, Trash2, Plus } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/taskStore';
import { XP_VALUES } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

const HabitSection = () => {
  const { user: authUser } = useAuth();
  
  const {
    userId,
    _hasHydrated,
    isSynced,
    habits,
    habitProgress,
    isLoading,
    toggleHabitCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    userProgress
  } = useTaskStore(
    useShallow((state) => ({
      userId: state.userId,
      _hasHydrated: state._hasHydrated,
      isSynced: state.isSynced,
      habits: state.habits,
      habitProgress: state.habitProgress,
      isLoading: state.isLoading,
      toggleHabitCompletion: state.toggleHabitCompletion,
      addHabit: state.addHabit,
      updateHabit: state.updateHabit,
      deleteHabit: state.deleteHabit,
      userProgress: state.userProgress
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

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const completedIds = useMemo(() => new Set(habitProgress?.completedHabitIds ?? []), [habitProgress]);
  const totalHabits = habits.length;
  const completedCount = completedIds.size;
  const completionPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
  const allCompleted = totalHabits > 0 && completedCount === totalHabits;
  const pendingHabits = useMemo(() => habits.filter((habit) => !completedIds.has(habit.id)), [habits, completedIds]);
  const completedHabits = useMemo(() => habits.filter((habit) => completedIds.has(habit.id)), [habits, completedIds]);

  const resetForm = () => {
    setFormValues({
      title: '',
      description: '',
    });
    setEditingHabitId(null);
  };

  useEffect(() => {
    if (allCompleted && totalHabits > 0) {
      setShowCelebration(true);
      const timeout = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timeout);
    }
    setShowCelebration(false);
  }, [allCompleted, totalHabits]);

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    setFormValues({
      title: habit.title,
      description: habit.description ?? '',
    });
    setEditingHabitId(habitId);
    setDialogOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = formValues.title.trim();
    if (!trimmedTitle) return;

    const description = formValues.description.trim();
    const payload = {
      title: trimmedTitle,
      description,
    };

    if (editingHabitId) {
      updateHabit(editingHabitId, payload);
    } else {
      addHabit(payload);
    }

    setDialogOpen(false);
    resetForm();
  };

  const renderHabitCard = (habit: typeof habits[number], isCompleted: boolean) => (
    <div
      key={habit.id}
      className={cn(
        'flex gap-4 rounded-2xl border border-white/10 bg-background/70 p-4 backdrop-blur transition hover:border-primary/40',
        isCompleted ? 'shadow-[0_0_25px_rgba(16,185,129,0.2)]' : 'shadow-[0_0_25px_rgba(6,182,212,0.2)]'
      )}
    >
      <Checkbox
        checked={isCompleted}
        disabled={isLoading}
        onCheckedChange={() => toggleHabitCompletion(habit.id)}
        className={cn(
          'h-6 w-6 rounded-md border-2 data-[state=checked]:bg-emerald-400/20 data-[state=checked]:border-emerald-300 data-[state=checked]:text-emerald-200',
          'data-[state=unchecked]:border-cyan-300 data-[state=unchecked]:text-cyan-200'
        )}
      />
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{habit.title}</p>
              <span className="text-xs uppercase tracking-widest text-primary/90 rounded-full border border-primary/40 px-2 py-0.5">
                +{habit.xpReward} XP
              </span>
            </div>
            {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => openEditDialog(habit.id)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover hábito</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Tem certeza de que deseja excluir &ldquo;{habit.title}&rdquo;?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHabit(habit.id)}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className={cn('h-4 w-4', habit.streak > 0 ? 'text-orange-400' : '')} />
            {habit.streak > 0 ? `${habit.streak} dia${habit.streak > 1 ? 's' : ''} de sequência` : 'Sem sequência'}
          </span>
          {habit.lastCompletedDate && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Última vez: {new Date(habit.lastCompletedDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (!isDataReady) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-background/80 to-background/40 p-6 space-y-6">
           {/* Header Skeleton */}
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-muted/20 rounded" />
                  <div className="h-8 w-28 bg-muted/20 rounded" />
              </div>
              <div className="h-8 w-64 bg-muted/30 rounded" />
              <div className="h-4 w-full max-w-md bg-muted/20 rounded" />
           </div>
           
           {/* Content Skeleton */}
           <div className="space-y-6">
              <div className="space-y-2">
                  <div className="flex justify-between">
                      <div className="h-4 w-24 bg-muted/20 rounded" />
                      <div className="h-4 w-32 bg-muted/20 rounded" />
                  </div>
                  <div className="h-2 w-full bg-muted/10 rounded" />
              </div>

              {/* Habit Cards Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 rounded-2xl border border-white/5 bg-background/40 p-4">
                        <div className="h-6 w-6 rounded-md bg-muted/20 flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-48 bg-muted/30 rounded" />
                                        <div className="h-5 w-16 bg-muted/20 rounded-full" />
                                    </div>
                                    <div className="h-4 w-3/4 bg-muted/20 rounded" />
                                </div>
                                <div className="flex gap-1">
                                    <div className="h-8 w-8 bg-muted/10 rounded" />
                                    <div className="h-8 w-8 bg-muted/10 rounded" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-4 w-24 bg-muted/10 rounded" />
                                <div className="h-4 w-32 bg-muted/10 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <Card className="relative border-white/5 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur overflow-hidden">
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/50 px-4 py-1 text-sm font-semibold text-white shadow-lg"
              >
                Todos os hábitos concluídos! +{XP_VALUES.HABIT_ALL_COMPLETE_BONUS} XP
              </motion.div>
              <motion.div
                className="absolute inset-0 opacity-70"
                initial={{ rotate: 0 }}
                animate={{ rotate: 6 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.4), transparent 45%), radial-gradient(circle at 80% 30%, rgba(14,165,233,0.4), transparent 40%), radial-gradient(circle at 50% 80%, rgba(236,72,153,0.4), transparent 35%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Hábitos Diários
            </div>
            <Button size="sm" onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo hábito
            </Button>
          </div>
          <CardTitle className="text-2xl">Construa consistência todos os dias</CardTitle>
          <p className="text-sm text-muted-foreground">
            Marque hábitos para ganhar XP extra. Complete todos para garantir o bônus diário.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalHabits > 0 ? (
            <>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso de hoje</span>
                  <span className="font-semibold text-primary">
                    {completedCount}/{totalHabits} hábitos ({completionPercent}%)
                  </span>
                </div>
                <Progress value={completionPercent} className="h-2 bg-muted" />
              </div>

              <div className="space-y-3">
                {habits.map((habit) => renderHabitCard(habit, completedIds.has(habit.id)))}
              </div>

              <div
                className={cn(
                  'rounded-xl border px-4 py-3 text-sm flex items-center gap-3',
                  allCompleted
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-white/10 bg-white/5 text-muted-foreground'
                )}
              >
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                {allCompleted ? (
                  <span>Parabéns! Você garantiu +{XP_VALUES.HABIT_ALL_COMPLETE_BONUS} XP de bônus hoje.</span>
                ) : (
                  <span>
                    Complete todos os hábitos do dia para garantir um bônus extra de +{XP_VALUES.HABIT_ALL_COMPLETE_BONUS} XP.
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-lg font-semibold">Nenhum hábito cadastrado</p>
                  <p className="text-sm text-muted-foreground">
                    Crie hábitos diários para ganhar XP constante e desbloquear o bônus de consistência.
                  </p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeiro hábito
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 animate-spin" />
          Sincronizando hábitos...
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHabitId ? 'Editar hábito' : 'Novo hábito'}</DialogTitle>
            <DialogDescription>Defina um título claro e descreva o hábito para manter sua motivação.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="habit-title">Título</Label>
              <Input
                id="habit-title"
                value={formValues.title}
                onChange={(event) => setFormValues((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Ex.: Beber 2L de água"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-description">Descrição</Label>
              <Textarea
                id="habit-description"
                value={formValues.description}
                onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Detalhe como você deseja cumprir esse hábito"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingHabitId ? 'Salvar alterações' : 'Adicionar hábito'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HabitSection;
