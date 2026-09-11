import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";
import { RuleCard } from "@/components/RuleCard";
import type { Rule } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function RegrasPage() {
  const rules: Rule[] = await prisma.rule.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const categories: string[] = Array.from(new Set(rules.map((r) => r.category)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 lg:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">Antes de sobreviver</p>
      <h1 className="mt-2 font-display text-4xl text-white">Regras</h1>
      <p className="mt-3 text-outbreak-ash">
        O respeito às regras é o que mantém o World Outbreak jogável para todos.
        Violações são registradas e podem resultar em punição.
      </p>

      {categories.length === 0 ? (
        <p className="mt-10 text-outbreak-ash">Nenhuma regra cadastrada ainda.</p>
      ) : (
        <div className="mt-10 space-y-8">
          {categories.map((category) => (
            <Card key={category} className="p-6">
              <h2 className="font-display text-xl text-white">{category}</h2>
              <div className="mt-2">
                {rules
                  .filter((r) => r.category === category)
                  .map((rule) => (
                    <RuleCard key={rule.id} title={rule.title} content={rule.content} />
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
