import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import SettingsPage from "./SettingsPage";
import WordDisplay from "./WordDisplay";
import {firestore} from "./firebase";
import {doc, getDoc} from "firebase/firestore";
import "./App.css";
import ModeSelection from "./ModeSelection.jsx";

function App() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [interval, setInterval] = useState(3);
  const [mode, setMode] = useState('shuffled'); // Default mode

    const applyMode = (mode) => {
        console.log("Before sorting:", words);
        if (mode === 'shuffle') {
            setWords(prevWords => {
                return [...prevWords].sort(() => Math.random() - 0.5);
            });
        } else if (mode === 'sort-low-to-high') {
            setWords(prevWords => {
                return [...prevWords].sort((a, b) => a.level - b.level);
            });
        } else if (mode === 'sort-high-to-low') {
            setWords(prevWords => {
                return [...prevWords].sort((a, b) => b.level - a.level);
            });
        }
        console.log("After sorting:", words);
        setCurrentWordIndex(0);
    };

    const fetchWords = async () => {
      try {
        const docRef = doc(firestore, "words", "wordList");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const fetchedWords = docSnap.data().words;
            console.log("Fetched words:", fetchedWords);
          setWords(docSnap.data().words);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    useEffect(() => {
        if (location.pathname === '/display') {
            fetchWords();
        }
    }, [location.pathname]);
  const handleAnswerSubmit = (answer) => {
    console.log("Answer submitted:", answer);
    // Switch to the next word
    setCurrentWordIndex((prevIndex) => (prevIndex + 1));
  };
    const handleNextWord = () => {
        setCurrentWordIndex(prevIndex => (prevIndex + 1));
    };
    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
        applyMode(mode);
    };
    return (
    <Router>
        <div className="container">
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/"><strong>SETTINGS</strong></Link>
                        </li>
                        <li>
                            <Link to="/mode-selection"><strong>START</strong></Link>
                        </li>
                    </ul>
                </nav>
                <div className="content">
                    <Routes>
                        <Route
                            path="/"
                            element={<SettingsPage setInterval={setInterval}/>}
                        />
                        <Route
                            path="/display"
                            element={
                                words.length > -1 ? (
                                    <WordDisplay
                                        word={words.length > 0 && currentWordIndex < words.length? words[currentWordIndex].word : ""}
                                        definition={words.length > 0 && currentWordIndex < words.length? words[currentWordIndex].definition : ""}
                                        samples={words.length > 0 && currentWordIndex < words.length? words[currentWordIndex].samples : []}
                                        level={words.length > 0 && currentWordIndex < words.length? words[currentWordIndex].level : ""}
                                        onAnswerSubmit={handleAnswerSubmit}
                                        onNextWord={handleNextWord}
                                        interval={interval}
                                        currentWordIndex={currentWordIndex}
                                        totalWords={words.length}
                                    />

                                ) : (
                                    <p>Loading words...</p>
                                )
                            }
                        />
                        <Route path="/mode-selection" element={<ModeSelection onModeSelected={handleModeChange} />} />
                    </Routes>
                </div>

            </div>
        </div>
    </Router>
  );
}

export default App;
