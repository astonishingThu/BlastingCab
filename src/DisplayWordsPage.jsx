import React, { useEffect, useState } from "react";
import { firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./WordDisplay.css"
function DisplayWordsPage() {
  const [words, setWords] = useState([]);
  const [wordsLength, setWordsLength] = useState(words.length);
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const docRef = doc(firestore, "words", "wordList");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWords(docSnap.data().words);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  return (
    <div className="display-words">
      <h1>Word List</h1>
      {wordsLength > 0 ? (
        <ul>
          {words.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      ) : (
        <p>No words to display.</p>
      )}
    </div>
  );
}

export default DisplayWordsPage;
