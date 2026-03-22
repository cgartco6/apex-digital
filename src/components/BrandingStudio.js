import React, { useState, useEffect } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';

const BrandingStudio = ({ role }) => {
    const [primary, setPrimary] = useState(loadFromLocal(role, 'brand_primary', '#f97316'));
    const [secondary, setSecondary] = useState(loadFromLocal(role, 'brand_secondary', '#3b82f6'));
    const [font, setFont] = useState(loadFromLocal(role, 'brand_font', 'Inter'));
    const [logo, setLogo] = useState(loadFromLocal(role, 'brand_logo', 'https://placehold.co/200x80/1e293b/f97316?text=APEX+LOGO'));
    const [tempLogo, setTempLogo] = useState('');

    useEffect(() => {
        saveToLocal(role, 'brand_primary', primary);
        saveToLocal(role, 'brand_secondary', secondary);
        saveToLocal(role, 'brand_font', font);
        saveToLocal(role, 'brand_logo', logo);
    }, [primary, secondary, font, logo, role]);

    const exportBrandKitZip = async () => {
        const zip = new JSZip();
        const cssContent = `:root { --primary: ${primary}; --secondary: ${secondary}; --font: ${font}; } .btn-primary { background: var(--primary); }`;
        zip.file("brand.css", cssContent);
        if (logo && logo.startsWith('http')) {
            try {
                const response = await fetch(logo);
                const blob = await response.blob();
                zip.file("logo.png", blob);
            } catch(e) { console.warn("Could not fetch logo"); }
        }
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "apex-brand-kit.zip");
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div><label>Primary Color</label><input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-full h-10 rounded" /></div>
                <div><label>Secondary Color</label><input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-full h-10 rounded" /></div>
                <div><label>Font</label><select value={font} onChange={e => setFont(e.target.value)} className="bg-gray-800 p-2 rounded w-full"><option>Inter</option><option>Poppins</option><option>Montserrat</option></select></div>
                <div><label>Logo URL</label><div className="flex gap-2"><input type="text" value={tempLogo} onChange={e => setTempLogo(e.target.value)} className="bg-gray-800 flex-1 p-2 rounded" placeholder="Image URL" /><button onClick={() => { if(tempLogo) setLogo(tempLogo); }} className="bg-orange-600 px-3 rounded">Set</button></div></div>
                <button onClick={exportBrandKitZip} className="bg-blue-600 w-full py-2 rounded-lg mt-2"><i className="fas fa-file-zipper"></i> Download Brand Kit (ZIP)</button>
            </div>
            <div className="glass-card p-4 rounded-2xl" style={{ backgroundColor: secondary+'20', borderTopColor: primary, borderTopWidth: 4, fontFamily: font }}>
                <h3 style={{color: primary}}>APEX Preview</h3>
                <div className="flex gap-2 mt-2"><span className="px-3 py-1 rounded text-white" style={{background:primary}}>Primary</span><span className="px-3 py-1 rounded text-white" style={{background:secondary}}>Secondary</span></div>
                <img src={logo} alt="logo" className="max-h-16 mt-2" />
            </div>
        </div>
    );
};

export default BrandingStudio;
