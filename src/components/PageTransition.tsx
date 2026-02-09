import React from 'react';
import { motion } from 'framer-motion';

// Manual definition as import might fail in some environments
type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 15, // Start slightly down
    filter: 'blur(5px)' // Add a subtle blur for a glass-like effect
  },
  in: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] // Custom bezier for a very "premium" snappy yet smooth feel
    }
  },
  out: { 
    opacity: 0, 
    y: -15, // Move up slightly when exiting
    filter: 'blur(5px)',
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

interface PageTransitionProps {
  children: React.ReactNode;
}

const MotionDiv = motion.div as any;

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <MotionDiv
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full"
    >
      {children}
    </MotionDiv>
  );
};