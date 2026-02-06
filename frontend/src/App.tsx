import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function Dashboard() {
  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Bem-vindo!</h2>
          <p className="text-gray-400">Selecione uma opção no menu lateral para começar.</p>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Ciclos Abertos</h2>
          <p className="text-3xl font-bold text-blue-400">0</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Fornecedores</h2>
          <p className="text-3xl font-bold text-purple-400">0</p>
        </div>
      </div>
    </Layout>
  );
}

import { Suppliers } from './pages/Suppliers';
import { Products } from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/suppliers" element={
            <PrivateRoute>
              <Suppliers />
            </PrivateRoute>
          } />

          <Route path="/products" element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          } />

          {/* Add placeholder routes for now */}
          <Route path="/stores" element={<PrivateRoute><Layout><h1>Lojas</h1></Layout></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
