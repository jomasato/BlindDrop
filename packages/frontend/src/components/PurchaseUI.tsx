"use client";
import React, { useState } from 'react';

export function PurchaseUI() {
    const [buffer, setBuffer] = useState<number>(15);
    const [showModal, setShowModal] = useState(false);
    const stalePrice = 1000;
    const lastReveal = "2 mins ago";

    const handleEncrypt = async () => {
        // Encrypt limit price via SDK
        setShowModal(true);
    };

    const executePurchase = () => {
        // Payload executes
        setShowModal(false);
        alert("Encrypted purchase transaction submitted!");
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-gray-900 rounded-xl shadow-md space-y-4 text-white">
            <h2 className="text-xl font-bold">BlindDrop Presale</h2>

            {/* Epic 3.3: Stale Price Display Logic */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Estimated Current Price</p>
                <p className="text-2xl font-mono">{stalePrice} wei</p>
                <p className="text-xs text-gray-500">Last updated: {lastReveal}</p>
            </div>

            {/* Epic 3.1: Encrypted Limit Order UI */}
            <div>
                <label className="block text-sm mb-2">Select Safe Buffer</label>
                <div className="flex gap-2">
                    <button
                        className={`flex-1 py-2 px-4 rounded ${buffer === 5 ? 'bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => setBuffer(5)}
                    >
                        Aggressive (+5%)
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded ${buffer === 15 ? 'bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => setBuffer(15)}
                    >
                        Balanced (+15%)
                    </button>
                </div>
            </div>

            <button
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition-all"
                onClick={handleEncrypt}
            >
                Encrypt & Submit Order
            </button>

            {/* Epic 3.2: Blind Signing Onboarding UX */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full space-y-4">
                        <h3 className="text-lg font-bold text-yellow-500">⚠️ Blind Signing Required</h3>
                        <p className="text-sm text-gray-300">
                            To hide your limit order from front-running bots, your payload is
                            <strong> Fully Homomorphically Encrypted</strong>.
                        </p>
                        <p className="text-sm text-gray-300">
                            Your wallet will ask you to sign an unreadable string of data. This is expected and safe!
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button
                                className="flex-1 bg-gray-600 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-yellow-600 py-2 rounded font-bold"
                                onClick={executePurchase}
                            >
                                I Understand, Sign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
