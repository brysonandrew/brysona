import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AnimatedTitle = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Mark as animated after the animation completes
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2500); // Total animation duration

    return () => clearTimeout(timer);
  }, []);

  const letterVariants: Variants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      filter: 'blur(10px)',
    },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    final: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  } as const;

  const glowVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.5,
    },
    animate: {
      opacity: [0, 1, 0.8, 1],
      scale: [0.5, 1.2, 1, 1.1],
      transition: {
        duration: 2.5,
        ease: 'easeInOut',
        times: [0, 0.4, 0.8, 1],
      },
    },
    final: {
      opacity: 1,
      scale: 1.1,
    },
  } as const;

  const word = 'OUTREACHER';
  const letters = word.split('');

  return (
    <div className="relative flex items-center justify-center py-8 md:py-12 opacity-40">
      <motion.div
        className="relative inline-block"
        initial="initial"
        animate={hasAnimated ? 'final' : 'animate'}
      >
        {/* Main glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary opacity-10 blur-3xl"
          variants={glowVariants}
          style={{
            filter: 'blur(60px)',
          }}
        />

        {/* Text container */}
        <div className="relative flex items-center gap-1 md:gap-2">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="relative inline-block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
              style={{
                background:
                  'linear-gradient(135deg, rgba(45, 212, 191, 0.4) 0%, rgba(113, 174, 225, 0.4) 50%, rgba(45, 212, 191, 0.4) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow:
                  '0 0 10px rgba(45, 212, 191, 0.15)',
                // fontFamily:
                //   'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
              {/* Individual letter glow */}
              <motion.span
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={
                  hasAnimated
                    ? { opacity: 0.1 }
                    : {
                        opacity: [0, 0.3, 0.15, 0.2],
                        transition: {
                          duration: 0.6,
                          delay: i * 0.1,
                          repeat: 0,
                        },
                      }
                }
                style={{
                  background:
                    'linear-gradient(135deg, rgba(45, 212, 191, 0.3) 0%, rgba(113, 174, 225, 0.3) 100%)',
                  filter: 'blur(8px)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  zIndex: -1,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            </motion.span>
          ))}
        </div>

        {/* Holographic overlay effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={
            hasAnimated
              ? { opacity: 0.05 }
              : {
                  opacity: [0, 0.15, 0.05, 0.08],
                  transition: {
                    duration: 2.5,
                    ease: 'easeInOut',
                  },
                }
          }
          style={{
            background:
              'linear-gradient(45deg, transparent 30%, rgba(45, 212, 191, 0.05) 50%, transparent 70%)',
            mixBlendMode: 'overlay',
          }}
        />
      </motion.div>
    </div>
  );
};
