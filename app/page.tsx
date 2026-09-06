export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="av-hero">
        <h1>Arcade Vault</h1>
        <p className="sub">
          Juega online &bull; Compite por puntos
          <span className="blink"> _</span>
        </p>
      </section>

      {/* Game grid placeholder */}
      <section className="av-grid">
        <article className="card">
          <div className="cover">
            <div className="cover-bg cover-bricks" />
          </div>
          <div className="meta">
            <span className="title">Breakout</span>
            <span className="desc">Rompe todos los bloques para avanzar al siguiente nivel.</span>
          </div>
          <div className="row">
            <div className="score-badge">
              <span>High score</span>
              <b>12,480</b>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="cover">
            <div className="cover-bg cover-snake" />
          </div>
          <div className="meta">
            <span className="title">Snake</span>
            <span className="desc">Crece sin chocar contigo mismo. Clásico arcade.</span>
          </div>
          <div className="row">
            <div className="score-badge">
              <span>High score</span>
              <b>8,320</b>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="cover">
            <div className="cover-bg cover-tetro" />
          </div>
          <div className="meta">
            <span className="title">Tetromino</span>
            <span className="desc">Encaja las piezas antes de que lleguen al tope.</span>
          </div>
          <div className="row">
            <div className="score-badge">
              <span>High score</span>
              <b>24,150</b>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
