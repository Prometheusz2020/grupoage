import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../services/api';
import { Plus, Users as UsersIcon, Mail } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    _count: {
        stores: number;
        managedSuppliers: number;
    }
}

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [submitLoading, setSubmitLoading] = useState(false);

    async function loadUsers() {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/users', formData);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'USER' });
            loadUsers();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar usuário');
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <Layout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <UsersIcon className="text-blue-500" />
                        Gerenciar Lojistas
                    </h1>
                    <p className="text-gray-400">Cadastre usuários para gerenciar lojas e produtos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} />
                    Novo Usuário
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map(user => (
                        <div key={user.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xl text-blue-400">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{user.name}</h3>
                                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{user.role}</span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400">
                                <p className="flex items-center gap-2">
                                    <Mail size={14} /> {user.email}
                                </p>
                                <div className="flex justify-between pt-4 border-t border-gray-700 mt-4">
                                    <div className="text-center">
                                        <span className="block font-bold text-white text-lg">{user._count.stores}</span>
                                        <span className="text-xs">Lojas</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-white text-lg">{user._count.managedSuppliers}</span>
                                        <span className="text-xs">Fornecedores</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simple Modal for Create User */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Novo Usuário</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                                <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-blue-500"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input required type="email" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-blue-500"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Senha</label>
                                <input required type="password" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-blue-500"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                                <button type="submit" disabled={submitLoading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium">
                                    {submitLoading ? 'Salvando...' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
