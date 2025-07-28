import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: (name: string) => void;
  isLoading?: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading = false }) => {
  const [name, setName] = useState('');
  const [streamedIntro1, setStreamedIntro1] = useState('');
  const [streamedIntro2, setStreamedIntro2] = useState('');
  const [isPart1Done, setIsPart1Done] = useState(false);

  const introText1 = "따분한 국어 시간, 꾸벅꾸벅 졸던 평범한 고등학생인 당신...\n\n눈을 떠보니 이곳은 '한글 왕국'?! 정신을 차릴 새도 없이, 왕국의 신하가 다급하게 외칩니다.";
  const introText2 = "\"고대 한글 왕국에 재앙이 닥쳤습니다. 사악한 '알파벳 마왕'이 나타나, 우리의 소중한 '한글 공주'를 납치했습니다!\n\n마왕의 성으로 가는 길은 강력한 맞춤법 몬스터들이 지키고 있습니다.\n\n왕국의 마지막 희망, 용사여! 당신의 이름을 알려주세요!\"";

  useEffect(() => {
    setStreamedIntro1('');
    let index = 0;
    const intervalId = setInterval(() => {
        if (index < introText1.length) {
            const char = introText1[index];
            if (char !== undefined) {
                setStreamedIntro1(prev => (prev || '') + char);
            }
            index++;
        } else {
            clearInterval(intervalId);
            setIsPart1Done(true);
        }
    }, 30);
    return () => clearInterval(intervalId);
  }, [introText1]);

  useEffect(() => {
    if (isPart1Done) {
      setStreamedIntro2('');
      let index = 0;
      const intervalId = setInterval(() => {
          if (index < introText2.length) {
              const char = introText2[index];
              if (char !== undefined) {
                  setStreamedIntro2(prev => (prev || '') + char);
              }
              index++;
          } else {
              clearInterval(intervalId);
          }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [isPart1Done, introText2]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onStart(name.trim());
    }
  };

  return (
    <div className="nes-container with-title is-centered">
      <p className="title">게임 속 맞춤법 용사로 살아남기</p>
      
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left', padding: '0 1rem', minHeight: '350px' }}>
        <p style={{ whiteSpace: 'pre-line' }} className="nes-text is-primary">{streamedIntro1 || ''}</p>
        
        {isPart1Done && (
          <>
            <div style={{ margin: '1rem 0', textAlign: 'center' }}>
              <img 
                src="/devilking1.png" 
                alt="알파벳 마왕에게 잡혀있는 한글 공주" 
                style={{ 
                  imageRendering: 'pixelated', 
                  maxWidth: '80%', 
                  maxHeight: '180px',
                  margin: 'auto'
                }} 
              />
            </div>
            <p style={{ whiteSpace: 'pre-line' }} className="nes-text is-primary">{streamedIntro2 || ''}</p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <div className="nes-field">
          <label htmlFor="name_field" style={{fontSize: '0.9rem'}}>용사 이름</label>
          <input
            type="text"
            id="name_field"
            className="nes-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="여기에 입력..."
            maxLength={10}
            required
            style={{textAlign: 'center'}}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className={`nes-btn is-primary ${isLoading ? 'is-disabled' : ''}`}
          disabled={isLoading}
          style={{ minHeight: '46px' }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <i className="nes-icon star is-small spinner"></i>
              <span>모험을 준비하는 중...</span>
            </span>
          ) : (
            '모험 시작하기'
          )}
        </button>
      </form>
    </div>
  );
};

export default StartScreen;