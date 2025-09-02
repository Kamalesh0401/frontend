import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const cardProps: MotionProps = onClick
    ? {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    }
    : {};

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...cardProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
