import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
    // respond with code 200 and JSON body nextjs app router style
    return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'Content-Type': 'application/json' },
    });
    
}