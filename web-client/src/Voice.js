import React, { useState } from "react";
import { ReactMic } from "react-mic";
import styles from "./Voice.module.scss";
import classNames from "classnames";

export default ({ onData, onStop }) => {
  const [recording, setRecording] = useState(false);
  return (
    <>
      <ReactMic
        record={recording}
        className={styles.mic}
        onStop={recordedBlob => {
          console.log("onStop", recordedBlob);
          onStop(recordedBlob);
        }}
        onData={recordedBlob => {
          console.log("onData", recordedBlob);
          if (typeof onData === "function") {
            onData(recordedBlob);
          }
        }}
        strokeColor="#000"
        backgroundColor="#fff"
      />
      <div
        onClick={() => {
          if (!recording) {
            setRecording(true);
          }
        }}
        className={classNames(styles.record, recording && styles.disable)}
      >
        record
      </div>
      <div
        onClick={() => {
          if (recording) {
            setRecording(false);
          }
        }}
        className={classNames(styles.record, !recording && styles.disable)}
      >
        stop
      </div>
    </>
  );
};
