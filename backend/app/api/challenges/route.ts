import { NextResponse } from 'next/server';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    rewardTokenAmount: string;
    durationDays: number;
    participantsCount: number;
    imageUrl?: string;
    requiredSubmissions: number;
    minStake: string;
}

const mockChallenges: Challenge[] = [
    {
        id: '1',
        title: '30 Days of Code',
        description: 'Commit code every day for 30 days. No excuses.',
        rewardTokenAmount: '100',
        durationDays: 30,
        participantsCount: 156,
        requiredSubmissions: 30,
        minStake: '50',
    },
    {
        id: '2',
        title: 'Morning Run Streak',
        description: 'Run 5km every morning before 8 AM.',
        rewardTokenAmount: '50',
        durationDays: 14,
        participantsCount: 89,
        requiredSubmissions: 14,
        minStake: '20',
    },
    {
        id: '3',
        title: 'Design Daily',
        description: 'Create one UI component every day.',
        rewardTokenAmount: '75',
        durationDays: 21,
        participantsCount: 42,
        requiredSubmissions: 21,
        minStake: '100',
    }
];

export async function GET() {
    return NextResponse.json(mockChallenges, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
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
