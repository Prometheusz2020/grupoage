import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../services/api';
import { Plus, Search, Truck, Package, Power } from 'lucide-react';
import { CreateSupplierModal } from '../components/CreateSupplierModal';

interface Supplier {
    id: number;
    tradeName: string;
    corporateName: string;
    cnpj: string;
    email: string;
    phone: string;
    isActive: boolean;
    _count: {
        products: number;
        purchaseCycles: number;
    }
}

export function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function loadSuppliers() {
        setLoading(true);
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error("Erro ao carregar fornecedores", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSuppliers();
    }, []);

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Meus Fornecedores</h1>
                    <p className="text-gray-400">Gerencie seus parceiros comerciais</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} />
                    Novo Fornecedor
                </button>
            </div>

            <CreateSupplierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadSuppliers}
            />

            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Carregando...
                </div>
            ) : suppliers.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Truck size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum fornecedor encontrado</h3>
                    <p className="text-gray-400 mb-6 max-w-md">Você ainda não cadastrou nenhum fornecedor. Clique no botão acima para começar.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {suppliers.map(supplier => (
                        <div key={supplier.id} className={`bg-gray-800 p-6 rounded-xl border ${supplier.isActive ? 'border-gray-700' : 'border-red-900/50 opacity-75'} hover:border-blue-500/50 transition-colors group relative`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{supplier.tradeName}</h3>
                                    <span className="text-xs text-gray-400">{supplier.cnpj}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${supplier.isActive ? 'bg-green-500' : 'bg-red-500'}`} title={supplier.isActive ? 'Ativo' : 'Inativo'} />
                            </div>

                            <div className="space-y-2 text-sm text-gray-300 mb-6">
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-500">Email:</span> {supplier.email || '-'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-500">Tel:</span> {supplier.phone || '-'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-4 border-t border-gray-700">
                                <span>{supplier._count.products} Produtos</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = `/products?supplierId=${supplier.id}`;
                                        }}
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Ver Produtos"
                                    >
                                        <Package size={18} />
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!confirm(supplier.isActive ? 'Desativar este fornecedor?' : 'Ativar este fornecedor?')) return;
                                            try {
                                                await api.patch(`/suppliers/${supplier.id}/toggle-active`);
                                                loadSuppliers();
                                            } catch (err) { console.error(err); }
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${supplier.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                                        title={supplier.isActive ? 'Desativar' : 'Ativar'}
                                    >
                                        <Power size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
