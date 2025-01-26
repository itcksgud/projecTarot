import { getServerSession } from "@/lib/session";


export async function POST(req) {
    const {spread_type} = await req.json();
    const session = await getServerSession(req); // 서버에서 세션 가져오기
    if (spread_type==='a-or-b')
        {
            return new Response(
                JSON.stringify({ redirect: '/card-select/a-or-b' }),
                { status: 200 }
                );
        }
        else if (spread_type==='celtic-cross')
        {
            return new Response(
                JSON.stringify({ redirect: '/card-select/celtic-cross' }),
                { status: 200 }
                );
        }
    
  }