import { useState, useEffect, type FormEvent } from 'react';
import { X, User as UserIcon, Phone, Building } from 'lucide-react';
import { api } from '../services/api';

interface CreateSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface User {
    id: number;
    name: string;
    email: string;
}

export function CreateSupplierModal({ isOpen, onClose, onSuccess }: CreateSupplierModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        tradeName: '',
        corporateName: '',
        cnpj: '',
        email: '',
        address: '',
        phone1: '',
        phone2: '',
        contactName1: '',
        contactName2: '',
        notes: '',
        managerId: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Load potential managers (users)
            api.get('/users').then(response => {
                setUsers(response.data);
                // Default select the first one if available not recommended, better force choice
            }).catch(err => console.error("Failed to load users", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.managerId) {
            setError("Selecione um responsável pelo fornecedor.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/suppliers', formData);
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                tradeName: '', corporateName: '', cnpj: '', email: '', address: '',
                phone1: '', phone2: '', contactName1: '', contactName2: '', notes: '', managerId: ''
            });
        } catch (err) {
            console.error(err);
            setError('Falha ao criar fornecedor. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl my-8">
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-xl z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building className="text-blue-500" />
                        Novo Fornecedor
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Dados Principais */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-700 pb-1">Dados da Empresa</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nome Fantasia *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="Ex: Distribuidora ABC"
                                    value={formData.tradeName}
                                    onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Razão Social</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="Ex: ABC Comércio Ltda"
                                    value={formData.corporateName}
                                    onChange={e => setFormData({ ...formData, corporateName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">CNPJ *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="00.000.000/0001-00"
                                    value={formData.cnpj}
                                    onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Responsável (Lojista) *</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none"
                                        value={formData.managerId}
                                        onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                                    >
                                        <option value="">Selecione um usuário...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    <UserIcon size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                placeholder="contato@empresa.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Endereço Completo</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                placeholder="Rua, Número, Bairro, Cidade - UF"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>


                    {/* Contatos */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-700 pb-1 flex items-center gap-2">
                            <Phone size={16} /> Contatos & Telefones
                        </h3>

                        {/* Contato 1 */}
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Contato Principal</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Contato</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: João Silva"
                                        value={formData.contactName1}
                                        onChange={e => setFormData({ ...formData, contactName1: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone1}
                                        onChange={e => setFormData({ ...formData, phone1: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contato 2 */}
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Contato Secundário (Opcional)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Contato</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: Maria"
                                        value={formData.contactName2}
                                        onChange={e => setFormData({ ...formData, contactName2: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone2}
                                        onChange={e => setFormData({ ...formData, phone2: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Observações (Obs)</label>
                        <textarea
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            rows={3}
                            placeholder="Informações adicionais..."
                            value={formData.notes || ''}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar Fornecedor'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
