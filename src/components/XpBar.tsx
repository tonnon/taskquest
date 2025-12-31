import { motion } from 'framer-motion';
import { Trophy, Zap, Target, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

const XpBar = () => {
  const { userProgress } = useTaskStore();
  const progressPercent = (userProgress.currentLevelXp / userProgress.xpToNextLevel) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        {/* Level Badge */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center glow-gold">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-gold" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold shadow-glow-md"
              key={userProgress.level}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              {userProgress.level}
            </motion.div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nível</p>
            <p className="text-2xl font-bold text-gradient-gold">
              {userProgress.level}
            </p>
          </div>
        </motion.div>

        {/* XP Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Experiência</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {userProgress.currentLevelXp} / {userProgress.xpToNextLevel} XP
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 xp-bar-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 shimmer opacity-50" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total: {userProgress.totalXp} XP
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tarefas</p>
              <p className="text-lg font-bold">{userProgress.tasksCompleted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Itens</p>
              <p className="text-lg font-bold">{userProgress.checklistsCompleted}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default XpBar;
