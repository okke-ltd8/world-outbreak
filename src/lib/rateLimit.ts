/**
 * Rate limiter simples em memória.
 *
 * ATENÇÃO (produção): isso funciona apenas para uma única instância do
 * processo Node. Se o site rodar em múltiplas instâncias/serverless,
 * substitua por um backend compartilhado (ex: Redis / Upstash) mantendo
 * a mesma assinatura de `checkRateLimit`.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key identificador único (ex: `verify:${ip}:${discordId}`)
 * @param limit número máximo de requisições na janela
 * @param windowMs tamanho da janela em milissegundos
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Extrai um identificador de IP razoável a partir dos headers da requisição. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
