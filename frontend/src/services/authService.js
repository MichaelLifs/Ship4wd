const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            return data;
        } catch {
            throw new Error('Invalid email or password');
        }
    },
};

