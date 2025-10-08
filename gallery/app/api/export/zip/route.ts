import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const archivePath = path.resolve(process.cwd(), "dist", "app.zip");
  try {
    const fileStats = await stat(archivePath);
    const stream = createReadStream(archivePath);
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(fileStats.size),
        "Content-Disposition": 'attachment; filename="exported-app.zip"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Archive not found" }, { status: 404 });
  }
}
