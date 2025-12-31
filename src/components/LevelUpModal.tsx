import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const LevelUpModal = ({ level, onClose }: LevelUpModalProps) => {
  useEffect(() => {
    // Celebration confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#8B5CF6', '#A855F7', '#D946EF', '#F59E0B', '#22C55E'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="relative w-full max-w-md glass-card rounded-3xl p-8 text-center glow-gold"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>

        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-amber-400 mb-6 shadow-glow-gold"
        >
          <Trophy className="w-12 h-12 text-background" />
        </motion.div>

        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="w-5 h-5 text-gold fill-gold" />
          <Star className="w-6 h-6 text-gold fill-gold" />
          <Star className="w-5 h-5 text-gold fill-gold" />
        </div>

        <h2 className="text-3xl font-bold mb-2">
          <span className="text-gradient-gold">Level Up!</span>
        </h2>

        <p className="text-muted-foreground mb-4">
          Parabéns! Você alcançou o
        </p>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-amber-500/20 border border-gold/30 mb-6"
        >
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="text-4xl font-bold text-gradient-gold">
            Nível {level}
          </span>
          <Sparkles className="w-5 h-5 text-gold" />
        </motion.div>

        <p className="text-sm text-muted-foreground mb-6">
          Continue completando tarefas para subir de nível!
        </p>

        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-background font-semibold rounded-xl h-12"
        >
          Continuar
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default LevelUpModal;
