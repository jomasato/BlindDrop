"use client";
import { useState, useCallback, useRef } from 'react';
import { BrowserProvider } from 'ethers';
import { FhenixClient, getPermit } from 'fhenixjs';

// Wraps fhenixjs to provide FHE encryption and permit management.
// Must be called after MetaMask is connected.

export function useFhenix() {
    const clientRef = useRef<FhenixClient | null>(null);
    const [ready, setReady] = useState(false);

    const init = useCallback(async () => {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        clientRef.current = new FhenixClient({ provider });
        setReady(true);
    }, []);

    // Encrypts a uint64 limit order value for use in attemptPurchase
    const encryptLimitOrder = useCallback(async (value: bigint) => {
        if (!clientRef.current) throw new Error("FhenixClient not initialised — call init() first");
        return clientRef.current.encrypt_uint64(value);
    }, []);

    // Generates a permit for getEncryptedBalance
    const getBalancePermit = useCallback(async (contractAddress: string) => {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        return getPermit(contractAddress, provider);
    }, []);

    return { ready, init, encryptLimitOrder, getBalancePermit };
}
