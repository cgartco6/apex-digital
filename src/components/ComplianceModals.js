import React from 'react';

const ComplianceModals = ({ showPrivacy, setShowPrivacy, showTerms, setShowTerms }) => (
    <>
        {showPrivacy && (
            <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay" onClick={() => setShowPrivacy(false)}>
                <div className="bg-gray-900 p-6 rounded-2xl max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-orange-400">Privacy Policy (POPIA & GDPR)</h2>
                    <p className="mt-4 text-sm">Apex Digital respects your privacy. We collect only data you provide (designs, campaigns) stored locally on your device. No personal information is transmitted to external servers unless explicitly exported. For South African users, this complies with the Protection of Personal Information Act (POPIA). You may request deletion of any stored data via the "Reset All Data" button.</p>
                    <button className="mt-4 bg-orange-600 px-4 py-2 rounded-lg" onClick={() => setShowPrivacy(false)}>Close</button>
                </div>
            </div>
        )}
        {showTerms && (
            <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay" onClick={() => setShowTerms(false)}>
                <div className="bg-gray-900 p-6 rounded-2xl max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-orange-400">Terms of Service</h2>
                    <p className="mt-4 text-sm">By using Apex Digital you agree that the tool is provided "as is" for lawful marketing, design, and branding purposes. You are solely responsible for the content you create. Aggressive marketing engine suggestions are simulated; real-world compliance with marketing laws (e.g., CAN-SPAM, CPA) is your responsibility. We reserve the right to update these terms.</p>
                    <button className="mt-4 bg-orange-600 px-4 py-2 rounded-lg" onClick={() => setShowTerms(false)}>Accept & Close</button>
                </div>
            </div>
        )}
    </>
);

export default ComplianceModals;
