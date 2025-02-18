import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // next-auth 설정 가져오기

export async function POST(req) {
    const { redirectUrl, loginUrl } = await req.json();
    const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

    if(!session) {
        return new Response(
            JSON.stringify({ redirect: loginUrl }),
            { status: 401 }
        );
    }

    if (redirectUrl === '/card-select/a-or-b') {
        return new Response(
            JSON.stringify({ redirect: redirectUrl }),
            { status: 200 }
        );  
    } 
    else if (redirectUrl === '/card-select/celtic-cross') {
        return new Response(
            JSON.stringify({ redirect: redirectUrl }),
            { status: 200 }
        );
    } else if (redirectUrl === '/my-page'){
        return new Response(
            JSON.stringify({ redirect: `${redirectUrl}`}),
            { status: 200 }
        );
    }
}
