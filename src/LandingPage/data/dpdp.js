// DPDP Compliance — Digital Personal Data Protection Act, 2023
// Content mirrors the source document 1:1 (navbar/footer excluded).
// `eyebrow` = kicker above the heading, `title` = the section heading,
// `kind` drives placement: hero → top of page, content → body cards,
// dark → Insight Consulting band, tail → after the band, cta → closing banner.

const dpdp = {
  serviceName: "DPDP Compliance",
  tagline: "Digital Personal Data Protection Act, 2023",
  sections: [
    /* ── HERO ───────────────────────────────────────────────────────── */
    {
      kind: "hero",
      content: [
        "India's data protection law is now in force. Insight Consulting helps organisations translate its obligations into a working, defensible privacy programme — practical, not theoretical.",
      ],
    },

    /* ── TIMELINE — rendered in the hero column, beside the enquiry form ── */
    {
      kind: "hero",
      eyebrow: "A Constitutional Evolution",
      title: "From a fundamental right to a working law",
      content: [
        "India's data protection framework didn't arrive overnight — it's the product of a decade-long constitutional and legislative arc, now entering its enforcement phase.",
      ],
      timeline: [
        {
          year: "2017",
          description:
            "Privacy recognised as a fundamental right under Article 21.",
        },
        {
          year: "2018",
          description:
            "Srikrishna Committee report lays the groundwork for a law.",
        },
        {
          year: "2023",
          description: "DPDP Act passed and receives presidential assent.",
        },
        {
          year: "2025",
          description:
            "Final DPDP Rules notified by the Ministry of Electronics & IT.",
        },
        {
          year: "NOW",
          description: "Organisations prepare for operational readiness.",
        },
        {
          year: "2027",
          description: "Full enforcement of obligations, rights, and penalties.",
        },
      ],
    },

    /* ── THEMES — the five cards that follow the timeline in the source ── */
    {
      kind: "content",
      subSections: [
        {
          title: "Individual Empowerment",
          description: "Control of and rights over personal data.",
        },
        {
          title: "Trust Building",
          description: "Secure, reliable digital transactions.",
        },
        {
          title: "Innovation Balance",
          description: "Streamlined, workable rules.",
        },
        {
          title: "Global Standards",
          description: "Aligned globally, yet localised.",
        },
        {
          title: "Accountability",
          description: "Clear organisational duties.",
        },
      ],
    },

    /* ── ECOSYSTEM ──────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "The Stakeholder Ecosystem",
      title: "The Act governs relationships, not just data",
      services: [
        {
          name: "The Data Principal",
          description:
            "The individual the data is about — including parents or lawful guardians for children and persons with disabilities.",
        },
        {
          name: "The Data Fiduciary",
          description:
            "The entity that determines the purpose and means of processing personal data.",
        },
        {
          name: "The Data Processor",
          description:
            "Third-party vendors that process data on behalf of the Fiduciary.",
        },
        {
          name: "Data Protection Board of India",
          description:
            "The regulator — handles breach notifications and levies financial penalties.",
        },
        {
          name: "The Consent Manager",
          description:
            "A single interoperable platform: a unified consent dashboard for the Principal, registered with the Board.",
        },
      ],
    },

    /* ── SCOPE ──────────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "The Scope",
      title: "Territory alone doesn't determine applicability",
      content: [
        "Applicability follows how data is captured, digitised, and used to serve people in India.",
      ],
      subSections: [
        {
          title: "In Scope",
          nested: [
            {
              text: "Within India",
              subItems: [
                "Personal data is collected digitally — or collected in a non-digital form and digitised later.",
              ],
            },
            {
              text: "Outside India",
              subItems: [
                "Processing is connected with offering goods or services to Data Principals within India.",
              ],
            },
          ],
        },
        {
          title: "Out of Scope",
          nested: [
            {
              text: "Personal or Domestic Use",
              subItems: [
                "Personal data processed for a personal or domestic purpose.",
              ],
            },
            {
              text: "Made Public by the Principal",
              subItems: ["Data made publicly available by the Data Principal."],
            },
            {
              text: "Legally Required Public Data",
              subItems: [
                "Data a person is legally required to make publicly available.",
              ],
            },
            {
              text: "Research, Archival & Statistical Purposes",
              subItems: [
                "Processing carried out solely for research, archiving, or statistical purposes is exempt from the Act's provisions.",
              ],
            },
          ],
        },
      ],
    },

    /* ── PERSONAL DATA ──────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Personal Data — Section 2(t)",
      title: "A universal standard, no separate \"sensitive\" tier",
      subSections: [
        {
          title: "Direct Identifiers",
          points: ["Name", "Address", "Photographs", "Aadhaar", "PAN"],
        },
        {
          title: "Indirect Identifiers",
          points: ["IP addresses", "Device IDs", "Cookies", "Location / GPS"],
        },
        {
          title: "Contextual Data",
          points: ["Health records", "Financial details", "Biometrics"],
        },
      ],
      note: "Crucial deviation: Unlike the IT Act 2000 or the GDPR, the DPDP Act 2023 has no separate legal category for \"Sensitive\" Personal Data — all personal data receives the same robust baseline protection.",
    },

    /* ── VALID CONSENT ──────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Valid Consent",
      title: "The diagnostic criteria for valid consent",
      services: [
        {
          name: "Freely Given",
          description:
            "Active choice required — no coercion, no \"accept all or leave\" walls, and no pre-checked boxes.",
        },
        {
          name: "Specific",
          description:
            "The exact purpose must be stated. Consent for delivery is not consent for marketing.",
        },
        {
          name: "Informed",
          description:
            "The user must clearly understand what they agree to — no burying terms in dense legal text.",
        },
        {
          name: "Unambiguous",
          description:
            "A clear affirmative action showing both parties agree on the same thing in the same sense.",
        },
      ],
    },

    /* ── MINORS ─────────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Routing Logic for Minors",
      title: "Processing data for under-18s",
      content: [
        "Requires verifiable parental consent and restricts targeting outright.",
        "Is the Data Principal under 18?",
        "↓ yes",
        "Obtain verifiable consent from a parent or lawful guardian — via third-party identity/age verification, or a virtual token issued by an authorised entity (e.g. DigiLocker).",
      ],
      points: [
        "✕ No behavioural tracking",
        "✕ No targeted advertising",
        "✕ No tracking",
      ],
      subSections: [
        {
          title: "Exemptions (Bypass)",
          description:
            "Medical emergencies, educational safety, and child day-care functionality are exempt from the standard consent flow.",
        },
        {
          title: "Also exempt for certain purposes",
          description:
            "State benefit or subsidy administration, email account creation, real-time location for safety, and confirming a user is not a child.",
        },
      ],
    },

    /* ── PENALTIES ──────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "The Penalty Framework",
      title: "Tiered financial exposure",
      subSections: [
        {
          title: "₹10,000",
          description:
            "Breach of duties by a Data Principal (e.g., registering false complaints).",
        },
        {
          title: "Up to ₹50 Cr",
          description: "Breach of general provisions of the Act or Rules.",
        },
        {
          title: "Up to ₹150 Cr",
          description:
            "Breach of additional obligations regarding children, or Significant Data Fiduciary obligations.",
        },
        {
          title: "Up to ₹200 Cr",
          description:
            "Failure to notify the Board or affected Data Principals of a personal data breach.",
        },
        {
          title: "Up to ₹250 Cr",
          description:
            "Failure to take reasonable security safeguards to prevent a personal data breach.",
        },
      ],
    },

    /* ── REGULATOR ──────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "The Regulator",
      title: "The Data Protection Board of India",
      subSections: [
        {
          title: "Board Structure",
          description: "Chairperson + up to 4 Members",
          extraDescription:
            "Appointed by the Central Government — experts in law, technology, and economics.",
        },
        {
          title: "The Civil Court Equivalence",
          description:
            "Under Section 28, the Board holds the powers of a Civil Court under the Code of Civil Procedure, 1908:",
          points: [
            "Initiate suo-moto investigations",
            "Summon witnesses under oath",
            "Demand documents and records",
            "Inspect premises and server facilities",
            "Issue legally binding interim orders",
          ],
        },
      ],
    },

    /* ── SDF MATRIX ─────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "The Fiduciary Tiering Matrix",
      title: "Standard obligations vs. Significant Data Fiduciary",
      content: [
        "The Government assigns \"Significant\" status based on data volume, sensitivity, and risk to democracy.",
      ],
      comparison: {
        headers: ["Data Fiduciary (Standard)", "Significant Data Fiduciary (SDF)"],
        rows: [
          [
            "Appoint a contact person for grievances",
            "Appoint an India-based Data Protection Officer reporting to the Board",
          ],
          [
            "Implement reasonable security",
            "Appoint an independent Data Auditor",
          ],
          [
            "No additional requirement",
            "Conduct periodic Data Protection Impact Assessments (DPIA) and audits",
          ],
          [
            "Standard cross-border data flows",
            "Restrict specific transfers outside India per Government committee limits",
          ],
        ],
      },
      note: "SDFs also carry two further duties: assess that any algorithmic software used to process personal data doesn't pose a risk to Data Principals, and submit a summary report of their DPIAs and audits to the Board.",
    },

    /* ── RULE 6 ─────────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Rule 6",
      title: "Tech stack audit: mandatory security safeguards",
      content: [
        "Specific technical and organisational measures every Data Fiduciary must implement to prevent data breaches.",
      ],
      services: [
        {
          name: "Data Masking",
          description:
            "Secure data through encryption, obfuscation, masking, or virtual tokens.",
        },
        {
          name: "Access Controls",
          description:
            "Enforce strict access limits to compute resources for Fiduciaries and Processors.",
        },
        {
          name: "Visibility & Audit",
          description:
            "Maintain logs, monitoring, and review systems to detect unauthorised access.",
        },
        {
          name: "Log Retention",
          description:
            "Retain logs and personal data for at least one year for tracing and remediation.",
        },
        {
          name: "Resilience",
          description:
            "Maintain backups to sustain processing if integrity or availability is compromised.",
        },
        {
          name: "Contractual Enforcement",
          description:
            "Embed flow-down security requirements in all contracts with Processors.",
        },
      ],
    },

    /* ── RULE 7 ─────────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Rule 7",
      title: "The breach notification timeline",
      content: [
        "Fiduciaries face a strict window to report compromises in confidentiality, integrity, or availability.",
      ],
      subSections: [
        {
          title: "To the Data Protection Board",
          description: "Without delay, then within 72 hours",
          points: [
            "Initial intimation without delay",
            "Comprehensive follow-up report on the understanding of the breach",
            "Mitigation and remedial steps taken",
            "Findings on the person responsible",
            "A report on user notifications",
          ],
        },
        {
          title: "To the Data Principal",
          description: "Without undue delay",
          points: [
            "A description of the breach and its consequences",
            "Mitigation measures already taken",
            "Safety steps the user should take",
            "DPO contact information",
          ],
        },
      ],
    },

    /* ── THIRD-PARTY RISK ───────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Section 8(6)",
      title: "Third-party risk & processor accountability",
      table: {
        headers: [
          "Risk Tier",
          "Characteristics",
          "Due Diligence",
          "Mandatory Contract",
        ],
        rows: [
          [
            "Critical — e.g. AWS, Razorpay",
            "High volume, sensitive data",
            "ISO 27001 Type II, onsite audit, annual review",
            "Strict DPA, sub-processor veto",
          ],
          [
            "High — e.g. Blue Dart",
            "Moderate access, regular processing",
            "Detailed questionnaire, certification review",
            "Standard DPA",
          ],
          [
            "Medium — e.g. Google Analytics",
            "Limited access, specific use case",
            "Standard questionnaire, bi-annual review",
            "Standard DPA",
          ],
          [
            "Low — e.g. design tools",
            "Peripheral function, no PII",
            "Simplified review, reactive monitoring",
            "Standard terms",
          ],
        ],
      },
      note: "Liability insight: the Data Fiduciary remains fully accountable for its processors. Seek recourse through indemnification clauses in the Data Processing Agreement.",
    },

    /* ── THIRD SCHEDULE ─────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Third Schedule",
      title: "Data erasure schedules for high-volume platforms",
      content: [
        "E-commerce, social media, and online gaming entities above a registered-user threshold face a specific erasure clock.",
      ],
      subSections: [
        {
          title: "E-commerce Entities",
          description:
            "2 crore+ registered users in India — erase inactive-user data within 3 years.",
        },
        {
          title: "Social Media Platforms",
          description:
            "2 crore+ registered users in India — erase inactive-user data within 3 years.",
        },
        {
          title: "Online Gaming Companies",
          description:
            "50 lakh+ registered users in India — erase inactive-user data within 3 years.",
        },
      ],
      note: "The clock runs from the Data Principal's last approach for the specified purpose or exercise of rights. Fiduciaries must notify the Principal at least 48 hours before deletion, giving them a chance to log in and retain their data — unless the data is needed by law, or to access the account or virtual tokens tied to money, goods, or services.",
    },

    /* ── GOVERNANCE / DPO ───────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Governance in Practice",
      title: "The DPO as the ecosystem hub",
      subheading: "DPO",
      // 2 spokes left, 2 right, DPO node in the centre connecting all four
      hubLayout: true,
      subSections: [
        {
          title: "Board of Directors",
          description: "Internal · Upward",
          extraDescription:
            "Strategic advisor: streamlined compliance updates, risk assessments, and organisational accountability.",
        },
        {
          title: "Data Protection Board",
          description: "External · Regulator",
          extraDescription:
            "Primary regulatory liaison: submits audit/DPIA findings and executes mandatory breach notifications.",
        },
        {
          title: "Business, Engineering & HR",
          description: "Internal · Operational",
          extraDescription:
            "Operational guide: technical/organisational safeguards (Rule 6), vendor due diligence, and data minimisation.",
        },
        {
          title: "Data Principals",
          description: "External · Public",
          extraDescription:
            "The public face of privacy: contact point for rights (access, correction, erasure) and grievance redressal.",
        },
      ],
    },

    /* ── EVIDENCE TRAIL ─────────────────────────────────────────────── */
    {
      kind: "content",
      inlineDoc: true,
      eyebrow: "The Evidence Trail",
      title: "Documentation for audits",
      steps: [
        { name: "Consent Logs", description: "Method, purpose, and withdrawal." },
        {
          name: "Processing Records",
          description: "Data inventory and retention limits.",
        },
        {
          name: "Sharing Agreements",
          description: "Third-party contracts and cross-border flows.",
        },
        {
          name: "Principal Requests",
          description: "Access, correction, and grievance resolution.",
        },
        {
          name: "Security Safeguards",
          description: "Vulnerability reports and employee training.",
        },
        {
          name: "Breach Register",
          description: "All incidents and remediation steps.",
        },
      ],
      note: "SDFs must secure independent external audits evaluating all provisions every 12 months.",
      footerNote:
        "Golden Rule: if it isn't documented, it didn't happen.",
    },

    /* ── DELIVERY FRAMEWORK ─────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "Our Approach",
      title: "The Delivery Framework",
      // numbered 01–06 phases lead, the three grouped boxes follow
      stepsFirst: true,
      content: [
        "A structured, six-phase path from first gap assessment to sustained compliance.",
      ],
      steps: [
        { name: "Discover" },
        { name: "Assess" },
        { name: "Design" },
        { name: "Implement" },
        { name: "Validate" },
        { name: "Sustain" },
      ],
      subSections: [
        {
          title: "Discover + Assess",
          description: "Build the Data Privacy Foundation",
          points: [
            "Application & processor inventory across systems",
            "Maturity assessment against DPDP requirements",
            "Action plan across governance, technology, people, process",
          ],
        },
        {
          title: "Design + Implement",
          description: "Operationalise Privacy Controls",
          points: [
            "Policy, notice, and contract clause pack",
            "Consent design based on the application inventory",
            "Rights-request intake and breach-response playbooks",
          ],
        },
        {
          title: "Validate + Sustain",
          description: "Scale and Sustain Data Protection",
          points: [
            "Retention schedule by data category",
            "Privacy technology evaluation and roadmap",
            "Awareness training and regulatory change tracking",
          ],
        },
      ],
    },

    /* ── SERVICES ───────────────────────────────────────────────────── */
    {
      kind: "content",
      eyebrow: "How We Can Support You",
      title: "Six ways we take you from gap to ready",
      services: [
        {
          name: "DPDP Readiness Assessment",
          description:
            "A comprehensive assessment of your current data handling practices against DPDP requirements, benchmarked to identify gaps and risks.",
        },
        {
          name: "Consent Framework Design",
          description:
            "Design compliant, customer-friendly consent workflows and privacy notices for onboarding, KYC, and marketing — moving rights and withdrawal requests off email onto a structured, trackable form.",
        },
        {
          name: "Policy & Documentation",
          description:
            "Drafting and updating privacy policies, data processing agreements, and breach response protocols.",
        },
        {
          name: "Technology Enablement",
          description:
            "Identify and recommend consent management platforms and data mapping tools tailored to your technology ecosystem.",
        },
        {
          name: "Ongoing Compliance Support",
          description:
            "Periodic reviews, DPIA support, and liaison assistance in case of regulatory queries.",
        },
        {
          name: "Training & Change Management",
          description:
            "Equipping compliance, operations, and customer-facing teams with the knowledge to operate under the new regime.",
        },
      ],
    },

    /* ── INSIGHT CONSULTING BAND ────────────────────────────────────── */
    {
      kind: "dark",
      eyebrow: "Why Insight Consulting",
      title: "Our distinctive strengths",
      subSections: [
        {
          title: "Sector-Focused Expertise",
          description:
            "Deep familiarity with diverse industry data flows — user onboarding, historical activity, transaction monitoring, and cross-sell journeys across multiple sectors.",
        },
        {
          title: "Practical — Not Theoretical",
          description:
            "We translate legal obligations into workable SOPs, consent flows, and templates your teams can actually use.",
        },
        {
          title: "End-to-End Partner",
          description:
            "From gap assessment through DPIA, technology selection, training, and ongoing regulatory liaison support.",
        },
      ],
      closingParagraphs: [
        "Privacy is now a market expectation, not a legal afterthought.",
        "DPDP compliance builds customer confidence and brand trust.",
        "Reduces regulatory exposure and investor risk alike.",
      ],
    },
    {
      kind: "dark",
      eyebrow: "Where Organisations Get Stuck",
      title: "DPDP compliance is straightforward on paper, harder in practice",
      subSections: [
        {
          title: "01 Limited Awareness",
          description:
            "Teams outside legal and compliance often don't know the Act applies to them at all.",
        },
        {
          title: "02 Thin In-House Expertise",
          description:
            "Few organisations have privacy specialists who can read a Rule and translate it into a workflow.",
        },
        {
          title: "03 Budget Pressure",
          description:
            "Privacy competes with other priorities for a limited compliance and technology budget.",
        },
        {
          title: "04 Fragmented Data Estates",
          description:
            "Personal data is scattered across systems, vendors, and spreadsheets nobody has fully mapped.",
        },
        {
          title: "05 Consent at Scale",
          description:
            "A consent flow that works for a hundred users breaks down at a hundred thousand.",
        },
        {
          title: "06 A Moving Target",
          description:
            "Rules, thresholds, and Board guidance will keep evolving through to full enforcement in 2027.",
        },
      ],
      closingText:
        "This is exactly where an experienced, hands-on partner earns its keep.",
    },

    /* ── FAQ ────────────────────────────────────────────────────────── */
    {
      kind: "tail",
      accordion: true,
      eyebrow: "Frequently Asked Questions",
      title: "Quick answers before you talk to us",
      subSections: [
        {
          title: "Who does the DPDP Act actually apply to?",
          description:
            "Any Data Fiduciary processing digital personal data of individuals in India — whether the organisation is based in India or offers goods and services to Indian users from abroad. Size doesn't exempt you; only the specific obligations that apply scale with how much data you hold and how sensitive your operations are.",
        },
        {
          title:
            "Is personal data under DPDP treated differently from \"sensitive\" data, like under GDPR?",
          description:
            "No — and that's a deliberate design choice. Unlike the IT Act 2000 or the GDPR, the DPDP Act has no separate legal category for \"sensitive\" personal data. Every category — from a name to a health record — receives the same baseline protection.",
        },
        {
          title: "What's the real deadline we should be working towards?",
          description:
            "The Rules were notified on 14 November 2025. Obligations phase in over 18 months, with full enforcement — including the complete penalty framework — landing on 14 May 2027. Waiting until then to start is the single most common mistake we see.",
        },
        {
          title:
            "Do small and mid-sized businesses need to comply, or is this only for large platforms?",
          description:
            "Core obligations — consent, notice, security safeguards, rights handling — apply to every Data Fiduciary regardless of size. Only a subset of heavier obligations (an India-based DPO, independent audits, DPIAs) are reserved for Significant Data Fiduciaries designated by the Government.",
        },
        {
          title: "What happens if we're not ready by the deadline?",
          description:
            "Financial penalties, assessed per violation, ranging from ₹10,000 for a Data Principal's frivolous complaint up to ₹250 crore for failing to implement reasonable security safeguards. There's no imprisonment under the Act, but the Data Protection Board can investigate, summon records, and issue binding orders in the meantime.",
        },
        {
          title: "Where should we start?",
          description:
            "With a readiness assessment — a structured look at what personal data you hold, where it lives, and how far your current notices, consent flows, and contracts are from what the Act requires. That gap list becomes your roadmap.",
        },
      ],
    },

    /* ── CTA ────────────────────────────────────────────────────────── */
    {
      kind: "cta",
      title: "Compliance as a competitive advantage",
      description:
        "A focused first conversation is usually enough to map how far your organisation is from a defensible DPDP programme — and what to fix first.",
      action: "Talk to Us",
      email: "enquiry@insightconsulting.info",
    },
  ],

  // Hero tagline strip from the source document
  closingTagline: "where Clarity meets Growth",
};

export default dpdp;
