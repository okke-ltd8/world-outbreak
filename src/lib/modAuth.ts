import { NextRequest } from "next/server";

/**
 * Autenticação dos endpoints consumidos pelo mod Forge do servidor Minecraft.
 *
 * Esses endpoints não são chamados por um usuário logado no navegador — são
 * chamados servidor-a-servidor pelo processo do Minecraft. Por isso usamos uma
 * chave compartilhada (`MINECRAFT_API_KEY`), enviada no header `x-api-key`,
 * em vez de sessão de usuário.
 *
 * Nunca aceite essas requisições sem validar a chave: qualquer um na internet
 * poderia gerar códigos de verificação ou consultar status de contas.
 */
export function isAuthorizedModRequest(req: NextRequest): boolean {
  const expected = process.env.MINECRAFT_API_KEY;
  if (!expected) {
    // Sem chave configurada, negamos por padrão (fail closed).
    return false;
  }
  const provided = req.headers.get("x-api-key");
  return provided === expected;
}
