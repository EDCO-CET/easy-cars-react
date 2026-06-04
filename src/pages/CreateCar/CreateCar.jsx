import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { carService } from '../../services/car.service';
import styles from './CreateCar.module.css';
import { useState } from 'react';


// ---------- Funciones de validación (retornan '' si el valor es válido) ----------

const validateName = (name) =>
    name.trim().length >= 3 ? '' : 'El nombre debe tener al menos 3 caracteres';

const validateImage = (image) => {
    // La imagen debe ser una URL que empiece por http:// o https://
    const urlRegex = /^https?:\/\/.+/;
    return urlRegex.test(image) ? '' : 'La imagen debe ser una URL válida (http:// o https://)';
};

const validateType = (type) =>
    type.trim() !== '' ? '' : 'El tipo de carro es requerido';

const validateSpeed = (speed) =>
    speed.trim() !== '' ? '' : 'La velocidad es requerida (ej. 250 km/h)';

const validateZeroToHundred = (value) =>
    value.trim() !== '' ? '' : 'El 0-100 es requerido (ej. 4.5s)';

const validateSeats = (seats) => {
    const num = Number(seats);
    return Number.isInteger(num) && num >= 1 && num <= 9
        ? ''
        : 'Los asientos deben ser un número entero entre 1 y 9';
};

const validatePrice = (price) => {
    const num = Number(price);
    return !Number.isNaN(num) && num > 0 ? '' : 'El precio debe ser un número mayor a 0';
};

// Reglas de validación que consume useForm: cada campo tiene su validador
const validationRules = {
    name: validateName,
    type: validateType,
    image: validateImage,
    speed: validateSpeed,
    zeroToHundred: validateZeroToHundred,
    seats: validateSeats,
    price: validatePrice,
};

function CreateCar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Estado del formulario: useForm maneja los valores y los errores por campo
    const { values, handleChange, errors, reset } = useForm({
        name: '',
        type: '',
        image: '',
        speed: '',
        zeroToHundred: '',
        seats: '',
        price: '',
    }, validationRules);

    // 2. Conexión con el API: en modo POST la petición NO se dispara sola,
    //    nosotros la ejecutamos con `execute(body)` cuando el form se envía
    //const { execute, loading } = useApi(API_URL, { method: 'POST' });

    /**
     * Valida TODOS los campos antes de enviar.
     * useForm solo valida los campos que el usuario ha tocado (onChange),
     * así que aquí recorremos todas las reglas para evitar enviar un form vacío.
     * Retorna true si todo el formulario es válido.
     */
    const validateAll = () => {
        return Object.entries(validationRules).every(
            ([field, validate]) => validate(values[field]) === ''
        );
    };

    // 3. Enlace form → API: al enviar, validamos y hacemos el POST
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitamos que el navegador recargue la página

        if (!validateAll()) {
            Swal.fire({
                title: 'Formulario incompleto',
                text: 'Por favor revisa los campos del formulario',
                icon: 'warning',
                confirmButtonText: 'Ok',
            });
            return;
        }

        try {
            // Armamos el objeto con la forma que espera el API.
            // El campo "0-100" no es un nombre de variable válido en JS,
            // por eso en el form lo llamamos zeroToHundred y lo mapeamos aquí.
            setLoading(true);
            await carService.create({
                name: values.name,
                type: values.type,
                image: values.image,
                speed: values.speed,
                '0-100': values.zeroToHundred,
                seats: Number(values.seats),
                price: Number(values.price),
            });

            await Swal.fire({
                title: '¡Guardado!',
                text: 'El carro fue creado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok',
            });

            reset(); // Limpiamos el formulario
            navigate('/'); // Redirigimos al catálogo para ver el carro nuevo
        } catch (err) {
            // execute() re-lanza el error si el API falla.
            // Mostramos el mensaje que envió el backend (o uno genérico si no hay).
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo crear el carro. Verifica que el API esté corriendo.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles['create-car-section']}>
            <form className={styles['create-car__form']} onSubmit={handleSubmit} noValidate>
                <h2>Crear nuevo carro</h2>

                <label htmlFor="name">Nombre</label>
                <input
                    id="name"
                    name="name"
                    className={styles['create-car__input']}
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Ferrari 488"
                />
                {/* Si el campo tiene error, lo mostramos debajo del input */}
                {errors.name && <span className={styles['create-car__error']}>{errors.name}</span>}

                <label htmlFor="type">Tipo</label>
                {/* Un select también funciona con handleChange: usa name y value igual que un input */}
                <select
                    id="type"
                    name="type"
                    className={styles['create-car__input']}
                    value={values.type}
                    onChange={handleChange}
                >
                    <option value="">Selecciona un tipo</option>
                    <option value="Sport">Sport</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                </select>
                {errors.type && <span className={styles['create-car__error']}>{errors.type}</span>}

                <label htmlFor="image">Imagen (URL)</label>
                <input
                    id="image"
                    name="image"
                    className={styles['create-car__input']}
                    value={values.image}
                    onChange={handleChange}
                    placeholder="https://example.com/ferrari.png"
                />
                {errors.image && <span className={styles['create-car__error']}>{errors.image}</span>}

                <label htmlFor="speed">Velocidad máxima</label>
                <input
                    id="speed"
                    name="speed"
                    className={styles['create-car__input']}
                    value={values.speed}
                    onChange={handleChange}
                    placeholder="330 km/h"
                />
                {errors.speed && <span className={styles['create-car__error']}>{errors.speed}</span>}

                <label htmlFor="zeroToHundred">0-100</label>
                <input
                    id="zeroToHundred"
                    name="zeroToHundred"
                    className={styles['create-car__input']}
                    value={values.zeroToHundred}
                    onChange={handleChange}
                    placeholder="3.0s"
                />
                {errors.zeroToHundred && <span className={styles['create-car__error']}>{errors.zeroToHundred}</span>}

                <label htmlFor="seats">Asientos</label>
                <input
                    id="seats"
                    name="seats"
                    type="number"
                    className={styles['create-car__input']}
                    value={values.seats}
                    onChange={handleChange}
                    placeholder="2"
                />
                {errors.seats && <span className={styles['create-car__error']}>{errors.seats}</span>}

                <label htmlFor="price">Precio (por día)</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    className={styles['create-car__input']}
                    value={values.price}
                    onChange={handleChange}
                    placeholder="450"
                />
                {errors.price && <span className={styles['create-car__error']}>{errors.price}</span>}

                {/* Mientras el POST está en curso deshabilitamos el botón */}
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Crear carro'}
                </button>
            </form>
        </section>
    );
}

export default CreateCar;
