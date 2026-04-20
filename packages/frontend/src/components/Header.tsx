"use client";
import React, { useState, useEffect, useCallback } from 'react';

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            on: (event: string, handler: (...args: unknown[]) => void) => void;
            removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
        };
    }
}

export function Header() {
    const [account, setAccount] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    const handleAccountsChanged = useCallback((accounts: unknown) => {
        const list = accounts as string[];
        setAccount(list.length > 0 ? list[0] : null);
    }, []);

    useEffect(() => {
        if (!window.ethereum) return;
        window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
            const list = accounts as string[];
            if (list.length > 0) setAccount(list[0]);
        });
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [handleAccountsChanged]);

    const connect = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed.');
            return;
        }
        setConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
            setAccount(accounts[0]);
        } catch {
            // user rejected
        } finally {
            setConnecting(false);
        }
    };

    const disconnect = () => setAccount(null);

    const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50 text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center font-bold text-black">B</div>
                    <span className="text-xl font-extrabold tracking-widest uppercase">BlindDrop</span>
                </div>

                <div>
                    {account ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-green-400 font-mono">Connected: {short(account)}</span>
                            <button
                                onClick={disconnect}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connect}
                            disabled={connecting}
                            className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
                        >
                            {connecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
