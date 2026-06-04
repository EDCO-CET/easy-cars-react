import Card from "../../components/Card";
import styles from "./Catalog.module.css";
import { supabase } from '../../utils/supabase'
import { useEffect, useState } from "react";


function Catalog() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCars() {
            try {
            setLoading(true);
            const { data: carsData } = await supabase.from('Cars').select();

            if (carsData) {
                setCars(carsData)
            }
            setLoading(false);
            } catch (error) {
                console.error('Error fetching cars:', error);
                setError(error);
                setLoading(false);
            }
        }

        getCars();
    }, []);

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