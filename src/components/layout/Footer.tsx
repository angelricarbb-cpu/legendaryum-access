import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">L</span>
              </div>
              <span className="text-xl font-semibold">Legendaryum</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Experiencias educativas inmersivas para familias y colegios.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Precios</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Características</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Experiencias</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Contacto</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">Privacidad</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Términos</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 Legendaryum. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
