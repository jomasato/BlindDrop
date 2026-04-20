"use client";
import { useState, useCallback, useRef } from 'react';
import { BrowserProvider } from 'ethers';

// fhenixjs is imported dynamically to prevent WASM from being bundled at SSR/build time.
// Turbopack and most SSR bundlers cannot resolve WASM modules statically.

type FhenixClientType = {
    encrypt_uint64: (value: bigint) => Promise<{ data: Uint8Array; securityZone: number }>;
};

export function useFhenix() {
    const clientRef = useRef<FhenixClientType | null>(null);
    const [ready, setReady] = useState(false);

    const init = useCallback(async () => {
        if (clientRef.current) return;
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        // Dynamic import keeps WASM out of the SSR bundle
        const { FhenixClient } = await import('fhenixjs');
        clientRef.current = new FhenixClient({ provider }) as FhenixClientType;
        setReady(true);
    }, []);

    const encryptLimitOrder = useCallback(async (value: bigint) => {
        if (!clientRef.current) await init();
        return clientRef.current!.encrypt_uint64(value);
    }, [init]);

    const getBalancePermit = useCallback(async (contractAddress: string) => {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        const { getPermit } = await import('fhenixjs');
        return getPermit(contractAddress, provider);
    }, []);

    return { ready, init, encryptLimitOrder, getBalancePermit };
}
