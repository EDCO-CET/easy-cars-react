import styles from './Loading.module.css';

function Loading() {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
        </div>
    );
}

export default Loading;