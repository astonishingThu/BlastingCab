// src/components/ModeSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.css';

function ModeSelection({ onModeSelected }) {
    const [mode, setMode] = useState('');
    const navigate = useNavigate();

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleSubmit = () => {
        if (mode) {
            onModeSelected(mode);
            navigate('/display');
        }
    };

    return (
        <div className="mode-selection">
            <div className="mode-buttons">
                <button
                    className={`mode-button ${mode === 'sort-low-to-high' ? 'selected' : ''}`}
                    onClick={() => handleModeChange('sort-low-to-high')}
                >
                    <h2>Low to High</h2>
                    <p>Start with easier words and progress to harder ones.</p>
                </button>
                <button
                    className={`mode-button ${mode === 'sort-high-to-low' ? 'selected' : ''}`}
                    onClick={() => handleModeChange('sort-high-to-low')}
                >
                    <h2>High to Low</h2>
                    <p>Begin with the hardest words and move towards easier ones.</p>
                </button>
                <button
                    className={`mode-button ${mode === 'shuffle' ? 'selected' : ''}`}
                    onClick={() => handleModeChange('shuffle')}
                >
                    <h2>Shuffle</h2>
                    <p>Randomly shuffle the words for a unique experience every time.</p>
                </button>
            </div>
            <button className="confirm-button" onClick={handleSubmit}>
                Start
            </button>

        </div>
    );
}

export default ModeSelection;


