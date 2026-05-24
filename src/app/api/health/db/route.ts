import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      message: "MongoDB connection is healthy.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown MongoDB connection error.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    );
  }
}
