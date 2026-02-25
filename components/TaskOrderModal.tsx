import React, { useState, useEffect, useCallback } from 'react';
import { X, ListOrdered, GripVertical, CheckCircle2, Clock, Play, Calendar, Trophy, Sparkles, Wand2, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { CardData } from '../types';

interface TaskOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    cards: CardData[];
    events: any[];
    isRoutineActive: boolean;
    onReorder: (newOrder: CardData[]) => void;
    onStart: (orderedList: CardData[]) => void;
    onStop: () => void;
}

const TaskOrderModal: React.FC<TaskOrderModalProps> = ({
    isOpen,
    onClose,
    cards = [],
    events = [],
    isRoutineActive,
    onReorder,
    onStart,
    onStop
}) => {
    const [localTasks, setLocalTasks] = useState<CardData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Initialize local state from cards
    useEffect(() => {
        if (isOpen) {
            const taskCards = cards.filter(c => c.type !== 'note');
            // Sort: Pending at top, Completed at bottom
            const sorted = [...taskCards].sort((a, b) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return 0;
            });
            setLocalTasks(sorted);
            setSelectedIndex(0);
        }
    }, [isOpen, cards]);

    const moveTask = (index: number, direction: 'up' | 'down') => {
        const newTasks = [...localTasks];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newTasks.length) return;

        [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
        setLocalTasks(newTasks);
        setSelectedIndex(newIndex);
        onReorder(newTasks);
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < localTasks.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (localTasks[selectedIndex]) {
                // Se o usuário apertar Enter, iniciamos o fluxo a partir desse card
                const reordered = [
                    localTasks[selectedIndex],
                    ...localTasks.filter((_, i) => i !== selectedIndex)
                ];
                onStart(reordered);
            }
        }
    }, [isOpen, localTasks, selectedIndex, onStart]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    const pendingCount = localTasks.filter(t => t.status !== 'completed').length;
    const completedCount = localTasks.filter(t => t.status === 'completed').length;

    return (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center md:p-4 p-0">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-2xl border border-white/60 w-full max-w-3xl h-full md:max-h-[85vh] rounded-none md:rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in scale-95 opacity-0 duration-500 cubic-bezier(0.19, 1, 0.22, 1) [animation-fill-mode:forwards] animate-reveal">

                {/* Header Section */}
                <div className="px-6 md:px-12 py-6 md:py-10 border-b border-gray-100 flex justify-between items-center relative overflow-hidden bg-white/50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="relative flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl md:rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-6 shrink-0">
                            <ListOrdered size={24} md:size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">Task Order</h2>
                            <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2 ml-1 flex items-center gap-2">
                                <Sparkles size={10} className="text-blue-500" /> Fluxo Prioritário
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Controles</span>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[9px] text-gray-400 font-black">↑↓ NAVEGAR</span>
                                <span className="px-2 py-0.5 bg-blue-600 border border-blue-500 rounded text-[9px] text-white font-black shadow-lg shadow-blue-500/20">ENTER INICIAR</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:scale-110 active:scale-95 transition-all border border-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-gray-50/50 px-6 md:px-12 py-4 md:py-6 border-b border-gray-100 flex items-center gap-6 md:gap-10">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Clock size={16} />
                        </div>
                        <div>
                            <div className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Pendentes</div>
                            <div className="text-sm md:text-lg font-black text-gray-900">{pendingCount}</div>
                        </div>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-gray-200" />
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500 shrink-0">
                            <CheckCircle2 size={16} />
                        </div>
                        <div>
                            <div className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Concluídos</div>
                            <div className="text-sm md:text-lg font-black text-gray-900">{completedCount}</div>
                        </div>
                    </div>

                    {isRoutineActive && (
                        <button
                            onClick={onStop}
                            className="ml-auto hidden md:flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm shadow-rose-500/5 group"
                        >
                            <Square size={12} fill="currentColor" className="group-hover:scale-110 transition-transform" /> Parar Rotina
                        </button>
                    )}
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto md:px-8 md:py-10 p-4 space-y-2 custom-scrollbar">
                    {localTasks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                                <Calendar size={36} />
                            </div>
                            <p className="text-lg font-black text-gray-500">Nenhuma tarefa no horizonte</p>
                        </div>
                    ) : (
                        localTasks.map((task, index) => (
                            <div
                                key={task.id}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    const reordered = [
                                        localTasks[index],
                                        ...localTasks.filter((_, i) => i !== index)
                                    ];
                                    onStart(reordered);
                                }}
                                className={`group flex items-center gap-6 p-5 rounded-[32px] border transition-all duration-300 cursor-pointer relative ${selectedIndex === index ? 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/10' : 'border-gray-50 bg-white hover:bg-gray-50'} ${task.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                            >
                                <div className="flex items-center gap-4 border-r border-gray-100 pr-5 shrink-0">
                                    <div className="flex flex-col items-center gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveTask(index, 'up'); }}
                                            disabled={index === 0}
                                            className={`p-1 rounded-lg hover:bg-blue-100 transition-all ${index === 0 ? 'opacity-0' : 'text-gray-300 hover:text-blue-600'}`}
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <span className={`text-[12px] font-black font-mono transition-colors ${selectedIndex === index ? 'text-blue-600' : 'text-gray-300'}`}>{(index + 1).toString().padStart(2, '0')}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveTask(index, 'down'); }}
                                            disabled={index === localTasks.length - 1}
                                            className={`p-1 rounded-lg hover:bg-blue-100 transition-all ${index === localTasks.length - 1 ? 'opacity-0' : 'text-gray-300 hover:text-blue-600'}`}
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>
                                    <GripVertical size={16} className={`transition-colors ${selectedIndex === index ? 'text-blue-500' : 'text-gray-100 group-hover:text-gray-300'}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-black transition-all text-sm truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                        {task.title || 'Tarefa sem título'}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1.5 font-bold">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.color === 'red' ? '#ef4444' : task.color === 'yellow' ? '#facc15' : task.color === 'purple' ? '#a855f7' : task.color === 'blue' ? '#3b82f6' : '#22c55e' }} />
                                            {Math.round(task.timerTotal / 60)} min
                                        </div>
                                        {task.status === 'completed' ? (
                                            <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                                <Trophy size={10} /> Finalizado
                                            </div>
                                        ) : selectedIndex === index && (
                                            <div className="flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                                                <Sparkles size={10} /> Clique ou Enter para Iniciar
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {task.status !== 'completed' && (
                                        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all ${selectedIndex === index ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 -translate-x-1' : 'bg-gray-50 text-gray-200 group-hover:bg-blue-50 group-hover:text-blue-300'}`}>
                                            <Play size={20} fill={selectedIndex === index ? "white" : "none"} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 md:p-10 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-12">
                    <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-400">
                        <Trophy size={18} className="text-amber-500" />
                        <span className="text-gray-900">{completedCount} finalizados</span> hoje
                    </div>
                    <div className="flex w-full md:w-auto gap-3 md:gap-4">
                        <button
                            onClick={() => onStart(localTasks)}
                            className="flex-1 md:flex-none bg-blue-600 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={16} md:size={18} fill="white" /> Iniciar Sequência
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 md:flex-none bg-gray-900 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes reveal {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .animate-reveal {
                    animation: reveal 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default TaskOrderModal;
