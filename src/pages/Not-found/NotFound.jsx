import { Link } from "react-router";
import styles from "./NotFound.module.css";

function NotFound() {
    return (
        <div className={styles.container}>
            <h1>Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go back to home</Link>
        </div>
    );
}

export default NotFound;