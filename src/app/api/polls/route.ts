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
