import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // next-auth 설정 가져오기

export async function POST(req) {
    const session = await getServerSession(authOptions); // 올바르게 세션 가져오기

    if(!session) {
        return new Response(
            JSON.stringify({ redirect: '' }),
            { status: 401 }
        );
    } else {
        return new Response(
            JSON.stringify({ redirect: `/my-page/${session.user.id}` }),
            { status: 200 }
        );
    }
    
}
