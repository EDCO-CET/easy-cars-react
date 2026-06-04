# Cómo enlazar un formulario con un API en React

Guía paso a paso para construir la funcionalidad **"Crear Carro"**: un formulario con validaciones (`useForm`) que envía los datos a un API mediante un POST (`useApi`).

## ¿Qué vamos a construir?

```
┌─────────────┐   handleChange   ┌─────────┐   execute(values)   ┌─────────────┐
│  Formulario │ ───────────────▶ │ useForm │ ──────────────────▶ │   useApi    │
│  (inputs)   │ ◀─────────────── │ (estado │                     │ (fetch POST)│
│             │  values / errors │  + val.)│                     │             │
└─────────────┘                  └─────────┘                     └──────┬──────┘
                                                                        │
                                                                        ▼
                                                            POST /api/cars (JSON)
```

El flujo completo es:

1. El usuario escribe en los inputs → `useForm` guarda los valores y valida cada campo.
2. Al enviar el form → validamos todo y llamamos a `execute(values)` del hook `useApi`.
3. `useApi` hace el `fetch` con método POST y el body en JSON.
4. Según la respuesta, mostramos una alerta de éxito (y redirigimos) o de error.

---

## Paso 1: Extender `useApi` para que acepte POST

**Archivo:** `src/hooks/useApi.js`

El hook original solo hacía GET automáticamente al montar el componente:

```js
// ANTES: solo GET automático
export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => { /* fetch(url) ... */ };
    loadData();
  }, [url]);

  return { data, loading, error };
}
```

El problema: un POST **no debe dispararse solo** al montar el componente — debe ejecutarse cuando el usuario envíe el formulario. Por eso hicimos tres cambios:

### 1.1 Aceptar opciones (`method` y `autoFetch`)

```js
export function useApi(url, { method = 'GET', autoFetch = method === 'GET' } = {}) {
```

- `method`: el método HTTP. Por defecto `'GET'` para no romper los usos existentes (el Catálogo sigue funcionando igual con `useApi(url)`).
- `autoFetch`: indica si la petición se dispara sola al montar. Por defecto solo es `true` cuando el método es GET.

### 1.2 Exponer una función `execute(body)`

```js
const execute = useCallback(async (body) => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch(url, {
      method,
      // Solo enviamos headers y body cuando hay datos que enviar (POST/PUT)
      ...(body !== undefined && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    });
    if (!response.ok) {
      // Intentamos leer el mensaje de error que envía el backend
      // (ej. { "message": "No autorizado: falta el token..." })
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || 'Failed to fetch data');
    }
    const resultado = await response.json();
    setData(resultado);
    return resultado; // El componente recibe la respuesta
  } catch (err) {
    setError(err.message);
    throw err; // Re-lanzamos para que el componente pueda reaccionar
  } finally {
    setLoading(false);
  }
}, [url, method]);
```

Puntos clave:

- `JSON.stringify(body)`: el `fetch` no envía objetos de JS, hay que serializarlos a JSON.
- `Content-Type: application/json`: le dice al API que el body viene en formato JSON.
- `return resultado` y `throw err`: permiten que el componente sepa si el POST funcionó o falló (para mostrar la alerta correcta).

### 1.3 El `useEffect` solo se ejecuta si `autoFetch` es `true`

```js
useEffect(() => {
  if (!autoFetch) return; // En modo POST no hacemos nada al montar
  execute().catch(() => {});
}, [autoFetch, execute]);

return { data, loading, error, execute };
```

> **Nota:** `loading` ahora inicia en `autoFetch` (no en `true`), para que en modo POST el botón no aparezca como "cargando" antes de enviar.

---

## Paso 2: Definir el estado del formulario con `useForm`

**Archivo:** `src/pages/CreateCar/CreateCar.jsx`

`useForm` (ya existente en `src/hooks/useForm.js`) recibe dos cosas: los **valores iniciales** y las **reglas de validación**.

### 2.1 Funciones de validación

Cada validador recibe el valor del campo y retorna `''` si es válido, o el mensaje de error si no:

```js
const validateName = (name) =>
    name.trim().length >= 3 ? '' : 'El nombre debe tener al menos 3 caracteres';

const validateImage = (image) => {
    const urlRegex = /^https?:\/\/.+/;
    return urlRegex.test(image) ? '' : 'La imagen debe ser una URL válida (http:// o https://)';
};

const validateSeats = (seats) => {
    const num = Number(seats);
    return Number.isInteger(num) && num >= 1 && num <= 9
        ? ''
        : 'Los asientos deben ser un número entero entre 1 y 9';
};
// ... validateSpeed, validateZeroToHundred, validatePrice
```

### 2.2 Reglas de validación

Un objeto que mapea cada nombre de campo a su validador. `useForm` lo usa en cada `onChange`:

```js
const validationRules = {
    name: validateName,
    type: validateType,
    image: validateImage,
    speed: validateSpeed,
    zeroToHundred: validateZeroToHundred,
    seats: validateSeats,
    price: validatePrice,
};
```

### 2.3 Inicializar el hook

```js
const { values, handleChange, errors, reset } = useForm({
    name: '',
    type: '',
    image: '',
    speed: '',
    zeroToHundred: '',
    seats: '',
    price: '',
}, validationRules);
```

- `values`: el estado actual de todos los campos.
- `handleChange`: actualiza el valor del campo Y ejecuta su validación.
- `errors`: objeto con el mensaje de error de cada campo (o `''` si es válido).
- `reset`: vuelve el formulario a su estado inicial.

> **Detalle:** el campo del API se llama `"0-100"`, pero ese no es un nombre de variable válido en JS, así que en el form lo llamamos `zeroToHundred` y lo mapeamos al enviar (Paso 4).

---

## Paso 3: Construir el JSX del formulario

Cada campo sigue el mismo patrón de **input controlado**: el valor viene de `values`, los cambios pasan por `handleChange`, y el error (si existe) se muestra debajo:

```jsx
<label htmlFor="name">Nombre</label>
<input
    id="name"
    name="name"                 // ¡Importante! Debe coincidir con la clave en values
    value={values.name}         // Input controlado: el valor vive en el estado
    onChange={handleChange}     // Actualiza el estado y valida
    placeholder="Ferrari 488"
/>
{errors.name && <span className={styles['create-car__error']}>{errors.name}</span>}
```

El atributo `name` del input es la pieza que conecta todo: `handleChange` lo usa para saber qué campo actualizar (`e.target.name`) y qué regla de validación aplicar.

Los `<select>` funcionan exactamente igual que los inputs: también disparan `onChange` y tienen `name` y `value`, así que `handleChange` los maneja sin cambios:

```jsx
<select name="type" value={values.type} onChange={handleChange}>
    <option value="">Selecciona un tipo</option>
    <option value="Sport">Sport</option>
    <option value="SUV">SUV</option>
    {/* ... */}
</select>
{errors.type && <span>{errors.type}</span>}
```

El botón de envío se deshabilita mientras el POST está en curso:

```jsx
<button className="btn btn-primary" type="submit" disabled={loading}>
    {loading ? 'Guardando...' : 'Crear carro'}
</button>
```

---

## Paso 4: Enlazar el submit con el API

### 4.1 Inicializar `useApi` en modo POST

```js
const { execute, loading } = useApi(API_URL, { method: 'POST' });
```

Como el método es POST, `autoFetch` queda en `false`: la petición solo ocurre cuando nosotros llamemos a `execute`.

### 4.2 Validar TODO antes de enviar

`useForm` solo valida los campos que el usuario ha **tocado**. Si el usuario da clic en "Crear carro" sin escribir nada, `errors` estaría vacío. Por eso revalidamos todo en el submit:

```js
const validateAll = () => {
    return Object.entries(validationRules).every(
        ([field, validate]) => validate(values[field]) === ''
    );
};
```

### 4.3 El `handleSubmit`

```js
const handleSubmit = async (e) => {
    e.preventDefault(); // Evitamos que el navegador recargue la página

    if (!validateAll()) {
        Swal.fire({ title: 'Formulario incompleto', icon: 'warning', /* ... */ });
        return;
    }

    try {
        // Aquí ocurre el enlace form → API
        await execute({
            name: values.name,
            type: values.type,
            image: values.image,
            speed: values.speed,
            '0-100': values.zeroToHundred, // Mapeamos al nombre que espera el API
            seats: Number(values.seats),   // Los inputs siempre dan strings,
            price: Number(values.price),   // convertimos a número
        });

        await Swal.fire({ title: '¡Guardado!', icon: 'success', /* ... */ });
        reset();        // Limpiamos el formulario
        navigate('/');  // Redirigimos al catálogo para ver el carro nuevo
    } catch (err) {
        // Mostramos el mensaje de error que envió el backend
        Swal.fire({ title: 'Error', text: err.message, icon: 'error', /* ... */ });
    }
};
```

Puntos clave:

- `e.preventDefault()`: sin esto, el navegador haría un submit tradicional y recargaría la página.
- `await execute(...)`: enviamos los `values` del form como body del POST.
- Conversión de tipos: los inputs HTML siempre entregan strings; `seats` y `price` se convierten con `Number()`.
- `try/catch`: como `execute` re-lanza el error, podemos distinguir éxito de fallo y mostrar la alerta correspondiente.

---

## Paso 5: Registrar la ruta y el enlace de navegación

### 5.1 La ruta

**Archivo:** `src/routes.jsx`

```jsx
import CreateCar from "./pages/CreateCar";

const routes = [
    // ... rutas existentes
    {
        // Ruta para el formulario de creación de carros
        path: "/cars/new",
        element: <CreateCar />
    },
    {
        path: "*",           // El comodín 404 siempre va al final
        element: <NotFound />
    }
];
```

### 5.2 El enlace en el Navbar

**Archivo:** `src/components/Navbar/Navbar.jsx`

```jsx
<li>
  <NavLink to="/cars/new" className={({ isActive }) =>
      isActive ? styles.navActive : styles.navInactive
    }>Crear Carro</NavLink>
</li>
```

---

## Cómo probarlo

1. Levanta el API de carros en `http://localhost:4000` (debe exponer `POST /api/cars`).
2. Levanta el frontend:

   ```bash
   npm install
   npm run dev
   ```

3. Abre `http://localhost:5173/cars/new` (o haz clic en **Crear Carro** en el Navbar).
4. Prueba las validaciones:
   - Envía el formulario vacío → debe mostrar la alerta "Formulario incompleto" y **no** llamar al API.
   - Escribe una imagen sin `http://` → debe aparecer el error debajo del input.
   - Pon `seats` en `15` → debe aparecer "entre 1 y 9".
5. Llena todo correctamente y envía → alerta de éxito y redirección al catálogo, donde aparece el carro nuevo.
6. Apaga el API y vuelve a enviar → debe aparecer la alerta de error.

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `src/hooks/useApi.js` | Hook de API extendido con soporte POST (`execute`) |
| `src/hooks/useForm.js` | Hook de formulario (valores, cambios y validación por campo) |
| `src/pages/CreateCar/CreateCar.jsx` | Página con el formulario y el enlace form → API |
| `src/pages/CreateCar/CreateCar.module.css` | Estilos de la página |
| `src/routes.jsx` | Registro de la ruta `/cars/new` |
| `src/components/Navbar/Navbar.jsx` | Enlace de navegación "Crear Carro" |
