"use client";

import Link from "next/link";
import type { Game } from "@/lib/data";

const NUM = (n: number) => n.toLocaleString("es-AR");

interface GameCardProps {
  game: Game;
  className?: string;
  tilt?: boolean;
}

/**
 * Tarjeta de juego reutilizable (Biblioteca, Home rail, etc).
 * - Cover art CSS via `cover-bg ${game.cover}`.
 * - Efecto tilt discreto al mover el mouse (deshabilitable + off en reduced-motion).
 * - Enlaza a `/detalle/{id}`.
 */
export default function GameCard({ game, className = "", tilt = true }: GameCardProps) {
  const tiltStyles = (e: React.MouseEvent<HTMLElement>) => {
    if (!tilt) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(720px) rotateY(${Math.round(px * 8)}deg) rotateX(${Math.round(-py * 8)}deg)`;
  };
  const tiltReset = (e: React.MouseEvent<HTMLElement>) => {
    if (!tilt) return;
    e.currentTarget.style.transform = "";
  };

  return (
    <Link
      href={`/detalle/${game.id}`}
      className={`card gc-card ${className}`}
      onMouseMove={tiltStyles}
      onMouseLeave={tiltReset}
      aria-label={`Jugar a ${game.title}`}
    >
      <div className="cover">
        <div className={`cover-bg ${game.cover}`} />
        <span className="label">{game.cat}</span>
      </div>
      <div className="meta">
        <span className="title">{game.title}</span>
        <span className="desc">{game.short}</span>
      </div>
      <div className="row gc-row">
        <div className="score-badge">
          <span>Marca</span>
          <b>{NUM(game.best)}</b>
        </div>
        <span className="plays">{game.plays} jugadas</span>
      </div>
    </Link>
  );
}