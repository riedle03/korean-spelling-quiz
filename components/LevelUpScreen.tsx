import React, { useState, useEffect } from 'react';

interface LevelUpScreenProps {
  level: number;
  onProceed: () => void;
}

const bosses = {
  2: { name: "혼돈의 쌍둥이 '리'와 '이'", description: "'리'와 '이'는 발음이 비슷해 용사들을 헷갈리게 만듭니다. 집중해서 둘의 차이를 간파하세요!" },
  3: { name: "망각의 그림자 '돼'와 '되'", description: "'돼'와 '되'는 용사들의 기억을 흐리게 하여 올바른 활용법을 잊게 합니다. 문장의 구조를 잘 살펴보세요!" },
  4: { name: "오타의 유령 '낫'과 '낮'", description: "'낫'과 '낮'은 글자의 형태를 교묘하게 바꿔 용사의 눈을 속입니다. 한 글자 한 글자 신중하게 보세요!" },
  5: { name: "알파벳 마왕", description: "마침내 마주한 최종 보스! 알파벳 마왕은 한글의 근본을 뒤흔드는 가장 어려운 문제들을 냅니다. 공주님을 구할 마지막 관문입니다!" }
};

const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ level, onProceed }) => {
  const boss = bosses[level as keyof typeof bosses];
  const [streamedDescription, setStreamedDescription] = useState('');
  
  useEffect(() => {
    if (boss) {
      const description = boss.description;
      setStreamedDescription('');
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < description.length) {
          setStreamedDescription(prev => prev + description[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [boss]);

  if (!boss) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(30, 30, 30, 0.75)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', padding: '1rem'}}>
        <dialog className="nes-dialog is-dark is-rounded" open style={{width: 'auto', maxWidth: '100%'}}>
            <form method="dialog" style={{textAlign: 'center'}}>
                <p className="title">{level === 5 ? "최종 보스 등장!" : "중간 보스 등장!"}</p>
                <p className="nes-text is-warning" style={{marginBottom: '1rem'}}>LEVEL {level-1} CLEAR!</p>
                <i className="nes-octocat animate" style={{transform: 'scale(1.5)', marginBottom: '1.5rem'}}></i>
                <h3 style={{marginBottom: '1rem'}}>{boss.name}</h3>
                <p style={{marginBottom: '2rem', fontSize: '0.9rem', minHeight: '54px'}}>{streamedDescription}</p>
                <menu className="dialog-menu">
                    <button 
                        onClick={onProceed} 
                        className="nes-btn is-primary"
                    >
                        {level === 5 ? "최후의 결전 시작" : "도전하기"}
                    </button>
                </menu>
            </form>
        </dialog>
    </div>
  );
};

export default LevelUpScreen;