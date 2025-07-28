import React from 'react';
import { QuizData } from '../types';

type QuizOption = {
  word: string;
  isCorrect: boolean;
};

interface QuizCardProps {
  quizData: QuizData;
  options: QuizOption[];
  onSelectAnswer: (selectedWord: string) => void;
  userAnswer: string | null;
  isAnswered: boolean;
  level: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ quizData, options, onSelectAnswer, userAnswer, isAnswered, level }) => {
  const { sentence, correctWord } = quizData;

  const getButtonClass = (word: string) => {
    if (!isAnswered) {
      return "";
    }
    if (word === correctWord) {
      return "is-success";
    }
    if (word === userAnswer) {
      return "is-error";
    }
    return "is-disabled";
  };
  
  const getPromptText = () => {
    if (level === 5) return "알파벳 마왕의 마지막 시험이다!";
    if (level > 1) return "중간 보스가 길을 막아섰다!";
    return "몬스터가 나타났다! 빈칸에 들어갈 알맞은 말은?";
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="nes-container is-dark with-title" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        <p className="title">문제</p>
        <p style={{fontSize: '0.8rem'}}>{getPromptText()}</p>
      </div>

      <section className="nes-balloon from-left" style={{ marginBottom: '1rem', fontSize: '1rem', padding: '0.5rem 1rem' }}>
        <p>
          {sentence.split('__')[0]}
          <span className="nes-text is-primary">
            {isAnswered ? ` ${correctWord} ` : ' ____ '}
          </span>
          {sentence.split('__')[1]}
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
        {options.map(({ word }) => (
          <button
            key={word}
            onClick={() => onSelectAnswer(word)}
            disabled={isAnswered}
            type="button"
            className={`nes-btn ${getButtonClass(word)}`}
            style={{ width: '100%', height: '40px' }}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
