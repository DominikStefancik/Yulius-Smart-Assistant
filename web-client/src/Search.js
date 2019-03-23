import React, { useState, useEffect, useRef } from "react";
import styles from "./Search.module.scss";
import Status from "./Status";
import VideoChat from "./VideoChat";
import Fuse from "fuse.js";
import classNames from "classnames";
import panes from "./panes";
import Suggestion from "./Suggestion";
import Voice from "./Voice";

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

let handleClickRef = null;

export default () => {
  const inputNode = useRef(null);
  const suggestionsNode = useRef(null);
  const searchNode = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showVideo, setShowVideo] = useState("show");
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState(0);
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

  const sendData = data => {
    const form = new FormData();
    form.append("recording", data);
    fetch("https://wiki.epfl.ch/test.php", { method: "POST", body: form });
  };

  console.log("->", showVideo);

  return (
    <div>
      <Voice onStop={sendData} />
      <div
        ref={searchNode}
        className={classNames(
          styles.search,
          showVideo === "show" && styles.animateSearch,
          showVideo === "disappear" && styles.animateSearchBack
        )}
      >
        <div className={styles.wrapper}>
          <img alt="person" src={person} className={styles.person} />
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              ref={inputNode}
              className={classNames(
                styles.bar,
                showVideo === "show" && styles.animateInput,
                showVideo === "disappear" && styles.animateInputBack
              )}
              placeholder="Type to search..."
              value={input}
              onKeyDown={handleKeyDown}
              onChange={event => {
                setInput(event.target.value);
                if (event.target.value !== "") {
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
            />
          </form>
          <img
            className={classNames(
              styles.microphoneIcon,
              showVideo === "show" && styles.animateIcons,
              showVideo === "disappear" && styles.animateIconsBack
            )}
            src={microphone}
            alt="microphone"
          />
          <img
            className={classNames(
              styles.searchIcon,
              showVideo === "show" && styles.animateIcons,
              showVideo === "disappear" && styles.animateIconsBack
            )}
            src={searchIcon}
            alt="search"
          />

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
              console.log(
                showVideo,
                showVideo === "show" ? "disappear" : "show"
              );
              setShowVideo(showVideo === "show" ? "disappear" : "show");
              setInput("");
            }}
          >
            <img
              alt="call"
              src={showVideo === "show" ? cross : camera}
              style={
                showVideo === "show"
                  ? { width: "24px", height: "24px" }
                  : { width: "30px", height: "30px" }
              }
            />
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
