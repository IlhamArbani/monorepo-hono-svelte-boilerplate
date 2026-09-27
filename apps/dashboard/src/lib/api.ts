import { browser } from '$app/environment';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
	status: number;
	data: any;

	constructor(status: number, data: any) {
		super(data?.error || `API Error: ${status}`);
		this.status = status;
		this.data = data;
	}
}

function getToken(): string | null {
	if (!browser) return null;
	return localStorage.getItem('token');
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
	const token = getToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {})
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		throw new ApiError(res.status, data);
	}

	return data;
}

export const api = {
	get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),

	post: <T = any>(path: string, body?: unknown) =>
		request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

	put: <T = any>(path: string, body?: unknown) =>
		request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

	delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' })
};

export { ApiError };
