import { useEffect, useMemo, useState } from "react";
import travelImg from "../../../../assets/travel.png";

type Subscriber = {
  email: string;
  date: string; // ISO
};

const STORAGE_KEY = "newsletter_subscribers";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function readSubscribers(): Subscriber[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is Subscriber => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return typeof o.email === "string" && typeof o.date === "string";
    });
  } catch {
    return [];
  }
}

function writeSubscribers(list: Subscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function PlaneIllustration() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-white/10 blur-3xl" />

      <img
        src={travelImg}
        alt="Illustration voyage"
        draggable={false}
        className="relative w-[320px] sm:w-[360px] md:w-[420px] lg:w-[460px]
                   max-w-none select-none
                   drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}



export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const emailOk = useMemo(() => isValidEmail(emailTrimmed), [emailTrimmed]);

  useEffect(() => {
    if (!isSuccess) return;
    const t = window.setTimeout(() => setIsSuccess(false), 5000);
    return () => window.clearTimeout(t);
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailTrimmed || !emailOk) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const subscribers = readSubscribers();
      const exists = subscribers.some(
        (s) => s.email.toLowerCase() === emailTrimmed.toLowerCase()
      );

      if (exists) {
        setError("Vous êtes déjà inscrit.");
        return;
      }

      subscribers.unshift({ email: emailTrimmed, date: new Date().toISOString() });
      writeSubscribers(subscribers);

      setIsSuccess(true);
      setEmail("");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="relative overflow-hidden rounded-[34px] shadow-[0_30px_90px_-45px_rgba(2,6,23,0.75)]">
        {/* Background gradient like the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1637] via-[#0A2E5B] to-[#1C7C7A]" />

        {/* Decorative lines */}
        <svg
          className="absolute inset-0 opacity-25"
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2">
            <path d="M70,75 C210,10 320,40 420,95 C520,150 680,120 760,80 C860,35 980,50 1130,120" />
            <path d="M80,155 C250,85 340,120 430,170 C520,220 680,200 770,160 C870,120 980,135 1140,210" />
            <path d="M90,250 C260,180 350,210 440,260 C530,310 690,290 780,250 C880,210 990,225 1150,300" />
          </g>
        </svg>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 px-7 py-10 md:px-12 md:py-12">
          {/* Left */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-white font-extrabold tracking-tight text-3xl md:text-4xl">
              Ne ratez aucune bonne affaire
            </h2>
            <p className="mt-2 text-white/75 text-base md:text-lg max-w-xl">
              Restez en avance. Recevez les meilleurs deals, conseils et actus voyage
              directement par email.
            </p>

            {isSuccess && (
              <div className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-500/15 px-5 py-4 text-white">
                <p className="font-semibold">Inscription réussie.</p>
                <p className="text-sm text-white/75">Vous recevrez bientôt votre premier email.</p>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-300/25 bg-red-500/15 px-5 py-4 text-white">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse email"
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-12 rounded-2xl bg-white/10 text-white placeholder:text-white/45 border border-white/15 px-4 outline-none transition
                               focus:border-white/30 focus:ring-4 focus:ring-white/10
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="h-12 rounded-2xl px-6 font-bold bg-white text-slate-900 transition
                             hover:bg-white/95 active:scale-[0.99]
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Inscription..." : isSuccess ? "Inscrit" : "Recevoir l’alerte"}
                </button>
              </div>

              <p className="mt-3 text-xs text-white/60">
                Désinscription à tout moment. Lisez notre{" "}
                <a href="#" className="underline underline-offset-2 text-white/80 hover:text-white">
                  Politique de confidentialité
                </a>
                .
              </p>

              <p className="mt-2 text-xs text-white/55">
                {emailTrimmed ? (emailOk ? "Email valide" : "Email invalide") : "Entrez votre email pour commencer"}
              </p>
            </form>
          </div>

          {/* Right illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative translate-y-3 lg:translate-y-0 lg:translate-x-6">
              <PlaneIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}