import React from "react";
import styles from "./panes.module.scss";
import Trend from "react-trend";

const Trends = () => (
  <Trend
    style={{ height: "100%" }}
    smooth
    autoDraw
    autoDrawDuration={3000}
    autoDrawEasing="ease-out"
    data={[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9]}
    gradient={["rgba(0, 20, 137, 1)"]}
    radius={25}
    strokeWidth={1}
    strokeLinecap={"butt"}
  />
);
export default [
  {
    title: "International situation",
    description: "Discover current affairs.",
    component: ({ pane }) => (
      <div className={styles.pane}>
        <div className={styles.paneHeader}>{pane.title}</div>
        <div className={styles.paneDescription}>{pane.description}</div>
        <Trends />
      </div>
    )
  },
  {
    title: "Stock options",
    description: "Check how your market investments are profiting with us.",
    component: ({ pane }) => (
      <div className={styles.pane}>
        <div className={styles.paneHeader}>{pane.title}</div>
        <div className={styles.paneDescription}>{pane.description}</div>
        <Trends />
      </div>
    )
  },
  {
    title: "Relevant news",
    description:
      "Information that matters to you. Explored by our AI, hand-made tailored by our analysts.",
    component: ({ pane }) => (
      <div className={styles.pane}>
        <div className={styles.paneHeader}>{pane.title}</div>
        <div className={styles.paneDescription}>{pane.description}</div>
        <Trends />
      </div>
    )
  }
];
