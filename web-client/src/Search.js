import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import classNames from "classnames";
import { ReactMic } from "react-mic";
import SpeechRecognition from "react-speech-recognition";

import styles from "./Search.module.scss";

import VideoChat from "./VideoChat";
import Status from "./Status";
import panes from "./panes";
import Suggestion from "./Suggestion";

import person from "./person.png";
import call from "./call.svg";
import camera from "./camera.svg";
import searchIcon from "./search.svg";
import microphone from "./microphone.svg";
import cross from "./cross.svg";

const fuseConfig = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["title", "description"]
};

const fuse = new Fuse(panes, fuseConfig);
let globalResetTranscript = null;

const Form = props => {
  props.recognition.lang = "en-US";
  globalResetTranscript = props.resetTranscript;

  useEffect(
    () => () => {
      globalResetTranscript = null;
    },
    []
  );

  return (
    <form onSubmit={props.handleSubmit}>
      <input
        autoFocus
        ref={props.inputNode}
        className={props.className}
        placeholder="Type to search..."
        value={!props.enableRecognition ? props.input : props.transcript}
        onKeyDown={props.handleKeyDown}
        onChange={props.handleChange}
      />
    </form>
  );
};

const FormWithSpeech = SpeechRecognition(Form);

let handleClickRef = null;

export default () => {
  const inputNode = useRef(null);
  const suggestionsNode = useRef(null);
  const searchNode = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showVideo, setShowVideo] = useState("show");
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [recording, setRecording] = useState(false);
  const [input, setInput] = useState("");

  const filteredBySelected = panes.filter(pane => pane.title === selected);
  const selectedPane =
    filteredBySelected.length > 0 ? filteredBySelected : null;

  const handleClick = event => {
    if (
      (inputNode.current && inputNode.current.contains(event.target)) ||
      (suggestionsNode.current &&
        suggestionsNode.current.contains(event.target))
    )
      return;
    setShowSuggestions(false);
  };

  const handleSuggestionClick = title => {
    setInput("");
    setShowSuggestions(false);
    setCursor(0);
    setSelected(title);
  };

  if (handleClickRef)
    window.removeEventListener("mousedown", handleClickRef, false);
  handleClickRef = handleClick;

  useEffect(() => {
    window.addEventListener("mousedown", handleClickRef, false);
    return () => window.removeEventListener("mousedown", handleClickRef, false);
  });

  const search = fuse.search(input);

  const results = search.length > 0 ? search : panes;

  const handleSubmit = event => {
    setShowSuggestions(false);
    if (input === "") {
      setSelected(null);
    } else {
      setSelected(results[cursor].title);
    }
    setInput("");
    setCursor(0);
    event.preventDefault();
  };

  const handleKeyDown = event => {
    if (event.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
    } else if (event.keyCode === 40 && cursor < results.length - 1) {
      setCursor(cursor + 1);
    }
  };

  const handleChange = event => {
    setInput(event.target.value);
    if (event.target.value !== "") {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (recording) {
      setRecording(false);
      globalResetTranscript();
    } else {
      setRecording(true);
    }
  };

  const sendData = data => {
    const form = new FormData();
    form.append("recording", data);
    fetch("http://127.0.0.1:5000/", { method: "POST", body: form });
  };

  //   (
  //   <form onSubmit={handleSubmit}>
  //     <input
  //       autoFocus
  //       ref={inputNode}
  //       className={classNames(
  //         styles.bar,
  //         showVideo === "show" && styles.animateInput,
  //         showVideo === "disappear" && styles.animateInputBack
  //       )}
  //       placeholder="Type to search..."
  //       value={input}
  //       onKeyDown={handleKeyDown}
  //       onChange={handleChange}
  //     />
  //   </form>
  // );

  const renderMicrophoneIcon = () => (
    <img
      onClick={handleMicrophoneClick}
      className={classNames(
        styles.microphoneIcon,
        showVideo === "show" && styles.animateIcons,
        showVideo === "disappear" && styles.animateIconsBack
      )}
      style={{ opacity: recording ? 0.5 : 1 }}
      src={microphone}
      alt="microphone"
    />
  );

  const renderSearchIcon = () => (
    <img
      className={classNames(
        styles.searchIcon,
        showVideo === "show" && styles.animateIcons,
        showVideo === "disappear" && styles.animateIconsBack
      )}
      src={searchIcon}
      alt="search"
      onClick={handleSubmit}
    />
  );

  const renderCameraIcon = () => (
    <img
      alt="call"
      src={showVideo === "show" ? cross : camera}
      style={
        showVideo === "show"
          ? { width: "24px", height: "24px" }
          : { width: "30px", height: "30px" }
      }
    />
  );

  return (
    <div>
      <div
        ref={searchNode}
        className={classNames(
          styles.search,
          showVideo === "show" && styles.animateSearch,
          showVideo === "disappear" && styles.animateSearchBack
        )}
      >
        <div
          className={classNames(
            styles.wrapper,
            showVideo !== "show" && styles.micMoved
          )}
        >
          <img alt="person" src={person} className={styles.person} />
          {recording && (
            <div className={styles.mic}>
              <ReactMic
                record={recording}
                className={styles.mic}
                onStop={recordedBlob => {
                  sendData(recordedBlob);
                }}
                strokeColor="#000"
                backgroundColor="#666"
              />
              <div className={styles.arrowWrapper}>
                <div className={styles.arrowDown} />
              </div>
            </div>
          )}
          <FormWithSpeech
            handleSubmit={handleSubmit}
            className={classNames(
              styles.bar,
              showVideo === "show" && styles.animateInput,
              showVideo === "disappear" && styles.animateInputBack
            )}
            input={input}
            handleKeyDown={handleKeyDown}
            handleChange={handleChange}
            enableRecognition={recording}
          />
          {renderMicrophoneIcon()}
          {renderSearchIcon()}
          {showSuggestions && (
            <div
              ref={suggestionsNode}
              className={classNames(
                styles.suggestions,
                showVideo === "show" && styles.animateSuggestions,
                showVideo === "disappear" && styles.animateSuggestionsBack
              )}
            >
              {results.map((pane, index) => (
                <Suggestion
                  key={pane.title}
                  pane={pane}
                  recommended={index === cursor}
                  onClick={() => handleSuggestionClick(pane.title)}
                />
              ))}
            </div>
          )}
          <Status />
          <div className={styles.voice}>
            <img
              alt="call"
              src={call}
              style={{ width: "32px", height: "32px" }}
            />
          </div>
          <div
            className={styles.video}
            onClick={() => {
              setShowVideo(showVideo === "show" ? "disappear" : "show");
              setInput("");
            }}
          >
            {renderCameraIcon()}
          </div>
          {showVideo === "show" && <VideoChat />}
        </div>
      </div>
      {/* here start panes */}
      <div className={styles.panes}>
        {(selectedPane || results).map(pane => (
          <pane.component key={pane.title} pane={pane} />
        ))}
      </div>
    </div>
  );
};
