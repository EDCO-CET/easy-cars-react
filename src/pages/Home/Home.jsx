import Counter from "../../components/Counter";
import styles from "./Home.module.css";

function Home() {
    return (
        <section className={styles["counter-section"]}>
            <h1>Home</h1>
            <Counter />
        </section>
    );
}

export default Home;