import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.98,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const reducedVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
};

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? reducedVariants : pageVariants;

  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}
