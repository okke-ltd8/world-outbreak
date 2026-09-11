import { Card } from "@/components/Card";

// DADOS MOCKADOS — ainda não há integração real com o servidor Minecraft
// para coletar kills, dias sobrevividos, etc. Quando essa integração existir,
// substitua esta constante por uma consulta ao banco/API real.
const MOCK_RANKING = [
  { position: 1, player: "Nightshade_92", clan: "Cinzas do Norte", kills: 143, daysSurvived: 61 },
  { position: 2, player: "Ferrugem", clan: "Cinzas do Norte", kills: 121, daysSurvived: 58 },
  { position: 3, player: "DrJenner", clan: "Bunker 7", kills: 98, daysSurvived: 74 },
  { position: 4, player: "SoloWolf", clan: "—", kills: 87, daysSurvived: 90 },
  { position: 5, player: "Kessler", clan: "Bunker 7", kills: 76, daysSurvived: 45 },
];

export default function RankingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 lg:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-outbreak-warn">Os que resistem</p>
      <h1 className="mt-2 font-display text-4xl text-white">Ranking</h1>

      <div className="mt-4 rounded-sm border border-outbreak-warn/40 bg-outbreak-warn/10 px-4 py-3 text-sm text-outbreak-warn">
        Estes dados são <strong>ilustrativos (mockados)</strong>. O ranking real será
        preenchido automaticamente assim que a integração com o mod Forge estiver ativa.
      </div>

      <Card className="mt-8 overflow-x-auto p-0">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="border-b border-outbreak-line text-xs uppercase tracking-wider text-outbreak-ash">
            <tr>
              <th className="px-5 py-3">Posição</th>
              <th className="px-5 py-3">Jogador</th>
              <th className="px-5 py-3">Clã</th>
              <th className="px-5 py-3">Kills</th>
              <th className="px-5 py-3">Dias sobrevividos</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RANKING.map((row) => (
              <tr key={row.position} className="border-b border-outbreak-line last:border-none">
                <td className="px-5 py-3 font-display text-outbreak-bloodBright">#{row.position}</td>
                <td className="px-5 py-3 text-white">{row.player}</td>
                <td className="px-5 py-3 text-outbreak-ash">{row.clan}</td>
                <td className="px-5 py-3">{row.kills}</td>
                <td className="px-5 py-3">{row.daysSurvived}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
