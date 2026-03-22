import React, { useState, useEffect } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';
import { BANK_DETAILS } from '../utils/constants';

const PaymentSystem = ({ role, onPaymentVerified }) => {
    const [paymentRequests, setPaymentRequests] = useState(loadFromLocal(role, 'payment_requests', []));
    const [newRequestAmount, setNewRequestAmount] = useState('');
    const [newRequestReason, setNewRequestReason] = useState('');
    const [isPro, setIsPro] = useState(() => loadFromLocal(role, 'pro_status', false));

    const generateReference = () => `${BANK_DETAILS.referencePrefix}-${Math.floor(Math.random()*100000)}`;

    const createPaymentRequest = () => {
        if (!newRequestAmount || parseFloat(newRequestAmount) <= 0) {
            alert("Please enter a valid amount (ZAR)");
            return;
        }
        const ref = generateReference();
        const newRequest = {
            id: Date.now(),
            amount: parseFloat(newRequestAmount),
            reason: newRequestReason || "Apex Pro Upgrade",
            reference: ref,
            status: "pending",
            date: new Date().toISOString(),
            proofDataUrl: null
        };
        const updated = [newRequest, ...paymentRequests];
        setPaymentRequests(updated);
        saveToLocal(role, 'payment_requests', updated);
        setNewRequestAmount('');
        setNewRequestReason('');
        alert(`Payment request created! Reference: ${ref}\nPlease make EFT to:\n${BANK_DETAILS.bank}\nAccount: ${BANK_DETAILS.accountName}\nNumber: ${BANK_DETAILS.accountNumber}\nBranch: ${BANK_DETAILS.branchCode}\nReference: ${ref}`);
    };

    const handleFileUpload = (requestId, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const updatedRequests = paymentRequests.map(req => 
                req.id === requestId ? { ...req, proofDataUrl: dataUrl } : req
            );
            setPaymentRequests(updatedRequests);
            saveToLocal(role, 'payment_requests', updatedRequests);
            alert("Proof of payment uploaded. Admin will verify (simulated).");
        };
        reader.readAsDataURL(file);
    };

    const verifyPayment = (requestId) => {
        const updated = paymentRequests.map(req => 
            req.id === requestId ? { ...req, status: "verified" } : req
        );
        setPaymentRequests(updated);
        saveToLocal(role, 'payment_requests', updated);
        const hasVerified = updated.some(req => req.status === "verified");
        if (hasVerified) {
            setIsPro(true);
            saveToLocal(role, 'pro_status', true);
            if (onPaymentVerified) onPaymentVerified();
            alert("✅ Payment verified! Pro status unlocked.");
        } else {
            alert("Payment marked as verified.");
        }
    };

    const resetPro = () => {
        if (confirm("Reset Pro status? This will remove all payment verifications.")) {
            setIsPro(false);
            saveToLocal(role, 'pro_status', false);
            const updated = paymentRequests.map(req => ({ ...req, status: "pending" }));
            setPaymentRequests(updated);
            saveToLocal(role, 'payment_requests', updated);
            alert("Pro status removed.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl">
                <h3 className="text-xl font-bold flex items-center gap-2"><i className="fas fa-credit-card text-green-400"></i> Direct EFT (South Africa)</h3>
                <p className="text-sm text-gray-300 mt-1">No API, PayFast, PayPal, or Stripe – pure EFT simulation.</p>
                <div className="mt-4 bg-gray-800 p-3 rounded-lg text-sm">
                    <p><strong>Bank:</strong> {BANK_DETAILS.bank}</p>
                    <p><strong>Account Name:</strong> {BANK_DETAILS.accountName}</p>
                    <p><strong>Account Number:</strong> {BANK_DETAILS.accountNumber}</p>
                    <p><strong>Branch Code:</strong> {BANK_DETAILS.branchCode}</p>
                    <p><strong>Reference:</strong> Will be generated per request</p>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-bold">Amount (ZAR)</label>
                    <input type="number" value={newRequestAmount} onChange={e => setNewRequestAmount(e.target.value)} className="bg-gray-700 p-2 rounded w-full" placeholder="e.g., 299" />
                    <label className="block text-sm font-bold mt-2">Reason (optional)</label>
                    <input type="text" value={newRequestReason} onChange={e => setNewRequestReason(e.target.value)} className="bg-gray-700 p-2 rounded w-full" placeholder="e.g., Pro Upgrade" />
                    <button onClick={createPaymentRequest} className="mt-3 bg-green-600 w-full py-2 rounded-lg font-bold"><i className="fas fa-plus-circle"></i> Create Payment Request</button>
                </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg">Payment History</h4>
                    {isPro && <span className="pro-badge px-3 py-1 rounded-full text-xs font-bold text-white"><i className="fas fa-crown"></i> PRO ACTIVE</span>}
                    <button onClick={resetPro} className="text-red-400 text-xs underline">Reset Pro</button>
                </div>
                {paymentRequests.length === 0 && <p className="text-gray-400 text-center py-4">No payment requests yet.</p>}
                <div className="space-y-4 mt-2">
                    {paymentRequests.map(req => (
                        <div key={req.id} className="bg-gray-800 p-3 rounded-xl">
                            <div className="flex justify-between text-sm">
                                <span><strong>Ref:</strong> {req.reference}</span>
                                <span className={req.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}>{req.status.toUpperCase()}</span>
                            </div>
                            <div className="text-sm mt-1"><strong>Amount:</strong> ZAR {req.amount}</div>
                            <div className="text-xs text-gray-400">{req.reason} · {new Date(req.date).toLocaleString()}</div>
                            {req.status === 'pending' && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <label className="bg-blue-600 px-3 py-1 rounded text-xs cursor-pointer">
                                        <i className="fas fa-upload"></i> Upload Proof
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload(req.id, e.target.files[0])} />
                                    </label>
                                    <button onClick={() => verifyPayment(req.id)} className="bg-orange-600 px-3 py-1 rounded text-xs">Mark as Verified (Admin Sim)</button>
                                </div>
                            )}
                            {req.proofDataUrl && (
                                <div className="mt-2">
                                    <a href={req.proofDataUrl} target="_blank" className="text-xs text-blue-400 underline">View uploaded proof</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentSystem;
