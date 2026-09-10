import Link from "next/link";
import Reveal from "@/components/reveal";
import ContactForm from "@/components/contact-form";

const HIGHLIGHTS = [
  {
    tag: "// MISIÓN",
    title: "El arcade nunca murió",
    text: "Creemos que jugar es mejor con una moneda encima de la mesa y tu nombre brillando en el marcador. Arcade Vault trae esa sensación al navegador: sin adaptadores, sin consola, sin excusas.",
  },
  {
    tag: "// HISTORIA",
    title: "Nacimos en un sótano",
    text: "En 2026 el grupo de juegos de la facultad se mudó a un sótano con un gabinete roto. Lo arreglamos, agregamos un proyector y en cuatro semanas teníamos una sala. Después la volcamos acá.",
  },
  {
    tag: "// COMUNIDAD",
    title: "Tu marca es tu firma",
    text: "Cada récord en el Salón de la Fama es una carta de presentación. Compartís sala con 18 jugadores de verdad, y la competencia es amistosa hasta que alguien sube el marcador.",
  },
];

const PIXELS = Array.from({ length: 24 }, (_, i) => i);

export default function About() {
  return (
    <>
      {/* HERO MISIÓN */}
      <section className="av-hero">
        <Reveal>
          <span className="kicker">// QUIÉNES SOMOS</span>
          <h1 className="about-title">Mantenemos viva la sala</h1>
          <p className="about-sub">
            Una plataforma para jugar online y competir por la mayor cantidad de
            puntos. Nada de lobby vacío: acá el marcador manda.
          </p>
          <div className="hero-ctas">
            <Link href="/biblioteca" className="btn lg">
              VER LA SALA
            </Link>
            <Link href="/salon" className="btn ghost lg">
              SALÓN DE LA FAMA
            </Link>
          </div>
        </Reveal>
      </section>

      {/* HIGHLIGHTS */}
      <section className="av-sec">
        <div className="head">
          <span className="kicker">// LA IDEA</span>
          <h2>Tres razones para quedarse</h2>
        </div>
        <div className="av-features">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.tag} delay={i * 90}>
              <article className="feature about-feature">
                <span className="about-tag">{h.tag}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DIVIDER PIXELADO */}
      <Reveal>
        <div className="pix-divider" aria-hidden="true">
          <span className="d-flag" />
          <span className="d-track">
            {PIXELS.map((i) => (
              <span key={i} className={`d-pix d${i % 6}`} />
            ))}
          </span>
          <span className="d-flag" />
        </div>
      </Reveal>

      {/* CONTACTO */}
      <section className="av-sec about-contact-sec">
        <div className="head">
          <span className="kicker">// CONTACTO</span>
          <h2>Mandanos una transmisión</h2>
          <p>
            ¿Pedido de juego, un high score injusto o un bug en la ROM? Escribinos.
            Respondemos como un arcade: rápido y sin vueltas.
          </p>
        </div>
        <Reveal>
          <div className="contact-shell">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}