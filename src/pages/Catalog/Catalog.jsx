import Card from "../../components/Card";
import styles from "./Catalog.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { carService } from "../../services/car.service";
import Swal from "sweetalert2";


function Catalog() {
    
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function getCars() {
            try {
                setLoading(true);
                const { data } =  await supabase.from('Cars').select();
                if (data){
                    setCars(data);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        getCars();
    }, []);

    const handleDeleteCar = async (carId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            })


            if (result.isConfirmed) {
                await carService.delete(carId);
                setCars(cars.filter((car) => car.id !== carId));
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El carro ha sido eliminado',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            setError(error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al eliminar el carro',
                icon: 'error'
            })
        }
    };

    return (
        <section>
            <div className={styles['cars-container']}>
                {!loading && cars?.map((car) => (
                    <Card key={car.name} {...car} onDelete={handleDeleteCar} />
                ))}
                {loading && <p>Cargando...</p>}
                {error && <p>Error: {error.message}</p>}
            </div>
        </section>
    );
}

export default Catalog;