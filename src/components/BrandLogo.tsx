import React from 'react';
import { COMPANY_NAME } from '../constants';

interface BrandLogoProps {
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  variant?: 'default' | 'white' | 'dark';
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto object-contain',
  theme = 'auto',
  variant,
  alt = COMPANY_NAME
}) => {
  // If explicitly forced to white or dark variant
  if (variant === 'white' || theme === 'dark') {
    return (
      <img
        src="/Logo-White.png"
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src.includes('Logo-White.png')) {
            target.src = '/Logo-White.svg';
          }
        }}
      />
    );
  }

  if (variant === 'dark' || theme === 'light') {
    return (
      <img
        src="/Logo.png"
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src.includes('Logo.png')) {
            target.src = '/Logo.svg';
          }
        }}
      />
    );
  }

  // Automatic mode: switches dynamically based on the .dark CSS class on document/html
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Light Mode Logo (Visible in Light Mode, Hidden in Dark Mode) */}
      <img
        src="/Logo.png"
        alt={alt}
        className={`${className} dark:hidden transition-opacity duration-300`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src.includes('Logo.png')) {
            target.src = '/Logo.svg';
          }
        }}
      />
      {/* Dark Mode Logo (Hidden in Light Mode, Visible in Dark Mode / Contrast Background) */}
      <img
        src="/Logo-White.png"
        alt={alt}
        className={`${className} hidden dark:block transition-opacity duration-300`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src.includes('Logo-White.png')) {
            target.src = '/Logo-White.svg';
          }
        }}
      />
    </div>
  );
};
