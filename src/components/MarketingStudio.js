import React, { useState, useEffect } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';

const MarketingStudio = ({ role, aggressiveBoostFlag, onBoostAcknowledge }) => {
    const [campaigns, setCampaigns] = useState(loadFromLocal(role, 'campaigns', [
        { id: 1, name: "Summer Blast", budget: 2500, impressions: 45800, clicks: 3100, conversions: 342, status: "active" },
        { id: 2, name: "Flash Sale X", budget: 1200, impressions: 23400, clicks: 2100, conversions: 198, status: "active" },
    ]));
    const [newCampaign, setNewCampaign] = useState({ name: "", budget: "" });

    useEffect(() => {
        saveToLocal(role, 'campaigns', campaigns);
    }, [campaigns, role]);

    useEffect(() => {
        if (aggressiveBoostFlag) {
            setCampaigns(prev => prev.map(c => ({
                ...c,
                impressions: Math.floor(c.impressions * 1.4),
                clicks: Math.floor(c.clicks * 1.5),
                conversions: Math.floor(c.conversions * 1.35),
            })));
            if (onBoostAcknowledge) onBoostAcknowledge();
        }
    }, [aggressiveBoostFlag]);

    const addCampaign = () => {
        if (!newCampaign.name || !newCampaign.budget) return;
        const newId = campaigns.length + 1;
        setCampaigns([...campaigns, {
            id: newId,
            name: newCampaign.name,
            budget: parseInt(newCampaign.budget),
            impressions: Math.floor(Math.random() * 20000) + 5000,
            clicks: Math.floor(Math.random() * 2000),
            conversions: Math.floor(Math.random() * 200),
            status: "active"
        }]);
        setNewCampaign({ name: "", budget: "" });
    };
    const exportCSV = () => {
        const headers = ["ID","Name","Budget","Impressions","Clicks","Conversions","Status"];
        const rows = campaigns.map(c => [c.id, c.name, c.budget, c.impressions, c.clicks, c.conversions, c.status]);
        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        saveAs(blob, "apex-campaigns.csv");
    };
    const exportPDF = async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Apex Digital - Campaign Report", 10, 10);
        let y = 20;
        campaigns.forEach(c => {
            doc.text(`${c.name} | Budget: $${c.budget} | Impr: ${c.impressions} | Clicks: ${c.clicks} | Conv: ${c.conversions}`, 10, y);
            y += 8;
            if (y > 280) { doc.addPage(); y = 20; }
        });
        doc.save("campaign-report.pdf");
    };
    const totals = campaigns.reduce((acc,c) => ({ impressions: acc.impressions+c.impressions, clicks: acc.clicks+c.clicks, conversions: acc.conversions+c.conversions, budget: acc.budget+c.budget }), {impressions:0, clicks:0, conversions:0, budget:0});
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card p-2 text-center"><i className="fas fa-eye"></i><p className="text-xl font-bold">{totals.impressions.toLocaleString()}</p><p className="text-xs">Impressions</p></div>
                <div className="glass-card p-2 text-center"><i className="fas fa-mouse-pointer"></i><p className="text-xl font-bold">{totals.clicks.toLocaleString()}</p><p className="text-xs">Clicks</p></div>
                <div className="glass-card p-2 text-center"><i className="fas fa-chart-line"></i><p className="text-xl font-bold">{totals.conversions}</p><p className="text-xs">Conversions</p></div>
                <div className="glass-card p-2 text-center"><i className="fas fa-chart-simple"></i><p className="text-xl font-bold">{((totals.conversions*45)/totals.budget || 0).toFixed(1)}%</p><p className="text-xs">ROI Est.</p></div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
                <div className="flex justify-between items-center"><h4 className="font-bold">Campaigns</h4><div className="flex gap-2"><button onClick={exportCSV} className="bg-green-700 text-xs px-3 py-1 rounded"><i className="fas fa-file-csv"></i> CSV</button><button onClick={exportPDF} className="bg-red-700 text-xs px-3 py-1 rounded"><i className="fas fa-file-pdf"></i> PDF</button></div></div>
                <div className="max-h-64 overflow-y-auto space-y-2 mt-2">
                    {campaigns.map(c => (
                        <div key={c.id} className="bg-gray-800 p-2 rounded-xl flex flex-wrap justify-between items-center text-sm">
                            <span><b>{c.name}</b> (${c.budget})</span>
                            <span className="text-xs">{c.impressions} / {c.clicks} clk / {c.conversions} conv</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input placeholder="Campaign name" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="bg-gray-700 p-2 rounded flex-1 text-sm" />
                    <input type="number" placeholder="$ Budget" value={newCampaign.budget} onChange={e => setNewCampaign({...newCampaign, budget: e.target.value})} className="bg-gray-700 p-2 rounded w-28 text-sm" />
                    <button onClick={addCampaign} className="bg-orange-600 px-3 rounded"><i className="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    );
};

export default MarketingStudio;
