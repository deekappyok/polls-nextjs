import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handle the POST request to create a poll
export async function POST(request: Request) {
    const { question, description, options } = await request.json();

    console.log(request);

    if (!question || !options || options.length < 2) {
        return NextResponse.json(
            { error: 'Invalid input' },
            { status: 400 }
        );
    }

    const poll = await prisma.poll.create({
        data: {
            title: question || "No question",
            description: description || "No description",
            options: {
                create: options.map((option: string) => ({ text: option })),
            }
        },
    });

    return NextResponse.json(poll, { status: 201 });
}