
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100 mt-20">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* COLONNE 1 - ABOUT */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-300 text-slate-900 flex items-center justify-center font-bold text-lg">
                V
              </div>
              <h3 className="font-bold text-lg">Voytica</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Le moteur de recherche de vols le plus puissant. Comparez les meilleures offres de vols en une seconde.
            </p>
            <p className="text-xs text-slate-500">© {currentYear} Voytica. Tous droits réservés.</p>
          </div>

          {/* COLONNE 2 - NAVIGATION */}
          <div>
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  À propos
                </a>
              </li>
              <li>
                <a href="#blog" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Emplois
                </a>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 - LEGAL */}
          <div>
            <h4 className="font-bold text-white mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#terms" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Gestion des cookies
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-sm text-slate-400 hover:text-white transition no-underline">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          {/* COLONNE 4 - CONTACT */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MdEmail className="text-lg mt-0.5 flex-shrink-0 text-blue-400" />
                <a
                  href="mailto:support@voytica.com"
                  className="text-sm text-slate-400 hover:text-white transition no-underline"
                >
                  support@voytica.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MdPhone className="text-lg mt-0.5 flex-shrink-0 text-blue-400" />
                <a
                  href="tel:+33123456789"
                  className="text-sm text-slate-400 hover:text-white transition no-underline"
                >
                  +33 (0) 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MdLocationOn className="text-lg mt-0.5 flex-shrink-0 text-blue-400" />
                <span className="text-sm text-slate-400">
                  Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* COPYRIGHT */}
          <p className="text-xs text-slate-500">
            Voytica est un moteur de recherche de vols. Les prix et disponibilités sont fournis par nos partenaires.
          </p>

          {/* SOCIAL MEDIA */}
          <div className="flex items-center gap-4">
            <a
              href="#facebook"
              className="text-slate-400 hover:text-blue-400 transition"
              title="Facebook"
            >
              <FaFacebook className="text-lg" />
            </a>
            <a
              href="#twitter"
              className="text-slate-400 hover:text-blue-400 transition"
              title="Twitter"
            >
              <FaTwitter className="text-lg" />
            </a>
            <a
              href="#instagram"
              className="text-slate-400 hover:text-blue-400 transition"
              title="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="#linkedin"
              className="text-slate-400 hover:text-blue-400 transition"
              title="LinkedIn"
            >
              <FaLinkedin className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}