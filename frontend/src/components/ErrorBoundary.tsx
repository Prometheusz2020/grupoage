import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Algo deu errado!</h1>
                    <div className="bg-gray-800 p-4 rounded border border-gray-700 max-w-lg w-full overflow-auto">
                        <h2 className="text-lg font-semibold mb-2">Erro:</h2>
                        <pre className="text-sm text-red-300 font-mono mb-4 whitespace-pre-wrap">
                            {this.state.error?.message}
                        </pre>
                        <p className="text-gray-400 text-sm">
                            Verifique o console do navegador (F12) para mais detalhes.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
