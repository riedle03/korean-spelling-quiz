import React from 'react';

interface VictoryScreenProps {
    heroName: string;
    score: number;
    onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ heroName, score, onRestart }) => (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(30, 30, 30, 0.75)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', padding: '1rem'}}>
        <dialog className="nes-dialog is-dark is-rounded" open style={{width: 'auto', maxWidth: '100%'}}>
            <form method="dialog" style={{textAlign: 'center'}}>
                <p className="title">승리!</p>
                <i className="nes-icon trophy is-large" style={{marginBottom: '1.5rem'}}></i>
                <p style={{marginBottom: '1.5rem', fontSize: '0.9rem'}}>
                    축하합니다, 용사 {heroName}! <br/>
                    당신은 알파벳 마왕을 물리치고 한글 공주를 구했습니다. <br/>
                    한글 왕국에 다시 평화가 찾아왔습니다!
                </p>
                <div style={{marginBottom: '1.5rem'}}>
                    최종 점수: <span className="nes-text is-warning">{score}점</span>
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

export default VictoryScreen;