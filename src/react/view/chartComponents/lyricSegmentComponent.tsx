import React, { useState, useRef } from 'react';
import { ChordWrapper } from '../../model/chordWrapper';

function LyricSegmentComponent(chordWrapper: ChordWrapper) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(chordWrapper.lyricSegment);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // Adjust the size of the input field based on its content
    if (inputRef.current) {
      inputRef.current.size = e.target.value.length || 1;
    }
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    padding: '0',
    fontSize: 'inherit',
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          className='oac-lyric-segment'
          type='text'
          value={text}
          autoFocus
          onBlur={handleBlur}
          onChange={handleInputChange}
          style={inputStyle}
          size={text.length || 1} // Initialize the size based on the text length
        />
      ) : (
        <p className='oac-lyric-segment' onClick={handleClick}>
          {text}
        </p>
      )}
    </>
  );
}

export default LyricSegmentComponent;