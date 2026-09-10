"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SAVE_KEY, readScores, type Game, type SavedScore } from "@/lib/data";
import { useUser } from "@/lib/user-context";

const SCORE_STEP = 10;
const TICK_MS = 220;

interface PlayerScreenProps {
  game: Game;
}

export default function PlayerScreen({ game }: PlayerScreenProps) {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("PLAYER");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveName, setSaveName] = useState("");
  const shipRef = useRef<HTMLDivElement>(null);
  const [shipX, setShipX] = useState(50);

  useEffect(() => {
    setName(user || "PLAYER");
    setMounted(true);
  }, [user]);

  // Loop de puntuación: +10 cada 220ms
  useEffect(() => {
    if (!mounted || paused || gameOver) return;
    const iv = setInterval(() => {
      setScore((s) => {
        const ns = s + SCORE_STEP;
        setLevel(Math.floor(ns / 1000) + 1);
        return ns;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [mounted, paused, gameOver]);

  // Teclado: Esc pausa, flechas mueven nave
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused((p) => !p);
      if (e.key === "ArrowLeft") setShipX((x) => Math.max(8, x - 4));
      if (e.key === "ArrowRight") setShipX((x) => Math.min(92, x + 4));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  const loseLife = useCallback(() => {
    setLives((l) => {
      const nl = l - 1;
      if (nl <= 0) setGameOver(true);
      return Math.max(0, nl);
    });
  }, []);

  const reset = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setPaused(false);
    setGameOver(false);
    setSaved(false);
    setSaveName("");
    setShipX(50);
  };

  const saveScore = () => {
    const nm = (saveName.trim() || name).toUpperCase().slice(0, 10);
    const entry: SavedScore = { game: game.id, score, name: nm, at: Date.now() };
    try {
      const next = [...readScores(), entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      setSaved(true);
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const progress = Math.min(
    100,
    (gameOver ? 0 : score / (game.best || 1)) * 100
  );

  return (
    <main className="av-player">
      {/* HUD */}
      <div className="player-hud" role="status">
        <div className="hud-stat">
          <span className="l">Jugador</span>
          <span className="v">{name}</span>
        </div>
        <div className="hud-stat">
          <span className="l">Puntuación</span>
          <span className="v">{score.toLocaleString("es-AR")}</span>
        </div>
        <div className="hud-stat lives">
          <span className="l">Vidas</span>
          <span className="v">{"♥".repeat(lives) || "—"}</span>
        </div>
        <div className="hud-stat level">
          <span className="l">Nivel</span>
          <span className="v">{level}</span>
        </div>
        <div className="hud-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={loseLife}
            disabled={gameOver}
          >
            PERDER VIDA
          </button>
          <button
            type="button"
            className="btn magenta"
            onClick={() => setPaused((p) => !p)}
            disabled={gameOver}
          >
            {paused ? "REANUDAR" : "PAUSA"}
          </button>
        </div>
      </div>

      {/* CRT */}
      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor" aria-hidden="true" />
            <span className="enemy e1" aria-hidden="true" />
            <span className="enemy e2" aria-hidden="true" />
            <span className="enemy e3" aria-hidden="true" />
            <div
              ref={shipRef}
              className="player-ship"
              style={{ left: `${shipX}%` }}
              aria-hidden="true"
            />
            {level > 1 && <span className="arena-hint">NIVEL {level}</span>}
          </div>

          {/* Pausa overlay */}
          {paused && !gameOver && (
            <div className="pause-ov">
              <span className="pause-title">PAUSA</span>
              <button type="button" className="btn" onClick={() => setPaused(false)}>
                CONTINUAR
              </button>
              <span className="pause-hint">Presioná ESC o el botón para seguir</span>
            </div>
          )}

          {/* Game-over flash in arena */}
          {gameOver && (
            <div className="gameover-ov">
              <span className="go-title">GAME OVER</span>
              <span className="go-score">{score.toLocaleString("es-AR")}</span>
              <span className="go-game">{game.title.toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="crt-bottom">
          <span className="led">ON AIR — {game.title}</span>
          <span>CRT MODE v2.6</span>
        </div>
      </div>

      {/* Progreso vs mejor marca */}
      <div className="progress-strip">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-label">
          {gameOver
            ? "PARTIDA TERMINADA"
            : `META ${game.best.toLocaleString("es-AR")} pts`}
        </span>
      </div>

      {/* Modal game-over */}
      {gameOver && (
        <div className="modal-bd" role="dialog" aria-modal="true" aria-labelledby="go-title">
          <div className="modal">
            <h2 id="go-title">FIN DEL JUEGO</h2>
            <div className="final">{score.toLocaleString("es-AR")}</div>
            <div className="final-label">PUNTOS</div>

            {!saved ? (
              <>
                <div className="input-row">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) =>
                      setSaveName(e.target.value.toUpperCase().slice(0, 10))
                    }
                    placeholder="TU ARCADE TAG (MÁX 10)"
                    maxLength={10}
                    aria-label="Nombre para guardar la puntuación"
                  />
                  <button type="button" className="btn" onClick={saveScore}>
                    GUARDAR
                  </button>
                </div>
                <p className="modal-note">
                  Se guarda en este dispositivo en <b>{game.title}</b>.
                </p>
              </>
            ) : (
              <div className="toast-saved">¡PUNTUACIÓN GUARDADA! ✓</div>
            )}

            <div className="actions">
              <button type="button" className="btn lg pulse" onClick={reset}>
                JUGAR DE NUEVO
              </button>
              <Link href="/salon" className="btn ghost lg">
                SALÓN DE LA FAMA
              </Link>
              <Link href="/biblioteca" className="btn ghost lg">
                BIBLIOTECA
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}