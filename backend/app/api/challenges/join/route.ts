import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { challengeId, userAddress } = body;

        if (!challengeId || !userAddress) {
            return NextResponse.json({ error: 'Missing challengeId or userAddress' }, { status: 400 });
        }

        // Here we would sync with DB or verify on-chain event
        // For MVP Mock:
        console.log(`User ${userAddress} joined challenge ${challengeId} with stake.`);
        console.log(`Condition: If failed, stake slashed to Treasury (USDC).`);

        return NextResponse.json({ success: true, message: 'Joined challenge successfully' }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
