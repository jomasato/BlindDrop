"use client";
import React, { useState } from 'react';

// --- MOCK FIREBASE DATA ---
const MOCK_ITEMS = [
    {
        id: "0x0000000000000000000000000000000000000000000000000000000000000001",
        name: "Shadow Sniper Pass",
        description: "Exclusive early access to the fog. Bypass the public queues.",
        imageUrl: "https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=400&h=400",
        category: "Pass",
        status: "Active",
        stalePrice: 0.05,
        lastReveal: "2 mins ago"
    },
    {
        id: "0x0000000000000000000000000000000000000000000000000000000000000002",
        name: "Obsidian Artifact",
        description: "A mysterious on-chain asset shrouded in encrypted state.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=400",
        category: "NFT",
        status: "Active",
        stalePrice: 0.12,
        lastReveal: "15 mins ago"
    }
];

export function PurchaseUI() {
    const [view, setView] = useState<'dashboard' | 'detail' | 'feedback'>('dashboard');
    const [selectedItem, setSelectedItem] = useState<typeof MOCK_ITEMS[0] | null>(null);

    const [buffer] = useState<number>(15);
    const [showPreMintModal, setShowPreMintModal] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    const [agreeToSign, setAgreeToSign] = useState(false);

    // Mock User Balance
    const [encryptedBalance] = useState("0.25 ETH (Encrypted)");

    const handleSelectItem = (item: typeof MOCK_ITEMS[0]) => {
        setSelectedItem(item);
        setView('detail');
    };

    const initiatePurchase = () => {
        setShowPreMintModal(true);
    };

    const proceedToSigning = () => {
        setShowPreMintModal(false);
        setShowSignModal(true);
    };

    const confirmPurchase = () => {
        if (!agreeToSign) return;
        setShowSignModal(false);
        // Execute mock Tx
        console.log(`Executing attemptPurchase for itemId: ${selectedItem?.id} with buffer ${buffer}%`);
        setView('feedback');
    };

    // 1. Dashboard View
    if (view === 'dashboard') {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-8 text-gray-200">
                <header className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tighter text-white">Target Selection</h1>
                        <p className="text-sm text-gray-500 mt-1">Sniper in the Fog: Multi-Item Presale</p>
                    </div>
                    <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 shadow-inner">
                        <span className="text-xs text-gray-500 block uppercase tracking-wider">Vault Balance</span>
                        <span className="font-mono text-green-400">{encryptedBalance}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ITEMS.map((item) => (
                        <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors group">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <span className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur text-xs px-2 py-1 rounded text-white border border-gray-700">
                                    {item.status}
                                </span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">{item.category}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Delayed Reference Price</span>
                                        <span className="font-mono text-lg text-yellow-500 flex items-center gap-2">
                                            {item.stalePrice} ETH
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelectItem(item)}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Acquire Target
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 4. Post-Purchase Feedback View
    if (view === 'feedback') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="text-6xl mb-4">🌫️</div>
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Transaction Sent</h2>
                    <p className="text-gray-400 leading-relaxed font-mono">
                        📦 オーダーは暗号化されたまま処理されました。<br />
                        ボットには見えません。<br />
                        結果を確認するには、ヴォルト（残高）を更新してください。
                    </p>
                    <button
                        onClick={() => setView('dashboard')}
                        className="mt-8 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-mono tracking-widest text-sm transition-colors border border-gray-600"
                    >
                        ← RETURN TO RADAR
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedItem) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 text-gray-200">
            <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-widest transition-colors">
                ← Abort Mission
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visuals & Description */}
                <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden border border-gray-800 bg-black relative">
                        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay"></div>
                        <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full aspect-square object-cover opacity-80" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">{selectedItem.name}</h1>
                        <p className="text-gray-400 mt-2 leading-relaxed">{selectedItem.description}</p>
                    </div>
                </div>

                {/* Order Mechanics */}
                <div className="space-y-6 flex flex-col justify-center">

                    {/* User Vault Section */}
                    <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Encrypted Vault Balance</p>
                            <p className="font-mono text-xl text-green-400">{encryptedBalance}</p>
                        </div>
                        <button className="bg-gray-800 hover:bg-gray-700 text-xs px-4 py-2 rounded border border-gray-700 transition-colors font-bold uppercase tracking-wider">
                            Charge
                        </button>
                    </div>

                    {/* Stale Price Section */}
                    <div className="bg-black border border-yellow-900/30 p-5 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                        <p className="text-xs text-yellow-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="text-lg">⏲️</span> Delayed Reference Price
                        </p>
                        <div className="flex items-baseline gap-3">
                            {/* Added glitch visual styling placeholder via class */}
                            <span className="text-5xl font-mono font-extrabold text-yellow-500 opacity-90 tracking-tighter mix-blend-lighten drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                                {selectedItem.stalePrice} ETH
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-mono flex items-center gap-1">
                            <span>Last updated: {selectedItem.lastReveal}</span>
                        </p>
                    </div>

                    {/* Safe Buffer Form */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Select FHE Encrypted Limit Buffer</p>
                        <div className="grid grid-cols-1 gap-3">
                            <label className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center ${buffer === 5 ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 hover:border-gray-600 bg-gray-900'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${buffer === 5 ? 'border-blue-500' : 'border-gray-600'}`}>
                                        {buffer === 5 && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white tracking-widest text-lg">+5% Safe</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Lower chance, better price</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center ${buffer === 15 ? 'border-green-500 bg-green-900/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-gray-800 hover:border-gray-600 bg-gray-900'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${buffer === 15 ? 'border-green-500' : 'border-gray-600'}`}>
                                        {buffer === 15 && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white tracking-widest text-lg">+15% Balanced</p>
                                        <p className="text-xs text-green-400 mt-0.5 font-bold uppercase tracking-wider">🌟 Recommended</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center ${buffer === 30 ? 'border-red-500 bg-red-900/20' : 'border-gray-800 hover:border-gray-600 bg-gray-900'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${buffer === 30 ? 'border-red-500' : 'border-gray-600'}`}>
                                        {buffer === 30 && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white tracking-widest text-lg">+30% Sniper</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Highest chance of execution</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={initiatePurchase}
                        className="w-full bg-white text-black py-4 rounded-xl font-extrabold tracking-widest uppercase hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Encrypt & Submit Order
                    </button>
                </div>
            </div>

            {/* 3. Educational Modals */}

            {/* Pre-Mint Educational Modal */}
            {showPreMintModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                            <span className="text-3xl">🛡️</span>
                            <h3 className="text-xl font-extrabold text-white tracking-wider">Security Checkpoint</h3>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                            指値を暗号化してミドルマンやボットから守るため、購入トランザクションには事前のデポジットが必要です（内部ウォレット）。<br /><br />
                            あなたがこれから送信する実際の価格データは <span className="text-blue-400 font-bold">FHE (Fully Homomorphic Encryption)</span> によってノードからも読み取れない状態に変換されます。
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setShowPreMintModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors tracking-widest uppercase">
                                Cancel
                            </button>
                            <button onClick={proceedToSigning} className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-extrabold shadow-lg hover:bg-gray-200 transition-colors tracking-widest uppercase">
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blind Signing Onboarding Modal */}
            {showSignModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-blue-900/50 p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(37,99,235,0.15)] space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                            <span className="text-3xl text-blue-500">🔐</span>
                            <h3 className="text-xl font-extrabold text-white tracking-wider">Blind Signing</h3>
                        </div>

                        <div className="bg-black p-4 rounded-xl font-mono text-xs text-blue-500/50 break-all overflow-hidden h-28 relative border border-gray-800">
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent" />
                            <span className="text-blue-400">0x8a9c3d4e5f68a9c3d4e5f68a9c3d4e5f68a9c3d4e5f6...</span><br />
                            (Fully Homomorphically Encrypted Payload)
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed">
                            MetaMask等の署名画面には、人間には読めない巨大な暗号文字列が表示されます。<br /><br />
                            これは<strong>あなたの指値をMempoolのボットから完全に隠すため</strong>に行われており、プロトコルの正常な動作です。詐欺ではありませんので安心してください。
                        </p>

                        <label className="flex items-start gap-4 p-4 bg-gray-800/40 rounded-xl cursor-pointer hover:bg-gray-800/80 transition-colors border border-gray-800/50">
                            <input type="checkbox" checked={agreeToSign} onChange={(e) => setAgreeToSign(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer" />
                            <span className="text-sm text-gray-200 font-medium leading-snug">
                                理解しました。内容の読めない暗号化トランザクションに署名して、購入を実行します。
                            </span>
                        </label>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => { setShowSignModal(false); setAgreeToSign(false); }}
                                className="flex-[0.5] py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors tracking-widest uppercase"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmPurchase}
                                disabled={!agreeToSign}
                                className={`flex-1 py-3 rounded-xl text-sm font-extrabold tracking-widest uppercase transition-all ${agreeToSign ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                            >
                                Sign Tx
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
