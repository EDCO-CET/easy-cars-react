import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import CarForm from '../../components/CarForm';
import Loading from '../../components/Loading';
import { carService } from '../../services/car.service';

/**
 * Página de edición de un carro: /cars/:id/edit
 * Protegida en routes.jsx con <ProtectedRoute requiredRole="Admin">.
 * Reutiliza el CarForm compartido, pre-cargado con los datos actuales.
 */
function EditCar() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCar() {
            try {
                const car = await carService.getById(id);
                // Mapeamos el registro de la BD a los valores del formulario:
                // - "0-100" → zeroToHundred (nombre válido en JS)
                // - números → strings (los inputs trabajan con strings)
                setInitialValues({
                    name: car.name,
                    type: car.type,
                    image: car.image,
                    speed: car.speed,
                    zeroToHundred: car['0-100'],
                    seats: String(car.seats),
                    price: String(car.price),
                });
            } catch (err) {
                setError(err);
            }
        }

        getCar();
    }, [id]);

    // El CarForm ya validó y armó el payload; aquí hacemos el UPDATE
    const handleUpdate = async (carPayload) => {
        try {
            await carService.update(id, carPayload);

            await Swal.fire({
                title: '¡Guardado!',
                text: 'El carro fue actualizado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok',
            });

            navigate(`/cars/${id}`); // Volvemos al detalle para ver los cambios
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo actualizar el carro',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    if (error) {
        return (
            <section style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h2>Carro no encontrado</h2>
                <p>No pudimos cargar la información de este carro.</p>
                <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
                    Volver al catálogo
                </button>
            </section>
        );
    }

    // Mientras llega el carro mostramos el spinner
    if (!initialValues) {
        return <Loading />;
    }

    return (
        <CarForm
            title="Editar carro"
            submitLabel="Guardar cambios"
            initialValues={initialValues}
            onSubmit={handleUpdate}
        />
    );
}

export default EditCar;
