# -*- coding: utf-8 -*-
"""Recorta ícone de fundo sólido SEM deixar rebarba [sessão 086].

O problema que isto resolve: a arte chega com fundo sólido (branco ou
preto). Na borda do desenho o gerador de imagem mistura a cor do objeto
com a cor do fundo (anti-aliasing). Uma remoção "burra" — apagar só os
pixels parecidos com o fundo — deixa justamente essa faixa misturada, que
aparece como CONTORNO BRANCO (ou escuro) em volta do ícone. Era a rebarba
que o Davi reclamou.

O que este script faz, em ordem:

1. **Detecta a cor do fundo** pelos 4 cantos.
2. **Flood fill a partir das bordas** — só o fundo CONECTADO à borda é
   candidato a sumir. Isso protege área clara DENTRO do desenho (os anéis
   brancos do alvo de acertos, por exemplo).
3. **Alfa suave**: em vez de 0 ou 255, o pixel de transição recebe alfa
   proporcional à distância até a cor do fundo. É o que mantém a borda
   macia em vez de serrilhada.
4. **Descontaminação de cor** (a parte que mata a rebarba): sabendo que o
   pixel observado é `C = α·F + (1−α)·B`, dá pra recuperar a cor real do
   objeto `F = (C − (1−α)·B) / α`. Sem isso, mesmo com alfa correto a
   borda continua clareada pelo branco que estava por baixo.
5. Recorta no conteúdo e centraliza num canvas quadrado.

USO:
    python scripts/recortar-icone.py entrada.png saida.png [tamanho]
    python scripts/recortar-icone.py folha.png saida.png 240 --fatiar 4

`--fatiar N` corta uma FOLHA com N ícones lado a lado, gerando
`saida-1.png`, `saida-2.png`, ...
"""
import sys
import os
from collections import deque

import numpy as np
from PIL import Image

# Quanto a cor precisa se afastar do fundo pra ser considerada 100% objeto.
# Em fração da distância máxima possível no espaço RGB.
TOLERANCIA = 0.22


def cor_do_fundo(a):
    """Média dos 4 cantos — o fundo sólido da arte gerada."""
    cantos = np.array([a[0, 0, :3], a[0, -1, :3], a[-1, 0, :3], a[-1, -1, :3]], dtype=float)
    return cantos.mean(0)


def recortar(im, tolerancia=TOLERANCIA):
    a = np.array(im.convert('RGBA')).astype(float)
    rgb = a[..., :3]
    alfa = a[..., 3]
    fundo = cor_do_fundo(a)

    # distância normalizada de cada pixel até a cor do fundo
    dist = np.sqrt(((rgb - fundo) ** 2).sum(-1)) / (255 * np.sqrt(3))
    novo_alfa = np.clip(dist / tolerancia, 0, 1)

    # flood fill: só o que está LIGADO à borda vira fundo. O resto do
    # desenho fica intocado, mesmo tendo a mesma cor do fundo.
    candidato = (novo_alfa < 0.98) | (alfa < 40)
    h, w = candidato.shape
    visto = np.zeros_like(candidato)
    fila = deque()
    for x in range(w):
        for y in (0, h - 1):
            if candidato[y, x] and not visto[y, x]:
                visto[y, x] = True
                fila.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if candidato[y, x] and not visto[y, x]:
                visto[y, x] = True
                fila.append((y, x))
    while fila:
        y, x = fila.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and candidato[ny, nx] and not visto[ny, nx]:
                visto[ny, nx] = True
                fila.append((ny, nx))

    saida = a.copy()
    borda = visto & (novo_alfa > 0.02)   # transição: nem fundo puro, nem objeto
    saida[visto & ~borda, 3] = 0
    saida[borda, 3] = novo_alfa[borda] * 255

    # descontaminação: tira do pixel a parte que era fundo
    idx = np.where(borda)
    al = novo_alfa[idx][:, None]
    cor = (rgb[idx] - (1 - al) * fundo) / np.maximum(al, 1e-3)
    saida[idx[0], idx[1], :3] = np.clip(cor, 0, 255)

    return Image.fromarray(saida.astype('uint8'))


def quadrado(im, lado):
    caixa = im.getbbox()
    if caixa:
        im = im.crop(caixa)
    w, h = im.size
    s = max(w, h)
    c = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    c.paste(im, ((s - w) // 2, (s - h) // 2))
    return c.resize((lado, lado), Image.LANCZOS)


def blocos_horizontais(im, minimo=40):
    m = np.array(im)[..., 3] > 20
    cols = m.sum(0)
    runs, ini = [], None
    for i, c in enumerate(cols):
        if c > 0 and ini is None:
            ini = i
        if c == 0 and ini is not None:
            if i - ini > minimo:
                runs.append((ini, i))
            ini = None
    if ini is not None:
        runs.append((ini, len(cols)))
    return runs


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    entrada, saida = args[0], args[1]
    lado = int(args[2]) if len(args) > 2 else 240
    fatias = 0
    if '--fatiar' in sys.argv:
        fatias = int(sys.argv[sys.argv.index('--fatiar') + 1])

    im = recortar(Image.open(entrada))
    if fatias:
        runs = blocos_horizontais(im)
        if len(runs) != fatias:
            print('aviso: achei %d blocos, esperava %d' % (len(runs), fatias))
        base, ext = os.path.splitext(saida)
        for i, (x0, x1) in enumerate(runs, 1):
            parte = im.crop((x0, 0, x1, im.size[1]))
            destino = '%s-%d%s' % (base, i, ext)
            quadrado(parte, lado).save(destino)
            print('  ' + destino)
    else:
        quadrado(im, lado).save(saida)
        print('  ' + saida)


if __name__ == '__main__':
    main()
