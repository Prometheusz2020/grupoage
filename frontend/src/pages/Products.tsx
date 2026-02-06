import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../services/api';
import { Search, Plus, Package, Filter } from 'lucide-react';
import { CreateProductModal } from '../components/CreateProductModal';

interface Supplier {
    id: number;
    tradeName: string;
}

interface Product {
    id: number;
    name: string;
    costPrice: number;
    salePrice: number;
    itemsPerBox: number;
    boxPrice: number;
    active: boolean;
    supplierId: number;
    supplier?: {
        tradeName: string;
    }
}

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // URL params
    const queryParams = new URLSearchParams(window.location.search);
    const urlSupplierId = queryParams.get('supplierId');

    useEffect(() => {
        if (urlSupplierId) {
            setSelectedSupplierId(urlSupplierId);
        }
        loadSuppliers();
    }, [urlSupplierId]);

    useEffect(() => {
        loadProducts();
    }, [selectedSupplierId]);

    async function loadSuppliers() {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error("Failed to load suppliers", error);
        }
    }

    async function loadProducts() {
        setLoading(true);
        try {
            const url = selectedSupplierId
                ? `/products?supplierId=${selectedSupplierId}`
                : '/products';
            const response = await api.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-blue-500" />
                        Gerenciar Produtos
                    </h1>
                    <p className="text-gray-400">
                        {selectedSupplierId
                            ? `Produtos de: ${suppliers.find(s => s.id === Number(selectedSupplierId))?.tradeName || 'Fornecedor'}`
                            : 'Todos os Produtos'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Plus size={20} />
                        Novo Produto
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <select
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                        value={selectedSupplierId}
                        onChange={e => setSelectedSupplierId(e.target.value)}
                    >
                        <option value="">Todos os Fornecedores</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.tradeName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                    <Package size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-300">Nenhum produto encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente mudar o filtro ou cadastrar um novo.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 font-bold min-w-[2.5rem]">
                                    {product.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{product.name}</h3>
                                    <p className="text-xs text-blue-400 mb-1">{product.supplier?.tradeName}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                        <span className="text-green-400 font-medium">Venda: R$ {Number(product.salePrice).toFixed(2)}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span>Custo: R$ {Number(product.costPrice).toFixed(2)}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                            Cx {product.itemsPerBox}un : R$ {Number(product.boxPrice).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${product.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {product.active ? 'Ativo' : 'Inativo'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadProducts}
                supplierId={selectedSupplierId ? Number(selectedSupplierId) : 0}
                suppliers={suppliers} // Pass suppliers list to modal
            />
        </Layout>
    );
}
