import React, { useState } from "react";
import "./Settings.css";
import { firestore } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion} from "firebase/firestore";

function SettingsPage({ setInterval, onModeChange }) {
  const [wordList, setWordList] = useState("");
  const [intervalInput, setIntervalInput] = useState(3);
  const [mode, setMode] = useState("shuffle");

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file from the input
    if (!file) return; // Do nothing if no file is selected

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target.result; // Get the CSV text
      const newWords = csvText.split("\n").map((line) => {
        const [word, definition, samples, level] = line.split(",");
        return { word: word.trim(), definition, samples: samples.split(";").map(sample => sample.trim()), level };
      });

      try {
        const docRef = doc(firestore, "words", "wordList");
        const docSnap = await getDoc(docRef);

        let existingWords = [];
        if (docSnap.exists()) {
          existingWords = docSnap.data().words;
        }

        const filteredWords = newWords.filter(
            (newWord) => !existingWords.some((existingWord) => existingWord.word === newWord.word)
        );

        if (filteredWords.length > 0) {
          await updateDoc(docRef, {
            words: arrayUnion(...filteredWords),
          });
        }

        // Clear the file input after import
        event.target.value = "";
      } catch (error) {
        console.error("Error importing words:", error);
      }
    };

    // Read the contents of the selected file as text
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const newWords = wordList.split("\n").map((word) => {
      const [wordStr, definition, samplesStr, level] = word.split(",");
      const samples = samplesStr.split(";").map((sample) => sample.trim());
      return { word: wordStr.trim(), definition, samples, level };

    });

    try {
      const docRef = doc(firestore, "words", "wordList");
      const docSnap = await getDoc(docRef);

      let existingWords = [];
      if (docSnap.exists()) {
        existingWords = docSnap.data().words;
      }


      const filteredWords = newWords.filter(
          newWord => !existingWords.some(existingWord => existingWord.word === newWord.word)
      );

      if (filteredWords.length > 0) {
        await updateDoc(docRef, {
          words: arrayUnion(...filteredWords)
        });
      }

      setWordList(""); // Clear the textarea after import
    } catch (error) {
      console.error("Error importing words:", error);
    }
  };

  const handleIntervalChange = () => {
    setInterval(intervalInput);
  };
  const handleModeChange = (event) => {
    setMode(event.target.value);
    onModeChange(event.target.value);
  };
  return (
      <div className="settings">
        <label>
          Upload a CSV file:
          <input type="file" accept=".csv" onChange={handleFileChange}/>
        </label>
        <label>
        <textarea
            value={wordList}
            onChange={(e) => setWordList(e.target.value)}
            placeholder="format: word, definition, samples(;), level"
        />
        </label>
        <button onClick={handleImport}>Import Words</button>
        <br/>
        <div className="setInterval-container">
          <label>
            Set interval (seconds):
            <input
                type="number"
                value={intervalInput}
                onChange={(e) => setIntervalInput(Number(e.target.value))}
            />
          </label>
          <button onClick={handleIntervalChange}>Set Interval</button>
        </div>
      </div>
  );
}

export default SettingsPage;
