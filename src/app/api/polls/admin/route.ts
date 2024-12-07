import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

const SECRET = process.env.SECRET;

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');  
  
  if (secret == undefined || secret !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const polls = await prisma.poll.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: { options: true, votes: true },
  });

  
  return NextResponse.json({ polls: polls }, { status: 200 });
}