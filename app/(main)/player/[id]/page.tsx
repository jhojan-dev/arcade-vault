import { notFound } from "next/navigation";
import { GAMES } from "@/lib/data";
import PlayerScreen from "@/components/player-screen";

/**
 * Player — ruta /player/[id].
 * Server wrapper: resuelve el juego (404 si no existe) y delega toda la
 * interactividad al componente cliente (loop de puntuación, CRT, modal game-over).
 */
export default async function Player({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <PlayerScreen game={game} />;
}