// ── FRASES DO PAINEL DE OFENSIVA [Fase 8.2, sessão 096] ─────────────────────
// As 15 frases vieram de um PDF que o Davi escreveu (`referencias/icones/
// ofensiva/frases-ofensiva.pdf`): 5 por situação, sorteadas na hora de
// mostrar. Elas substituíram o "recorde" que ficava no painel — o recorde
// passou a viver só no Perfil.
//
// Texto dele, preservado. A única mudança combinada: a primeira frase de
// APAGADA falava "Duas horas para sua ofensiva zerar!" e virou o tempo REAL
// que falta até a meia-noite (ele autorizou na sessão 092) — por isso ela é
// função, e não string.

export const FRASES_OFENSIVA = {
  acesa: [
    () => 'Hoje você aumentou sua ofensiva!',
    () => 'Mais um dia na ofensiva!',
    () => 'Sua ofensiva continua firme!',
    () => 'Boa! Você manteve sua ofensiva acesa!',
    () => 'Ofensiva aumentando! Continue assim!',
  ],
  apagada: [
    (h) => (h <= 1
      ? 'Menos de uma hora para sua ofensiva zerar!'
      : `${h} horas para sua ofensiva zerar!`),
    () => 'Sua ofensiva está por um fio!',
    () => 'Corre! Sua ofensiva está quase acabando!',
    () => 'O tempo está passando... não deixe sua ofensiva zerar!',
    () => 'Sua ofensiva precisa de você!',
  ],
  congelada: [
    () => 'Você deixou sua ofensiva congelar!',
    () => 'Sua ofensiva entrou no modo congelado!',
    () => 'Ops! Sua ofensiva ficou congelada!',
    () => 'Sua ofensiva está congelada. Hora de descongelar!',
    () => 'O gelo tomou conta da sua ofensiva!',
  ],
};

// Horas cheias que faltam até a virada do dia — é o prazo real da ofensiva.
export function horasAteMeiaNoite(agora = new Date()) {
  const meiaNoite = new Date(agora);
  meiaNoite.setHours(24, 0, 0, 0);
  return Math.max(1, Math.ceil((meiaNoite - agora) / 3_600_000));
}

// Sorteia UMA frase da situação. O sorteio é preso ao dia + situação de
// propósito: se fosse `Math.random()` puro, a frase trocaria a cada
// re-render do painel (abrir e fechar o hover mudaria o texto na cara do
// jogador). Assim ela é estável durante o dia e muda no dia seguinte.
export function fraseDaOfensiva(situacao, data = new Date()) {
  const lista = FRASES_OFENSIVA[situacao] || FRASES_OFENSIVA.apagada;
  const semente = data.getFullYear() * 10000 + (data.getMonth() + 1) * 100 + data.getDate();
  const escolhida = lista[semente % lista.length];
  return escolhida(horasAteMeiaNoite(data));
}
