"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/user-context";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/salon", label: "Salón de la Fama" },
  { href: "/about", label: "Acerca de" },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, logout, loading } = useUser();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (loading) {
    // skeleton mientras hidrata (evita layout shift + SSR mismatch)
    return (
      <>
        <nav className="av-nav" aria-hidden="true">
          <span className="logo" aria-hidden="true">
            <span className="logo-mark" />
            <span className="logo-text">Arcade Vault</span>
          </span>
          <div className="links">
            <span>Inicio</span><span>Biblioteca</span><span>Salón</span><span>Acerca</span>
          </div>
          <span className="spacer" />
          <span className="coin-counter"><span className="coin" />3</span>
          <span className="auth-btn">...</span>
          <button className="hamburger" aria-hidden="true"><span className="bar"/><span className="bar"/><span className="bar"/></button>
        </nav>
      </>
    );
  }

  return (
    <>
      <nav className="av-nav">
        {/* Logo animado */}
        <Link href="/" className="logo" aria-label="Arcade Vault — Inicio" onClick={close}>
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">Arcade Vault</span>
        </Link>

        {/* Links de escritorio */}
        <div className="links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? "active" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <span className="spacer" />

        {/* Contador de créditos */}
        <span className="coin-counter" title="Créditos">
          <span className="coin" aria-hidden="true" />
          3
        </span>

        {/* Auth / logout */}
        <div className="auth-btn">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="nav-user" title={user}>
                {user}
              </span>
              <button type="button" className="btn ghost" onClick={logout}>
                SALIR
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn">
              INICIAR SESIÓN
            </Link>
          )}
        </div>

        {/* Hamburger (visible < 840px) */}
        <button
          type="button"
          className="hamburger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </nav>

      {/* Menú mobile slide-in + backdrop */}
      <div
        className={`av-mobile-backdrop ${open ? "open" : ""}`}
        aria-hidden="true"
        onClick={close}
      />
      <div className={`av-mobile-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={isActive(l.href) ? "active" : undefined}
            onClick={close}
          >
            {l.label}
          </Link>
        ))}
        {user ? (
          <button
            type="button"
            className="btn ghost mt-2"
            onClick={() => {
              close();
              logout();
            }}
          >
            SALIR
          </button>
        ) : (
          <Link href="/auth" className="btn mt-2" onClick={close}>
            INICIAR SESIÓN
          </Link>
        )}
      </div>
    </>
  );
}