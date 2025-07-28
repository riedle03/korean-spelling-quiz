import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (name: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="nes-container with-title is-centered">
      <p className="title">한글 용사: 고대 왕국의 부름</p>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left', padding: '0 1rem' }}>
        <p>고대 한글 왕국에 재앙이 닥쳤습니다.</p>
        <p>사악한 '알파벳 마왕'이 나타나, 우리의 소중한 '한글 공주'를 납치했습니다!</p>
        <p>마왕의 성으로 가는 길은 강력한 맞춤법 몬스터들이 지키고 있습니다.</p>
        <p style={{ marginTop: '1rem' }} className="nes-text is-primary">왕국의 마지막 희망, 용사여! 당신의 이름을 알려주세요!</p>
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
          />
        </div>
        <button
          type="submit"
          className="nes-btn is-primary"
        >
          모험 시작하기
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
