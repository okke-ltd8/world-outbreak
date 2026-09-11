import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/rules — regras públicas ativas, organizadas por categoria e ordem. */
export async function GET() {
  const rules = await prisma.rule.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(rules);
}
