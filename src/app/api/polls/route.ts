import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handle the POST request to create a poll
export async function POST(request: Request) {
    const { question, description, options } = await request.json();

    // Basic input validation
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return NextResponse.json(
            { error: 'Question is required and must be a non-empty string' },
            { status: 400 }
        );
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
        return NextResponse.json(
            { error: 'At least two options are required' },
            { status: 400 }
        );
    }

    // Validate option strings
    for (const option of options) {
        if (typeof option !== 'string' || option.trim().length === 0) {
            return NextResponse.json(
                { error: 'Each option must be a non-empty string' },
                { status: 400 }
            );
        }
    }

    // Create the poll
    try {
        const poll = await prisma.poll.create({
            data: {
                title: question,
                description: description || "No description",
                options: {
                    create: options.map((option: string) => ({ text: option })),
                },
            },
        });

        return NextResponse.json(poll, { status: 201 });
    } catch (error) {
        console.error('Error creating poll:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating the poll' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');


    if (!id) {
        return NextResponse.json(
            { error: 'Poll ID is required' },
            { status: 400 }
        );
    }

    try {
        const poll = await prisma.poll.findUnique({
            where: { id },
            include: { options: true, votes: true },
        });

        if (!poll) {
            return NextResponse.json(
                { error: 'Poll not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(poll, { status: 200 });
    } catch (error) {
        console.error('Error fetching poll:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching the poll' },
            { status: 500 }
        );
    }
}

// Handle the PUT request to vote on a poll
export async function PUT(request: Request) {
    const { pollId, optionId } = await request.json();

    // get ip
    const voterId = getRealIp(request);

    // Validate input
    if (!pollId || typeof pollId !== 'string') {
        return NextResponse.json(
            { error: 'Poll ID is required and must be a string' },
            { status: 400 }
        );
    }

    if (!voterId || typeof voterId !== 'string') {
        return NextResponse.json(
            { error: 'Voter ID is required and must be a string' },
            { status: 400 }
        );
    }

    if (!optionId || typeof optionId !== 'string') {
        return NextResponse.json(
            { error: 'Option ID is required and must be a string' },
            { status: 400 }
        );
    }

    try {
        // Check if the poll exists
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: true },
        });

        if (!poll) {
            return NextResponse.json(
                { error: 'Poll not found' },
                { status: 404 }
            );
        }

        // Check if the option exists in the poll
        const option = poll.options.find((opt: any) => opt.id === optionId);
        if (!option) {
            return NextResponse.json(
                { error: 'Invalid option ID' },
                { status: 400 }
            );
        }

        // Check if the voter has already voted for this poll
        const existingVote = await prisma.vote.findUnique({
            where: {
                voterId_pollId: {
                    voterId,
                    pollId,
                },
            },
        });

        if (existingVote) {
            return NextResponse.json(
                { error: 'You have already voted in this poll' },
                { status: 421 }
            );
        }

        // Record the vote
        const vote = await prisma.vote.create({
            data: {
                voterId,
                pollId,
                optionId,
            },
        });

        return NextResponse.json(vote, { status: 200 });
    } catch (error) {
        console.error('Error processing vote:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the vote' },
            { status: 500 }
        );
    }
}


function getRealIp(request: Request): string {
    const headers = request.headers;
    // Cloudflare sets the real IP in the 'CF-Connecting-IP' header
    const realIp = headers.get('CF-Connecting-IP');
    
    if (realIp) {
        return realIp;
    }

    // Fallback if CF header is missing (for non-Cloudflare requests)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]; // Handle forwarded IP
    return ip || 'Unknown IP'; // Return 'Unknown IP' if no IP is found
}