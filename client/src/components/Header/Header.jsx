import React, { useState } from "react";
import { Link } from "react-router-dom";
import bot from "../../assets/lunabot1.png";
import "./Header.scss";
import AdminModal from "../Modal/AdminModal";
import MenuIcon from "../MenuIcon/MenuIcon";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && <AdminModal setShowModal={setShowModal} />}
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
              href=""
              target="_blank"
              rel="noreferrer"
              className="resume"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              Admin
            </a>
          </div>
          <MenuIcon />
        </nav>
      </header>
    </>
  );
};

Header.defaultProps = {
  subPage: true,
};

export default Header;
