
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

/**
 * Hook genérico para consumir un API.
 *
 * - GET (por defecto): hace la petición automáticamente al montar el componente.
 *   Uso: const { data, loading, error } = useApi(url);
 *
 * - POST (u otros métodos): NO se ejecuta automáticamente. El componente decide
 *   cuándo enviar llamando a `execute(body)`, por ejemplo en el submit de un form.
 *   Uso: const { execute, loading, error } = useApi(url, { method: 'POST' });
 *
 * @param {string} url - URL del endpoint.
 * @param {object} options - Opciones del hook.
 * @param {string} options.method - Método HTTP ('GET', 'POST', ...). Por defecto 'GET'.
 * @param {boolean} options.autoFetch - Si la petición se dispara sola al montar.
 *   Por defecto solo es true cuando el método es GET.
 */
export function useApi(url, { method = 'GET', autoFetch = method === 'GET' } = {}) {
  const [data, setData] = useState(null);
  const {userData} = useAuth();
  // En modo POST no estamos "cargando" hasta que el usuario envíe el form,
  // por eso loading inicia con el valor de autoFetch.
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  /**
   * Ejecuta la petición manualmente.
   * Recibe un `body` opcional (por ejemplo, los valores del formulario),
   * lo serializa a JSON y retorna la respuesta del API para que el
   * componente pueda reaccionar (mostrar alerta, redirigir, etc.).
   */
  const execute = useCallback(async (body) => {
    try {
      setLoading(true);
      setError(null); // Limpiamos errores de intentos anteriores
      const response = await fetch(url, {
        method,
        // Solo enviamos headers y body cuando hay datos que enviar (POST/PUT)
        ...(body !== undefined && {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData?.token}` },
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
      return resultado;
    } catch (err) {
      setError(err.message);
      // Re-lanzamos el error para que quien llama a execute() pueda manejarlo
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  // Petición automática al montar (solo para GET / autoFetch = true)
  useEffect(() => {
    if (!autoFetch) return;
    const loadData = async () => {
      try {
        await execute();
      } catch {
        // El error ya quedó guardado en el estado `error`
      }
    };
    loadData();
  }, [autoFetch, execute]);

  return { data, loading, error, execute };
}
