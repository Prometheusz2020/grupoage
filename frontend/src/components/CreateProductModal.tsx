import { useState, type FormEvent, useEffect } from 'react';
import { X, Package, DollarSign, Box, Truck } from 'lucide-react';
import { api } from '../services/api';

interface Supplier {
    id: number;
    tradeName: string;
}

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    supplierId: number;
    suppliers: Supplier[];
}

export function CreateProductModal({ isOpen, onClose, onSuccess, supplierId, suppliers }: CreateProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        costPrice: '',
        salePrice: '',
        itemsPerBox: '',
        boxPrice: '',
        selectedSupplierId: ''
    });

    useEffect(() => {
        if (supplierId) {
            setFormData(prev => ({ ...prev, selectedSupplierId: String(supplierId) }));
        }
    }, [supplierId, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const finalSupplierId = supplierId || Number(formData.selectedSupplierId);

        if (!finalSupplierId) {
            setError('Selecione um fornecedor.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/products', {
                ...formData,
                supplierId: finalSupplierId,
                costPrice: Number(formData.costPrice.replace(',', '.')),
                salePrice: Number(formData.salePrice.replace(',', '.')),
                itemsPerBox: Number(formData.itemsPerBox),
                boxPrice: Number(formData.boxPrice.replace(',', '.'))
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: '', costPrice: '', salePrice: '', itemsPerBox: '', boxPrice: '', selectedSupplierId: ''
            });
        } catch (err) {
            console.error(err);
            setError('Falha ao criar produto.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl my-8">
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-xl z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="text-blue-500" />
                        Novo Produto
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

                    {/* Supplier Select (only if not pre-selected) */}
                    {!supplierId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Fornecedor</label>
                            <div className="relative">
                                <Truck size={16} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                                <select
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none"
                                    value={formData.selectedSupplierId}
                                    onChange={e => setFormData({ ...formData, selectedSupplierId: e.target.value })}
                                >
                                    <option value="">Selecione um fornecedor...</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.tradeName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Produto</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            placeholder="Ex: Coca Cola 2L"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Preço de Custo (Un)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.costPrice}
                                    onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Preço de Venda (Un)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.salePrice}
                                    onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                            <Box size={16} /> Configuração de Caixa
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Qtd. por Caixa</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="1"
                                    value={formData.itemsPerBox}
                                    onChange={e => setFormData({ ...formData, itemsPerBox: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Preço da Caixa</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.boxPrice}
                                    onChange={e => setFormData({ ...formData, boxPrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

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
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
