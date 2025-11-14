// Importa la URL canónica del repositorio desde la configuración del sitio
import { REPO_URL } from '../config';

/**
 * Devuelve la URL del commit cuando se proporciona un SHA; de lo contrario,
 * devuelve la URL del repositorio.
 */
export function commitUrl(sha?: string): string {
  return sha ? `${REPO_URL}/commit/${sha}` : REPO_URL;
}