import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  useImageWordmark?: boolean;
  variant?: 'auto' | 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  useImageWordmark = false,
  variant = 'auto',
}) => {
  // Scale for the text logo as requested
  const textSizes = {
    sm: 'text-2xl tracking-tight',
    md: 'text-3xl sm:text-4xl tracking-tight',
    lg: 'text-4xl sm:text-5xl tracking-tight',
    xl: 'text-6xl sm:text-7xl tracking-tighter',
  };

  const imgHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  if (useImageWordmark) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src="/assets/aistudio/SFERA__4__76be6c7d.png"
          alt="Sferavis"
          className={`${imgHeights[size]} w-auto object-contain brightness-100 dark:brightness-125 dark:invert`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const sferaColor =
    variant === 'dark'
      ? 'text-white'
      : variant === 'light'
      ? 'text-black'
      : 'text-black dark:text-white';

  // Pure typography reproduction using Oswald, matching the Sferavis wordmark
  return (
    <span
      className={`font-oswald font-black select-none inline-flex items-baseline leading-none transition-transform duration-200 ${textSizes[size]} ${className}`}
    >
      <span className={`${sferaColor} font-extrabold transition-colors duration-200`}>Sfera</span>
      <span className="text-[#A30000] font-black">vis</span>
    </span>
  );
};
