import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import CarForm from '../../components/CarForm';
import { carService } from '../../services/car.service';

function CreateCar() {
    const navigate = useNavigate();

    // El CarForm ya validó y armó el payload con la forma que espera el API.
    // Aquí solo hacemos el POST y manejamos el resultado.
    const handleCreate = async (carPayload) => {
        try {
            await carService.create(carPayload);

            await Swal.fire({
                title: '¡Saved!',
                text: 'Successfully saved',
                icon: 'success',
                confirmButtonText: 'Ok',
            });

            navigate('/'); // Redirigimos al catálogo para ver el carro nuevo
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo crear el carro. Verifica que el API esté corriendo.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    return (
        <CarForm
            title="Crear nuevo carro"
            submitLabel="Crear carro"
            onSubmit={handleCreate}
        />
    );
}

export default CreateCar;
