
export async function GET() {
    // respond with code 200 and JSON body nextjs app router style
    return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'Content-Type': 'application/json' },
    });
    
}