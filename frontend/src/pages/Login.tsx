import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            await signIn({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">AGE26</h1>
                    <p className="text-gray-400">Central de Compras</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-300 mb-2 text-sm">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                            <input
                                type="email"
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 text-sm">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                            <input
                                type="password"
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg hover:shadow-blue-600/20"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
