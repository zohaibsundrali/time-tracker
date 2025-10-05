export async function POST(req) {
  try {
    const body = await req.json();
    const { code } = body;

    if (code === "123456") {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(
      JSON.stringify({ success: false, message: "Invalid or expired code" }),
      { status: 400 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
