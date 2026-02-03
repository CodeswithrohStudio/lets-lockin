
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { REGISTRY_ADDRESS, REGISTRY_ABI, RPC_URL } from '../../lib/constants';

export const dynamic = 'force-dynamic'; // Ensure no caching for live data

export async function GET() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);

        const nextId = await registry.nextChallengeId();
        const totalChallenges = Number(nextId);

        const challenges = [];

        for (let i = 0; i < totalChallenges; i++) {
            const c = await registry.challenges(i);

            // c structure: [id, metadataURI, rewardAmount, minStake, isActive]
            if (!c.isActive) continue; // Skip inactive

            let metadata = { title: `Challenge #${i}`, description: 'No metadata' };
            try {
                // If it's a simple JSON string (as seeded), parse it.
                // If it's a URL, we would fetch it. 
                // Our seed script used raw JSON string.
                metadata = JSON.parse(c.metadataURI);
            } catch (e) {
                console.error("Failed to parse metadata", c.metadataURI);
            }

            challenges.push({
                id: c.id.toString(),
                title: metadata.title,
                description: metadata.description,
                rewardTokenAmount: c.rewardAmount.toString(),
                durationDays: 30, // Mocked for now as contract doesn't store duration explicitly in struct (MVP trade-off)
                participantsCount: 0, // Would need to query event logs to get real count
                minStake: ethers.formatUnits(c.minStake, 6), // USDC 6 decimals
                requiredSubmissions: 30
            });
        }

        return NextResponse.json(challenges, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error("Backend Error:", error);
        return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}
