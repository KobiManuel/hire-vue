import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { useNavigate } from "react-router-dom";

const Modal = () => {
  const [error, setError] = useState(false);

  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("lunaClient");
    if (userName) {
      const [firstName, lastName] = userName.split(" ");
      if (inputRef.current) {
        inputRef.current.value = `${firstName} ${lastName}`;
      }
    }
  }, []);

  const handleTextInput = (e) => {
    const value = e.target.value.trim();
    const words = value.split(/\s+/);
    if (error) {
      setError(false);
    }
    if (words.length === 2) {
      e.target.value = words.slice(0, 2).join(" ");
    }
  };

  const handleGetStarted = () => {
    const value = inputRef.current.value.trim();
    const words = value.split(/\s+/);
    const [first, last] = words;

    if (!first || !last) {
      setError(true);
    }

    if (first && last) {
      localStorage.setItem("lunaClient", value);
      navigate("/chat");
    }
  };
  return (
    <div className={styles["helper-modal-container"]}>
      <div className={styles["helper-modal-overlay"]}></div>
      <div
        style={{
          width: "50%",
          margin: "0 auto",
          paddingTop: 70,
          paddingBottom: 100,
          zIndex: 1000,
          position: "relative",
        }}
      >
        <div className={styles["helper-modal"]}>
          <div className={styles.right}>
            <label className={styles.label}> AI Interview Assistant</label>
            <h2 className={styles.header}>HIRE VUE</h2>

            <p className={styles.desc}>Please Enter your name to get started</p>
            <div style={{ position: "relative", width: "fit-content" }}>
              <input
                placeholder="e.g. Elon Musk"
                className={styles["name-input"]}
                onChange={handleTextInput}
                ref={inputRef}
              />
              {error ? (
                <span className={styles["error-msg"]}>
                  Input should contain two names
                </span>
              ) : (
                ""
              )}
            </div>

            <button
              className={styles["get-started-btn"]}
              onClick={handleGetStarted}
            >
              Get Started
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Modal;
