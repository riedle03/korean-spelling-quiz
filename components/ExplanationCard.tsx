import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExplanationCardProps {
  isCorrect: boolean | null;
  explanation: string;
  correctWord: string;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ isCorrect, explanation, correctWord }) => {
  if (isCorrect === null) return null;

  const [streamedExplanation, setStreamedExplanation] = useState('');

  useEffect(() => {
    if (explanation && typeof explanation === 'string') {
      setStreamedExplanation('');
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < explanation.length) {
          const char = explanation[index];
          if (char !== undefined) {
            setStreamedExplanation(prev => (prev || '') + char);
          }
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [explanation]);

  return (
    <div className="nes-container is-dark" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 className={`nes-text ${isCorrect ? 'is-success' : 'is-error'}`} style={{fontSize: '1rem'}}>
            {isCorrect ? "정답입니다!" : "아쉬워요!"}
        </h3>
        {!isCorrect && <p style={{marginTop: '0.25rem', fontSize: '0.9rem'}}>정답은 '{correctWord || ''}'입니다.</p>}
      </div>
      <div className="prose" style={{textAlign: 'left', fontSize: '0.8rem', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {explanation ? (
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedExplanation || ''}</ReactMarkdown>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}>
            <i className="nes-icon star is-small spinner"></i>
            <p style={{fontSize: '0.8rem'}}>해설 생성중...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationCard;