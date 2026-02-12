type SearchParams = {
  from: string;
  to: string;
  date: string;
};

type Destination = {
  city: string;
  country: string;
  code: string;
  image: string; // public path
  tag: "Week-end" | "Business" | "Soleil" | "Culture" | "Night" | "City";
};

function toISODate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

function tagClasses(tag: Destination["tag"]) {
  switch (tag) {
    case "Soleil":
      return "bg-amber-500/15 text-amber-200 border-amber-300/25";
    case "Business":
      return "bg-emerald-500/15 text-emerald-200 border-emerald-300/25";
    case "Culture":
      return "bg-violet-500/15 text-violet-200 border-violet-300/25";
    case "Night":
      return "bg-slate-500/15 text-slate-200 border-slate-300/25";
    case "City":
      return "bg-blue-500/15 text-blue-200 border-blue-300/25";
    case "Week-end":
    default:
      return "bg-cyan-500/15 text-cyan-200 border-cyan-300/25";
  }
}

export default function TopDestinations({
  onPick,
  fromDefault = "CDG",
}: {
  onPick: (params: SearchParams) => void;
  fromDefault?: string;
}) {
  const date = getTomorrowISO();

  const destinations: Destination[] = [
    {
      city: "Paris",
      country: "France",
      code: "PAR",
      image: "/destinations/paris.jpg",
      tag: "City",
    },
    {
      city: "London",
      country: "United Kingdom",
      code: "LON",
      image: "/destinations/london.jpg",
      tag: "Business",
    },
    {
      city: "Barcelona",
      country: "Spain",
      code: "BCN",
      image: "/destinations/barcelona.jpg",
      tag: "Soleil",
    },
    {
      city: "Dubai",
      country: "UAE",
      code: "DXB",
      image: "/destinations/dubai.jpg",
      tag: "Night",
    },
    {
      city: "Istanbul",
      country: "Turkey",
      code: "IST",
      image: "/destinations/istanbul.jpg",
      tag: "Culture",
    },
    {
      city: "New York",
      country: "United States",
      code: "NYC",
      image: "/destinations/new-york.jpg",
      tag: "City",
    },
  ];

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Top destinations
          </h2>
          <p className="mt-2 text-slate-600">
            Des idées rapides pour lancer votre recherche.
          </p>
        </div>

        <a
          href="#search"
          className="hidden sm:inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          Rechercher maintenant
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((d) => (
          <button
            key={d.code}
            type="button"
            onClick={() => onPick({ from: fromDefault, to: d.code, date })}
            className="group text-left rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-[1px] transition will-change-transform"
          >
            {/* Image header */}
            <div className="relative h-40">
              {/* fallback gradient behind the image */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900" />

              <img
                src={d.image}
                alt={`${d.city}, ${d.country}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-95 scale-[1.01] group-hover:scale-[1.05] transition duration-500"
              />

              {/* overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/5" />

              {/* top chip */}
              <div className="absolute left-5 top-5">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${tagClasses(
                    d.tag
                  )}`}
                >
                  {d.tag}
                </span>
              </div>

              {/* code badge */}
              <div className="absolute right-5 top-5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/25 text-white backdrop-blur-sm">
                  {d.code}
                </span>
              </div>

              {/* title */}
              <div className="absolute left-5 bottom-5 text-white">
                <p className="text-lg font-extrabold leading-tight">{d.city}</p>
                <p className="text-sm text-white/80">{d.country}</p>
              </div>
            </div>

            {/* body */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Voir les vols
                </span>
                <span className="text-sm text-blue-700 font-semibold group-hover:text-blue-800 transition">
                  →
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Départ: <span className="font-semibold">{fromDefault}</span>
                </span>
                <span>
                  Date: <span className="font-semibold">{date}</span>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
