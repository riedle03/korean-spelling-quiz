import React, { useState, useEffect } from 'react';

interface GameOverScreenProps {
    heroName: string;
    score: number;
    level: number;
    onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ heroName, score, level, onRestart }) => {
    const [streamedMessage, setStreamedMessage] = useState('');
    const message = `용사 ${heroName || ''}의 여정은 여기까지...\n알파벳 마왕의 공격에 쓰러져 한글 공주를 구하지 못했습니다.`;
    
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
                    <p className="title">게임 오버</p>
                    <i className="nes-icon heart is-transparent" style={{transform: 'scale(2.5)', marginBottom: '1.5rem', imageRendering: 'pixelated'}}></i>
                    <p style={{marginBottom: '1.5rem', fontSize: '0.9rem', whiteSpace: 'pre-line', minHeight: '54px'}}>
                        {streamedMessage || ''}
                    </p>
                    <div style={{marginBottom: '1.5rem'}}>
                        최종 점수: <span className="nes-text is-primary">{score || 0}점</span>,
                        레벨: <span className="nes-text is-primary">{level || 1}</span>
                    </div>
                    <menu className="dialog-menu">
                        <button 
                        onClick={onRestart} 
                        className="nes-btn is-primary"
                        >
                            다시 도전하기
                        </button>
                    </menu>
                </form>
            </dialog>
        </div>
    );
};

export default GameOverScreen;