import Footerctn from "./reusable/Footerctn";
import TestimonialsSection from "./reusable/Testimonials";

const About = () => {
  const teamMembers = [
    {
      name: "Revathy Bhalaaji",
      role: "B. Com, FCA, ACMA, Certified Independent Director",
      experience: "30+ Years",
      expertise: "Financial Reporting & Audit",
      desc: "With over 30 years of professional experience across financial reporting, internal audit and risk management. Her career reflects deep expertise in building structured finance environments, strengthening governance frameworks, and supporting organizations in navigating evolving regulatory and operational landscapes. She is a recognized speaker and knowledge contributor in areas such as GST, Microfinance, Finance for Non-Finance professionals, and Tax Management, and has delivered 300+ technical and executive sessions in industry forums such as TANSTIA, CODISSIA, and various Corporates.",
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/revathy.png",
      color: "from-violet-50 to-indigo-50",
      badgeColor: "bg-violet-100 text-violet-700",
      borderColor: "border-violet-100",
    },
    {
      name: "Gopalakrishnan Sethuraman",
      role: "B. Com, FCA, ACMA, CISA, IIM(B)",
      experience: "30+ Years",
      expertise: "Assurance & Finance Transformation",
      desc: "With over 30 years of experience across assurance, finance transformation, and business process consulting, Gopalakrishnan specializes in implementing process maturity models and strengthening controls across retail, manufacturing, supply chain & logistics, and service sectors. He supports organizations in building scalable finance processes, improving governance frameworks, and driving transformation-led performance improvement.",
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/gopalakrishnan.png",
      color: "from-blue-50 to-sky-50",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-100",
    },
    {
      name: "Kannan Subbiah",
      role: "B. Com, FCA, CISA, CGEIT, C|CISO, CCMP, Cyber Security Strategist",
      experience: "30+ Years",
      expertise: "IT Governance & Cyber Security",
      desc: "About 3 decades of demonstrated IT Leadership involving designing & architecting solutions arounds IT systems and Infra and have led organizations through IS 9001, ISO 27001 and CMMI certifications. Currently offering services as fractional CXO, IT Strategy, IT Governance, IS Audit & Assessments",
      // TODO: replace with the uploaded ImageKit URL for Kannan's photo
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image%20(8).jfif",
      color: "from-cyan-50 to-sky-50",
      badgeColor: "bg-cyan-100 text-cyan-700",
      borderColor: "border-cyan-100",
    },
    {
      name: "Bhalaaji Muthuswamy",
      role: "B. Sc (Physics), ACA",
      experience: "30+ Years",
      expertise: "FMCG & Manufacturing",
      desc: "With over 30 years of leadership experience across FMCG, manufacturing, consumer durables, media, and hospitality sectors, Bhalaaji works closely with founders and management teams on finance transformation, operating-model strengthening, and building scalable finance environments that support structured growth and better decision-making.",
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/balaji.png",
      color: "from-emerald-50 to-teal-50",
      badgeColor: "bg-emerald-100 text-emerald-700",
      borderColor: "border-emerald-100",
    },
    {
      name: "Balasubramanian K",
      role: "B. Com, MFM, ACA, IIM(C)",
      experience: "20+ Years",
      expertise: "FMCG & Manufacturing",
      desc: "Bala brings 20 years of powerhouse experience, including PAN-India leadership roles across Credit Administration, Risk & Policy Management, and Underwriting. He has contributed to top-tier driving growth, compliance, and high-quality credit portfolios on a national scale..  Bala blends analytical precision with strategic financial acumen in building scalable finance processes enabling better decisions, driving risk assurance and compliance and supporting organizations in navigating evolving regulatory requirement.",
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/WhatsApp%20Image%202026-04-21%20at%204.07.57%20PM.jpeg",
      color: "from-emerald-50 to-teal-50",
      badgeColor: "bg-emerald-100 text-emerald-700",
      borderColor: "border-emerald-100",
    },
    {
      name: "Venugopal Bhuvanagiri",
      role: "B. Com, M. Com, MBA",
      experience: "25+ Years",
      expertise: "Operations & Business Advisory",
      desc: "With over 25 years of experience in operations leadership, transition management, and finance transformation, Venu has led large-scale delivery programs for global retail and fashion enterprises and served as CEO – China Operations for a technology and consulting organization. He supports clients in building scalable delivery models and strengthening.",
      image:
        "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/venugopal.png",
      color: "from-amber-50 to-orange-50",
      badgeColor: "bg-amber-100 text-amber-700",
      borderColor: "border-amber-100",
    },
  ];

  const services = [
    {
      title: "Business Setup & Structuring",
      desc: "Company incorporation, entity structuring, and regulatory registrations to help you start right.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: "Virtual CFO & Finance Support",
      desc: "Strategic finance guidance, MIS reporting, cash-flow visibility, and decision support for growing businesses.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: "GST Compliance & Advisory",
      desc: "Registrations, filings, reviews, and practical advisory support to keep your business compliant and efficient.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      title: "Income Tax & Regulatory Compliance",
      desc: "Income tax filings, TDS compliance, ROC filings, and ongoing regulatory support.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: "Assurance Services",
      desc: "Independent assurance services that strengthen governance, transparency, and stakeholder confidence.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Business Advisory & Process Support",
      desc: "Solutions to improve financial clarity, strengthen processes, and support sustainable growth.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  const teamCulture = [
    { icon: "👥", text: "A customer-first mindset in every engagement" },
    {
      icon: "🎯",
      text: "A purpose-driven approach to delivering measurable impact",
    },
    { icon: "🤝", text: "Strong ownership and accountability toward outcomes" },
    {
      icon: "💡",
      text: "Active collaboration and knowledge sharing across teams",
    },
    {
      icon: "🌱",
      text: "A supportive environment that promotes balanced execution and continuous learning",
    },
    {
      icon: "🏆",
      text: "A culture where we celebrate individual and team success together",
    },
  ];

  const principles = [
    {
      word: "Clarity",
      desc: "We cut through complexity to deliver straightforward, actionable guidance for every client.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      word: "Accountability",
      desc: "We take full ownership of every engagement and stand behind the outcomes we deliver.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      word: "Integrity",
      desc: "We act with transparency and honesty, building relationships rooted in trust.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      word: "Responsiveness",
      desc: "We prioritize timely, attentive service — because your decisions depend on our speed.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      word: "Excellence",
      desc: "We hold ourselves to the highest standards in every deliverable, every time.",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <>
    <div className="font-inter w-full overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="w-full bg-white pt-10 pb-12 lg:pt-20 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center gap-5 text-center lg:max-w-[900px] lg:mx-auto">
          
            <h1 className="text-3xl text-dark leading-[1.2] lg:text-[52px] lg:leading-[1.15] font-semibold tracking-[-0.03em]">
              where Clarity meets Growth
            </h1>
            {/* Hero paragraph — increased from 17px to 19px */}
            <p className="text-base md:text-[19px] leading-[30px] font-normal text-muted max-w-full">
              Insight Consulting is a professional services firm bringing
              together professionals from diverse backgrounds to deliver
              impactful outcomes that reflect our commitment to excellence,
              responsibility, and trust—partnering with businesses to navigate
              change, strengthen compliance, and enable sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* ── About / Company Description ── */}
      <section className="w-full bg-white pb-14 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 items-start gap-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-3 text-center md:text-left">
            {/* <h2 className="text-dark text-[28px] lg:text-[40px] leading-[1.25] font-semibold tracking-[-0.025em] mt-3 relative inline-block">
              A Trusted CA Firm Built on Three Decades of Expertise
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20(1).png?updatedAt=1771488262931"
                alt="underline"
                className="absolute -bottom-2 left-0 w-36 opacity-70 hidden lg:block"
              />
            </h2> */}
            {/* About paragraphs — increased from 16px to 18px */}
            <div className="mt-8 flex flex-col gap-5">
              {[
                "Based in Chennai, we provide a comprehensive suite of professional services including Virtual CFO Services, Bookkeeping, Regulatory Compliance (GST, Income Tax, TDS, MCA), Audit & Assurance, and Business Consulting. Our approach combines technical depth with practical execution to support businesses across every stage of their growth journey.",
                "At Insight Consulting, we enable clients to achieve their business objectives through structured, insight-driven solutions that deliver measurable value in every engagement. Our partner-led delivery model ensures senior-level involvement, responsiveness, and consistently high service quality.",
                "Our team brings together a diverse blend of professionals with strong experience across finance, compliance, transformation, and business advisory. This multidisciplinary capability allows us to operate as a trusted one-stop solution partner, addressing both strategic priorities and operational requirements with equal rigor.",
                "Whether solving complex challenges or simplifying layered business environments, we approach every engagement with clarity, structure, and purpose. By taking a holistic view of each client's ecosystem, we deliver solutions that resolve immediate priorities while strengthening the foundation for sustainable long-term growth and value creation.",
                "We work alongside our clients not just as service providers, but as long-term strategic partners — strengthening governance, enabling better decisions, and building finance functions that support sustainable scale and enterprise value creation.",
              ].map((para, i) => (
                <p key={i} className="text-muted text-base md:text-[18px] leading-[1.85]">
                  {para}
                </p>
              ))}
            </div>
            <p className="text-primary font-semibold text-[17px] mt-7 italic border-l-2 border-primary pl-4 self-start">
              Partner with Insight Consulting – where Clarity meets Growth.
            </p>
          </div>
          <div className="lg:col-span-2 flex justify-center lg:justify-end lg:pt-6">
            <div className="relative w-full max-w-[420px]">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                alt="Team working"
                className="w-full h-[300px] lg:h-[480px] object-cover rounded-2xl"
              />
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Abstract%20Design%20(4).png?updatedAt=1771772119170"
                className="absolute -top-5 -right-5 w-12 md:w-16 opacity-80"
                alt=""
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  3
                </div>
                <div>
                  <p className="text-dark font-semibold text-[14px] leading-tight">
                    Decades
                  </p>
                  <p className="text-muted text-[12px]">of expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="w-full bg-gray-50 py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full lg:w-[46%] rounded-2xl overflow-hidden">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/Image%20(4).png"
                alt="Office"
                className="w-full h-[320px] md:h-[400px] lg:h-[520px] object-cover"
              />
            </div>
            <div className="w-full lg:w-[54%] flex flex-col gap-10">
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <span className="text-[14px] font-semibold leading-[24px] text-primary tracking-wide uppercase">
                  Trusted by growing businesses
                </span>
                {/* Metrics heading — unchanged, it's a heading not a paragraph */}
                <h2 className="text-[28px] lg:text-[42px] font-semibold leading-[1.2] tracking-[-0.025em] text-dark">
                  Supporting businesses at every stage of growth
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { stat: "400+", label: "Clients Supported" },
                  { stat: "30+", label: "Years of Experience" },
                  { stat: "10k+", label: "Compliance Filings Managed" },
                  { stat: "200+", label: "Businesses Served" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 text-center lg:text-left"
                  >
                    <div className="text-[40px] lg:text-[56px] leading-[1] tracking-[-0.04em] font-semibold text-primary">
                      {item.stat}
                    </div>
                    <div className="w-8 h-[2px] bg-primary/30 mx-auto lg:mx-0 rounded-full" />
                    {/* Stat labels — increased from 15px to 17px */}
                    <p className="text-[17px] leading-[24px] font-medium text-dark mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="w-full bg-white py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[12px] font-semibold text-primary tracking-wider uppercase">
                Leadership
              </span>
            </div>
            <h2 className="text-dark text-[32px] lg:text-[44px] font-bold tracking-tight leading-[1.2] max-w-[600px]">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 text-[18px] lg:text-[20px] leading-relaxed max-w-[600px]">
              Our founding partners bring 25–30+ years of real-world experience
              across finance, compliance, and business strategy.
            </p>
          </div>

          {/* Cards – image always left, image + title in same row, description below */}
          <div className="flex flex-col gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`group relative w-full rounded-3xl bg-white border ${member.borderColor || "border-gray-100"} shadow-sm hover:shadow-md transition-all duration-300 ease-out overflow-hidden`}
              >
                <div className="p-6 lg:p-8 xl:p-10">
                  {/* Row: small profile image + name/role */}
                  <div className="flex items-center gap-4 md:gap-5">
                    {/* Circular image - always left */}
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Title section (name + role) - right of image */}
                    <div className="flex-1">
                      <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                        {member.name}
                      </h3>
                      <p className="text-primary text-base font-semibold mt-1.5 tracking-wide">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Description paragraph - below the image + title row */}
                  <div className="mt-5 md:mt-6">
                    <p className="text-gray-700 text-base lg:text-[17px] leading-relaxed">
                      {member.desc}
                    </p>
                  </div>

                  {/* Decorative quote icon (optional) */}
                  <div className="mt-5 text-right opacity-30 hidden md:block">
                    <svg
                      className="w-6 h-6 text-primary inline-block"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Insight Advantage ── */}
      <section className="w-full bg-gray-50 py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[13px] font-semibold text-primary tracking-widest uppercase">
                  Our Culture
                </span>
                <h2 className="text-dark text-[28px] lg:text-[36px] font-semibold tracking-[-0.025em] leading-[1.25] mt-2">
                  The Insight Advantage
                </h2>
              </div>
              {/* Culture paragraphs — increased from 16px to 18px */}
              <p className="text-muted text-[18px] leading-[1.85]">
                At Insight Consulting, our strength lies in our people. Our team
                is a thoughtful blend of energetic young professionals and
                experienced practitioners, working together in a purpose-driven
                environment focused on delivering meaningful outcomes for our
                clients.
              </p>
              <p className="text-muted text-[18px] leading-[1.85]">
                We believe strong client impact begins with strong team
                ownership and collaboration.
              </p>

              <div className="flex items-center gap-3 mt-1">
                <div className="w-1 h-7 bg-primary rounded-full flex-shrink-0" />
                <h3 className="text-dark font-bold text-[20px] lg:text-[22px] leading-tight">
                  Our culture reflects this commitment:
                </h3>
              </div>

              {/* Culture list items — increased from 15–16px to 17–18px */}
              <ul className="flex flex-col gap-3">
                {teamCulture.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-all duration-200"
                  >
                    <span className="text-[24px] flex-shrink-0 leading-none mt-0.5">
                      {point.icon}
                    </span>
                    <span className="text-dark text-[17px] lg:text-[18px] leading-[1.75] font-medium">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden sticky top-8">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/Image%20(4).png"
                alt="Our Team"
                className="w-full h-[440px] lg:h-[680px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Commitment ── */}
      <section className="w-full py-16 relative overflow-hidden bg-primary">
        <div className="absolute top-0 bg-black/10 w-full h-full"></div>
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center gap-6 text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border border-white/30 text-white bg-white/10 backdrop-blur-sm">
              Our Commitment
            </span>
            <h2 className="text-white text-[30px] lg:text-[46px] font-semibold tracking-[-0.03em] leading-[1.2] max-w-[680px]">
              Our work is anchored in five core principles
            </h2>
            {/* Commitment paragraphs — increased from 16–18px to 18–20px */}
            <p className="text-[18px] lg:text-[20px] leading-[1.9] max-w-[600px] text-white/90">
              We work alongside founders, promoters, and leadership teams to
              strengthen regulatory compliance confidence, build resilient
              finance functions, enhance decision-making visibility and support
              sustainable, scalable enterprise growth.
            </p>
            <p className="text-[17px] leading-[1.8] text-white/80 italic">
              We bring the experience, structure, and responsiveness needed to
              support your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {principles.map((p, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 p-6 lg:p-7 rounded-2xl transition-all duration-300 group 
  backdrop-blur-xl border-2 border-white 
  bg-gradient-to-br from-white/100 to-orange-50/90 
  hover:from-white hover:to-orange-100/80 
  hover:shadow-md hover:shadow-orange-200/40"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
    bg-primary 
    text-white 
    group-hover:scale-105 group-hover:shadow-md group-hover:shadow-orange-300/40
    transition-all duration-300"
                >
                  {p.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  {/* Number + Line */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-primary">
                      0{i + 1}
                    </span>
                    <div className="h-[1.3px] flex-1 bg-gradient-to-r from-orange-200 via-orange-200 to-transparent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-primary text-[20px] lg:text-[22px] font-semibold tracking-tight group-hover:text-orange-700 transition-colors">
                    {p.word}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Can Help (Services) ── */}
      <section className="w-full bg-gray-50 py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:gap-14">
            <div className="flex flex-col items-center gap-4 text-center max-w-[580px]">
              <span className="text-[13px] font-semibold text-primary tracking-widest uppercase">
                Services
              </span>
              <h2 className="text-dark text-[28px] lg:text-[38px] font-semibold tracking-[-0.025em] leading-[1.2]">
                How We Can Help
              </h2>
              {/* Services subheading — increased from 16px to 18px */}
              <p className="text-muted text-[18px] leading-[1.8]">
                Our team supports businesses across their growth journey with
                practical, dependable, and timely professional services.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-primary rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.querySelector(".svc-icon-box");

                    if (box) box.style.backgroundColor = "var(--color-primary)";
                   
                  }}
                  onMouseLeave={(e) => {
                    const box = e.currentTarget.querySelector(".svc-icon-box");
                    const svg =
                      e.currentTarget.querySelector(".svc-icon-box svg");

                    if (box) box.style.backgroundColor = "rgba(0,0,0,0.05)"; // light neutral
                    if (svg) svg.style.stroke = "var(--color-primary)";
                  }}
                >
                  <div className="svc-icon-box w-[48px] h-[48px] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-primary/10">
                    <span className="flex items-center justify-center text-primary transition-all duration-300">
                      {svc.icon}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-dark text-[17px] font-semibold leading-[1.4]">
                      {svc.title}
                    </h3>

                    <p className="text-muted text-[16px] leading-[1.8]">
                      {svc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection/>

      <Footerctn />
    </div>
    </>
  );
};

export default About;
