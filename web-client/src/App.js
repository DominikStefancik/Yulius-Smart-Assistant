import React, { useEffect, useState } from "react";
import "./App.css";
import styles from "./App.module.scss";
import Spinner from "./Spinner";
import Search from "./Search";
import SpeechRecognition from "react-speech-recognition";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className={styles.app}>
      <Search />
      <div className={styles.content}>{loading && <Spinner />}</div>
    </div>
  );
};

export default App;
