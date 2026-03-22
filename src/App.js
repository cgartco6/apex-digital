import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DesignStudio from './components/DesignStudio';
import BrandingStudio from './components/BrandingStudio';
import MarketingStudio from './components/MarketingStudio';
import PaymentSystem from './components/PaymentSystem';
import FeedbackForm from './components/FeedbackForm';
import ComplianceModals from './components/ComplianceModals';
import CookieConsent from './components/CookieConsent';
import { loadFromLocal, saveToLocal } from './utils/storage';

const App = () => {
    const [role, setRole] = useState('client'); // 'client', 'admin', 'owner'
    const [activeTab, setActiveTab] = useState('dashboard');
    const [aggressiveTriggered, setAggressiveTriggered] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [proStatus, setProStatus] = useState(() => loadFromLocal(role, 'pro_status', false));

    const handleAggressiveAction = () => {
        setAggressiveTriggered(true);
        setTimeout(() => setAggressiveTriggered(false), 200);
    };
    const resetAllData = () => {
        if (confirm("⚠️ This will erase all data for the current role. Continue?")) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(role)) localStorage.removeItem(key);
            });
            window.location.reload();
        }
    };
    const onPaymentVerified = () => {
        setProStatus(true);
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setActiveTab('dashboard');
        setProStatus(loadFromLocal(newRole, 'pro_status', false));
    };

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 border-b border-orange-800/50 pb-3">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        <i className="fas fa-crown"></i> APEX DIGITAL
                    </h1>
                    <p className="text-gray-400 text-sm">Role: {role.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <select value={role} onChange={e => handleRoleChange(e.target.value)} className="bg-gray-800 rounded px-2 py-1 text-sm border border-gray-600">
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                    </select>
                    {proStatus && <span className="pro-badge px-3 py-1 rounded-full text-xs font-bold text-white"><i className="fas fa-gem"></i> PRO</span>}
                    <button onClick={() => setShowPrivacy(true)} className="text-xs text-gray-400 hover:text-white">Privacy</button>
                    <button onClick={() => setShowTerms(true)} className="text-xs text-gray-400 hover:text-white">Terms</button>
                    <button onClick={resetAllData} className="text-xs bg-red-800/50 px-2 py-1 rounded hover:bg-red-700">Reset Data</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-1 border-b border-gray-700 overflow-x-auto">
                        {['dashboard', 'design', 'branding', 'marketing', 'payments'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-t-xl ${activeTab === tab ? 'tab-active' : 'text-gray-400'}`}>
                                <i className={`fas fa-${tab === 'dashboard' ? 'tachometer-alt' : tab === 'design' ? 'pen-fancy' : tab === 'branding' ? 'palette' : tab === 'marketing' ? 'chart-line' : 'credit-card'} mr-2`}></i>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="bg-gray-900/40 rounded-2xl p-5 backdrop-blur-sm border border-gray-700">
                        {activeTab === 'dashboard' && <Dashboard role={role} />}
                        {activeTab === 'design' && <DesignStudio role={role} />}
                        {activeTab === 'branding' && <BrandingStudio role={role} />}
                        {activeTab === 'marketing' && <MarketingStudio role={role} aggressiveBoostFlag={aggressiveTriggered} onBoostAcknowledge={()=>{}} />}
                        {activeTab === 'payments' && <PaymentSystem role={role} onPaymentVerified={onPaymentVerified} />}
                    </div>
                    <FeedbackForm role={role} />
                </div>
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-4 text-center text-xs">
                        <i className="fas fa-globe-africa"></i> Compliant with POPIA (ZA) & GDPR.<br/>
                        All data stored locally per role.<br/>
                        {role === 'owner' && <span className="text-orange-400">🚀 Platform Marketing Engine active</span>}
                    </div>
                </div>
            </div>
            <CookieConsent />
            <ComplianceModals showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy} showTerms={showTerms} setShowTerms={setShowTerms} />
        </div>
    );
};

export default App;
