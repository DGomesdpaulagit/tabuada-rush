// ── FRASES DA CAIXA DE DIVISÃO [sessão 097] ─────────────────────────────────
// 30 frases escritas pelo Davi, 10 por situação, sorteadas sem ordem fixa.
// A COR muda junto com a situação (pedido dele): vermelho na zona de
// rebaixamento, normal no meio, verde no pódio.
//
// O sorteio é preso ao dia + situação, e não `Math.random()` puro: a caixa
// re-renderiza a cada navegação, e a frase ficaria pulando na cara do jogador.
// Assim ela é estável no dia e muda quando o dia (ou a situação) muda.

export const FRASES_DIVISAO = {
  rebaixamento: [
    'Cuidado: você está na zona de rebaixamento!',
    'Fuja da zona de rebaixamento agora!',
    'Reaja para sair da zona de rebaixamento!',
    'Zona de perigo: suba na classificação!',
    'Não deixe o rebaixamento te alcançar!',
    'Hora de virar o jogo e sair dessa zona!',
    'Esforço máximo para evitar o rebaixamento!',
    'Saia da zona de rebaixamento hoje!',
    'Alerta: suba para não ser rebaixado!',
    'Lute para sair da zona de rebaixamento!',
  ],
  meio: [
    'Jogue para subir no pódio!',
    'Alcance o pódio com mais vitórias!',
    'Suba na classificação agora mesmo!',
    'O pódio está logo ali, continue!',
    'Jogue para conquistar seu lugar!',
    'Mais pontos para chegar ao pódio!',
    'Suba no ranking com suas vitórias!',
    'Rumo ao pódio: jogue mais!',
    'Garanta seu lugar no pódio hoje!',
    'Melhore sua posição no ranking!',
  ],
  podio: [
    'Mantenha o ritmo para subir de divisão!',
    'Ótimo trabalho, rumo à próxima divisão!',
    'Pódio garantido: foque na promoção!',
    'Continue assim e suba de divisão!',
    'Você está brilhando, rumo ao topo!',
    'Pódio mantido: próximo passo, divisão!',
    'Mantenha a posição e suba de nível!',
    'Excelente desempenho, continue firme!',
    'Rumo à divisão superior, não pare!',
    'Pódio conquistado: foco na promoção!',
  ],
};

// Cor por situação — o `text-fg-muted` do meio é o "normal" que ele pediu.
export const COR_DIVISAO = {
  rebaixamento: 'text-danger',
  meio: 'text-fg-muted',
  podio: 'text-success',
};

export const PODIO_ATE = 3;

// `posicao` é 1-based. `primeiroDaZona` vem de utils/relegation.
export function situacaoDaDivisao(posicao, primeiroDaZona) {
  if (posicao >= primeiroDaZona) return 'rebaixamento';
  if (posicao <= PODIO_ATE) return 'podio';
  return 'meio';
}

export function fraseDaDivisao(situacao, data = new Date()) {
  const lista = FRASES_DIVISAO[situacao] || FRASES_DIVISAO.meio;
  const semente =
    data.getFullYear() * 10000 + (data.getMonth() + 1) * 100 + data.getDate() + situacao.length;
  return lista[semente % lista.length];
}
