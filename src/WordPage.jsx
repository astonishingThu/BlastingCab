// src/WordPage.js
import React, { useState, useEffect } from "react";
import "./WordDisplay.css";

function WordPage({ words, interval }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(interval);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (words.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft === 0) {
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          setTimeLeft(interval);
          setInput("");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, interval, words.length]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === words[currentWordIndex]) {
      alert("Correct!");
    } else {
      alert(`Incorrect! The correct word was ${words[currentWordIndex]}`);
    }
    setInput("");
  };

  if (words.length === 0) {
    return <div>Please import words from the Settings page.</div>;
  }

  return (
    <div className="word-display">
      <h1>{words[currentWordIndex]}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type the word here"
        />
        <button type="submit">Submit</button>
      </form>
      <div className="timer">Time left: {timeLeft} seconds</div>
    </div>
  );
}

export default WordPage;
