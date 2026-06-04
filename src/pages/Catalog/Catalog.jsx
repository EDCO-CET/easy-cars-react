import Card from "../../components/Card";
import styles from "./Catalog.module.css";
import { supabase } from '../../utils/supabase'
import { carService } from "../../services/car.service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await carService.delete(id);
            setCars((prevCars) => prevCars.filter((car) => car.id !== id));
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El carro fue eliminado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo eliminar el carro',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    return (
        <section>
            <div className={styles['cars-container']}>
                {!loading && cars?.map((car) => (
                    <Card key={car.id} {...car} onDelete={handleDelete} />
                ))}
                {loading && <p>Cargando...</p>}
                {error && <p>Error: {error.message}</p>}
            </div>
        </section>
    );
}

export default Catalog;