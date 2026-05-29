import { useState } from 'react';

export function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationRules[name]) {
      const error = validationRules[name](value); // { name: "El nombre debe tener al menos 3 caracteres"}
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    handleChange,
    errors,
    reset,
  };
}