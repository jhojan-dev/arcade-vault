"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Formulario de contacto del About.
 * - Validación mínima: si hay campos vacíos el form hace "shake" y marca el error.
 * - Envío simulado: muestra una terminal que "imprime" el mensaje línea a línea
 *   (animación typewriter) y un estado de éxito.
 * No envía nada a ningún lado: es visual del MVP.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const [visible, setVisible] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    if (!name.trim() || !email.trim() || !msg.trim()) {
      setErr("TRANSMISIÓN INCOMPLETA: completá los 3 campos.");
      return;
    }
    setErr(null);
    setLogs([
      `> abriendo canal seguro      ... OK`,
      `> cifrando mensaje           ... OK`,
      `> enrutando a: ${email.trim()}`,
      `> desplegando payload        ... OK`,
      `> ACUSE DE RECIBO #${Math.floor(Math.random() * 9000 + 1000)}`,
      "",
      "✅ MENSAJE ENVIADO. VOLVEMOS EN 24-48H.",
    ]);
    setVisible(0);
    setPhase("sending");
  };

  // terminal: revela una línea cada 380ms mientras `sending`
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (phase !== "sending") return;
    if (ticker.current) return;
    ticker.current = setInterval(() => {
      setVisible((v) => {
        const next = v + 1;
        if (next >= logs.length) {
          if (ticker.current) clearInterval(ticker.current);
          ticker.current = null;
          setPhase("done");
        }
        return next;
      });
    }, 380);
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      ticker.current = null;
    };
  }, [phase, logs.length]);
  const reset = () => {
    if (phase === "sending") return;
    setName("");
    setEmail("");
    setMsg("");
    setLogs([]);
    setVisible(0);
    setPhase("idle");
    setErr(null);
  };

  const shakeCls = err ? " shake" : "";

  return (
    <div className="contact-wrap">
      {phase === "idle" && (
        <form className={`contact-form${shakeCls}`} onSubmit={submit} noValidate>
          <label>
            <span>NOMBRE / ARCADE TAG</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: R2-D2"
            />
          </label>
          <label>
            <span>EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: pilot@vault.gg"
            />
          </label>
          <label>
            <span>MENSAJE</span>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={4}
              placeholder="Contanos qué juego te haría falta en la sala…"
            />
          </label>
          {err && <p className="form-err" role="alert">{err}</p>}
          <button type="submit" className="btn magenta">
            ENVIAR TRANSMISIÓN
          </button>
        </form>
      )}

      {phase !== "idle" && (
        <div className="terminal" aria-live="polite">
          <div className="terminal-head">
            <span className="dot" style={{ background: "var(--magenta)" }} />
            <span className="dot" style={{ background: "var(--yellow)" }} />
            <span className="dot" style={{ background: "var(--green)" }} />
            <span className="ttl">vault-comm — transmisión</span>
          </div>
          <pre className="terminal-body">
            {logs.slice(0, visible).map((l, i) => (
              <div key={i} className={l.startsWith("✅") ? "t-ok" : ""}>
                {l}
                {phase !== "done" && i === visible - 1 && (
                  <span className="t-cursor" aria-hidden="true" />
                )}
              </div>
            ))}
          </pre>
          {phase === "done" && (
            <button type="button" className="btn ghost" onClick={reset}>
              ENVIAR OTRO
            </button>
          )}
        </div>
      )}
    </div>
  );
}