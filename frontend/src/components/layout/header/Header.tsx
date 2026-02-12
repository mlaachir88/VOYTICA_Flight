
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdClose, MdLanguage, MdHeadsetMic } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("FR");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* CONTAINER PRINCIPAL */}
        <div className="flex items-center justify-between gap-4">
          {/* GAUCHE: LOGO */}
          <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-lg">
              V
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900">Voytica</p>
              <p className="text-xs text-slate-500">Flight Search</p>
            </div>
          </Link>

          {/* DROITE: MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
            {/* SUPPORT */}
            <a
              href="mailto:support@voytica.com"
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition no-underline font-medium text-sm"
              title="Support"
            >
              <MdHeadsetMic className="text-lg" />
              <span className="hidden lg:inline">Support</span>
            </a>

            {/* LANGUE */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition font-medium text-sm"
              >
                <MdLanguage className="text-lg" />
                <span className="hidden lg:inline">{currentLanguage}</span>
              </button>

              {/* DROPDOWN LANGUE */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleLanguageChange("FR")}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition ${
                      currentLanguage === "FR"
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange("EN")}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition ${
                      currentLanguage === "EN"
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("ES")}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition ${
                      currentLanguage === "ES"
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => handleLanguageChange("DE")}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition ${
                      currentLanguage === "DE"
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    🇩🇪 Deutsch
                  </button>
                </div>
              )}
            </div>

            {/* DEVIS */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
              <HiDocumentText className="text-lg" />
              <span className="hidden lg:inline">Devis</span>
            </button>
          </nav>

          {/* MENU BURGER MOBILE */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-slate-900 text-2xl flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>

        {/* MENU MOBILE */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 space-y-3">
            {/* SUPPORT MOBILE */}
            <a
              href="mailto:support@voytica.com"
              onClick={closeMenu}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition no-underline font-medium"
            >
              <MdHeadsetMic className="text-lg" />
              Support
            </a>

            {/* LANGUE MOBILE */}
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold text-slate-500 px-4 mb-2">Langue</p>
              <div className="space-y-1">
                {["FR", "EN", "ES", "DE"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      handleLanguageChange(lang);
                      closeMenu();
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      currentLanguage === lang
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {lang === "FR" && "🇫🇷 Français"}
                    {lang === "EN" && "🇬🇧 English"}
                    {lang === "ES" && "🇪🇸 Español"}
                    {lang === "DE" && "🇩🇪 Deutsch"}
                  </button>
                ))}
              </div>
            </div>

            {/* DEVIS MOBILE */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold mt-4">
              <HiDocumentText className="text-lg" />
              Devis
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}