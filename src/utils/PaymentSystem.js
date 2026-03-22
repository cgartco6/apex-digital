import React, { useState, useEffect } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';

const PlatformMarketingEngine = () => {
    const [campaign, setCampaign] = useState(loadFromLocal('owner', 'platform_campaign', {
        active: false,
        target: 3000,
        current: 0,
        deadline: null,
        adHeadline: "Create Scroll-Stopping Social Ads in Minutes",
        adCopy: "Apex Social Media Ad Creator helps you design high‑conversion ads with AI‑assisted copy and instant previews. No design skills needed.",
        adImage: "https://placehold.co/600x400/1e293b/f97316?text=Apex+Ad+Creator",
        cta: "Try for Free"
    }));
    const [countdown, setCountdown] = useState('');
    const [simulationInterval, setSimulationInterval] = useState(null);

    const startCampaign = () => {
        if (campaign.active) return;
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 3);
        setCampaign({
            ...campaign,
            active: true,
            current: 0,
            deadline: deadline.toISOString()
        });
        saveToLocal('owner', 'platform_campaign', { ...campaign, active: true, current: 0, deadline: deadline.toISOString() });
        const interval = setInterval(() => {
            setCampaign(prev => {
                if (!prev.active || prev.current >= prev.target) {
                    clearInterval(interval);
                    setSimulationInterval(null);
                    return prev;
                }
                const increment = Math.floor(Math.random() * 20) + 5;
                const newCurrent = Math.min(prev.current + increment, prev.target);
                const updated = { ...prev, current: newCurrent };
                saveToLocal('owner', 'platform_campaign', updated);
                if (newCurrent >= prev.target) {
                    clearInterval(interval);
                    setSimulationInterval(null);
                    alert("🎉 Campaign completed! 3,000 people reached!");
                }
                return updated;
            });
        }, 2000);
        setSimulationInterval(interval);
    };

    const stopCampaign = () => {
        if (simulationInterval) clearInterval(simulationInterval);
        setCampaign(prev => ({ ...prev, active: false }));
        saveToLocal('owner', 'platform_campaign', { ...campaign, active: false });
    };

    const updateAd = (field, value) => {
        const updated = { ...campaign, [field]: value };
        setCampaign(updated);
        saveToLocal('owner', 'platform_campaign', updated);
    };

    useEffect(() => {
        if (!campaign.active || !campaign.deadline) return;
        const timer = setInterval(() => {
            const now = new Date();
            const deadline = new Date(campaign.deadline);
            const diff = deadline - now;
            if (diff <= 0) {
                setCountdown("Expired");
                clearInterval(timer);
            } else {
                const days = Math.floor(diff / (1000*60*60*24));
                const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
                const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
                const secs = Math.floor((diff % (1000*60)) / 1000);
                setCountdown(`${days}d ${hours}h ${mins}m ${secs}s`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [campaign.active, campaign.deadline]);

    const progressPercent = (campaign.current / campaign.target) * 100;

    return (
        <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl">
                <h3 className="text-xl font-bold flex items-center gap-2"><i className="fas fa-chart-line text-orange-400"></i> Platform Marketing Engine</h3>
                <p className="text-sm text-gray-300">Target: 3,000 impulse buyers in 3 days. Honest advertising – no upselling, no false claims.</p>
                <div className="mt-4 bg-gray-800 p-4 rounded-xl">
                    <div className="flex justify-between text-sm"><span>Progress</span><span>{campaign.current} / {campaign.target}</span></div>
                    <div className="w-full bg-gray-700 rounded-full h-4 mt-1"><div className="bg-orange-500 h-4 rounded-full" style={{ width: `${progressPercent}%` }}></div></div>
                    {campaign.active && <div className="mt-2 text-xs">⏳ Time remaining: {countdown}</div>}
                    <div className="flex gap-2 mt-4">
                        {!campaign.active ? (
                            <button onClick={startCampaign} className="bg-green-600 px-4 py-2 rounded-lg font-bold"><i className="fas fa-play"></i> Start Campaign</button>
                        ) : (
                            <button onClick={stopCampaign} className="bg-red-600 px-4 py-2 rounded-lg font-bold"><i className="fas fa-stop"></i> Stop Campaign</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
                <h4 className="font-bold text-lg">Ad Creator (No Clickbait)</h4>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-3">
                        <div><label className="block text-sm">Headline</label><input type="text" value={campaign.adHeadline} onChange={e => updateAd('adHeadline', e.target.value)} className="bg-gray-700 p-2 rounded w-full" /></div>
                        <div><label className="block text-sm">Copy</label><textarea rows="3" value={campaign.adCopy} onChange={e => updateAd('adCopy', e.target.value)} className="bg-gray-700 p-2 rounded w-full"></textarea></div>
                        <div><label className="block text-sm">Image URL</label><input type="text" value={campaign.adImage} onChange={e => updateAd('adImage', e.target.value)} className="bg-gray-700 p-2 rounded w-full" /></div>
                        <div><label className="block text-sm">CTA Button</label><input type="text" value={campaign.cta} onChange={e => updateAd('cta', e.target.value)} className="bg-gray-700 p-2 rounded w-full" /></div>
                    </div>
                    <div className="landing-page-preview bg-white text-black p-4 rounded-xl">
                        <h2 className="text-2xl font-bold">{campaign.adHeadline}</h2>
                        <img src={campaign.adImage} alt="Ad preview" className="my-3 rounded-lg max-h-40 object-cover w-full" />
                        <p className="text-gray-700">{campaign.adCopy}</p>
                        <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">{campaign.cta}</button>
                        <p className="text-xs text-gray-500 mt-3">No upsells • No false claims • What you see is what you get</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformMarketingEngine;
