import React from "react";
import { Link } from "react-router-dom";
import bot from "../../assets/lunabot1.png";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <figure>
          <Link to="/" className="name-container">
            <p className="name">
              {" "}
              <div
                className="profile header-logo"
                style={{ background: "white" }}
              >
                {/* <img src={bot} alt={"bot"} /> */}
              </div>
              HIREVUE
            </p>
          </Link>
          <span className="extra-nav-links">
            <p>Vetting Process</p>
            <p>How it Works</p>
          </span>
        </figure>
        <div>
          {" "}
          <button>Start Interview</button>
          <a
            href="https://docs.google.com/document/d/1NJ8nqD9KPumsMaPehvlMv-WAMziW7qhoPugzdUBL4L0/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="resume"
          >
            Admin
          </a>
        </div>
      </nav>
    </header>
  );
};

Header.defaultProps = {
  subPage: true,
};

export default Header;
