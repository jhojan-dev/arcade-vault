"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/user-context";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useUser();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") {
      if (!name.trim() || !pass.trim()) {
        setErr("Completá usuario y contraseña.");
        return;
      }
    } else {
      if (!name.trim() || !email.trim() || !pass.trim()) {
        setErr("Completá los tres campos.");
        return;
      }
    }
    login(name);
    router.push("/biblioteca");
  };

  const guest = () => {
    login("INVITADO");
    router.push("/biblioteca");
  };

  return (
    <main className="av-auth-wrap">
      <div className="auth-card">
        <header className="auth-header">
          <div className="mark" aria-hidden="true" />
          <h2>ARCADE VAULT</h2>
        </header>

        <div className="auth-tabs" role="tablist" aria-label="Modo de acceso">
          <button
            role="tab"
            aria-selected={tab === "login"}
            className={tab === "login" ? "on" : ""}
            onClick={() => setTab("login")}
          >
            INICIAR SESIÓN
          </button>
          <button
            role="tab"
            aria-selected={tab === "register"}
            className={tab === "register" ? "on" : ""}
            onClick={() => setTab("register")}
          >
            CREAR CUENTA
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="name">USUARIO / ARCADE TAG</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="ej: NEO"
              maxLength={10}
              required
            />
          </div>
          {tab === "register" && (
            <div className="field">
              <label htmlFor="email">EMAIL</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej: neo@vault.gg"
                required
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="pass">CONTRASEÑA</label>
            <input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {err && <p className="form-err" role="alert">{err}</p>}

          <button type="submit" className="btn magenta" style={{ width: "100%", marginTop: 6 }}>
            {tab === "login" ? "ENTRAR A LA SALA" : "CREAR Y ENTRAR"}
          </button>
        </form>

        <div className="auth-divider">
          <span>O ACCEDÉ CON</span>
        </div>

        <div className="social">
          <button type="button" className="btn ghost" disabled>
            Google
          </button>
          <button type="button" className="btn ghost" disabled>
            GitHub
          </button>
        </div>

        <button type="button" className="btn yellow" style={{ width: "100%", marginTop: 14 }} onClick={guest}>
          JUGAR COMO INVITADO
        </button>
      </div>
    </main>
  );
}