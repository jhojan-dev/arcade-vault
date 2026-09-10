import Nav from "@/components/nav";
import Footer from "@/components/footer";

/**
 * Layout de grupo (main) — comparte Nav sticky + Footer en todas las
 * rutas "principales" de la app: Home, About, Biblioteca, Detalle,
 * Player y Salón de la Fama.
 *
 * La ruta /auth vive fuera de este grupo y no lleva Nav/Footer.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}