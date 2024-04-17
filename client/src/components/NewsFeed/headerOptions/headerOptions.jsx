import React from 'react';
import './headerOptions.css';

const HeaderOptions = ({ toggleAudio, audioEnabled, setSearchKeyword }) => {
  const buttonText = audioEnabled ? "Disable Audio" : "Enable Audio";
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div className="header-options">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search messages..."
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="enable-audio-container">
        <button onClick={toggleAudio} className={`enable-audio-button ${audioEnabled ? 'enabled' : 'disabled'}`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default HeaderOptions;
