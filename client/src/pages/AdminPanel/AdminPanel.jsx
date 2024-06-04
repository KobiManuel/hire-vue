import React, { useRef, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./AdminPanel.module.scss";
import copy from "../../assets/copy.svg";
import tick from "../../assets/tick.svg";
import Loader from "../../components/Icons/Loader";
import Toast from "../../components/Toast/Toast";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [toastVisiblity, setToastVisibility] = useState({
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  });
  const companyRef = useRef(null);
  const questionsRef = useRef(null);
  const linkRef = useRef(null);

  const { showToast, toastMessage, toastStatus } = toastVisiblity;

  const handleToast = (message, status) => {
    setToastVisibility({
      showToast: true,
      toastMessage: message,
      toastStatus: status,
    });
  };

  const handleSubmit = async () => {
    const orgName = companyRef?.current?.value.trim();
    setLoading(true);
    const questionsArray = questionsRef?.current?.value
      .split("\n")
      .map((question) => question.trim())
      .filter((question) => question !== "");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:5000/interview-questions/${orgName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            organizationName: companyRef?.current?.value.trim(),
            interviewQuestions: questionsArray,
          }),
        }
      );

      console.log("response is", response);

      if (response.ok) {
        const { message } = await response?.json();
        handleToast(message, "Success");
        const currentUrl = window.location.origin;
        const interviewLink = `${currentUrl}/${orgName}`;
        setLink(interviewLink);
        setIsSuccess(true);
      } else {
        // const { message } = await response?.json();
        handleToast(response?.statusText, "Error");
        const currentUrl = window.location.origin;
        const interviewLink = `${currentUrl}/${orgName}`;
        setLink(interviewLink);
      }
    } catch (error) {
      console.error("Error sending interview questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <section className={styles.admin}>
      <Header />
      <Toast
        setToastVisibility={setToastVisibility}
        showToast={showToast}
        toastMessage={toastMessage}
        toastStatus={toastStatus}
      />
      <div className={styles["admin-inner"]}>
        <div className={styles.column}>
          <label>Organization Name</label>
          <input
            type="text"
            name="orgName"
            placeholder="E.g: Microsoft"
            ref={companyRef}
          />
        </div>
        <div className={styles.column}>
          <label>Interview Questions</label>
          <textarea
            type="text"
            name="questions"
            placeholder="Enter questions here"
            className={styles.panel}
            ref={questionsRef}
          />
        </div>
        {isSuccess && (
          <div className={styles.column}>
            <label>Interview Link</label>
            <div className={styles["link_card"]}>
              <div
                className={styles["copy_btn"]}
                onClick={() => {
                  handleCopy();
                }}
              >
                <img src={copied ? tick : copy} alt="/" />
              </div>
              <p>{link ? link : "Link to be sent to candidates"}</p>
            </div>
          </div>
        )}
        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loader /> : "Submit"}
        </button>
      </div>
    </section>
  );
};

export default AdminPanel;
