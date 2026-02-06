import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../services/api';
import { Plus, Store as StoreIcon, UserCheck } from 'lucide-react';

interface Store {
    id: number;
    name: string;
    owner: {
        id: number;
        name: string;
        email: string;
    }
}

interface User {
    id: number;
    name: string;
    email: string;
}

export function Stores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [name, setName] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    async function loadData() {
        setLoading(true);
        try {
            const [storesRes, usersRes] = await Promise.all([
                api.get('/stores'),
                api.get('/users')
            ]);
            setStores(storesRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to load stores/users", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleCreateStore(e: React.FormEvent) {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/stores', { name, ownerId: Number(ownerId) });
            setIsModalOpen(false);
            setName('');
            setOwnerId('');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar loja');
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <Layout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <StoreIcon className="text-blue-500" />
                        Gerenciar Lojas
                    </h1>
                    <p className="text-gray-400">Cadastre suas lojas e vincule aos lojistas responsáveis.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} />
                    Nova Loja
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map(store => (
                        <div key={store.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                    <StoreIcon size={20} />
                                </div>
                            </div>

                            <h3 className="font-bold text-xl text-white mb-2">{store.name}</h3>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-sm text-gray-500 mb-1">Responsável</p>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <UserCheck size={16} className="text-blue-400" />
                                    <span>{store.owner?.name}</span>
                                </div>
                                <span className="text-xs text-gray-500 ml-6">{store.owner?.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Store Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Nova Loja</h2>
                        <form onSubmit={handleCreateStore} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nome da Loja</label>
                                <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-blue-500"
                                    value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Matriz - Centro" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Lojista Responsável</label>
                                <select required className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-blue-500 appearance-none"
                                    value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                                    <option value="">Selecione um lojista...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                                <button type="submit" disabled={submitLoading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium">
                                    {submitLoading ? 'Salvando...' : 'Criar Loja'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
