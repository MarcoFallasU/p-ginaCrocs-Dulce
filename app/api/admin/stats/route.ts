import { NextResponse } from "next/server";
import { repo } from "@/lib/db";
import { EVENT_NAMES, computeStats } from "@/lib/stats";

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const event = p.get("event") ?? "quiero";
  if (!(event in EVENT_NAMES)) return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  const weeks = [1, 4, 12].includes(Number(p.get("weeks"))) ? Number(p.get("weeks")) : 4;

  const [draft, published, events] = await Promise.all([repo.getDraft(), repo.getPublished(), repo.listEvents(Date.now() - 12 * 7 * 24 * 3600 * 1000)]);
  const result = computeStats(events, draft ?? published, {
    event,
    cat: p.get("cat") ?? "todas",
    group: p.get("group") ?? undefined,
    weeks,
    product: p.get("product") ?? undefined,
  });
  return NextResponse.json(result);
}
