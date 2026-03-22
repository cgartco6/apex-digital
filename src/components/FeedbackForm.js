import React, { useState } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';

const FeedbackForm = ({ role }) => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!feedback.trim()) return;
        const logs = loadFromLocal(role, 'feedback_logs', []);
        logs.push({ feedback, date: new Date().toISOString() });
        saveToLocal(role, 'feedback_logs', logs);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFeedback('');
    };

    return (
        <div className="glass-card p-4 rounded-2xl mt-6">
            <h4 className="font-bold flex items-center gap-2"><i className="fas fa-comment-dots text-orange-400"></i> Feedback</h4>
            <textarea className="w-full bg-gray-800 rounded-lg p-2 mt-2 text-sm" rows="2" placeholder="Suggestions, bugs, or ideas..." value={feedback} onChange={e => setFeedback(e.target.value)}></textarea>
            <button onClick={handleSubmit} className="mt-2 bg-orange-600 px-4 py-1 rounded-lg text-sm">Send Feedback</button>
            {submitted && <p className="text-green-400 text-xs mt-1">Thanks! Stored locally.</p>}
        </div>
    );
};

export default FeedbackForm;
