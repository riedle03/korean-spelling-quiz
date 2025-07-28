
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuizBatch } from './services/geminiService';
import { QuizData } from './types';
import QuizCard from './components/QuizCard';
import ExplanationCard from './components/ExplanationCard';
import Scoreboard from './components/Scoreboard';
import LoadingSpinner from './components/LoadingSpinner';
import StartScreen from './components/StartScreen';
import LevelUpScreen from './components/LevelUpScreen';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';

type QuizOption = {
  word: string;
  isCorrect: boolean;
};

type GamePhase = 'start' | 'playing' | 'answered' | 'level-up' | 'game-over' | 'victory';
type HeroStatus = 'idle' | 'happy' | 'sad';

const INITIAL_HEARTS = 5;
const CORRECT_ANSWERS_PER_LEVEL = 5;

const App: React.FC = () => {
  const [heroName, setHeroName] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<GamePhase>('start');
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  
  const [quizQueue, setQuizQueue] = useState<QuizData[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  // Gamification state
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(INITIAL_HEARTS);
  const [level, setLevel] = useState<number>(1);
  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [heroStatus, setHeroStatus] = useState<HeroStatus>('idle');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState<boolean>(true);

  const explanationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gamePhase === 'answered' && explanationRef.current) {
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [gamePhase, explanation]);

  const loadQuestionFromQueue = useCallback((index: number, queue: QuizData[]) => {
    if (!queue || queue.length === 0 || index >= queue.length) {
      console.error("Attempted to load question from an invalid queue or index.");
      return;
    }
    const data = queue[index];
    setQuizData(data);
    const newOptions = [
      { word: data.correctWord, isCorrect: true },
      { word: data.incorrectWord, isCorrect: false },
    ].sort(() => Math.random() - 0.5);
    setOptions(newOptions);

    setUserAnswer(null);
    setIsCorrect(null);
    setExplanation('');
    setHeroStatus('idle');
    setGamePhase('playing');
  }, []);

  const fetchQuizBatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuizData(null);
    try {
      const data = await generateQuizBatch();
      setQuizQueue(data);
      setCurrentQuizIndex(0);
      loadQuestionFromQueue(0, data);
      setCanRetry(true);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.toString();
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        setError('요청 한도를 초과했습니다. 1분 후에 다시 시도해주세요.');
        setCanRetry(false);
        setTimeout(() => setCanRetry(true), 60000);
      } else {
        setError('퀴즈 묶음을 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setCanRetry(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadQuestionFromQueue]);

  const handleAnswer = (selectedWord: string) => {
    if (gamePhase !== 'playing' || !quizData) return;

    const chosenOption = options.find(opt => opt.word === selectedWord);
    if (!chosenOption) return;

    setUserAnswer(selectedWord);
    setGamePhase('answered');
    setExplanation(quizData.explanation);

    if (chosenOption.isCorrect) {
      setIsCorrect(true);
      setHeroStatus('happy');
      setScore(prev => prev + 10 * level);
      
      const newLevelProgress = levelProgress + 1;

      if (level === 5 && newLevelProgress >= CORRECT_ANSWERS_PER_LEVEL) {
        setGamePhase('victory');
        return;
      }

      if (newLevelProgress >= CORRECT_ANSWERS_PER_LEVEL) {
        setLevel(prev => prev + 1);
        setLevelProgress(0);
        setGamePhase('level-up');
      } else {
        setLevelProgress(newLevelProgress);
      }
    } else {
      setIsCorrect(false);
      setHeroStatus('sad');
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setGamePhase('game-over');
      }
    }
  };
  
  const handleStartGame = (name: string) => {
    setHeroName(name);
    fetchQuizBatch();
  };

  const handleProceed = () => {
    if (error) {
        fetchQuizBatch();
        return;
    }

    if (gamePhase === 'level-up') {
      setGamePhase('playing');
    }
    
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizQueue.length) {
        setCurrentQuizIndex(nextIndex);
        loadQuestionFromQueue(nextIndex, quizQueue);
    } else {
        fetchQuizBatch();
    }
  };

  const handleRestart = () => {
    setScore(0);
    setHearts(INITIAL_HEARTS);
    setLevel(1);
    setLevelProgress(0);
    setHeroName('');
    setGamePhase('start');
    setHeroStatus('idle');
    setQuizQueue([]);
    setCurrentQuizIndex(0);
  };
  
  const isOverlayPhase = ['level-up', 'game-over', 'victory'].includes(gamePhase);
  const quizVisible = !isLoading && quizData;
  const contentFilter = { filter: isOverlayPhase ? 'blur(2px)' : 'none', transition: 'filter 0.3s ease' };

  return (
    <div className="game-console" aria-label="레트로 게임기 모양 UI">
      <div className="console-top">
          <div className="screen-bezel">
              <div className="screen">
                  {gamePhase === 'start' ? (
                      <div className="screen-content" style={{ height: '100%', overflow: 'auto', width: '100%' }}>
                        <StartScreen onStart={handleStartGame} isLoading={isLoading} />
                      </div>
                  ) : (
                      <React.Fragment>
                          <div className="screen-content-wrapper" style={{
                            ...contentFilter
                          }}>
                            <header>
                              <h1>한글 용사</h1>
                              <p>알파벳 마왕의 군대를 물리쳐라!</p>
                            </header>
                            
                            <div className="screen-scroll-container">
                              <main className="screen-content">
                                <Scoreboard
                                  score={score}
                                  level={level}
                                  levelProgress={levelProgress}
                                  hearts={hearts}
                                  correctAnswersPerLevel={CORRECT_ANSWERS_PER_LEVEL}
                                />
                                <div style={{ marginTop: '0.5rem' }}>
                                    <div className="nes-container" style={{ padding: '1rem' }}>
                                      {isLoading && <LoadingSpinner />}
                                      {error && (
                                        <div style={{ textAlign: 'center' }}>
                                          <p className="nes-text is-error">{error}</p>
                                          <button onClick={handleProceed} className="nes-btn is-error" style={{ marginTop: '1rem' }} disabled={!canRetry || isLoading}>
                                            {canRetry ? '재시도' : '대기 중...'}
                                          </button>
                                        </div>
                                      )}
                                      {quizVisible && (
                                        <div>
                                          <QuizCard
                                            quizData={quizData}
                                            options={options}
                                            onSelectAnswer={handleAnswer}
                                            userAnswer={userAnswer}
                                            isAnswered={gamePhase !== 'playing'}
                                            level={level}
                                          />
                                          <div ref={explanationRef}>
                                            {(gamePhase === 'answered' || isOverlayPhase) && quizData && (
                                              <ExplanationCard
                                                isCorrect={isCorrect}
                                                explanation={explanation}
                                                correctWord={quizData.correctWord}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                </div>
                              
                                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '40px', marginTop: '0.5rem' }}>
                                  {(gamePhase === 'answered' && !isOverlayPhase) && (
                                    <button
                                      onClick={handleProceed}
                                      disabled={isLoading}
                                      className="nes-btn is-primary"
                                    >
                                      다음 문제
                                    </button>
                                  )}
                                </div>
                              </main>
                            </div>

                            <footer>
                              <p>Powered by Google Gemini</p>
                              <div style={{ marginTop: '0.25rem', fontSize: '0.7rem', opacity: 0.8 }}>
                                © 2025 이대형. All rights reserved.<br />
                                <a href="https://aicreatorz.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0f380f', textDecoration: 'underline' }}>
                                  https://aicreatorz.netlify.app/
                                </a>
                              </div>
                            </footer>
                          </div>
                          
                          {gamePhase === 'level-up' && <LevelUpScreen level={level} onProceed={handleProceed} />}
                          {gamePhase === 'game-over' && <GameOverScreen heroName={heroName} score={score} level={level} onRestart={handleRestart} />}
                          {gamePhase === 'victory' && <VictoryScreen heroName={heroName} score={score} onRestart={handleRestart} />}
                      </React.Fragment>
                  )}
                  
                  {gamePhase !== 'start' && (
                      <div className="hero-container" style={{ 
                        position: 'absolute', 
                        bottom: '5px', 
                        right: '5px',
                        width: '100px',
                        height: '100px',
                        zIndex: 10
                      }}>
                                                    <div className={`hero-sprite ${heroStatus}`} style={{
                            width: '80px',
                            height: '80px',
                            position: 'relative',
                            imageRendering: 'pixelated',
                            transform: `scale(${heroStatus === 'happy' ? '1.1' : heroStatus === 'sad' ? '0.9' : '1'})`,
                            transition: 'transform 0.3s ease'
                          }}>
                              <img src="/hero.png"
                                alt="한글 용사 캐릭터"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  imageRendering: 'pixelated',
                                  objectFit: 'contain'
                                }}
                              />
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>
      <div className="console-bottom">
          <div className="controls-row">
            <div className="d-pad" aria-hidden="true">
                <div className="up"></div>
                <div className="right"></div>
                <div className="down"></div>
                <div className="left"></div>
            </div>
            <div className="action-buttons" aria-hidden="true">
                <div className="button b">B</div>
                <div className="button a">A</div>
            </div>
          </div>
          <h2 className="brand-name">GameBoy</h2>
      </div>
    </div>
  );
};

export default App;
