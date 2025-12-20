import { NextResponse } from "next/server";

export function GET(req) {
  const forwarded = req.headers.get("x-forwarded-for");

  // Locally, we can use a placeholder IP
    const ip = "192.168.10.1";
  // Get the client's IP address In Production
  //   const ip = forwarded
//     ? forwarded.split(",")[0].trim()
//     : req.ip ?? "Unknown";

  return NextResponse.json({ ip });
}
