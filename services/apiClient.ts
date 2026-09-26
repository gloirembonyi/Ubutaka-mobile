import { API_BASE_URL } from '../config/api';
import { useAuthStore } from '../store/authStore';

/**
 * Adds the signed-in user's JWT to every request sent to the Ubutaka API, so each screen can keep
 * using plain `fetch`. If the server answers 401 for an authenticated request, the session has
 * expired and the user is signed out.
 */
let installed = false;

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/locations', '/verify'];

export function installAuthFetch() {
  if (installed) return;
  installed = true;
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (!url.startsWith(API_BASE_URL)) return originalFetch(input, init);

    const token = useAuthStore.getState().token;
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const isPublic = PUBLIC_PATHS.some((p) => url.startsWith(API_BASE_URL + p));
    if (token && !isPublic && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);

    const response = await originalFetch(input, { ...init, headers });
    if (response.status === 401 && token && !isPublic) {
      useAuthStore.getState().logout();
    }
    return response;
  };
}
