import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="nes-icon star is-small spinner"></i>
        <p>한글 공주를 구하러 가고 있어요</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;