import { NextResponse } from 'next/server';
import { processSmsReply } from '@/lib/agents/setter';

export async function GET(req) {
    try {
        const response = await processSmsReply('+15551234567', 'Hey there, how does this work?', 'https://moxie.com/book/demo');
        return NextResponse.json({ success: true, response });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
