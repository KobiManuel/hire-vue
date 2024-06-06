import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../Icons/Loader";
import SuccessIcon from "../Icons/SuccessIcon";
import FailedIcon from "../Icons/FailedIcon";

const Modal = ({ showModal, setShowModal }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewLink, setInterviewLink] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("hireVueClient");
    if (userName) {
      const [firstName, lastName] = userName.split(" ");
      if (inputRef.current) {
        inputRef.current.value = `${firstName} ${lastName}`;
      }
    }
  }, []);

  const validateInterviewLink = async (e) => {
    setLoading(true);

    // Extract the organization name from the link
    const organizationName = e.target.value.split("/").pop();

    try {
      const response = await fetch(
        `http://localhost:5000/validateLink/${organizationName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setLoading(false);
      } else {
        setIsSuccess(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error validating interview link:", error);
    }
  };

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
      localStorage.setItem("hireVueClient", value);
      navigate("/chat");
    }
  };
  if (!showModal) {
    return null;
  } else
    return (
      <div
        className={styles["helper-modal-container"]}
        onClick={() => setShowModal(false)}
      >
        <div className={styles["helper-modal-overlay"]}></div>
        <div
          style={{
            width: "50%",
            margin: "auto",
            zIndex: 1000,
            position: "relative",
          }}
          className={styles["modal-main"]}
        >
          <div
            className={styles["helper-modal"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.right}>
              <label className={styles.label}> AI Interview Assistant</label>
              <h2 className={styles.header}>HIRE VUE</h2>

              <p className={styles.desc}>
                Please Enter your name to get started
              </p>
              <div style={{ position: "relative", width: "100%" }}>
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

              <div className={styles.link}>
                <label>Interview Link</label>
                <div>
                  <input
                    placeholder="Enter your interview link here"
                    className={styles["name-input"]}
                    onChange={validateInterviewLink}
                  />
                  {loading ? (
                    <Loader fill={"#3444da"} />
                  ) : isSuccess ? (
                    <SuccessIcon />
                  ) : isSuccess === false ? (
                    <FailedIcon />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <button
                className={styles["get-started-btn"]}
                onClick={handleGetStarted}
                disabled={!isSuccess}
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
