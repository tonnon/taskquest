import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XpPopupProps {
  amount: number;
}

const XpPopup = ({ amount }: XpPopupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: -20, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.8 }}
      className="absolute top-2 right-2 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-glow-md"
    >
      <Zap className="w-4 h-4" />
      +{amount} XP
    </motion.div>
  );
};

export default XpPopup;
