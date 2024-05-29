import React, {useState, useEffect, useCallback} from "react";
import "./WordDisplay.css"
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {firestore} from "./firebase.js";
import displayWordsPage from "./DisplayWordsPage.jsx";

function WordDisplay({ word, definition, samples, level, onAnswerSubmit, interval, onNextWord, currentWordIndex, totalWords, displayOrder }) {
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interval); // Use the interval passed as a prop
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    let timer;
    if (definition.trim() === '' && samples.length === 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      if(timeLeft===0) {
        onNextWord();
        setTimeLeft(interval);
      }
    }
    else if (!showDetails && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (showDetails && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (showDetails) {
        onNextWord(); // Move to the next word
      }
      setShowDetails(!showDetails);
      setTimeLeft(interval);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, showDetails]);

  const handleSkip = () => {
    console.log(showDetails)
    if (showDetails) {
      setShowDetails(false);
      onNextWord()
    } else {
      setShowDetails(true);
      setTimeLeft(interval);
    }
  };

  const handleLevelChange = async (newLevel) => {
    try {
      const docRef = doc(firestore, "words", "wordList");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const words = docSnap.data().words;
        const updatedWords = words.map(w => w.word === word ? { ...w, level: newLevel } : w);
        await updateDoc(docRef, { words: updatedWords });
        onNextWord();
        setShowDetails(false);
        setTimeLeft(interval);
      }
    } catch (error) {
      console.error("Error updating word level:", error);
    }
  };


  const handleKeyPress = useCallback((event) => {
    const key = parseInt(event.key);
    console.log("Inside handle key press");
    if (key >= '1' && key <= '5') {
      handleLevelChange(key);
    } else if (event.key === ' ') {
      handleSkip();
    }
  }, [handleLevelChange, onNextWord]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleButtonClick = (num) => {
    setIsButtonClicked(true);
    handleLevelChange(num);
  };
  if (currentWordIndex >= totalWords) {
    return <div className="word-display"><p>All words have been displayed!</p></div>;
  }

  return (
      <div className="word-display">
        <div className="begin">
          <h1><strong>{displayOrder === "wordFirst" ? word : definition === ""? word:definition}</strong></h1>
        </div>

        <div className="end">
          {showDetails && (
              <div className="backCard">
                <p>{displayOrder === "wordFirst" ? definition : word}</p>
                {samples.map((sample, index) => (
                    <p key={index}>{sample}</p>
                ))}
              </div>
          )}
        </div>

        <div className="control">
          <div className="control-wrapper">
            <div className="level-buttons">
              {[1, 2, 3, 4, 5].map(num => (
                  <button
                      key={num}
                      onClick={() => handleButtonClick(num)}
                      className={isButtonClicked ? 'clicked' : ''}
                  >
                    {num}
                  </button>
              ))}
            </div>
            <button className="skipButton" onClick={handleSkip}>Skip</button>
          </div>

          <div className="timer">
            <p>{timeLeft}</p>
          </div>
        </div>
      </div>
  );
}

export default WordDisplay;
