import { browser } from '$app/environment';
import { goto } from '$app/navigation';

interface User {
	id: string;
	name: string;
	email: string;
	roles?: { role: { id: string; name: string } }[];
}

let user = $state<User | null>(null);
let token = $state<string | null>(null);
let isAuthenticated = $state(false);

if (browser) {
	const savedToken = localStorage.getItem('token');
	if (savedToken) {
		token = savedToken;
		isAuthenticated = true;
	}
}

function setAuth(newToken: string, newUser: User) {
	token = newToken;
	user = newUser;
	isAuthenticated = true;
	if (browser) {
		localStorage.setItem('token', newToken);
	}
}

function clearAuth() {
	token = null;
	user = null;
	isAuthenticated = false;
	if (browser) {
		localStorage.removeItem('token');
	}
}

async function logout() {
	clearAuth();
	await goto('/login');
}

export function getAuth() {
	return {
		get user() {
			return user;
		},
		get token() {
			return token;
		},
		get isAuthenticated() {
			return isAuthenticated;
		},
		setAuth,
		clearAuth,
		logout,
		setUser(u: User) {
			user = u;
		}
	};
}
