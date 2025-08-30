import React from 'react';

const BackgroundWrapper = ({ children, theme }) => {
  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      {/* Overlay for better readability */}
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: theme === 'dark' 
            ? 'rgba(17, 24, 39, 0.92)' // dark overlay
            : 'rgba(249, 250, 251, 0.88)', // light overlay
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;