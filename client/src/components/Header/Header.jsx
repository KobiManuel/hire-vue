import React, { useState } from "react";
import { Link } from "react-router-dom";
import bot from "../../assets/lunabot1.png";
import "./Header.scss";
import AdminModal from "../Modal/AdminModal";
import MenuIcon from "../MenuIcon/MenuIcon";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [displayNav, setDisplayNav] = useState(false);
  return (
    <>
      {showModal && <AdminModal setShowModal={setShowModal} />}
      <header className={`header ${displayNav && "navOpen"}`}>
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
          <MenuIcon handleMenuToggle={() => setDisplayNav(!displayNav)} />
          {displayNav && (
            <div className="mobile-nav">
              <ul className="mobile-nav__left">
                <li>
                  <Link to={"/"}>Vetting Process</Link>
                </li>
                <li>
                  <Link to={"/"}>How it Works</Link>
                </li>
                <li>
                  <Link to={"/"}>Admin</Link>
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
                  <Link to={"/"}>Start Interview</Link>
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
