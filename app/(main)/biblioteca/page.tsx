"use client";

import { useMemo, useState } from "react";
import { GAMES, CATS, type GameCat } from "@/lib/data";
import GameCard from "@/components/game-card";
import Reveal from "@/components/reveal";

type Filter = GameCat | "ALL";

/**
 * Biblioteca — catálogo completo de juegos.
 * - Hero con título flicker.
 * - Barra de búsqueda (filtra por título) + chips de categoría.
 * - Grid de GameCards con efecto tilt.
 * - Estado vacío "NO HAY RESULTADOS" cuando no matchea nada.
 */
export default function Biblioteca() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Filter>("ALL");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GAMES.filter((g) => {
      const okCat = cat === "ALL" || g.cat === cat;
      const okQ = !needle || g.title.toLowerCase().includes(needle);
      return okCat && okQ;
    });
  }, [q, cat]);

  return (
    <>
      <section className="av-hero bi-hero">
        <Reveal>
          <span className="kicker">// CATÁLOGO</span>
          <h1 className="bi-title">Biblioteca de juegos</h1>
          <p className="about-sub">
            Ocho títulos, un solo pase. Buscá tu próximo récord y entrá a la
            sala cuando quieras.
          </p>
        </Reveal>
      </section>

      <div className="av-filters">
        <label className="av-search">
          <span className="ico" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar juego…"
            aria-label="Buscar juego"
          />
        </label>
        <div className="av-chips" role="group" aria-label="Filtrar por categoría">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${cat === c.id ? " active" : ""}`}
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <section className="av-grid">
        {list.length > 0 ? (
          list.map((g) => <GameCard key={g.id} game={g} />)
        ) : (
          <div className="empty">
            <span className="empty-ico">∅</span>
            <h2 className="empty-title">NO HAY RESULTADOS</h2>
            <p className="empty-sub">
              {q ? (
                <>
                  Nada matchea <b>"{q}"</b>. Probá con otro nombre o pasá la
                  categoría a <b>TODOS</b>.
                </>
              ) : (
                <>No hay juegos en esta categoría todavía. Volvé a TODOS.</>
              )}
            </p>
          </div>
        )}
      </section>
    </>
  );
}