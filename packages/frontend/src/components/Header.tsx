"use client";
import React, { useState } from 'react';

export function Header() {
    const [connected, setConnected] = useState(false);

    return (
        <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50 text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center font-bold text-black">B</div>
                    <span className="text-xl font-extrabold tracking-widest uppercase">BlindDrop</span>
                </div>

                <div>
                    {connected ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-green-400 font-mono">Connected: 0x1A2...9B3c</span>
                            <button
                                onClick={() => setConnected(false)}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConnected(true)}
                            className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                            CONNECT WALLET
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
