import { NextResponse } from "next/server";
import { repo } from "@/lib/db";

export async function POST() {
  await repo.discardDraft();
  return NextResponse.json({ ok: true });
}
