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
    <div className="nes-container" style={{padding: '0.25rem 0.5rem'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
          <span style={{whiteSpace: 'nowrap'}}>LV: {level}</span>
          <progress 
            className="nes-progress is-warning" 
            value={progressValue} 
            max="100" 
            style={{ height: '12px', width: '60px', marginLeft: '0.25rem' }}
          ></progress>
        </div>
        <div style={{whiteSpace: 'nowrap'}}>
            <span>SCORE: {score}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
          <span style={{marginRight: '0.25rem', whiteSpace: 'nowrap'}}>HP:</span>
          {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`nes-icon heart is-small ${i < hearts ? '' : 'is-transparent'}`}
                style={{fontSize: '0.6rem'}}
              ></i>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;