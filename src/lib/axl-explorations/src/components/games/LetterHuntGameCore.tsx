import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ProgressBar } from "../ProgressBar";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAudioLanguage } from "../../contexts/AudioLanguageContext";
import { Language } from "../../constants/languages";
import { teluguAudioManager } from "../../utils/teluguAudioManager";
import { kannadaAudioManager } from "../../utils/kannadaAudioManager";
import { marathiAudioManager } from "../../utils/marathiAudioManager";
import { ContinueButton } from "./ContinueButton";
import { englishAudioManager } from "../../utils/englishAudioManager";
import { playSuccessSound, attachSlowLoadToast } from "../../utils/audioUtils";
import { hindiAudioManager } from "../../utils/hindiAudioManager";
import { getFontFamilyByLang } from "../../../../../utils/fontUtils";

// Core question interface for Letter Hunt
export interface LetterHuntQuestion {
  target: string;
  options: string[];
  audio: string;
  audioText: string;
  language: Language;
  complexity?: string;
}

interface LetterHuntGameCoreProps {
  // Core game props
  questions: LetterHuntQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isCorrect: boolean;
  
  // Mode configuration
  mode: 'game' | 'preview';
  
  // Event handlers
  onAnswerSelect: (answer: string) => void;
  onContinue: () => void;
  onSpeakerClick?: () => void;
  /**
   * Optional callback invoked when feedback audio sequence completes
   * Used by preview components to reset UI after full feedback message audio finishes
   * Sequence: feedback1 → selected letter → feedback2
   */
  onFeedbackAudioComplete?: () => void;
  
  // UI customization
  showSpeaker?: boolean;
  showContinueButton?: boolean;
  showProgress?: boolean;
  progress?: {
    current: number;
    total: number;
    score?: number;
  };
  
  // Preview-specific props
  isPreview?: boolean;
  demoStep?: string;
  hasClickedSpeaker?: boolean;
  speakerButtonRef?: React.RefObject<HTMLDivElement>;
  optionsRef?: React.RefObject<HTMLDivElement>;
  showHandPointer?: boolean;
  disabled?: boolean;
  
  // Styling
  className?: string;
  // Container control: default 'card' to preserve existing behavior
  useContainer?: 'card' | 'none';
  
  // Lives system
  lives?: number;
  maxLives?: number;
  audioLanguageOverride?: Language;
}

export function LetterHuntGameCore({
  questions,
  currentQuestionIndex,
  selectedAnswer,
  showFeedback,
  isCorrect,
  mode,
  onAnswerSelect,
  onContinue,
  onSpeakerClick,
  onFeedbackAudioComplete,
  showSpeaker = true,
  showContinueButton = true,
  showProgress = false,
  progress,
  isPreview = false,
  demoStep,
  hasClickedSpeaker = false,
  speakerButtonRef,
  optionsRef,
  showHandPointer = false,
  disabled = false,
  className = "",
  useContainer = 'card',
  lives,
  maxLives = 3,
  audioLanguageOverride
}: LetterHuntGameCoreProps) {
  const { selectedLanguage } = useLanguage();
  const { selectedAudioLanguage } = useAudioLanguage();
  const effectiveLanguage = audioLanguageOverride || selectedLanguage;
  const currentQuestion = questions[currentQuestionIndex];
  const [isFeedbackAudioPlaying, setIsFeedbackAudioPlaying] = useState(false);
  
  // Get font family based on current language (for Telugu support)
  const fontFamily = getFontFamilyByLang(effectiveLanguage || selectedLanguage);
  
  // Track active audio instances for stopping playback when needed
  // This allows us to stop all audio (including feedback audio) when user clicks "Next"
  const activeAudioRefs = useRef<Set<HTMLAudioElement>>(new Set());
  const activeTTSRefs = useRef<Set<SpeechSynthesisUtterance>>(new Set());
  const isAudioStoppedRef = useRef(false);

  /**
   * Stop all audio playback (audio files and TTS)
   * Used when user clicks "Next" button or component unmounts
   */
  const stopAllAudio = useCallback(() => {
    isAudioStoppedRef.current = true;
    
    // Stop all HTMLAudioElement instances
    activeAudioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeAudioRefs.current.clear();
    
    // Stop all Text-to-Speech instances
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    activeTTSRefs.current.clear();
    
    // Reset flag after a delay to allow new audio to start
    setTimeout(() => {
      isAudioStoppedRef.current = false;
    }, 100);
  }, []);

  /**
   * Handle continue button click - stops all audio before proceeding
   * This ensures feedback audio doesn't continue playing after user moves to next question
   */
  const handleContinue = useCallback(() => {
    stopAllAudio();
    if (onContinue) {
      onContinue();
    }
  }, [onContinue, stopAllAudio]);

  const getFeedbackLanguage = useCallback(
    (fallback: Language = 'en') => {
      if (mode === 'game') {
        return (audioLanguageOverride || selectedAudioLanguage || selectedLanguage || fallback) as Language;
      }
      return (audioLanguageOverride || effectiveLanguage || fallback) as Language;
    },
    [audioLanguageOverride, effectiveLanguage, mode, selectedAudioLanguage, selectedLanguage]
  );

  // Localized feedback message parts
  // Memoized to prevent unnecessary re-renders
  // In game mode: Uses audio instruction language for feedback text
  // In preview mode: Uses effectiveLanguage (for preview compatibility)
  const getFeedbackText = useCallback((key: 'chosenLetterIs' | 'tryAgain') => {
    const texts = {
      chosenLetterIs: {
        en: 'This is',
        te: 'ఇది',
        kn: 'ಇದು',
        mr: 'हे',
        hi: 'यह'
      },
      tryAgain: {
        en: 'try again',
        te: 'మళ్లీ ప్రయత్నించండి',
        kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
        mr: 'आहे, पुन्हा प्रयत्न करा',
        hi: 'है, फिर कोशिश करें'
      }
    };
    // Determine language with shared helper (ensures consistent fallback)
    const lang = getFeedbackLanguage('en');
    return texts[key][lang] || texts[key].en;
  }, [getFeedbackLanguage]);

  // Enhanced audio function for different languages
  const playAudio = async (text: string, language: Language): Promise<void> => {
    // Check if audio was stopped
    if (isAudioStoppedRef.current) {
      return;
    }
    
    return new Promise((resolve) => {
      // For Telugu, try to use local audio files first
      if (language === 'te') {
        const audioUrl = teluguAudioManager.getAudioUrl(text);
        const audio = new Audio(audioUrl);
        activeAudioRefs.current.add(audio);
        attachSlowLoadToast(audio);
        
        audio.onloadeddata = () => {
          if (isAudioStoppedRef.current) {
            resolve();
            return;
          }
          audio.play().then(() => {
            audio.onended = () => {
              activeAudioRefs.current.delete(audio);
              resolve();
            };
          }).catch(() => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS
            if (!isAudioStoppedRef.current) {
              playTTSAudio(text, language).then(() => resolve());
            } else {
              resolve();
            }
          });
        };
        
        audio.onerror = () => {
          activeAudioRefs.current.delete(audio);
          // Fallback to TTS
          if (!isAudioStoppedRef.current) {
            playTTSAudio(text, language).then(() => resolve());
          } else {
            resolve();
          }
        };
        return;
      }
      if (language === 'hi') {
        const audioUrl = hindiAudioManager.getAudioUrl(text);
        const audio = new Audio(audioUrl);
        activeAudioRefs.current.add(audio);
        attachSlowLoadToast(audio);
        
        audio.onloadeddata = () => {
          if (isAudioStoppedRef.current) {
            resolve();
            return;
          }
          audio.play().then(() => {
            audio.onended = () => {
              activeAudioRefs.current.delete(audio);
              resolve();
            };
          }).catch(() => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS
            if (!isAudioStoppedRef.current) {
              playTTSAudio(text, language).then(() => resolve());
            } else {
              resolve();
            }
          });
        };
        
        audio.onerror = () => {
          activeAudioRefs.current.delete(audio);
          // Fallback to TTS
          if (!isAudioStoppedRef.current) {
            playTTSAudio(text, language).then(() => resolve());
          } else {
            resolve();
          }
        };
        return;
      }
      // For Kannada, try to use local audio files first
      if (language === 'kn') {
        const audioUrl = kannadaAudioManager.getAudioUrl(text);
        const audio = new Audio(audioUrl);
        activeAudioRefs.current.add(audio);
        attachSlowLoadToast(audio);
        
        audio.onloadeddata = () => {
          if (isAudioStoppedRef.current) {
            resolve();
            return;
          }
          audio.play().then(() => {
            audio.onended = () => {
              activeAudioRefs.current.delete(audio);
              resolve();
            };
          }).catch(() => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS
            if (!isAudioStoppedRef.current) {
              playTTSAudio(text, language).then(() => resolve());
            } else {
              resolve();
            }
          });
        };
        
        audio.onerror = () => {
          activeAudioRefs.current.delete(audio);
          // Fallback to TTS
          if (!isAudioStoppedRef.current) {
            playTTSAudio(text, language).then(() => resolve());
          } else {
            resolve();
          }
        };
        return;
      }
      
      // For English, try to use local audio files first
      if (language === 'en') {
        const audioUrl = englishAudioManager.getAudioUrl(text);
        const audio = new Audio(audioUrl);
        activeAudioRefs.current.add(audio);
        attachSlowLoadToast(audio);
        
        audio.onloadeddata = () => {
          if (isAudioStoppedRef.current) {
            resolve();
            return;
          }
          audio.play().then(() => {
            audio.onended = () => {
              activeAudioRefs.current.delete(audio);
              resolve();
            };
          }).catch(() => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS
            if (!isAudioStoppedRef.current) {
              playTTSAudio(text, language).then(() => resolve());
            } else {
              resolve();
            }
          });
        };
        
        audio.onerror = () => {
          activeAudioRefs.current.delete(audio);
          // Fallback to TTS
          if (!isAudioStoppedRef.current) {
            playTTSAudio(text, language).then(() => resolve());
          } else {
            resolve();
          }
        };
        return;
      }
      
      // For Marathi, try to use local audio files first
      if (language === 'mr') {
        const audioUrl = marathiAudioManager.getAudioUrl(text);
        const audio = new Audio(audioUrl);
        activeAudioRefs.current.add(audio);
        attachSlowLoadToast(audio);
        
        audio.onloadeddata = () => {
          if (isAudioStoppedRef.current) {
            resolve();
            return;
          }
          audio.play().then(() => {
            audio.onended = () => {
              activeAudioRefs.current.delete(audio);
              resolve();
            };
          }).catch(() => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS
            if (!isAudioStoppedRef.current) {
              playTTSAudio(text, language).then(() => resolve());
            } else {
              resolve();
            }
          });
        };
        
        audio.onerror = () => {
          activeAudioRefs.current.delete(audio);
          // Fallback to TTS
          if (!isAudioStoppedRef.current) {
            playTTSAudio(text, language).then(() => resolve());
          } else {
            resolve();
          }
        };
        return;
      }
      
      // Fallback to TTS for all other languages
      if (!isAudioStoppedRef.current) {
        console.log("playing TTS", text, language);
        playTTSAudio(text, language).then(() => resolve());
      } else {
        resolve();
      }
    });
  };

  const playTTSAudio = (text: string, language: Language): Promise<void> => {
    // Check if audio was stopped
    if (isAudioStoppedRef.current) {
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      activeTTSRefs.current.add(utterance);
      
      // Language-specific settings
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          utterance.rate = 0.6; // Slower for Telugu
          utterance.pitch = 0.9;
          utterance.volume = 0.9;
          break;
        case 'mr':
          utterance.lang = 'mr-IN';
          utterance.rate = 0.6; // Slower for Marathi
          utterance.pitch = 0.9;
          utterance.volume = 0.9;
          break;
        case 'kn':
          utterance.lang = 'kn-IN';
          utterance.rate = 0.6; // Slower for Kannada
          utterance.pitch = 0.9;
          utterance.volume = 0.9;
          break;
        default:
          utterance.lang = 'en-US';
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
      }

      // Set up event handlers
      utterance.onend = () => {
        activeTTSRefs.current.delete(utterance);
        resolve();
      };
      utterance.onerror = () => {
        activeTTSRefs.current.delete(utterance);
        resolve(); // Resolve even on error to prevent hanging
      };

      // Try to find the best voice (with fallback for voice loading)
      const findAndSetVoice = () => {
        const voices = speechSynthesis.getVoices();
        let bestVoice = null;

        if (voices.length === 0) {
          // Voices not loaded yet, will use default
          return;
        }

        if (language === 'te') {
          bestVoice = voices.find(voice => 
            voice.lang.includes('te') || 
            voice.lang.includes('hi-IN') || 
            voice.lang.includes('en-IN')
          );
        } else if (language === 'mr') {
          bestVoice = voices.find(voice => 
            voice.lang.includes('mr') || 
            voice.lang.includes('hi-IN') || 
            voice.lang.includes('en-IN')
          );
        } else if (language === 'kn') {
          bestVoice = voices.find(voice => 
            voice.lang.includes('kn') || 
            voice.lang.includes('hi-IN') || 
            voice.lang.includes('en-IN')
          );
        } else {
          bestVoice = voices.find(voice => 
            voice.lang.includes('en-US') || 
            voice.lang.includes('en-GB')
          );
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      };

      findAndSetVoice();
      
      // Check again before speaking
      if (isAudioStoppedRef.current) {
        activeTTSRefs.current.delete(utterance);
        resolve();
        return;
      }
      
      speechSynthesis.speak(utterance);
      
      // Timeout to prevent hanging if TTS doesn't fire onend
      setTimeout(() => {
        if (activeTTSRefs.current.has(utterance)) {
          activeTTSRefs.current.delete(utterance);
          resolve();
        }
      }, 5000); // 5 second timeout for TTS
    });
  };

  // Handle speaker button click
  const handleSpeakerClick = async () => {
    if (!currentQuestion) return;
    
    // In preview mode, allow speaker clicks based on demoStep, not disabled prop
    if (mode === 'preview') {
      if (demoStep !== 'waitForSpeaker' && demoStep !== 'instruction3' && demoStep !== 'waitForAnswer') {
        return;
      }
    } else if (disabled) {
      return;
    }
    
    if (onSpeakerClick) {
      onSpeakerClick();
    } else {
      // Default behavior - play the letter sound
      await playAudio(currentQuestion.audioText, effectiveLanguage);
    }
  };

  /**
   * Play feedback audio sequence when incorrect answer is shown
   * Sequence: feedback1 ("chosen letter is") → selected letter → feedback2 ("try again")
   * 
   * This function handles sequential playback of feedback audio files and letter audio,
   * ensuring no overlapping. It also calls onFeedbackAudioComplete callback when done,
   * which allows parent components (like preview) to reset UI after audio completes.
   * 
   * In game mode: Uses audio instruction language for feedback messages
   * In preview mode: Uses audioLanguageOverride or selectedLanguage (for preview compatibility)
   */
  const playFeedbackAudio = useCallback(async () => {
    if (!currentQuestion || !selectedAnswer || !selectedLanguage) return;

    // In game mode, use audio instruction language for feedback; in preview, use override or game language
    const feedbackLanguage = getFeedbackLanguage();

    setIsFeedbackAudioPlaying(true);

    try {
      /**
       * Helper function to play a single feedback audio file (feedback1 or feedback2)
       * Falls back to TTS if audio file fails to load or play
       */
      const playFeedbackAudioFile = async (feedbackNumber: 1 | 2): Promise<void> => {
        // Early return if audio was stopped (e.g., user clicked "Next")
        if (isAudioStoppedRef.current) {
          return;
        }
        
        return new Promise((resolve) => {
          const audioPath = `${process.env.PUBLIC_URL}/audio/letter-hunt-incorrect-message/${feedbackLanguage}/feedback${feedbackNumber}.wav`;
          const audio = new Audio(audioPath);
          activeAudioRefs.current.add(audio);
          attachSlowLoadToast(audio);
          
          audio.onloadeddata = () => {
            // Check again before playing (audio might have been stopped while loading)
            if (isAudioStoppedRef.current) {
              activeAudioRefs.current.delete(audio);
              resolve();
              return;
            }
            audio.play().then(() => {
              audio.onended = () => {
                activeAudioRefs.current.delete(audio);
                resolve();
              };
            }).catch(() => {
              activeAudioRefs.current.delete(audio);
              // Fallback to TTS if audio file fails to play
              if (!isAudioStoppedRef.current) {
                const fallbackText = getFeedbackText(
                  feedbackNumber === 1 ? 'chosenLetterIs' : 'tryAgain'
                );
                playTTSAudio(fallbackText, feedbackLanguage).then(() => resolve());
              } else {
                resolve();
              }
            });
          };
          
          audio.onerror = () => {
            activeAudioRefs.current.delete(audio);
            // Fallback to TTS if audio file doesn't exist or fails to load
            if (!isAudioStoppedRef.current) {
              const fallbackText = getFeedbackText(
                feedbackNumber === 1 ? 'chosenLetterIs' : 'tryAgain'
              );
              playTTSAudio(fallbackText, feedbackLanguage).then(() => resolve());
            } else {
              resolve();
            }
          };
          
          // Safety timeout to prevent hanging if audio doesn't fire onended event
          setTimeout(() => {
            if (activeAudioRefs.current.has(audio) && !audio.ended) {
              audio.pause();
              activeAudioRefs.current.delete(audio);
              resolve();
            }
          }, 10000);
        });
      };
      
      // Play feedback sequence sequentially:
      // 1. "chosen letter is" (feedback1)
      // 2. Selected letter audio
      // 3. "try again" (feedback2)
      // Check if stopped before each step to allow immediate stopping
      if (!isAudioStoppedRef.current) {
        await playFeedbackAudioFile(1);
      }
      if (!isAudioStoppedRef.current) {
        await playAudio(selectedAnswer, selectedLanguage || currentQuestion.language);
      }
      if (!isAudioStoppedRef.current) {
        await playFeedbackAudioFile(2);
      }

      // Notify parent component that feedback audio sequence is complete
      // This is used by preview components to reset UI after audio finishes
      if (!isAudioStoppedRef.current && onFeedbackAudioComplete) {
        onFeedbackAudioComplete();
      }
    } catch (error) {
      console.warn('Feedback audio playback failed:', error);
    } finally {
      setIsFeedbackAudioPlaying(false);
    }
  }, [currentQuestion, selectedAnswer, selectedLanguage, getFeedbackLanguage, getFeedbackText, onFeedbackAudioComplete]);

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (disabled || showFeedback) return;
    onAnswerSelect(option);
  };

  // Auto-play audio when question changes (only during actual gameplay, not preview)
  useEffect(() => {
    if (currentQuestion && !showFeedback && mode === 'game' && selectedLanguage && !isPreview) {
      // Stop any existing audio before playing new question audio
      stopAllAudio();
      // Small delay to ensure component is rendered
      const timer = setTimeout(() => {
        playAudio(currentQuestion.audioText, effectiveLanguage).catch((error) => {
          console.warn('Auto-play audio failed:', error);
        });
      }, 800);
      
      return () => {
        clearTimeout(timer);
        stopAllAudio();
      };
    }
  }, [currentQuestionIndex, currentQuestion, showFeedback, mode, selectedLanguage, isPreview, stopAllAudio, effectiveLanguage]);

  /**
   * Effect: Play success audio when correct answer is shown
   * 
   * Plays success sound immediately when correct answer is selected
   * Note: In preview mode, success sound is handled by the preview component, so we skip it here
   * 
   * In game mode: Uses audio instruction language for success feedback
   * In preview mode: Uses effectiveLanguage (for preview compatibility)
   */
  useLayoutEffect(() => {
    if (showFeedback) {
      setIsFeedbackAudioPlaying(true);
    }
  }, [showFeedback]);

  useEffect(() => {
    if (showFeedback && isCorrect && currentQuestion && selectedAnswer && selectedLanguage && !isPreview) {
      let isActive = true;

      const playSuccessAudio = async () => {
        setIsFeedbackAudioPlaying(true);
        try {
          // In game mode, use audio instruction language for success feedback
          const successLanguage = getFeedbackLanguage();
          await playSuccessSound(successLanguage, { exactLanguage: true });
        } catch (error) {
          console.warn('Success audio playback failed:', error);
        } finally {
          if (isActive) {
            setIsFeedbackAudioPlaying(false);
          }
        }
      };

      playSuccessAudio();

      return () => {
        isActive = false;
      };
    }
  }, [showFeedback, isCorrect, currentQuestion, selectedAnswer, selectedLanguage, isPreview, getFeedbackLanguage]);
  useEffect(() => {
    if (!showFeedback) {
      setIsFeedbackAudioPlaying(false);
    }
  }, [showFeedback]);


  /**
   * Effect: Play feedback audio when incorrect answer is shown
   * 
   * In preview mode: Waits 2 seconds to allow failure sound (from preview component) to complete first
   * In game mode: Starts immediately after feedback UI is shown
   */
  useEffect(() => {
    if (showFeedback && !isCorrect && currentQuestion && selectedAnswer && selectedLanguage) {
      // In preview mode, wait longer to allow failure sound to complete first
      // Failure sound typically takes 1-2 seconds, so we wait 2 seconds to be safe
      // In game mode, start immediately
      const delay = isPreview ? 2000 : 500;
      
      const timer = setTimeout(() => {
        playFeedbackAudio();
      }, delay);
      
      // Cleanup: stop audio if component unmounts or effect re-runs
      return () => {
        clearTimeout(timer);
        stopAllAudio();
      };
    }
  }, [showFeedback, isCorrect, currentQuestion, selectedAnswer, selectedLanguage, playFeedbackAudio, stopAllAudio, isPreview]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // Don't render if no current question
  if (!currentQuestion) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  const Container: any = useContainer === 'card' ? Card : 'div';
  const containerClass = useContainer === 'card'
    ? `flex-1 p-0 sm:p-0.5 md:p-1 lg:p-2 bg-white/95 backdrop-blur-sm shadow-floating overflow-y-auto flex flex-col relative ${className}`
    : `flex-1 p-0 sm:p-0.5 md:p-1 lg:p-2 overflow-y-auto flex flex-col relative ${className}`;

  return (
    <Container className={containerClass}>
      {/* Progress Bar with Stars and Lives */}
      {showProgress && progress && (
        <div className="flex-shrink-0 mb-0">
          <ProgressBar 
            current={progress.current} 
            total={progress.total} 
            score={progress.score}
            lives={lives}
            maxLives={maxLives}
          />
        </div>
      )}

      {/* Game Area */}
      <div className="flex-1 flex flex-col justify-center px-0 py-0 min-h-0">
        {/* Top Section - Audio */}
        {showSpeaker && (
          <div className="text-center mb-0 sm:mb-0.5 md:mb-1 flex-shrink-0">
            <div 
              ref={speakerButtonRef}
              className={`inline-block p-0.5 sm:p-1 md:p-1.5 rounded-lg transition-colors ${
                mode === 'preview' && demoStep === 'waitForSpeaker' && !hasClickedSpeaker
                  ? 'bg-blue-100 cursor-pointer hover:bg-blue-200 hover:scale-110 ring-4 ring-blue-400 ring-opacity-50 animate-pulse'
                  : mode === 'preview' && demoStep === 'instruction1'
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'bg-blue-100 cursor-pointer hover:bg-blue-200'
              }`}
              onClick={handleSpeakerClick}
              tabIndex={mode === 'preview' && demoStep === 'waitForSpeaker' ? 0 : -1}
            >
              <span className="text-sm sm:text-base md:text-lg lg:text-xl">🔊</span>
            </div>
            
            {/* Hand pointer for preview mode */}
            {mode === 'preview' && demoStep === 'waitForSpeaker' && !hasClickedSpeaker && (
              <div className="text-center mt-0.5 sm:mt-1 text-blue-600 font-medium animate-bounce">
                <span className="text-sm sm:text-base md:text-lg">👆</span>
              </div>
            )}
          </div>
        )}

        {/* Middle Section - Letter Options */}
        <div className="flex-shrink-0 flex flex-col justify-center mb-0">
          <div className={`relative flex items-center justify-center max-w-2xl mx-auto w-full ${mode === 'preview' && !showSpeaker ? 'invisible' : ''}`}>
            {/* Hand Icon - positioned to the left of options section */}
            {mode === 'preview' && showHandPointer && !showFeedback && (
              <div className="absolute left-0 top-1/2 transform -translate-x-16 -translate-y-1/2 rotate-90">
                <div className="animate-bounce">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl inline-block">👆</span>
                </div>
              </div>
            )}

            {/* Options Grid */}
            <div 
              ref={optionsRef}
              className="grid grid-cols-2 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-3 w-full"
              tabIndex={0}
            >
              {currentQuestion.options.map((letter, index) => {
                const isSelected = letter === selectedAnswer;
                const isGreyedOut = selectedAnswer !== null && !isSelected;
                
                return (
                  <Button
                    key={index}
                    variant={
                      showFeedback 
                        ? (isCorrect && letter === selectedAnswer ? "success" : 
                           !isCorrect && letter === selectedAnswer ? "destructive" : 
                           !isCorrect && letter === currentQuestion.target ? "success" : "outline")
                        : isSelected ? "default" : "outline"
                    }
                    size="lg"
                    className={`h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 2xl:h-24 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl ${effectiveLanguage !== 'te' ? 'font-bold' : 'font-normal'} transition-all duration-200 shadow-sm ${
                      isGreyedOut 
                        ? 'bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed' 
                        : isSelected && !showFeedback
                        ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400'
                        : !showFeedback && !disabled
                        ? 'hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md'
                        : ''
                    } ${
                      mode === 'preview' && !showFeedback && !disabled && !isGreyedOut ? 'hover:scale-105 cursor-pointer' : ''
                    }`}
                   style={{ fontFamily }} 
                    onClick={() => handleOptionClick(letter)}
                    disabled={showFeedback || disabled || isGreyedOut}
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section - Feedback */}
        <div className="flex-shrink-0 flex flex-col justify-center min-h-[20px] sm:min-h-[30px] md:min-h-[40px] lg:min-h-[60px] xl:min-h-[80px]">
          <div className="text-center">
            {showFeedback && (
              <div className="animate-fade-in">
                {isCorrect ? (
                  <div className="text-success">
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold" style={{ fontFamily }}>
                      {selectedLanguage === 'te'
                        ? '🎉 సరైనది!'
                        : selectedLanguage === 'kn'
                        ? '🎉 ಸರಿಯಿದೆ!'
                        : selectedLanguage === 'mr'
                        ? '🎉 बरोबर!'
                        : selectedLanguage === 'hi'
                        ? '🎉 सही है।'
                        : '🎉 Correct!'}
                    </p>
                  </div>
                ) : (
                  <div className="text-error">
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold" style={{ fontFamily }}>
                      {(() => {
                        // Use heart break emoji if game uses hearts/lives system
                        const emoji = (maxLives && maxLives > 0) ? '💔' : '😢';
                        return selectedLanguage === 'te'
                          ? `${emoji} అయ్యో! తప్పు!`
                          : selectedLanguage === 'kn'
                          ? `${emoji} ಅಯ್ಯೋ! ತಪ್ಪು!`
                          : selectedLanguage === 'mr'
                          ? `${emoji} अरेच्या! चुकीचे!`
                          : selectedLanguage === 'hi'
                          ? `${emoji} ओह! गलत!`
                          : `${emoji} Oops! Wrong!`;
                      })()}
                    </p>
                  </div>
                )}
                
                {/* Continue Button */}
                <ContinueButton
                  onContinue={handleContinue}
                  mode={mode}
                  showContinueButton={showContinueButton && !isFeedbackAudioPlaying}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}