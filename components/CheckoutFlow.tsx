
import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { ShedSpec, CostEstimate } from '../types';
import { UPGRADES } from '../constants';

interface CheckoutFlowProps {
  spec: ShedSpec;
  costs: CostEstimate;
  onCancel: () => void;
  onComplete: () => void;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ spec, costs, onCancel, onComplete }) => {
  const [step, setStep] = useState<'review' | 'delivery' | 'payment' | 'confirm'>('review');
  const [showPowerOptions, setShowPowerOptions] = useState(false);
  const [shedCare, setShedCare] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Saint John',
    province: 'NB',
    paymentMethod: 'full' as 'full' | 'rto36' | 'rto60'
  });

  const activeAddons = Object.entries(spec.addons)
    .filter(([_, active]) => active)
    .map(([id]) => UPGRADES.find(u => u.id === id));

  const steps = [
    { id: 'review', label: 'Review' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' }
  ];

  const [isProcessing, setIsProcessing] = useState(false);

  const generateReceipt = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFillColor(249, 115, 22); // Orange-500
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PLACED | Construction Receipt", 20, 25);

    // Order Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 60;
    doc.text(`Customer: ${formData.firstName} ${formData.lastName}`, 20, y);
    doc.text(`Date: ${date}`, 150, y);
    y += 10;
    doc.text(`Email: ${formData.email}`, 20, y);
    y += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Build Specification", 20, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 15;

    doc.setFont("helvetica", "normal");
    doc.text(`Model: ${spec.width}' x ${spec.depth}' ${spec.style}`, 20, y);
    doc.text(`$${costs.material.toLocaleString()}`, 170, y, { align: 'right' });
    y += 10;

    if (spec.electricalTier) {
      doc.text(`Power Kit: ${spec.electricalTier === '20A' ? '20A Creator' : '30A Comfort'}`, 20, y);
      doc.text(`$${(spec.electricalTier === '20A' ? 1200 : 1850).toLocaleString()}`, 170, y, { align: 'right' });
      y += 10;
    }

    Object.entries(spec.addons).forEach(([key, val]) => {
      if (val) {
        const up = UPGRADES.find(u => u.id === key);
        if (up) {
          doc.text(`Addon: ${up.name}`, 20, y);
          doc.text(`$${up.cost.toLocaleString()}`, 170, y, { align: 'right' });
          y += 10;
        }
      }
    });

    if (shedCare) {
      y += 10;
      doc.setTextColor(0, 100, 0);
      doc.setFont("helvetica", "bold");
      doc.text("ShedCare Subscription (Monthly)", 20, y);
      doc.text("$29.00/mo", 170, y, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    }

    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL PROJECT VALUATION`, 20, y);
    doc.text(`$${costs.total.toLocaleString()}`, 170, y, { align: 'right' });

    doc.save(`Placed_Receipt_${date.replace(/\//g, '-')}.pdf`);
  };

  const handleNext = async () => {
    if (step === 'review') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') setStep('confirm');
    else {
      setIsProcessing(true);
      // Simulate API call
      await new Promise(r => setTimeout(r, 2000));
      generateReceipt();
      setIsProcessing(false);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step === 'delivery') setStep('review');
    else if (step === 'payment') setStep('delivery');
    else if (step === 'confirm') setStep('payment');
    else onCancel();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-40 px-6 md:px-10 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-16 px-4 md:px-20 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 mx-20" />
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${steps.findIndex(x => x.id === step) >= i ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                {i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-slate-950' : 'text-slate-400'
                }`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100">
            {step === 'review' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-10">Review Your Build</h2>
                <div className="space-y-8">
                  <div className="flex items-center gap-8 border-b border-slate-100 pb-8">
                    <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center text-5xl">🏠</div>
                    <div>
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-2">Structure Primitive</span>
                      <h3 className="text-2xl font-black uppercase tracking-tight">{spec.width}' × {spec.depth}' {spec.style}</h3>
                      <p className="text-slate-500 font-medium">{spec.sidingType === 'lap' ? 'Horizontal Lap' : 'Board & Batten'} Siding • {spec.wallColor} Finish</p>
                    </div>
                  </div>

                  {activeAddons.length > 0 && (
                    <div className="py-2">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6">Selected Addons</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeAddons.map(addon => addon && (
                          <div key={addon.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-2xl">{addon.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-tight">{addon.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Power Check Section */}
                  <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">Did you plan your power?</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-md">Most homeowners add a plug-in power kit now so their shed is ready for heat, lights, and work from day one.</p>

                    {!showPowerOptions ? (
                      <div className="flex gap-4">
                        <button onClick={() => setStep('delivery')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800">Yes, Power Handled</button>
                        <button onClick={() => setShowPowerOptions(true)} className="bg-white border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-orange-500 hover:text-orange-600">Show Plug-in Options</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          { t: "20A Creator Kit", d: "Lights, laptop, light tools", p: "+$1,200" },
                          { t: "30A Comfort Kit", d: "Heater, PC, serious tools, fully active", p: "+$1,850" },
                          { t: "50A Pro Service", d: "Heavy heating/cooling (Requires Permit)", p: "+$3,500" }
                        ].map((opt, i) => (
                          <button key={i} className="w-full flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left group">
                            <div>
                              <div className="font-black uppercase text-sm group-hover:text-orange-700">{opt.t}</div>
                              <div className="text-xs text-slate-500">{opt.d}</div>
                            </div>
                            <div className="font-bold text-slate-900">{opt.p}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2rem]">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">🚛</span>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-orange-800 mb-1">Saint John Direct Delivery</h4>
                        <p className="text-xs text-orange-700/80 font-medium">Your location qualifies for free localized delivery within the Saint John city limits.</p>
                      </div>
                    </div>
                  </div>

                  {/* ShedCare Subscription */}
                  <div className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${shedCare ? 'bg-green-50 border-green-500' : 'bg-white border-slate-100 hover:border-green-200'}`} onClick={() => setShedCare(!shedCare)}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${shedCare ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {shedCare ? '✓' : '+'}
                        </div>
                        <div>
                          <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">ShedCare™ Protection</h4>
                          <p className="text-xs text-slate-500 font-medium max-w-sm mt-1">
                            Proactive maintenance, 24/7 power monitoring alerts, and priority storm response.
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">$19<span className="text-xs text-slate-400 font-bold">/mo</span></div>
                        {shedCare && <div className="text-[10px] font-black uppercase text-green-600 tracking-widest mt-1">Active</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'delivery' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-10">Delivery Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:border-slate-900 transition-all"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:border-slate-900 transition-all"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="123 Uptown St"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:border-slate-900 transition-all"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">City</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none"
                      value={formData.city}
                      readOnly
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">Email</label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:border-slate-900 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-10">Payment Plan</h2>
                <div className="space-y-4">
                  {[
                    { id: 'full', label: 'Pay In Full', sub: 'Single secure transaction', price: costs.total },
                    { id: 'rto36', label: '36 Month RTO', sub: 'No credit check', price: Math.ceil(costs.total / 36 * 1.3) },
                    { id: 'rto60', label: '60 Month RTO', sub: 'Lowest monthly cost', price: Math.ceil(costs.total / 60 * 1.5) }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: option.id as any })}
                      className={`w-full flex items-center justify-between p-8 rounded-3xl border-2 transition-all ${formData.paymentMethod === option.id ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-6 h-6 rounded-full border-4 ${formData.paymentMethod === option.id ? 'border-orange-600 bg-white' : 'border-slate-200'}`} />
                        <div className="text-left">
                          <span className="text-lg font-black uppercase tracking-tight block">{option.label}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{option.sub}</span>
                        </div>
                      </div>
                      <span className="text-xl font-black">${option.price.toLocaleString()}{option.id.startsWith('rto') ? '/mo' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-10">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-10">✓</div>
                <h2 className="text-5xl font-black tracking-tighter uppercase mb-4">Almost There!</h2>
                <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto mb-10">Please review your delivery details and order summary before finalizing your Placed asset.</p>
                <div className="bg-slate-50 p-10 rounded-[3rem] text-left border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Delivery Recipient</span>
                  <div className="text-xl font-black uppercase mb-1">{formData.firstName} {formData.lastName}</div>
                  <div className="text-slate-500 font-medium">{formData.address}, {formData.city}, NB</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-16 flex gap-6">
              <button
                onClick={handleBack}
                className="flex-1 p-8 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
              >
                {step === 'review' ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleNext}
                className="flex-[2] p-8 rounded-[2rem] bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
              >
                {step === 'confirm' ? (isProcessing ? 'Securing Slot...' : 'Reserve Construction Slot') : 'Continue'}
              </button>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 sticky top-40">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8 pb-4 border-b border-slate-100">Order Summary</h4>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500">Base Structure</span>
                  <span className="font-black font-mono">${costs.material.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500">Fabrication/Labor</span>
                  <span className="font-black font-mono">${costs.labor.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500">Delivery</span>
                  <span className="font-black uppercase text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500">Tax (HST)</span>
                  <span className="font-black font-mono">${Math.ceil(costs.total * 0.15).toLocaleString()}</span>
                </div>
                {shedCare && (
                  <div className="flex justify-between text-sm py-3 border-t border-slate-100 border-dashed">
                    <span className="font-bold text-green-600">ShedCare™ (Monthly)</span>
                    <span className="font-black font-mono text-green-600">$29.00</span>
                  </div>
                )}
              </div>
              <div className="pt-8 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</span>
                  <span className="text-4xl font-black tracking-tighter">${costs.total.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Secure SSL Encrypted
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 10-Year Structural Warranty
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
