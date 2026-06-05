import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';
import { carService } from '../../services/car.service';
import styles from './CarDetails.module.css';

/**
 * Página de detalle de un carro: /cars/:id
 * Es pública (todos los usuarios pueden verla). Los botones de
 * editar y eliminar solo aparecen para usuarios con rol Admin.
 */
function CarDetails() {
    // useParams nos da los parámetros dinámicos de la ruta (/cars/:id → { id })
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCar() {
            try {
                setLoading(true);
                const data = await carService.getById(id);
                setCar(data);
            } catch (err) {
                // id inválido o carro eliminado → mostramos estado de error
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        getCar();
    }, [id]);

    // Placeholder: aún no existe tabla de reservas, solo confirmamos la acción
    const handleRent = () => {
        Swal.fire({
            title: '¡Reserva confirmada!',
            text: `Has rentado el ${car.name} por $${car.price} al día`,
            icon: 'success',
            confirmButtonText: 'Ok',
        });
    };

    // Mismo flujo de eliminación que en el catálogo (Catalog.jsx)
    const handleDelete = async () => {
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
            await Swal.fire({
                title: '¡Eliminado!',
                text: 'El carro fue eliminado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
            navigate('/'); // El carro ya no existe, volvemos al catálogo
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo eliminar el carro',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <section className={styles['car-details__error']}>
                <h2>Carro no encontrado</h2>
                <p>No pudimos cargar la información de este carro.</p>
                <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
                    Volver al catálogo
                </button>
            </section>
        );
    }

    return (
        <section className={styles['car-details']}>
            <div className={styles['car-details__card']}>
                <img className={styles['car-details__image']} src={car.image} alt={car.name} />

                <div className={styles['car-details__info']}>
                    <header className={styles['car-details__head']}>
                        <span className="card__tag">
                            {car.isMostPopular ? 'Most Popular' : car.type}
                        </span>
                        <h2>{car.name}</h2>
                    </header>

                    <ul className={styles['car-details__specs']}>
                        <li>
                            <span>Velocidad</span>
                            <strong>{car.speed}</strong>
                        </li>
                        <li>
                            <span>0-100</span>
                            <strong>{car['0-100']}</strong>
                        </li>
                        <li>
                            <span>Asientos</span>
                            <strong>{car.seats}</strong>
                        </li>
                    </ul>

                    <p className={styles['car-details__price']}>
                        <span className={styles['car-details__price-amount']}>{`$${car.price}`}</span>
                        <span className={styles['car-details__price-unit']}>/ día</span>
                    </p>

                    <div className={styles['car-details__buttons']}>
                        <button className="btn btn-primary" type="button" onClick={handleRent}>
                            Rentar ahora
                        </button>
                        <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
                            Volver al catálogo
                        </button>
                        {/* Acciones solo para administradores */}
                        {hasRole('Admin') && (
                            <>
                                <button
                                    className="btn btn-ghost"
                                    type="button"
                                    onClick={() => navigate(`/cars/${id}/edit`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-delete"
                                    type="button"
                                    aria-label="Delete car"
                                    onClick={handleDelete}
                                >
                                    🗑
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CarDetails;
