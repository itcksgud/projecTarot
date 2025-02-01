import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // next-auth 설정 가져오기

export async function POST(req) {
    const { spread_type } = await req.json();
    const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

    console.log(session);


    if (spread_type === 'a-or-b') {
        if(!session) {
            return new Response(
                JSON.stringify({ redirect: '/login/a-or-b' }),
                { status: 401 }
            );
        } else {
            return new Response(
                JSON.stringify({ redirect: '/card-select/a-or-b' }),
                { status: 200 }
            );
        }
        
    } else if (spread_type === 'celtic-cross') {
        if(!session) {
            return new Response(
                JSON.stringify({ redirect: '/login/celtic-cross' }),
                { status: 401 }
            );
        } else {
            return new Response(
                JSON.stringify({ redirect: '/card-select/celtic-cross' }),
                { status: 200 }
            );
        }

    }
    
}
