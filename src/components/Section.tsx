import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const MotionDiv = motion.div as any;

export const Section: React.FC<SectionProps> = ({ children, className = "" }) => (
  <MotionDiv
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUp}
    className={className}
  >
    {children}
  </MotionDiv>
);