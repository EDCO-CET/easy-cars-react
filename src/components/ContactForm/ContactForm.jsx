import { useState } from 'react';
import './ContactForm.css';
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2'

function ContactForm() {
    const minLengthName = 3;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? '' : 'Email inválido';
    };
    const validateName = (name) => {
        return name.length > minLengthName ? '' : 'Nombre inválido';
    };
    const validationRules = {
        nombre: (value) => validateName(value),
        email: (value) => validateEmail(value)
    };

    const { values, handleChange, errors } = useForm({
        nombre: '',
        email: ''
    }, validationRules);

    

    const handleSubmit = (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        console.log('Form submitted:', values);
        setTimeout(() => { // Emulate API call
            Swal.fire({
                title: 'Saved!',
                text: 'Record saved successfully',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            setIsSubmitting(false);
        }, 3000);
    };

    return (
        <form className='contact__form'  onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input
                name="nombre"
                className='contact__form-input'
                value={values.nombre}
                onChange={handleChange}
                placeholder="Nombre"
            />
            {errors.nombre && <span className='contact__form-error'>{errors.nombre}</span>}
            <label htmlFor="email">Email</label>
            <input
                name="email"
                className='contact__form-input'
                value={values.email}
                onChange={handleChange}
                placeholder="Email"
            />
            {errors.email && <span className='contact__form-error'>{errors.email}</span>}
            <button className='btn btn-primary' type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
        </form>
    );
}

export default ContactForm;