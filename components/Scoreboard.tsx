import React from 'react';

interface ScoreboardProps {
  score: number;
  level: number;
  levelProgress: number;
  hearts: number;
  correctAnswersPerLevel: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, level, levelProgress, hearts, correctAnswersPerLevel }) => {
  const progressValue = (levelProgress / correctAnswersPerLevel) * 100;

  return (
    <div className="nes-container with-title" style={{padding: '0.5rem 1rem'}}>
      <p className="title">게임 현황</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
        <div>
          <span>LV: {level}</span>
          <progress className="nes-progress is-warning" value={progressValue} max="100" style={{ height: '15px', width: '80px', marginLeft: '0.5rem' }}></progress>
        </div>
        <div>
            <span>SCORE: {score}</span>
        </div>
        <div>
          <span style={{marginRight: '0.5rem'}}>HP:</span>
          {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`nes-icon heart is-small ${i < hearts ? '' : 'is-transparent'}`}
              ></i>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
