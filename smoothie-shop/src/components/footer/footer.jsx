import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <p>
            &copy; {new Date().getFullYear()} Smoothy Shop. All rights reserved
          </p>
          <p>Made in react by Muhammad Faizan Mustafa</p>
        </div>

        <div className="footer-links">
          <Link to={"/"}>Home</Link>
          <Link to={"/cart"}>Cart</Link>
          <Link to={"/about"}>About</Link>
        </div>

        <div className="footer-social">
          <a href="mailto: m.faizan12397@gmail.com">email</a>
          <a
            href="https://www.linkedin.com/in/mustafa078/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Mustafa078"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
