import { Link } from "react-router-dom";
import "./notfound.css";
const NotFound = () => {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1>Page Not Found</h1>
      <p className="not-found__message">That smoothie route does not exist.</p>
      <Link className="not-found__link" to={"/"}>
        Go Home
      </Link>
    </main>
  );
};
export default NotFound;
