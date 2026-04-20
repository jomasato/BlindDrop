"use client";
import { useState, useCallback, useRef } from 'react';
import { BrowserProvider } from 'ethers';

// fhenixjs bundles a WASM (tfhe-rs) binary.
// Turbopack cannot handle WASM modules and will crash even on dynamic import().
// The `new Function` trick creates an import call at runtime that no bundler can
// statically analyse, so fhenixjs never enters the build graph.

type FhenixClientType = {
    encrypt_uint64: (value: bigint) => Promise<{ data: Uint8Array; securityZone: number }>;
};
type FhenixModule = {
    FhenixClient: new (opts: { provider: unknown }) => FhenixClientType;
    getPermit: (contractAddress: string, provider: unknown) => Promise<unknown>;
};

// eslint-disable-next-line no-new-func
const runtimeImport = new Function('m', 'return import(m)') as (m: string) => Promise<FhenixModule>;

export function useFhenix() {
    const clientRef = useRef<FhenixClientType | null>(null);
    const [ready, setReady] = useState(false);

    const init = useCallback(async () => {
        if (clientRef.current) return;
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        const { FhenixClient } = await runtimeImport('fhenixjs');
        clientRef.current = new FhenixClient({ provider });
        setReady(true);
    }, []);

    const encryptLimitOrder = useCallback(async (value: bigint) => {
        if (!clientRef.current) await init();
        return clientRef.current!.encrypt_uint64(value);
    }, [init]);

    const getBalancePermit = useCallback(async (contractAddress: string) => {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        const { getPermit } = await runtimeImport('fhenixjs');
        return getPermit(contractAddress, provider);
    }, []);

    return { ready, init, encryptLimitOrder, getBalancePermit };
}
