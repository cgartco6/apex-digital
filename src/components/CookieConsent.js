import React, { useState } from 'react';

const CookieConsent = () => {
    const [accepted, setAccepted] = useState(() => localStorage.getItem('apex_cookie_consent') === 'true');
    if (accepted) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-orange-500 p-4 z-50 flex flex-wrap justify-between items-center gap-4">
            <span className="text-sm">We use local storage to remember your work. No tracking cookies. <button className="text-orange-400 underline" onClick={() => { localStorage.setItem('apex_cookie_consent','true'); setAccepted(true); }}>Accept</button></span>
        </div>
    );
};

export default CookieConsent;
