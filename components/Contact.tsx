
import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        type: 'Shed Installation (Shell Only)',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate network request
        setTimeout(() => setStatus('success'), 1500);
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-10">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-green-900/50">✓</div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Message Sent.</h1>
                    <p className="text-white/40 text-xl font-medium max-w-lg mx-auto mb-10">
                        Our architectural team has received your inquiry. We'll be in touch within 24 hours to discuss your project.
                    </p>
                    <button onClick={() => { setStatus('idle'); setFormData({ ...formData, message: '' }); }} className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all">
                        Send Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6 md:px-10 overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-[4rem] p-12 md:p-24 text-slate-900 shadow-2xl flex flex-col lg:flex-row gap-20 min-h-[80vh]">
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-6 block">Get In Touch</span>
                        <h2 className="text-8xl md:text-9xl font-black tracking-tighter uppercase mb-12 text-slate-200 leading-[0.85]">Talk <br/>Shop</h2>
                        <p className="text-xl md:text-2xl font-medium text-slate-500 leading-relaxed mb-16 max-w-md">
                            Ready to turn that empty corner of your yard into something useful? From new shed installs to plug-in backyard offices, our team can help you plan a project that actually fits your budget and your power situation in New Brunswick.
                        </p>
                        
                        <div className="space-y-12">
                            <div className="flex items-center gap-8 group cursor-pointer">
                                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-slate-950/20 group-hover:scale-110 transition-transform">📞</div>
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">Call Us</span>
                                    <span className="text-3xl font-black text-slate-950 tracking-tighter">1 (800) HANDBOOK</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 group cursor-pointer">
                                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-slate-950/20 group-hover:scale-110 transition-transform">✉️</div>
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">Email Us</span>
                                    <span className="text-3xl font-black text-slate-950 tracking-tighter">hello@handbook.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 bg-slate-50/80 backdrop-blur-sm rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-inner flex flex-col justify-center">
                        <form className="space-y-10" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 block">Project Type</label>
                                <div className="relative">
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full bg-white border-2 border-slate-100 rounded-3xl p-8 text-sm font-black uppercase tracking-widest focus:border-slate-950 outline-none transition-all appearance-none shadow-sm cursor-pointer hover:border-slate-300"
                                    >
                                        <option>Shed Installation (Shell Only)</option>
                                        <option>Shed + Plug-in Power Kit (Office/Studio)</option>
                                        <option>Add Power to Existing Shed</option>
                                        <option>I'm not sure – Help me choose</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-black">▼</div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 block">Your Email</label>
                                <input 
                                    type="email"
                                    required
                                    placeholder="YOU@EXAMPLE.COM"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-sm font-bold placeholder:text-slate-300 focus:border-slate-950 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 block">Your Message</label>
                                <textarea 
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="TELL US ABOUT YOUR SHED, HOW FAR IT IS FROM THE HOUSE, AND WHAT YOU WANT TO RUN INSIDE (HEATER, PC, TOOLS, ETC.)."
                                    className="w-full bg-white border-2 border-slate-100 rounded-[3rem] p-10 text-sm font-bold uppercase tracking-widest focus:border-slate-950 outline-none transition-all h-48 resize-none shadow-sm placeholder:text-slate-300"
                                />
                            </div>
                            <button 
                                disabled={status === 'loading'}
                                className="w-full bg-slate-950 text-white rounded-[2.5rem] p-8 text-sm font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-950/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {status === 'loading' ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Send Message'}
                            </button>
                            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                                We work with real-world New Brunswick conditions—snow loads, power rates, and the way electricians and inspectors actually operate here.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
