import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Header.scss";
import AdminModal from "../Modal/AdminModal";
import MenuIcon from "../MenuIcon/MenuIcon";
import Modal from "../Modal/Modal";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [displayNav, setDisplayNav] = useState(false);

  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <>
      {showModal && <Modal setShowModal={setShowModal} showModal={showModal} />}
      <header className={`header ${displayNav && "navOpen"}`}>
        <nav>
          <figure>
            <Link to="/" className="name-container">
              <p className="name">
                {" "}
                <div className="profile header-logo">
                  <img
                    src={logo}
                    alt={"bot"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "60%",
                    }}
                  />
                </div>
                HIREVUE
              </p>
            </Link>
            <span className="extra-nav-links">
              <p>Vetting Process</p>
              <Link to={"/how-it-works"}>
                <p>How it Works</p>
              </Link>
            </span>
          </figure>
          <div>
            {" "}
            <button onClick={() => setShowModal(true)}>Start Interview</button>
            <Link to={"/signup"} className="resume">
              Admin
            </Link>
          </div>
          <MenuIcon handleMenuToggle={() => setDisplayNav(!displayNav)} />
          {displayNav && (
            <div className="mobile-nav">
              <ul className="mobile-nav__left">
                <li>
                  <Link to={"/"}>Vetting Process</Link>
                </li>
                <li>
                  <Link to={"/how-it-works"}>How it Works</Link>
                </li>
                <li>
                  <Link to={"/signup"}>Admin</Link>
                </li>
              </ul>
              <ul className="mobile-nav__right">
                <li>
                  <a
                    href="https://trysapa.tawk.help/"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModal(true);
                    }}
                  >
                    Start Interview
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

Header.defaultProps = {
  subPage: true,
};

export default Header;
