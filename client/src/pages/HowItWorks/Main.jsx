import React from "react";

const HowItWorks = () => {
  const containerStyle = {
    width: "80%",
    margin: "auto",
    padding: "60px 0 60px 0",
    backgroundColor: "inherit",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "white",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const h1Style = {
    fontSize: "2em",
    marginBottom: "0.5em",
  };

  const h2Style = {
    fontSize: "1.6em",
    marginBottom: "0.5em",
    color: "#3444da",
  };

  const pStyle = {
    marginBottom: "1em",
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "80px",
  };

  const footerPStyle = {
    fontSize: "0.6em",
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={h1Style}>How It Works</h1>
      </header>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 1: Sign Up</h2>
        <p style={pStyle}>
          To get started, create an account by providing your email and
          password. Once registered, you will receive a confirmation email to
          verify your account.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 2: Log In</h2>
        <p style={pStyle}>
          After verifying your account, log in using your email and password.
          Upon successful login, you will receive a token for secure access to
          the application.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 3: Create an Interview</h2>
        <p style={pStyle}>
          Once logged in, you can create an interview by providing the
          organization name and the list of interview questions. This data is
          securely saved in our database and a link is generated to be sent to
          candidates.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 4: Manage Candidates</h2>
        <p style={pStyle}>
          Add candidates to the interview by giving them the generated interview
          link. The AI will also update their scores based on their interview
          performance.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 5: Conduct Interviews</h2>
        <p style={pStyle}>
          Conduct interviews using our AI-powered assistant, which guides the
          candidates through the interview questions and evaluates their
          responses.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Step 6: Review Results</h2>
        <p style={pStyle}>
          After the interview, review the candidates' scores and performance.
          You can send feedback and results to the candidates via email.
        </p>
      </section>

      <footer style={footerStyle}>
        <p style={footerPStyle}>
          &copy; 2024 Hirevue company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HowItWorks;
