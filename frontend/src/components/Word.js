// chencked
import React from "react";
import { useEffect, useRef, useState } from "react";
import next from '../images/right.png';
import previous from '../images/left.png';
import restart from '../images/restart.png';
import editButton from '../images/edit.png';
import deleteButton from '../images/delete.png';
import IsAdminContext from "../contexts/isAdminContext";
import { UPDATE_BUTTON_MESSAGE } from "../utils/constants";

function Word ({ 
  word, 
  currentLesson, 
  currentDepartment, 
  isReversed, 
  handleDeleteWord, 
  handleUpdateWord, 
  onChange 
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0); //helps to go previous/next word
  const [nextButton, setNextButton] = useState(next); //hepls to toggle next button and refresh button
  const [hidden, setHidden] = useState(true); // helps to hide content
  const [isChanging, setIsChanging] = useState(false); //helps to show/hide word change form
  const nextButtonRef = useRef();
  const prevButtonref = useRef();
  const isAdmin = React.useContext(IsAdminContext);

  // handle show next word
  function handleClickNext() {
    if (currentWordIndex < word.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (currentWordIndex === word.length - 1) {
      setCurrentWordIndex(0);
      setNextButton(next);
    }
    setHidden(true);
  };

  // handle show previous word
  function handleClickPrevious() {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
    setHidden(true);
  };

  // show hidden content
  function handleShowContent() {
    setHidden(false);
  };

  // handle delete word
  function onClickDeleteButton() {
    if (word) {
      handleDeleteWord(currentDepartment._id, currentLesson._id, word[currentWordIndex]._id);
    }
  };
 
  // handle previous next refresh buttons 
  useEffect(() => {
    if (currentWordIndex === word.length - 1) {
      setNextButton(restart);
    } else if (currentWordIndex === 0) {
      prevButtonref.current.classList.add('hidden');
    } else {
      setNextButton(next);
      nextButtonRef.current.classList.remove('hidden');
      prevButtonref.current.classList.remove('hidden');
    };
  }, [currentWordIndex]);

  // handle keyboard click
  function handleKeyboardManager(e) {
    e.preventDefault()
    if (e.keyCode === 32) {
      handleShowContent();
    }
    if (e.keyCode === 37) {
      handleClickPrevious();
    }
    if (e.keyCode === 39) {
      handleClickNext();
    }
    if (e.keyCode === 32 && !hidden) {
      handleClickNext();
    }
  };

  // remove keyboard listener while changing word
  useEffect(() => {
    if (!isChanging) {
      document.addEventListener('keydown', handleKeyboardManager)
    };

    return () => {
      document.removeEventListener('keydown', handleKeyboardManager)
    };
  });

  // handle click change button
  const onClickUpdateButton = () => {
    setIsChanging(!isChanging);
  };

  // handle submit changes
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleUpdateWord(currentDepartment._id, currentLesson._id, word[currentWordIndex]._id);
    setIsChanging(!isChanging);
  };

  // CODE TEMPLATES BELOW

  // word change template
  const formUpdateTemplate = (
    <form  onSubmit={handleSubmit}>
      <input type="text" name="cn" placeholder={word[currentWordIndex].cn} onChange={onChange}/>
      <input type="text" name="eng" placeholder={word[currentWordIndex].eng} onChange={onChange}/>
      <input type="text" name="example" placeholder={word[currentWordIndex].example} onChange={onChange}/>
      <button>{UPDATE_BUTTON_MESSAGE}</button>
    </form>
  );

  const defaultWordTemplate = (
    <>
      <p className={`word__title`}>{isReversed ? word[currentWordIndex].eng : word[currentWordIndex].cn}</p>
      <p className={hidden ? 'hidden' : 'word__translate'}>{isReversed ? word[currentWordIndex].cn : word[currentWordIndex].eng}</p>
      <p className={hidden ? 'hidden' : 'word__example'}>{word[currentWordIndex].example}</p>
    </>
  );

  // word delete and change buttons template
  const wordChangeAndDeleteButtons = (
    <>
      <img src={editButton} alt="Update Button" className="card__manage_icon" onClick={onClickUpdateButton}/>
      <img src={deleteButton} alt="Delete Button" className="card__manage_icon" onClick={onClickDeleteButton}/>
    </>
  );

  return (
    <div className="word">
      <div className="word__content">
        <div className="word__button" onClick={handleClickPrevious}>
          <img className="word__button_img" alt="Previous word" src={previous} ref={prevButtonref} onClick={handleClickPrevious}></img>
        </div>
        <div className="word__textcontent" onClick={handleShowContent}>
          {isChanging ? (formUpdateTemplate) : (defaultWordTemplate)}
        </div>
        {isAdmin ? (wordChangeAndDeleteButtons) : (null)}
        <div className="word__button" onClick={handleClickNext}>
          <img className="word__button_img" alt="Next/Refresh button" src={nextButton} ref={nextButtonRef} ></img>
        </div>
      </div>
    </div>
  );
};

export default Word;