import { createContext, type ReactNode, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (data: SignInData) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

interface SignInData {
    email: string;
    password: string;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // DEV MODE: Auto Login
        const devUser = { id: 1, name: 'Admin (Dev Mode)', email: 'admin@age26.com' };
        setUser(devUser);
        setLoading(false);
        localStorage.setItem('age26.token', 'dev_token');
        /*
        const token = localStorage.getItem('age26.token');
        const storedUser = localStorage.getItem('age26.user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from storage", error);
                localStorage.removeItem('age26.token');
                localStorage.removeItem('age26.user');
            }
        }
        setLoading(false);
        */
    }, []);

    async function signIn({ email, password }: SignInData) {
        const response = await api.post('/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('age26.token', token);
        localStorage.setItem('age26.user', JSON.stringify(user));

        setUser(user);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    function signOut() {
        localStorage.removeItem('age26.token');
        localStorage.removeItem('age26.user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
