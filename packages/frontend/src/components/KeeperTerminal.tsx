"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Database, Terminal, Zap, Clock, Cpu, Lock, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export function KeeperTerminal() {
    const [blockHeight, setBlockHeight] = useState(14820934);
    const [spamPool, setSpamPool] = useState(1.4500);
    const [lastDecay, setLastDecay] = useState(145);
    const [decayReward, setDecayReward] = useState(0.0035);
    const gasCost = 0.0050;
    const [revealCooldown, setRevealCooldown] = useState(12);
    const [logs, setLogs] = useState<string[]>([
        "[0xa1b2c3d4] INITIALIZED FheOS KEEPER TERMINAL v1.0.0",
        "[SYSTEM] Connecting to Fhenix Helium Testnet... SUCCESS"
    ]);

    // Ciphertext mocks
    const cipherInventory = "0x7f8c92b45a...!e2@f8#c9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5";
    const cipherPrice = "0x8b4a2c1f9d...!g3@k1#m4n5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8";

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.6) setBlockHeight(prev => prev + 1);

            if (Math.random() > 0.8) {
                setSpamPool(prev => prev + 0.01);
                const hash = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
                const newLog = `[${hash}] attemptPurchase() - Input: Encrypted - Fee Paid: 0.01 ETH`;
                setLogs(prev => [newLog, ...prev].slice(0, 30));
            }

            setLastDecay(prev => prev + 1);
            setDecayReward(prev => prev + 0.0001);
            setRevealCooldown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const roiPositive = decayReward > gasCost;

    const handleDecay = () => {
        if (!roiPositive) return;
        setLastDecay(0);
        setDecayReward(0);
        const hash = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setLogs(prev => [`[${hash}] decayPrice() EXECUTE - Arbitrage Captured`, ...prev].slice(0, 30));
    };

    const handleReveal = () => {
        if (revealCooldown > 0) return;
        setRevealCooldown(300);
        const hash = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setLogs(prev => [`[${hash}] requestPriceReveal() EXECUTE - Callback Initiated`, ...prev].slice(0, 30));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-emerald-500 font-mono p-6 selection:bg-emerald-900 selection:text-emerald-100">
            <div className="max-w-7xl mx-auto space-y-6">

                <header className="flex justify-between items-end border-b-2 border-emerald-900 pb-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-widest flex items-center gap-3">
                            <Terminal className="w-8 h-8" />
                            BLINDDROP // KEEPER_TERMINAL
                        </h1>
                        <p className="text-emerald-700 mt-2 text-sm tracking-widest uppercase">Cybernetic Command Center</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-cyan-500 mb-1 justify-end">
                            <Activity className="w-4 h-4 animate-pulse" />
                            <span className="text-sm uppercase tracking-widest">Fhenix Testnet (Helium)</span>
                        </div>
                        <p className="text-sm">BLOCK: <span className="text-white font-bold">{blockHeight}</span></p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. Global Status & Pool */}
                    <div className="col-span-1 border border-emerald-900 bg-slate-900/50 p-6 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.05)] flex flex-col justify-between">
                        <div>
                            <h2 className="text-xs text-emerald-700 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest">
                                <Database className="w-4 h-4" /> Network Health
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-black/40 p-3 rounded border border-emerald-900/50">
                                    <p className="text-xs text-emerald-600 mb-1">FHE RPC Latency</p>
                                    <p className="text-cyan-400 font-bold">42ms <span className="text-emerald-800">[Optimal]</span></p>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-emerald-900/50">
                                    <p className="text-xs text-emerald-600 mb-1">Oracle Sync Status</p>
                                    <p className="text-cyan-400 font-bold">SYNCED</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-xs text-emerald-600 mb-1 uppercase tracking-widest">Spam Wall Rewards Pool</p>
                            <p className="text-4xl font-black text-amber-500 flex items-baseline gap-2">
                                {spamPool.toFixed(4)} <span className="text-lg text-amber-500/50">ETH</span>
                            </p>
                        </div>
                    </div>

                    {/* 3. FHE Inventory Radar */}
                    <div className="col-span-1 md:col-span-2 border border-emerald-900 bg-slate-900/50 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_100%)]" />
                        <h2 className="text-xs text-emerald-700 font-bold mb-6 flex items-center gap-2 uppercase tracking-widest relative z-10">
                            <Shield className="w-4 h-4" /> FHE State Radar
                        </h2>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-emerald-500">encryptedInventory</span>
                                    <Lock className="w-4 h-4 text-emerald-700" />
                                </div>
                                <div className="bg-black border border-emerald-900/50 p-3 rounded font-mono text-xs text-emerald-800 break-all h-16 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent w-full h-full animate-pulse" style={{ animationDuration: '3s' }} />
                                    {cipherInventory}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-emerald-500">encryptedCurrentPrice</span>
                                    <Lock className="w-4 h-4 text-emerald-700" />
                                </div>
                                <div className="bg-black border border-emerald-900/50 p-3 rounded font-mono text-xs text-emerald-800 break-all h-16 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent w-full h-full animate-pulse" style={{ animationDuration: '2.5s' }} />
                                    {cipherPrice}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-emerald-950/30 p-4 border border-emerald-900 rounded">
                                <Cpu className="w-6 h-6 text-cyan-500" />
                                <div>
                                    <p className="text-xs text-emerald-600">Public Stale Price (Decrypted)</p>
                                    <p className="text-white font-bold">0.12 ETH</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-xs text-amber-500/80">Drift Estimation</p>
                                    <p className="text-amber-500 font-bold">+Unknown%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 2. Keeper Operations */}
                    <div className="border border-emerald-900 bg-slate-900/50 p-6 rounded-lg">
                        <h2 className="text-xs text-emerald-700 font-bold mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <Zap className="w-4 h-4" /> Keeper Operations
                        </h2>

                        <div className="space-y-6">
                            {/* Decay Action */}
                            <div className="bg-black/50 border border-emerald-900/50 p-4 rounded-lg">
                                <h3 className="text-sm text-white font-bold flex justify-between">
                                    decayPrice()
                                    <span className="text-xs font-normal text-emerald-600 font-mono">{lastDecay}s ago</span>
                                </h3>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="text-emerald-700 mb-1">Est. Gas Cost</p>
                                        <p className="font-bold text-white">{gasCost.toFixed(4)} ETH</p>
                                    </div>
                                    <div>
                                        <p className="text-emerald-700 mb-1">Claimable Reward</p>
                                        <p className={`font-bold ${roiPositive ? 'text-green-400' : 'text-amber-500'}`}>
                                            {decayReward.toFixed(4)} ETH
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDecay}
                                    disabled={!roiPositive}
                                    className={`w-full mt-4 py-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all ${roiPositive ? 'bg-emerald-600 text-black shadow-[0_0_15px_rgba(5,150,105,0.4)] hover:bg-emerald-500 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                                >
                                    {roiPositive ? 'EXECUTE ARBITRAGE' : 'ROI NEGATIVE'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Reveal Action */}
                            <div className="bg-black/50 border border-emerald-900/50 p-4 rounded-lg">
                                <h3 className="text-sm text-white font-bold flex justify-between">
                                    requestPriceReveal()
                                    <span className="text-xs font-normal text-emerald-600 font-mono flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {revealCooldown > 0 ? `${revealCooldown}s` : 'READY'}
                                    </span>
                                </h3>

                                <button
                                    onClick={handleReveal}
                                    disabled={revealCooldown > 0}
                                    className={`w-full mt-4 py-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all ${revealCooldown <= 0 ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:bg-cyan-500 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                                >
                                    TRIGGER DELAYED ORACLE
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4. Mempool Monitor */}
                    <div className="border border-emerald-900 bg-slate-900/50 p-6 rounded-lg flex flex-col">
                        <h2 className="text-xs text-emerald-700 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <ShieldAlert className="w-4 h-4" /> Mempool Monitor (Anti-Bot)
                        </h2>

                        <div className="flex-grow bg-black border border-emerald-900/50 rounded p-4 font-mono text-[10px] sm:text-xs overflow-hidden relative">
                            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black to-transparent z-10" />
                            <div className="space-y-1">
                                {logs.map((log, i) => (
                                    <p
                                        key={i}
                                        className={`${i === 0 ? 'text-white' : i < 3 ? 'text-emerald-400' : 'text-emerald-800'} transition-colors duration-1000`}
                                        style={{ opacity: Math.max(0.2, 1 - (i * 0.05)) }}
                                    >
                                        {log}
                                    </p>
                                ))}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent z-10" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
