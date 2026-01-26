import React, { useState } from 'react';

const MOCK_LEADS = [
    { id: 'L-101', name: 'James H.', model: '12x20 Modern Studio', status: 'deposit', value: 18500, date: '2h ago' },
    { id: 'L-102', name: 'Sarah M.', model: '10x16 Quaker', status: 'framing', value: 12400, date: '1d ago' },
    { id: 'L-103', name: 'Robert B.', model: '24x24 Lofted Barn', status: 'finishing', value: 32000, date: '3d ago' },
    { id: 'L-104', name: 'Emily C.', model: '8x12 A-Frame', status: 'ready', value: 6500, date: '5d ago' },
];

const COLUMNS = [
    { id: 'deposit', label: 'Deposit Paid', color: 'bg-blue-500' },
    { id: 'framing', label: 'Framing / Shell', color: 'bg-orange-500' },
    { id: 'finishing', label: 'Finishing', color: 'bg-purple-500' },
    { id: 'ready', label: 'Ready for Delivery', color: 'bg-green-500' }
];

const LeadDetailModal = ({ lead, onClose }: { lead: any, onClose: () => void }) => (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white text-2xl">×</button>
            <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2 block">Lead Spec # {lead.id}</span>
                <h2 className="text-4xl font-black text-white">{lead.name}</h2>
                <div className="flex gap-4 mt-4">
                    <span className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-bold uppercase text-slate-400 border border-white/10">{lead.date}</span>
                    <span className="bg-green-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase text-green-400 border border-green-500/30">Valor: ${lead.value.toLocaleString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Structure</h4>
                    <div className="text-xl font-bold text-white mb-1">{lead.model}</div>
                    <div className="text-sm text-slate-400">Standard Framing</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Contact</h4>
                    <div className="text-lg font-bold text-white mb-1">user@{lead.id.toLowerCase()}.com</div>
                    <div className="text-sm text-slate-400">+1 (506) 555-0123</div>
                </div>
            </div>

            <div className="flex gap-4">
                <button className="flex-1 bg-cyan-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors">Print Work Order</button>
                <button className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10">Email Client</button>
            </div>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const onDragStart = (e: React.DragEvent, id: string) => {
        setDraggedItem(id);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent, status: string) => {
        if (!draggedItem) return;
        setLeads(prev => prev.map(l => l.id === draggedItem ? { ...l, status } : l));
        setDraggedItem(null);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10 font-sans selection:bg-cyan-500">
            <header className="flex justify-between items-end mb-16 max-w-7xl mx-auto">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-4 block">Command Center</span>
                    <h1 className="text-6xl font-black uppercase tracking-tighter">Placed <span className="text-white/20">Admin</span></h1>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-white mb-1">$69,400</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Active Pipeline Value</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Total Active Builds</h3>
                    <div className="text-5xl font-black text-white">4</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Avg. Ticket Size</h3>
                    <div className="text-5xl font-black text-white">$17.3k</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] lg:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-6xl">🤖</span>
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">LUNAI Insight</h3>
                    <p className="text-lg font-medium text-white/80 leading-relaxed max-w-lg">
                        "The new <span className="text-white font-bold">$1,850 Comfort Kit</span> has seen a 45% lift in conversion since prioritizing the 'Plug-In Lifestyle' messaging. ShedCare adoption is at 60%."
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto overflow-x-auto pb-10">
                <div className="flex gap-8 min-w-[1200px]">
                    {COLUMNS.map(col => (
                        <div
                            key={col.id}
                            className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 min-h-[500px] flex flex-col"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, col.id)}
                        >
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{col.label}</span>
                                <span className="ml-auto text-[10px] font-bold text-white/20">{leads.filter(l => l.status === col.id).length}</span>
                            </div>

                            <div className="space-y-4 flex-1">
                                {leads.filter(l => l.status === col.id).map(lead => (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, lead.id)}
                                        onClick={() => setSelectedLead(lead)}
                                        className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 hover:border-cyan-500/50 cursor-grab active:cursor-grabbing shadow-xl transition-all group hover:scale-[1.02]"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{lead.id}</span>
                                            <span className="text-[9px] font-bold text-slate-600">{lead.date}</span>
                                        </div>
                                        <h4 className="text-lg font-black text-white mb-1">{lead.name}</h4>
                                        <p className="text-xs text-cyan-400 font-bold uppercase tracking-tight mb-4">{lead.model}</p>
                                        <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400">Value</span>
                                            <span className="font-mono text-sm font-bold">${lead.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        </div>
    );
};

export default AdminDashboard;
