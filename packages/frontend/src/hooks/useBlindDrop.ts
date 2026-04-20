"use client";
import { useState, useCallback } from 'react';
import { BrowserProvider, Contract, parseEther, id as ethersId } from 'ethers';

const BLIND_DROP_ABI = [
    "function deposit() payable",
    "function attemptPurchase(bytes32 itemId, tuple(bytes data) encryptedLimitOrder) payable",
    "function decayPrice(bytes32 itemId)",
    "function requestPriceReveal(bytes32 itemId)",
    "function getEncryptedBalance(tuple(bytes32 publicKey, bytes signature) permission) view returns (bytes)",
    "function initializeItem(bytes32 itemId, uint32 initialStock, uint64 initialPrice)",
    "function publicStalePrice(bytes32 itemId) view returns (uint64)",
    "function lastDecayTimes(bytes32 itemId) view returns (uint256)",
    "function SPAM_WALL_FEE() view returns (uint256)",
];

// Set this to your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export function itemIdFromString(name: string): string {
    return ethersId(name);
}

export function useBlindDrop() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getContract = useCallback(async (readOnly = false) => {
        if (!window.ethereum) throw new Error("MetaMask not found");
        const provider = new BrowserProvider(window.ethereum);
        if (readOnly) return new Contract(CONTRACT_ADDRESS, BLIND_DROP_ABI, provider);
        const signer = await provider.getSigner();
        return new Contract(CONTRACT_ADDRESS, BLIND_DROP_ABI, signer);
    }, []);

    const deposit = useCallback(async (amountEth: string) => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const tx = await contract.deposit({ value: parseEther(amountEth) });
            await tx.wait();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const attemptPurchase = useCallback(async (
        itemId: string,
        encryptedLimitOrderHex: string,
        spamFeeEth: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            // encryptedLimitOrderHex is the FHE-encrypted limit price bytes from fhenix.js
            const tx = await contract.attemptPurchase(
                itemId,
                { data: encryptedLimitOrderHex },
                { value: parseEther(spamFeeEth) }
            );
            await tx.wait();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const decayPrice = useCallback(async (itemId: string) => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const tx = await contract.decayPrice(itemId);
            await tx.wait();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const requestPriceReveal = useCallback(async (itemId: string) => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            const tx = await contract.requestPriceReveal(itemId);
            await tx.wait();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getContract]);

    const getStalePrice = useCallback(async (itemId: string): Promise<bigint> => {
        const contract = await getContract(true);
        return contract.publicStalePrice(itemId) as Promise<bigint>;
    }, [getContract]);

    const getSpamFee = useCallback(async (): Promise<bigint> => {
        const contract = await getContract(true);
        return contract.SPAM_WALL_FEE() as Promise<bigint>;
    }, [getContract]);

    return {
        loading,
        error,
        deposit,
        attemptPurchase,
        decayPrice,
        requestPriceReveal,
        getStalePrice,
        getSpamFee,
    };
}
