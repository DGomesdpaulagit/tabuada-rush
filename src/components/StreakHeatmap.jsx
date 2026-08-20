import { useMemo } from 'react';
import { motion } from 'framer-motion';

import GameIcon from './GameIcon';

// 365 dias, agrupados por semana (colunas) e dia da semana (linhas).
// Cor por intensidade:
//   0 jogos: cinza
//   1: light  (verde claro)
//   2-3: medium
//   4+: dark
const INTENSITY_CLASSES = [
  'bg-gray-100',           // 0
  'bg-emerald-200',        // 1
  'bg-emerald-400',        // 2-3
  'bg-emerald-600',        // 4-7
  'bg-emerald-800',        // 8+
];

function intensity(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  return 4;
}

const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // dom..sab
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function StreakHeatmap({ sessions = [] }) {
  // Agrupa sessões por data (YYYY-MM-DD).
  const sessionsByDate = useMemo(() => {
    const map = {};
    for (const s of sessions) {
      if (!s?.date) continue;
      const d = new Date(s.date);
      if (isNaN(d.getTime())) continue;
      const k = d.toISOString().split('T')[0];
      map[k] = (map[k] || 0) + 1;
    }
    return map;
  }, [sessions]);

  // Gera grade de 53 semanas terminando na semana atual.
  // Cada coluna = 1 semana (domingo → sábado).
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Encontra o domingo desta semana
    const endSunday = new Date(today);
    endSunday.setDate(today.getDate() - today.getDay() + 7); // próximo domingo
    // 53 semanas atrás, no domingo correspondente
    const startSunday = new Date(endSunday);
    startSunday.setDate(endSunday.getDate() - 53 * 7);

    const out = [];
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(startSunday);
        day.setDate(startSunday.getDate() + w * 7 + d);
        if (day > today) {
          week.push(null); // futuro
          continue;
        }
        const key = day.toISOString().split('T')[0];
        const count = sessionsByDate[key] || 0;
        week.push({ date: key, count, day });
      }
      out.push(week);
    }
    return out;
  }, [sessionsByDate]);

  // Marcos de mês (para legenda horizontal)
  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const firstDay = week.find((d) => d !== null);
      if (!firstDay) return;
      const m = firstDay.day.getMonth();
      if (m !== lastMonth) {
        markers.push({ wIdx, label: MONTH_NAMES[m] });
        lastMonth = m;
      }
    });
    return markers;
  }, [weeks]);

  const totalDays = Object.keys(sessionsByDate).length;
  const totalSessions = Object.values(sessionsByDate).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <GameIcon name="ofensiva" size={17} />
          <p className="font-black text-gray-800">Ofensiva — 365 dias</p>
        </div>
        <p className="text-[10px] font-bold text-gray-400">
          {totalDays} dias jogados · {totalSessions} partidas
        </p>
      </div>
      <p className="text-xs text-gray-400 font-semibold mb-4">
        Cada quadrado é um dia · cor mais escura = mais partidas
      </p>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="inline-block min-w-full">
          {/* Cabeçalho de meses */}
          <div className="flex gap-[3px] mb-1 ml-5">
            {weeks.map((_, wIdx) => {
              const marker = monthMarkers.find((m) => m.wIdx === wIdx);
              return (
                <div key={wIdx} className="w-2.5 text-[8px] font-bold text-gray-400 leading-none h-3">
                  {marker?.label}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Labels de dia da semana */}
            <div className="flex flex-col gap-[3px] mr-1">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className="w-3 h-2.5 text-[8px] font-bold text-gray-300 leading-none flex items-center"
                  style={{ opacity: i % 2 === 0 ? 1 : 0 }} // mostra só D/T/Q/S
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grade */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((cell, dIdx) => {
                  if (cell === null) {
                    return <div key={dIdx} className="w-2.5 h-2.5 rounded-[3px] bg-transparent" />;
                  }
                  const i = intensity(cell.count);
                  const title = `${cell.date}: ${cell.count} partida${cell.count !== 1 ? 's' : ''}`;
                  return (
                    <div
                      key={dIdx}
                      title={title}
                      className={`w-2.5 h-2.5 rounded-[3px] ${INTENSITY_CLASSES[i]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] font-bold text-gray-400">Menos</span>
        {INTENSITY_CLASSES.map((c, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-[3px] ${c}`} />
        ))}
        <span className="text-[10px] font-bold text-gray-400">Mais</span>
      </div>
    </motion.div>
  );
}
