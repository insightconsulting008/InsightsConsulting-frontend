import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";

const testimonials = [
  {
    quote: `It is my privilege and pleasure to write about Mrs. Revathy Bhalaaji, CA, of Insight Consulting.
I have been in awe of her poise-calm and friendly nature.
She is very reassuring, frank, and pleasant & communicates with clarity.`,
    name: "Sridhar K R",
    company: "L’aura Nirvana",
  },
  {
    quote: `This is Murugadoss Narayanan representing Quadrobay Technologies Pvt Ltd., belonging to IT Consulting Category, we do consulting and development services on Oracle EBS, Fusion Applications, Salesforce & Modern Applications.
Revathy immediately brought in professionalism and rigor to executive reporting. She is an experienced professional ready to challenge leadership to address in efficiencies. She has been a great addition to our team.
Wishing you all the very best Revathy. Happy Networking.`,
    name: "Murugadoss Narayan",
    company: "Quadrobay Technologies P ltd",
  },
  {
    quote: `Wanted to thank you and your team for managing my Company taxation and other details to keep it legal. The journey so far has been fulfilling with you and your team so THANK YOU again Revathy.`,
    name: "Balasubramanian Jayaraman",
    company: "Golden Key Software Solutions P Ltd",
  },
  {
    quote: `Hi, I, Vignesh, Founder of the Fresh Gala category of cattle farming and technology would like to give a Certificate of Appreciation to Ms. Revathy Bhalaaji for my company auditing process for the last financial year and also thank her for fast execution and to know the insides about taxation and help me to reduce the financial burden`,
    name: "Vignesh S S",
    company: "Freshgala Online Services",
  },
  {
    quote: `This is Selvam from The Homework.co, we represent Commercial Interiors Category.
Mrs. Revathy Bhalaaji, I am really happy to share this testimonial for her, a seasoned Professional.
My take I have done business with about 5 Chartered Accounts in my career, once you meet her in person, you will look no further. She understands you and gives you what you need and not just what she has got. So are her team mates.
Trust me on this, she can save you a lot of money through her professional guidance; by enabling you do things right the first time. A true professional mentor who one can rely on.`,
    name: "Selvam Sundaramurthy",
    company: "House of D Property Developers P Ltd",
  },
  {
    quote: `Had approached Revathy to do a statutory audit for one of my Client.
She had done an excellent job even though it was given to her at the eleventh hour.
She is very dedicated to the job she takes up.
Would recommend Revathy for audit to all my friends and relatives.`,
    name: "Saradha",
    company: "Ekameva Consult Private Limited",
  },
  {
    quote: `I recently introduced Revathy madam to one of my customers who was looking to buy a house from an NRI and needed to file TDS. She expertly guided the customer and meticulously reviewed every aspect, reaching out to anything that was out of order. Professionalism at its finest. Very trustworthy and dependable! I'd recommend it to everyone.`,
    name: "Shankar K",
    company: "Fortune Financial Services",
  },
  {
    quote: `I am Mahendra, CEO of Mako IT Lab (www.makoitlab.com). We are working with Revathy mam for five years now. Been experienced setting up a new business, we all as new entrepreneur know along with the managing cash flows, getting new business, maintaining a healthy customer relationship etc etc, how difficult it will be to manage the assurance of a business from a financial standpoint. The later will be a nightmare for every entrepreneur but not for Mako IT Lab as we got into the safe hands of Revathy mam and her team.
 
She takes care of end to end financial requirements of our company, definitely much more than what we are paying her for. She treats our business like her own and suggests us best practices, refer us clients and more to improve our business.
 
It is very hard to find a business person who is not money minded but service oriented, Revathy mam is one such person, we have been paying her the same fees for more than four years to her but the level of work that her team does for us increased to a large extent in four years.
 
We will be your lifetime customer and will vouch for your services mam. Thank you very much for your support in our early struggling times. It definitely means a lot to us.`,
    name: "Mahendra Vadivelu",
    company: "Mako IT Lab P Ltd",
  },
  {
    quote: `I would like to thank Revathy mam for an outstanding service given to one of my most important client. It was a small job but it meant a world to me because she was always available for a call and ready to take up the job. I am privileged to have such a competent and calm businesswoman and she deserves all the credit and much more. Thank you for your service mam. My client is your forever fan.`,
    name: "Swaminathan",
    company: "3Pin Realty",
  },
  {
    quote: `I’ve taken accounting service from Revathy in the past 1 year. She’s very approachable at any time with any queries. She doesn’t stop with the accounting service alone, she also advices us on the right things to be done. Her team is very cooperative and they have the right knowledge. I would strongly recommend Revathy for any accounting needs.`,
    name: "Thamizh Selvan Vijayan",
    company: "Jeevathma Foundation",
  },
  {
    quote: `Revathy Balaji, our legal and accounting expert is a force to be reckoned with. Her expertise in taxation and as an independent director for companies is truly praiseworthy, showcasing her deep understanding of priorities like nobody else. After taking a long break from work, her remarkable comeback with a bang is an inspiring testament to her resilience and skill. Revathy's dedication and knowledge make her an invaluable asset to her clients.`,
    name: "Basker Natesan",
    company: "The Design Intellect",
  },
];

const videoTestimonials = [
  {
    name: "Mr. Vidyashankar Guru",
    role: "Co-founder & Chief Vision Officer",
    company: "MiTran Global",
    duration: "0:59",
    highlight:
      "She doesn't just focus on numbers and compliance. She provides practical insights that help businesses make better decisions.",
    playbackId: "zKPBwGt5AXPxdT3TghYrYV00B1KfiS02CpHS2nbLyuyqk",
  },
  {
    name: "Dr. Kavitha Sairam",
    role: "Founder",
    // TODO: confirm the exact company name ("___ Life Technologies") with the client
    company: "",
    duration: "0:40",
    highlight:
      "She's very knowledgeable, informative and updated, and has also been helping me in some strategic decisions.",
    playbackId: "X9N63d9u8M6XLFhtYu6JlbZceg012cVy4fN402KJ1EyIM",
  },
];

const avatarColors = [
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-teal-100 text-teal-800",
  "bg-rose-100 text-rose-800",
  "bg-indigo-100 text-indigo-800",
];

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ t, colorIdx, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-7 sm:p-10 shadow-2xl max-h-[88vh] overflow-y-auto">
        {/* Mobile drag handle */}
        <div className="block sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer text-base"
        >
          ✕
        </button>

        {/* Stars */}
        <div className="flex gap-1 mb-5">
          {"★★★★★".split("").map((s, i) => (
            <span key={i} className="text-primary text-lg">
              {s}
            </span>
          ))}
        </div>

        {/* Full quote */}
        <p className="text-lg sm:text-xl leading-[1.82] text-black font-medium mb-8">
          "{t.quote}"
        </p>

        <hr className="border-gray-100 mb-6" />

        {/* Person */}
        <div className="flex items-center gap-4">
          <div
            className={`w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColors[colorIdx % avatarColors.length]}`}
          >
            {getInitials(t.name)}
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-black">
              {t.name}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">{t.company}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function TestimonialCard({ t, index, onReadMore }) {
  const previewRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  // Detect if text is actually clamped after mount
  useEffect(() => {
    const el = previewRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 2);
    }
  }, []);

  return (
    <div
      className="w-80 flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-0 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onReadMore(t, index)}
    >
      {/* Decorative quote mark — top right, no border */}
      <span className="absolute top-3 right-4 text-6xl leading-none text-primary opacity-10 select-none font-serif">
        "
      </span>

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {"★★★★★".split("").map((s, i) => (
          <span key={i} className="text-primary text-sm">
            {s}
          </span>
        ))}
      </div>

      {/* 3-line clamped quote */}
      <p
        ref={previewRef}
        className="text-base leading-[1.72] text-black font-medium mb-3"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "74px",
        }}
      >
        "{t.quote}"
      </p>

      {/* Read more — only if actually clamped */}
      {isClamped ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReadMore(t, index);
          }}
          className="self-start flex items-center gap-1.5 text-sm font-bold text-primary underline underline-offset-4 hover:opacity-60 transition-opacity duration-200 mb-4 bg-transparent border-none cursor-pointer p-0"
        >
          Read more
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <div className="mb-4" />
      )}

      <hr className="border-gray-100 mb-4" />

      {/* Person */}
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColors[index % avatarColors.length]}`}
        >
          {getInitials(t.name)}
        </div>
        <div>
          <div className="text-base font-bold text-black leading-snug">
            {t.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{t.company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoTestimonialCard({ v }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  // false = muted looping background preview, true = user pressed play (sound + controls)
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  // Autoplay the muted preview while the card is on screen, pause it when it leaves
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;
        if (entry.isIntersecting) {
          if (!activeRef.current && !reduceMotion) player.play()?.catch(() => {});
        } else {
          player.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playWithSound = () => {
    const player = playerRef.current;
    if (!player) return;
    activeRef.current = true;
    setActive(true);
    player.loop = false;
    player.muted = false;
    player.currentTime = 0;
    player.play()?.catch(() => {});
  };

  // When the full video finishes, drop back to the silent looping preview
  const handleEnded = () => {
    if (!activeRef.current) return;
    const player = playerRef.current;
    activeRef.current = false;
    setActive(false);
    player.muted = true;
    player.loop = true;
    player.play()?.catch(() => {});
  };

  return (
    <article className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div ref={containerRef} className="relative aspect-video w-full bg-black">
        <MuxPlayer
          ref={playerRef}
          playbackId={v.playbackId}
          metadata={{ video_title: v.name }}
          thumbnailTime={2}
          accentColor="#F13C20"
          muted
          loop
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className="absolute inset-0 w-full h-full"
          style={{
            aspectRatio: "16 / 9",
            "--media-object-fit": "cover",
            "--controls": active ? undefined : "none",
          }}
        />

        {!active && (
          <button
            type="button"
            onClick={playWithSound}
            aria-label={`Play video testimonial from ${v.name} with sound`}
            className="group absolute inset-0 w-full h-full cursor-pointer border-none p-0 bg-transparent"
          >
            <span className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(241,60,32,0.45)] ring-8 ring-white/15 group-hover:brightness-110 group-hover:scale-110 transition-all duration-300"
              style={{ backgroundColor: "rgba(241, 60, 32, 0.72)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-0.5">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-primary text-sm">
                {s}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M2 1.2v7.6L8.5 5z" />
            </svg>
            Video · {v.duration}
          </span>
        </div>

        {/* Pull quote */}
        <blockquote className="text-lg sm:text-xl leading-snug text-black font-medium mb-6">
          {v.highlight}
        </blockquote>

        {/* Person */}
        <div className="mt-auto">
          <div className="text-base font-bold text-black leading-snug">
            {v.name}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            {v.role}
            {v.company && `, ${v.company}`}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [modalData, setModalData] = useState(null);
  const doubled = [...testimonials, ...testimonials];

  return (
    <>
     <style>{`
  .marquee-track {
    display: flex;
    gap: 20px;
    width: max-content;
    animation: marqueeScroll 55s linear infinite;
    padding: 12px 0;
  }

  /* Pause when modal is open */
  .marquee-track.paused {
    animation-play-state: paused;
  }

  /* Hover pause only for md+ */
  @media (min-width: 768px) {
    .marquee-track:hover {
      animation-play-state: paused;
    }
  }

  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`}</style>

      <section className="bg-secondary pt-16 lg:pt-24 overflow-hidden">
        {/* Header */}
        <div className="text-center px-6 mb-14">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.18em] uppercase text-primary mb-4">
            <span className="inline-block w-7 h-px bg-primary" />
            Testimonials
            <span className="inline-block w-7 h-px bg-primary" />
          </div>

          <h2 className="text-4xl md:text-6xl font-semibold text-black leading-tight mb-3">
            What Our Clients <em className="font-normal italic">Say</em>
          </h2>

          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Trusted by founders, SMEs and enterprises across industries for
            audit, taxation, and financial clarity.
          </p>
        </div>

        {/* Video testimonials */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-black">
              Hear it from our clients
            </h3>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {videoTestimonials.map((v) => (
              <VideoTestimonialCard key={v.src} v={v} />
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

          <div className={`marquee-track ${modalData ? "paused" : ""}`}>
            {doubled.map((t, i) => (
              <TestimonialCard
                key={i}
                t={t}
                index={i}
                onReadMore={(t, idx) => setModalData({ t, colorIdx: idx })}
              />
            ))}
          </div>
        </div>
      </section>

      {modalData && (
        <Modal
          t={modalData.t}
          colorIdx={modalData.colorIdx}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
}
