import Card from "../../components/Card";
import styles from "./Catalog.module.css";
import { useApi } from "../../hooks/useApi";


function Catalog() {
    const url = 'http://localhost:4000/api/cars';
    const { data: cars, loading, error } = useApi(url);

    return (
        <section>
            <div className={styles['cars-container']}>
                {!loading && cars?.map((car) => (
                    <Card key={car.name} {...car} />
                ))}
                {loading && <p>Cargando...</p>}
                {error && <p>Error: {error.message}</p>}
            </div>
        </section>
    );
}

export default Catalog;