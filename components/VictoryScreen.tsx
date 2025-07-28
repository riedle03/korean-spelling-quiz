import React, { useState, useEffect } from 'react';

interface VictoryScreenProps {
    heroName: string;
    score: number;
    onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ heroName, score, onRestart }) => {
    const [streamedMessage, setStreamedMessage] = useState('');
    const message = `축하합니다, 용사 ${heroName || ''}!\n당신은 알파벳 마왕을 물리치고 한글 공주를 구했습니다.\n한글 왕국에 다시 평화가 찾아왔습니다!`;
    
    useEffect(() => {
        if (message && typeof message === 'string') {
            setStreamedMessage('');
            let index = 0;
            const intervalId = setInterval(() => {
                if (index < message.length) {
                    const char = message[index];
                    if (char !== undefined) {
                        setStreamedMessage(prev => (prev || '') + char);
                    }
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 30);
            return () => clearInterval(intervalId);
        }
    }, [message]);

    return (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30, 30, 30, 0.75)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', padding: '1rem'}}>
            <dialog className="nes-dialog is-dark is-rounded" open style={{width: 'auto', maxWidth: '100%'}}>
                <form method="dialog" style={{textAlign: 'center'}}>
                    <p className="title">승리!</p>
                    <img 
                        src="/hero2.png" 
                        alt="한글 용사와 공주" 
                        style={{ 
                            imageRendering: 'pixelated', 
                            maxWidth: '80%', 
                            maxHeight: '180px',
                            margin: 'auto',
                            marginBottom: '1.5rem'
                        }} 
                    />
                    <p style={{marginBottom: '1.5rem', fontSize: '0.9rem', whiteSpace: 'pre-line', minHeight: '72px'}}>
                        {streamedMessage || ''}
                    </p>
                    <div style={{marginBottom: '1.5rem'}}>
                        최종 점수: <span className="nes-text is-warning">{score || 0}점</span>
                    </div>
                    <menu className="dialog-menu">
                        <button 
                        onClick={onRestart} 
                        className="nes-btn is-success"
                        >
                            새로운 모험 떠나기
                        </button>
                    </menu>
                </form>
            </dialog>
        </div>
    );
};

export default VictoryScreen;