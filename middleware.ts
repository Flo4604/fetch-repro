import { type NextRequest, NextResponse } from "next/server";
import { HTTPClient } from "@/lib/sdk-http";

export const config = {
    matcher: ["/api/fail", "/api/success"],
};

export async function middleware(request: NextRequest) {
    const url = new URL("https://httpbin.org/post");
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true }),
    };

    const client = new HTTPClient();
    const req = client.createRequest(url, options);

    const shouldClone = request.nextUrl.pathname === "/api/fail";
    const requestToSend = shouldClone ? req.clone() : req;

    try {
        const response = await client.request(requestToSend);
        const data = await response.json();

        return NextResponse.json({
            success: true,
            data,
            mode: shouldClone ? "fail (cloned)" : "success (not cloned)",
        });
    } catch (err) {
        const error = err as Error & { code?: string; input?: string };
        return NextResponse.json({
            success: false,
            error: error.message,
            errorCode: error.code,
            errorInput: error.input,
            mode: shouldClone ? "fail (cloned)" : "success (not cloned)",
        });
    }
}
