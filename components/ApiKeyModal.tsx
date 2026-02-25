import React, { useState } from 'react';
import { X, Key, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentKey: string;
    onSave: (key: string) => Promise<boolean>;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, currentKey, onSave }) => {
    const [key, setKey] = useState(currentKey);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsLoading(true);
        setStatus('idle');
        const success = await onSave(key);
        setIsLoading(false);
        if (success) {
            setStatus('success');
            setTimeout(onClose, 1500);
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#111]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key className="text-purple-500" size={20} /> Configurar Gemini API
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-400">
                        Insira sua chave de API do Google Gemini para habilitar os recursos de Inteligência Artificial como Resumos, Brainstorms e Comandos de Voz.
                    </p>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">API Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                className={`w-full bg-white/5 border ${status === 'error' ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition`}
                                placeholder="AIzaSy..."
                                value={key}
                                onChange={e => setKey(e.target.value)}
                            />
                            {status === 'success' && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in">
                                    <Check size={20} />
                                </div>
                            )}
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle size={14} />
                            <span>Chave inválida ou erro de conexão. Verifique sua API Key.</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading || !key}
                            className="flex-[2] bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition active:scale-95"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Salvar Chave</>}
                        </button>
                    </div>

                    <p className="text-[10px] text-center text-gray-600">
                        Sua chave é salva localmente e nunca é compartilhada. <br />
                        Consiga uma chave gratuita em <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">Google AI Studio</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
