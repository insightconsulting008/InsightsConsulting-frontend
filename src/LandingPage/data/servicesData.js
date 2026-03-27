export const servicesData = [
  {
    categoryId: "registration",
    categoryName: "Registration",
    subcategories: [
      {
        subCategoryId: "business-registration",
        subCategoryName: "Business Registration",
        services: [
          /* ─────────────────────────────────────────────
             PRIVATE LIMITED COMPANY
          ───────────────────────────────────────────── */
          {
            serviceId: "private-limited-company",
            name: "Private Limited Company",
            tagline: "Build a Scalable, Credible & Investment-Ready Business Structure",
            whyChoose: {
              heading: "Why Choose a Private Limited Company?",
              paragraphs: [
                "A Private Limited Company is the most preferred business structure for serious entrepreneurs who want growth, credibility, and funding opportunities.",
                "At Insight Consulting, we don't just register your company — we help you build a strong legal and financial foundation for long-term success.",
              ],
            },
            idealFor: [
              "Startups planning to scale",
              "Businesses seeking funding or investors",
              "Entrepreneurs looking for limited liability protection",
              "Professionals building structured enterprises",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Limited Liability Protection",
                desc: "Your personal assets are protected — liability is limited to your investment.",
              },
              {
                iconKey: "trending",
                title: "Easy Fund Raising",
                desc: "Preferred structure for investors, venture capital, and bank funding.",
                bullets: ["Investors", "Venture capital", "Bank funding"],
              },
              {
                iconKey: "building",
                title: "High Credibility",
                desc: "More trusted by clients, vendors, and financial institutions.",
                bullets: ["Clients", "Vendors", "Financial institutions"],
              },
              {
                iconKey: "cycle",
                title: "Perpetual Existence",
                desc: "The company continues irrespective of ownership changes.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Directors & Shareholders",
                items: [
                  "Minimum 2 Directors",
                  "Minimum 2 Shareholders (can be same persons)",
                ],
              },
              documents: [
                "PAN & Aadhaar (Indian nationals)",
                "Passport (for foreign nationals)",
                "Address proof",
                "Registered office address proof",
              ],
            },
            process: [
              "Name approval (RUN / SPICe+)",
              "Drafting MOA & AOA",
              "Filing incorporation documents with MCA",
              "Issue of DSC & DIN",
              "Certificate of Incorporation (COI)",
              "PAN, TAN & bank account support",
            ],
            processSummary: "Complete support. Zero confusion.",
            insightAdvantage: {
              intro: "We go beyond registration — this is where we truly stand out:",
              points: [
                "Structuring shareholding intelligently",
                "Advising on capital & compliance planning",
                "Aligning with tax efficiency strategies",
                "Preparing your business for funding & scalability",
              ],
            },
            commonMistakes: [
              "Incorrect shareholding structure",
              "Poorly drafted object clauses",
              "Future compliance complications",
              "Tax inefficiencies",
            ],
            postSupportTitle: "Post-Incorporation Support",
            postSupport: [
              "GST Registration",
              "Accounting & Compliance setup",
              "CFO Advisory Services",
              "ROC & Annual Filings",
            ],
            growthInsight: null,
            cta: {
              headline: "Start Your Company the Right Way",
              tagline: "Don't just register a company — build it strategically from Day 1.",
              buttonText: "Get Expert Guidance",
            },
          },

          /* ─────────────────────────────────────────────
             ONE PERSON COMPANY (OPC)
          ───────────────────────────────────────────── */
          {
            serviceId: "one-person-company",
            name: "One Person Company (OPC)",
            tagline: "Start Your Business with Full Control & Limited Liability",
            whyChoose: {
              heading: "Why Choose OPC?",
              paragraphs: [
                "A One Person Company (OPC) is the perfect structure for solo entrepreneurs who want the benefits of a company without needing partners.",
                "At Insight Consulting, we help you set up your OPC with clarity, compliance, and future scalability in mind.",
              ],
            },
            idealFor: [
              "Solo entrepreneurs starting independently",
              "Consultants & professionals",
              "Freelancers moving towards structured business",
              "Business owners who want full control",
            ],
            keyAdvantages: [
              {
                iconKey: "user",
                title: "Single Ownership",
                desc: "You can run the entire company as the sole owner.",
              },
              {
                iconKey: "shield",
                title: "Limited Liability",
                desc: "Your personal assets remain protected.",
              },
              {
                iconKey: "building",
                title: "Separate Legal Entity",
                desc: "Your business has its own identity — enhancing credibility.",
              },
              {
                iconKey: "award",
                title: "Better Recognition",
                desc: "More structured and trusted than proprietorship.",
              },
            ],
            importantNote:
              "Nominee Requirement: You must appoint one nominee who will take over in case of unforeseen circumstances.",
            requirements: {
              eligibility: {
                heading: "Eligibility",
                items: [
                  "Only Indian resident individual can form OPC",
                  "One person can incorporate only one OPC",
                ],
              },
              documents: [
                "PAN & Aadhaar",
                "Address proof",
                "Registered office proof",
                "Nominee details (PAN & Aadhaar)",
              ],
            },
            process: [
              "Name approval (SPICe+)",
              "Drafting MOA & AOA",
              "Filing incorporation with MCA",
              "DSC & DIN generation",
              "Certificate of Incorporation",
              "PAN, TAN & bank account support",
            ],
            processSummary: "Smooth. Structured. Fully guided.",
            insightAdvantage: {
              intro: "We go beyond just registration:",
              points: [
                "Advising whether OPC is right vs Pvt Ltd / Proprietorship",
                "Structuring your business for future conversion to Pvt Ltd",
                "Ensuring tax-efficient setup",
                "Providing ongoing compliance & CFO support",
              ],
            },
            commonMistakes: [
              "Choosing OPC when scalability needs Pvt Ltd",
              "Incorrect nominee selection",
              "Ignoring compliance requirements",
              "Poor planning for future conversion",
            ],
            postSupportTitle: "Post-Incorporation Support",
            postSupport: [
              "GST Registration",
              "Accounting & Compliance setup",
              "ROC filings",
              "Business structuring & CFO advisory",
            ],
            growthInsight: {
              heading: "Conversion Insight",
              description:
                "As your business grows, OPC can be converted into a Private Limited Company. We guide you on the right timing and approach.",
            },
            cta: {
              headline: "Start Your Business — Your Way",
              tagline: "Take full control with the right structure — without compromising on credibility.",
              buttonText: "Register Your OPC",
            },
          },

          /* ─────────────────────────────────────────────
             LIMITED LIABILITY PARTNERSHIP (LLP)
          ───────────────────────────────────────────── */
          {
            serviceId: "limited-liability-partnership",
            name: "Limited Liability Partnership (LLP)",
            tagline: "Flexibility of a Partnership with the Protection of a Company",
            whyChoose: {
              heading: "Why Choose an LLP?",
              paragraphs: [
                "A Limited Liability Partnership (LLP) offers the perfect balance between flexibility and legal protection — ideal for businesses that want shared ownership without heavy compliance burden.",
                "At Insight Consulting, we help you structure your LLP with clarity, compliance, and long-term efficiency.",
              ],
            },
            idealFor: [
              "Professional firms (CA, CS, Consultants, Architects)",
              "Small & medium businesses with multiple partners",
              "Family-run businesses transitioning to structured entities",
              "Entrepreneurs seeking low compliance + legal protection",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Limited Liability",
                desc: "Partners are not personally liable for business debts.",
              },
              {
                iconKey: "handshake",
                title: "Flexible Management",
                desc: "No rigid structure — partners can define roles and profit sharing.",
              },
              {
                iconKey: "reduce",
                title: "Lower Compliance",
                desc: "Compared to Private Limited Companies:",
                bullets: ["Fewer filings", "No mandatory audit (below threshold)"],
              },
              {
                iconKey: "cycle",
                title: "Separate Legal Entity",
                desc: "The LLP can own assets, enter contracts, and operate independently.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Partners",
                items: [
                  "Minimum 2 Partners",
                  "At least 2 Designated Partners (one must be resident in India)",
                ],
              },
              documents: [
                "PAN & Aadhaar (for Indian partners)",
                "Passport (for foreign nationals)",
                "Address proof",
                "Registered office proof",
              ],
            },
            process: [
              "Name reservation (RUN-LLP)",
              "Drafting LLP Agreement",
              "Filing incorporation with MCA",
              "DSC & DPIN allocation",
              "Certificate of Incorporation",
              "LLP Agreement filing",
            ],
            processSummary: "Simple. Structured. Fully managed.",
            insightAdvantage: {
              intro: "We go beyond basic registration:",
              points: [
                "Drafting a robust LLP Agreement (profit sharing, roles, exit clauses)",
                "Advising on tax efficiency & partner remuneration",
                "Structuring for risk protection & clarity",
                "Providing ongoing compliance & CFO support",
              ],
            },
            commonMistakes: [
              "Weak or generic LLP Agreement",
              "Unclear profit-sharing ratios",
              "Ignoring tax implications",
              "Compliance gaps leading to penalties",
            ],
            postSupportTitle: "Post-Incorporation Support",
            postSupport: [
              "GST Registration",
              "Accounting & compliance setup",
              "Annual filings (Form 8, Form 11)",
              "Partner structuring & financial advisory",
            ],
            growthInsight: null,
            cta: {
              headline: "Build Your Partnership the Right Way",
              tagline: "A strong partnership starts with the right structure and clear agreements.",
              buttonText: "Register Your LLP",
            },
          },

          /* ─────────────────────────────────────────────
             PARTNERSHIP FIRM
          ───────────────────────────────────────────── */
          {
            serviceId: "partnership-firm",
            name: "Partnership Firm",
            tagline: "Simple, Flexible & Relationship-Driven Business Structure",
            whyChoose: {
              heading: "Why Choose a Partnership Firm?",
              paragraphs: [
                "A Partnership Firm is one of the simplest and most flexible ways to start a business with two or more people.",
                "At Insight Consulting, we don't just register your partnership — we help you build clarity in roles, profits, and long-term business relationships.",
              ],
            },
            idealFor: [
              "Family-run businesses",
              "Small trading or service businesses",
              "Businesses built on trust and shared management",
              "Entrepreneurs looking for low-cost, easy setup",
            ],
            keyAdvantages: [
              {
                iconKey: "bolt",
                title: "Easy to Start",
                desc: "Minimal legal formalities and quick setup.",
              },
              {
                iconKey: "handshake",
                title: "Shared Responsibility",
                desc: "Partners can divide roles, responsibilities, and decision-making.",
              },
              {
                iconKey: "reduce",
                title: "Low Compliance",
                desc: "Compared to companies and LLPs:",
                bullets: ["Fewer filings", "Simple operational structure"],
              },
              {
                iconKey: "wallet",
                title: "Cost Effective",
                desc: "Lower registration and maintenance cost.",
              },
            ],
            importantNote:
              "Unlimited Liability: Partners are personally liable for business obligations — this is a key factor to evaluate before choosing this structure.",
            requirements: {
              eligibility: {
                heading: "Partners",
                items: [
                  "Minimum 2 Partners",
                  "Maximum as per practical feasibility",
                ],
              },
              documents: [
                "PAN & Aadhaar of partners",
                "Address proof",
                "Business place proof",
              ],
            },
            process: [
              "Drafting Partnership Deed (customized, not generic)",
              "Execution on stamp paper",
              "Registration with Registrar of Firms (optional but recommended)",
              "PAN application for firm",
              "Bank account setup support",
            ],
            processSummary: "Simple. Clear. Professionally structured.",
            insightAdvantage: {
              intro: "We go far beyond basic deed drafting:",
              points: [
                "Drafting a strong, customized partnership deed",
                "Clearly defining profit sharing, roles, and exit terms",
                "Advising on tax planning & remuneration structure",
                "Evaluating whether LLP or Pvt Ltd is a better alternative",
              ],
            },
            commonMistakes: [
              "Using generic partnership deed templates",
              "Undefined roles leading to disputes",
              "Ignoring tax implications",
              "Not registering the firm (impact on legal enforceability)",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "GST Registration",
              "Accounting setup",
              "Tax filings (ITR for firm & partners)",
              "Business structuring advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Many growing businesses start as partnerships — but as they scale, they may benefit from converting into an LLP or Private Limited Company. We guide you on the right timing and transition strategy.",
            },
            cta: {
              headline: "Build Strong Partnerships, Not Just Firms",
              tagline: "A well-structured partnership avoids future conflicts and enables smooth growth.",
              buttonText: "Register Your Partnership Firm",
            },
          },

          /* ─────────────────────────────────────────────
             PROPRIETORSHIP FIRM
          ───────────────────────────────────────────── */
          {
            serviceId: "proprietorship-firm",
            name: "Proprietorship Firm",
            tagline: "The Simplest Way to Start Your Business Journey",
            whyChoose: {
              heading: "Why Choose a Proprietorship?",
              paragraphs: [
                "A Proprietorship is the easiest and fastest way to start a business — ideal for individuals who want to begin with minimal cost and full control.",
                "At Insight Consulting, we don't just help you start — we ensure your business is structured for smooth compliance and future growth.",
              ],
            },
            idealFor: [
              "First-time entrepreneurs",
              "Freelancers & consultants",
              "Small traders & service providers",
              "Individuals testing a business idea",
            ],
            keyAdvantages: [
              {
                iconKey: "bolt",
                title: "Quick & Easy Setup",
                desc: "No formal incorporation required — start your business quickly.",
              },
              {
                iconKey: "user",
                title: "Complete Control",
                desc: "Single owner — full decision-making power.",
              },
              {
                iconKey: "wallet",
                title: "Low Cost",
                desc: "Minimal registration and compliance costs.",
              },
              {
                iconKey: "reduce",
                title: "Simple Compliance",
                desc: "Less regulatory burden compared to LLP or companies.",
              },
            ],
            importantNote:
              "Unlimited Liability: The owner is personally liable for all business obligations.",
            requirements: {
              eligibility: {
                heading: "How Proprietorship is Established",
                items: [
                  "There is no separate registration — your business is recognized through:",
                  "GST Registration (if applicable)",
                  "Shop & Establishment License",
                  "Udyam (MSME) Registration",
                  "Bank current account in business name",
                ],
              },
              documents: [
                "PAN & Aadhaar",
                "Address proof",
                "Business address proof",
                "Bank details",
              ],
            },
            process: [
              "Understanding your business model",
              "GST Registration (if required)",
              "Shop & Establishment registration",
              "Udyam Registration (MSME)",
              "Bank account setup support",
            ],
            processSummary: "Fast. Structured. Fully guided.",
            insightAdvantage: {
              intro: "We go beyond basic setup:",
              points: [
                "Advising whether proprietorship is right vs LLP / Pvt Ltd",
                "Structuring for tax efficiency from Day 1",
                "Setting up compliance-ready systems",
                "Guiding future conversion strategy as you grow",
              ],
            },
            commonMistakes: [
              "Starting without proper registrations",
              "Mixing personal & business finances",
              "Ignoring GST applicability",
              "Lack of structured accounting",
            ],
            postSupportTitle: "Post-Setup Support",
            postSupport: [
              "GST filings",
              "Accounting & bookkeeping",
              "Income tax returns",
              "CFO advisory for growth",
            ],
            growthInsight: {
              heading: "Growth Insight",
              description:
                "Many successful businesses begin as proprietorships — but as they scale, they may transition into:",
              weHelpYou: [
                "LLP",
                "Private Limited Company",
              ],
              closing: "We guide you on the right timing and structure shift.",
            },
            cta: {
              headline: "Start Small. Think Big.",
              tagline: "Every large business once started small — what matters is how you structure it from the beginning.",
              buttonText: "Start Your Proprietorship",
            },
          },
        ],
      },

      /* ── NGO & LEGAL REGISTRATION ── */
      {
        subCategoryId: "ngo-legal-registration",
        subCategoryName: "NGO & Legal Registration",
        services: [
          {
            serviceId: "12a-80g-registration",
            name: "12A & 80G Registration",
            tagline: "Unlock Tax Exemptions & Attract More Donors for Your NGO",
            whyChoose: {
              heading: "Why 12A & 80G Registration Is Essential",
              paragraphs: [
                "12A registration exempts your NGO from paying income tax on surplus income — ensuring more funds stay available for your programs. 80G certification allows donors to claim tax deductions on their contributions, making your NGO more attractive for fundraising.",
                "At Insight Consulting, we handle the entire filing process — documentation, application, and follow-up — so your NGO gets both registrations smoothly and efficiently.",
              ],
            },
            idealFor: [
              "Charitable Trusts & Societies",
              "Section 8 Companies",
              "NGOs seeking government grants",
              "Organizations planning CSR fundraising",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "NGO Tax Exemption (12A)",
                desc: "Income used for charitable purposes is not taxed — more funds for your mission.",
              },
              {
                iconKey: "trending",
                title: "Donor Tax Benefits (80G)",
                desc: "Donors can claim deductions, making your NGO more attractive for contributions.",
              },
              {
                iconKey: "building",
                title: "Enhanced Credibility",
                desc: "Both registrations signal compliance and transparency to donors and authorities.",
              },
              {
                iconKey: "wallet",
                title: "CSR Funding Eligibility",
                desc: "Often required for corporate CSR partnerships and institutional grants.",
              },
            ],
            importantNote:
              "80G can only be applied for after or along with 12A registration. Donations above ₹2,000 must be non-cash to qualify for deduction.",
            requirements: {
              eligibility: {
                heading: "Eligible NGO Structures",
                items: [
                  "Trust (under Indian Trusts Act)",
                  "Society (under Societies Registration Act)",
                  "Section 8 Company (under Companies Act, 2013)",
                  "Must have charitable objectives (education, medical, environment, etc.)",
                  "Income & profits must NOT be distributed to members or trustees",
                ],
              },
              documents: [
                "Trust deed / MOA / AOA (clearly stating charitable objectives)",
                "PAN card of the NGO",
                "Registration certificate",
                "Audited accounts & activity report",
                "Details of governing members",
              ],
            },
            process: [
              "Review of NGO structure & eligibility",
              "Documentation preparation & verification",
              "Filing 12A application with Income Tax Department",
              "Filing 80G application (simultaneously or after 12A)",
              "Follow-up with department & query resolution",
              "Receipt of approval orders",
            ],
            processSummary: "Smooth. Compliant. Fully guided.",
            insightAdvantage: {
              intro: "We go beyond just application filing:",
              points: [
                "Evaluating eligibility before filing to avoid rejection",
                "Drafting strong documentation aligned with IT requirements",
                "Strategic advice on fund utilization and compliance",
                "Ensuring 80G conditions are met for donor benefits",
              ],
            },
            commonMistakes: [
              "Filing without proper MOA / trust deed alignment",
              "Incomplete or mismatched documentation",
              "Applying for 80G without 12A in place",
              "Ignoring post-registration compliance requirements",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "Annual ITR-7 filing for NGO",
              "Compliance with 12A & 80G conditions",
              "Audit support & fund utilization tracking",
              "Renewal and advisory services",
            ],
            growthInsight: {
              heading: "Compliance Insight",
              description:
                "12A & 80G registrations are not permanent — they require periodic renewal and compliance. We help you maintain eligibility and stay audit-ready at all times.",
            },
            cta: {
              headline: "Maximize Your NGO's Impact",
              tagline: "Maximize your NGO's impact — start with the right registrations.",
              buttonText: "Register 12A & 80G",
            },
          },

          {
            serviceId: "ngo-darpan-registration",
            name: "NGO Darpan Registration",
            tagline: "Get Your NGO Listed with NITI Aayog — Access Government Grants & CSR Funding",
            whyChoose: {
              heading: "Why NGO Darpan Registration is Important",
              paragraphs: [
                "NGO Darpan is an online portal managed by NITI Aayog that creates a unique ID for NGOs. It acts as a gateway for NGOs to connect with Government departments and schemes.",
                "At Insight Consulting, we handle end-to-end NGO Darpan registration — from documentation to submission — ensuring your NGO is correctly listed and ready to access government opportunities.",
              ],
            },
            idealFor: [
              "NGOs applying for central government grants",
              "Trusts, Societies & Section 8 Companies",
              "NGOs seeking CSR partnerships",
              "Organizations working with government ministries",
            ],
            keyAdvantages: [
              {
                iconKey: "building",
                title: "Mandatory for Govt Grants",
                desc: "Required to apply for central government funding and ministry schemes.",
              },
              {
                iconKey: "award",
                title: "Unique Darpan ID",
                desc: "Official identification for government communication and partnerships.",
              },
              {
                iconKey: "shield",
                title: "Enhanced Credibility",
                desc: "Listed with Government of India — builds trust with donors and partners.",
              },
              {
                iconKey: "trending",
                title: "Access to Opportunities",
                desc: "Enables NGO to apply for grants, CSR partnerships, and government projects.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Eligible Entities",
                items: [
                  "Trust / Society / Section 8 Company",
                  "Must have valid PAN card",
                  "Registration certificate required",
                  "Digital Signature Certificate (DSC) required",
                  "Details of governing members",
                ],
              },
              documents: [
                "PAN card of NGO",
                "Registration certificate",
                "Governing body / trustee details",
                "Digital Signature Certificate (DSC)",
                "Bank account details",
              ],
            },
            process: [
              "Verification of NGO structure and documents",
              "DSC arrangement (if not available)",
              "Portal registration on NGO Darpan",
              "Filing of NGO details and governing member information",
              "Unique ID allotment and confirmation",
            ],
            processSummary: "Simple. Structured. Government-ready.",
            insightAdvantage: {
              intro: "We go beyond basic registration:",
              points: [
                "Ensuring correct and complete documentation",
                "Arranging DSC if not already available",
                "Aligning NGO profile for maximum grant eligibility",
                "Advisory on post-registration government scheme access",
              ],
            },
            commonMistakes: [
              "Incorrect governing member details",
              "Missing DSC causing registration failure",
              "Incomplete NGO activity information",
              "Not updating Darpan profile after organizational changes",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "12A & 80G registration assistance",
              "Government grant application support",
              "CSR partnership advisory",
              "Annual compliance & ITR filing",
            ],
            growthInsight: null,
            cta: {
              headline: "Get Your NGO Recognised — Connect with Government",
              tagline: "Your NGO's gateway to government support starts with Darpan registration.",
              buttonText: "Register on NGO Darpan",
            },
          },

          {
            serviceId: "digital-signature-certificate",
            name: "Digital Signature Certificate (DSC)",
            tagline: "Secure, Legal & Mandatory — Get Your DSC Issued Quickly",
            whyChoose: {
              heading: "Why DSC is Important for NGOs & Businesses",
              paragraphs: [
                "A Digital Signature Certificate (DSC) is an electronic form of signature used to sign documents digitally and authenticate identity online. It is issued by government-authorized agencies under the framework of the Information Technology Act, 2000.",
                "At Insight Consulting, we assist in quick and error-free DSC procurement — handling documentation, verification, and token issuance with minimal hassle.",
              ],
            },
            idealFor: [
              "Company directors & LLP partners",
              "NGO trustees & authorized signatories",
              "Professionals filing ITR / GST",
              "Businesses participating in government tenders",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Legally Valid",
                desc: "Recognized like a handwritten signature under Indian law.",
              },
              {
                iconKey: "bolt",
                title: "Mandatory for Compliance",
                desc: "Required for MCA, Income Tax, GST, 12A/80G, and tender filings.",
              },
              {
                iconKey: "cycle",
                title: "Fully Online",
                desc: "No physical paperwork — approvals and filings done digitally.",
              },
              {
                iconKey: "award",
                title: "Secure & Authentic",
                desc: "Ensures data integrity and prevents unauthorized document signing.",
              },
            ],
            importantNote:
              "Class 3 DSC requires video verification and OTP authentication. Name in PAN, Aadhaar, and application must match exactly.",
            requirements: {
              eligibility: {
                heading: "DSC Types We Offer",
                items: [
                  "Class 3 DSC — for MCA, Income Tax, NGO registrations, tenders",
                  "Individual DSC — for personal filings",
                  "Organization DSC — for authorized signatories of NGOs / companies",
                  "Validity: 1–3 years",
                ],
              },
              documents: [
                "PAN Card (mandatory)",
                "Aadhaar Card (for address proof)",
                "Passport-size photograph",
                "Active email ID & mobile number",
                "Certificate of Incorporation / Authorization letter (for organizations)",
              ],
            },
            process: [
              "Understanding applicant type (individual / organization)",
              "Document collection and verification",
              "Application filing with DSC authority",
              "Video verification / Aadhaar OTP authentication",
              "USB token issuance with DSC",
            ],
            processSummary: "Quick. Secure. Fully guided.",
            insightAdvantage: {
              intro: "We go beyond basic procurement:",
              points: [
                "Ensuring PAN, Aadhaar and application details match exactly",
                "Assisting with video verification process",
                "Handling organization DSC with board resolution support",
                "Advisory on DSC usage across compliance filings",
              ],
            },
            commonMistakes: [
              "Mismatch in name across PAN, Aadhaar, and application",
              "Using incorrect mobile number (not Aadhaar-linked)",
              "Choosing wrong DSC class for the intended purpose",
              "Delays due to incomplete documentation",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "DSC usage guidance for MCA / GST filings",
              "Renewal reminders and support",
              "Integration with compliance filings",
              "Advisory on director and signatory DSC management",
            ],
            growthInsight: null,
            cta: {
              headline: "Get DSC Ready — File with Confidence",
              tagline: "A valid DSC is your digital key to compliance — get it right from the start.",
              buttonText: "Apply for DSC",
            },
          },

          {
            serviceId: "udyam-registration",
            name: "Udyam Registration (MSME)",
            tagline: "Unlock Government Benefits, Subsidies & Financial Support for Your Business",
            whyChoose: {
              heading: "Why Udyam Registration Is Required",
              paragraphs: [
                "Udyam Registration is not just a certificate — it is your gateway to credibility, funding, and government-backed growth opportunities.",
                "At Insight Consulting, we don't just register your business — we ensure you are strategically positioned to leverage every MSME benefit available.",
              ],
            },
            idealForHeading: "Who Should Register?",
            idealFor: [
              "Manufacturers",
              "Service providers",
              "Traders",
              "Startups & growing enterprises",
            ],
            keyAdvantages: [
              {
                iconKey: "wallet",
                title: "Financial Advantages",
                desc: "Collateral-free loans, lower interest rates, and easier working capital access.",
              },
              {
                iconKey: "building",
                title: "Government Support",
                desc: "Subsidies, incentives, and priority in government tenders.",
              },
              {
                iconKey: "shield",
                title: "MSME Act Protection",
                desc: "Legal protection against delayed payments from buyers.",
              },
              {
                iconKey: "trending",
                title: "Business Growth",
                desc: "Enhanced credibility with banks, clients, and access to grants & schemes.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "MSME Classification",
                items: [
                  "Micro: Investment up to ₹1 Cr, Turnover up to ₹5 Cr",
                  "Small: Investment up to ₹10 Cr, Turnover up to ₹50 Cr",
                  "Medium: Investment up to ₹50 Cr, Turnover up to ₹250 Cr",
                  "Applicable to: Proprietorship, Partnership, LLP, Private Limited, etc.",
                ],
              },
              documents: [
                "Aadhaar number of owner / authorized person",
                "PAN details of business entity",
                "Basic business information (nature, address, bank details)",
              ],
            },
            process: [
              "Understanding your business structure and classification",
              "Identifying correct MSME category (Micro / Small / Medium)",
              "Accurate application filing on Udyam portal",
              "Registration and certificate issuance",
              "Post-registration advisory on benefit utilization",
            ],
            processSummary: "Fast. Accurate. Benefit-focused.",
            insightAdvantage: {
              intro: "We go beyond just registration:",
              points: [
                "Correct MSME classification to maximize benefit eligibility",
                "Advisory on schemes and subsidies applicable to your business",
                "Alignment with GST and tax registrations",
                "Post-registration support to leverage MSME status",
              ],
            },
            commonMistakes: [
              "Incorrect MSME classification affecting benefit eligibility",
              "Using wrong Aadhaar details for registration",
              "Not updating Udyam certificate when business grows",
              "Missing post-registration advisory on available benefits",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "GST registration",
              "Accounting & compliance setup",
              "MSME scheme & subsidy advisory",
              "CFO advisory for scaling businesses",
            ],
            growthInsight: {
              heading: "Growth Insight",
              description:
                "As your business grows and crosses MSME thresholds, your registration category and benefits change. We guide you on timely updates and transitions to maximize your positioning.",
            },
            cta: {
              headline: "Register for Udyam — Unlock MSME Benefits",
              tagline: "Every registered MSME gains a competitive edge — don't leave benefits on the table.",
              buttonText: "Register for Udyam",
            },
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CATEGORY 2: GST
  ═══════════════════════════════════════════════════════ */
  {
    categoryId: "gst",
    categoryName: "GST",
    subcategories: [
      {
        subCategoryId: "gst-registration",
        subCategoryName: "GST Registration",
        services: [
          {
            serviceId: "gst-registration",
            name: "GST Registration",
            tagline: "Stay Compliant. Build Credibility. Enable Seamless Business Growth.",
            whyChoose: {
              heading: "Why GST Registration Matters",
              paragraphs: [
                "GST registration is not just a legal requirement — it is a critical step in building a compliant, scalable, and credible business.",
                "At Insight Consulting, we ensure your GST setup is accurate, strategic, and aligned with your business model.",
              ],
            },
            idealForHeading: "Who Needs GST Registration?",
            idealFor: [
              "Businesses with turnover exceeding ₹40L (Goods) / ₹20L (Services)",
              "E-commerce sellers",
              "Businesses making interstate supply of goods",
              "Input Service Distributors & reverse charge entities",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Legal Compliance",
                desc: "Operate your business without regulatory risks.",
              },
              {
                iconKey: "wallet",
                title: "Input Tax Credit (ITC)",
                desc: "Reduce your tax cost by claiming eligible credits.",
              },
              {
                iconKey: "building",
                title: "Business Credibility",
                desc: "Enhance trust with customers, vendors, and institutions.",
              },
              {
                iconKey: "trending",
                title: "Expansion Opportunities",
                desc: "Sell across India without restrictions.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Who Needs GST Registration",
                items: [
                  "Turnover exceeding ₹40 Lakhs (Goods) or ₹20 Lakhs (Services)",
                  "₹10 Lakhs threshold for special category states",
                  "Interstate supply of goods (regardless of turnover)",
                  "E-commerce sellers and aggregators",
                  "Entities liable under reverse charge mechanism",
                ],
              },
              documents: [
                "PAN & Aadhaar (for proprietorship)",
                "PAN of entity + Certificate of Incorporation / Partnership Deed",
                "Address proof of business",
                "Bank details",
                "Authorized signatory details",
              ],
            },
            process: [
              "Business model understanding & GST applicability evaluation",
              "Selection of registration type (Regular vs Composition)",
              "Accurate application filing on GST portal",
              "Aadhaar authentication / verification",
              "GSTIN allotment",
              "Post-registration guidance on returns & compliance",
            ],
            processSummary: "Smooth. Compliant. Hassle-free.",
            insightAdvantage: {
              intro: "We go beyond basic registration:",
              points: [
                "Correct GST structure (Regular vs Composition)",
                "Proper HSN/SAC classification",
                "Input Tax Credit eligibility planning",
                "Alignment with your financial & operational model",
              ],
            },
            commonMistakes: [
              "Wrong registration type (composition vs regular)",
              "Incorrect business classification",
              "Incomplete or mismatched documentation",
              "Future compliance complications",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "GST return filing (GSTR-1, GSTR-3B, etc.)",
              "Input Tax Credit reconciliation",
              "GST audits & notices handling",
              "Ongoing compliance & advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "GST is not just about compliance — it directly impacts your:",
              weHelpYou: [
                "Pricing strategy",
                "Working capital",
                "Profitability",
              ],
              closing: "We help you use GST as a business advantage — not just a tax obligation.",
            },
            cta: {
              headline: "Get GST Ready the Right Way",
              tagline: "Avoid errors. Save taxes. Build a compliant business.",
              buttonText: "Register for GST",
            },
          },

          {
            serviceId: "gst-registration-foreigners",
            name: "GST Registration for Foreigners",
            tagline: "Seamless Compliance for Non-Resident Businesses Entering India",
            whyChoose: {
              heading: "Expanding Into India? Start with GST Compliance",
              paragraphs: [
                "If you are a foreign business or individual supplying goods or services in India, GST registration is mandatory before commencing operations.",
                "At Insight Consulting, we simplify the process and ensure you are fully compliant, structured, and ready to operate in India without delays.",
              ],
            },
            idealForHeading: "Who Needs This?",
            idealFor: [
              "Foreign companies supplying goods/services in India",
              "Non-resident individuals conducting business in India",
              "Businesses participating in exhibitions or trade fairs",
              "Short-term project operators in India",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Mandatory Compliance",
                desc: "No threshold exemption — registration required before starting business.",
              },
              {
                iconKey: "cycle",
                title: "Temporary Registration",
                desc: "Valid for 90 days, extendable for the period of operations.",
              },
              {
                iconKey: "wallet",
                title: "Advance Tax Management",
                desc: "We assist in correct computation and payment of advance GST.",
              },
              {
                iconKey: "building",
                title: "India Market Access",
                desc: "Proper GST setup ensures smooth operations in the Indian market.",
              },
            ],
            importantNote:
              "A local authorized representative in India is compulsory for Non-Resident Taxable Person (NRTP) GST registration.",
            requirements: {
              eligibility: {
                heading: "Who Needs This",
                items: [
                  "Non-Resident Taxable Person (NRTP) category applies",
                  "Must appoint an authorized signatory resident in India",
                  "Advance GST payment required based on estimated turnover",
                ],
              },
              documents: [
                "Passport (for foreign individuals)",
                "TIN / Company registration certificate (for entities)",
                "Proof of business address in India",
                "Bank account details (if available)",
                "PAN & Aadhaar of Indian authorized signatory",
                "Authorization letter",
              ],
            },
            process: [
              "Understanding your business model in India",
              "Appointment of authorized Indian signatory",
              "GST application filing (NRTP category)",
              "Assistance in advance tax computation and payment",
              "GSTIN allotment",
              "Ongoing compliance & return filing support",
            ],
            processSummary: "Smooth entry into India. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond registration:",
              points: [
                "Structuring your India entry from a tax perspective",
                "Ensuring correct GST positioning (NRTP vs normal registration)",
                "Advising on pricing, tax impact, and compliance strategy",
                "Supporting end-to-end GST compliance during your India operations",
              ],
            },
            commonMistakes: [
              "Delayed registration before starting operations",
              "Incorrect classification of registration type",
              "Non-payment of advance GST",
              "Non-compliance with return filing timelines",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "GST return filing (GSTR-5 for NRTP)",
              "Tax payment & reconciliation",
              "Advisory on permanent business setup in India",
              "Transition to regular GST registration (if applicable)",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "If your presence in India becomes long-term, it may be beneficial to:",
              weHelpYou: [
                "Set up an Indian entity (Private Limited / LLP)",
                "Shift from temporary GST registration to regular registration",
              ],
              closing: "We guide you on the right structure for long-term operations.",
            },
            cta: {
              headline: "Enter the Indian Market with Confidence",
              tagline: "Avoid compliance risks and operational delays — get your GST registration done right from Day 1.",
              buttonText: "Get GST as a Foreign Entity",
            },
          },

          {
            serviceId: "virtual-office-gst",
            name: "Virtual Office + GST Registration",
            tagline: "Establish Your Business Presence Anywhere — Without the Cost of a Physical Office",
            whyChoose: {
              heading: "Expand Your Business Without Expanding Costs",
              paragraphs: [
                "A Virtual Office allows you to legally use a premium business address for GST registration — without renting a full-fledged office.",
                "At Insight Consulting, we provide compliant virtual office solutions along with GST registration, ensuring your business is legally structured and operational from Day 1.",
              ],
            },
            idealFor: [
              "Startups and new businesses",
              "Businesses expanding to new cities",
              "E-commerce sellers",
              "Service providers working remotely",
              "Companies needing multi-state GST registration",
            ],
            keyAdvantages: [
              {
                iconKey: "building",
                title: "Premium Business Address",
                desc: "Use a recognized commercial address for GST and official communication.",
              },
              {
                iconKey: "shield",
                title: "GST Compliant Setup",
                desc: "Fully compliant documentation — address proof, NOC, and agreement.",
              },
              {
                iconKey: "wallet",
                title: "Cost Effective",
                desc: "Establish business presence in metro cities without heavy overhead.",
              },
              {
                iconKey: "trending",
                title: "Multi-State Expansion",
                desc: "Expand to multiple states for GST without physical offices.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Applicable Business Types",
                items: [
                  "Proprietorship — PAN & Aadhaar",
                  "Companies / LLP / Firms — PAN, incorporation documents, signatory details",
                  "Virtual office agreement must be GST-compliant",
                ],
              },
              documents: [
                "PAN & Aadhaar (for proprietorship)",
                "PAN of entity + incorporation documents (for companies/LLP)",
                "Authorized signatory details",
                "Virtual office agreement",
                "NOC from property owner",
                "Utility bill of virtual office address",
              ],
            },
            process: [
              "Selection of virtual office location (strategic advice included)",
              "Documentation — agreement, NOC, utility proof",
              "GST application filing",
              "Aadhaar authentication / verification",
              "GSTIN allotment",
              "Post-registration compliance support",
            ],
            processSummary: "Seamless. Compliant. Business-ready.",
            insightAdvantage: {
              intro: "We ensure your setup is not just convenient — but also compliant:",
              points: [
                "GST-compliant documentation (critical for approval)",
                "Strategic advice on location selection (state-wise GST impact)",
                "End-to-end registration & compliance support",
                "Avoidance of GST rejection risks",
              ],
            },
            commonMistakes: [
              "Using non-compliant addresses",
              "Missing NOC or improper agreements",
              "GST rejection due to documentation issues",
              "Choosing wrong state for registration",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "GST return filing",
              "Multi-state compliance management",
              "E-commerce platform compliance support",
              "Ongoing GST advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Your business address impacts:",
              weHelpYou: [
                "GST jurisdiction",
                "Compliance requirements",
                "Business perception",
              ],
              closing: "We help you choose the right location strategically — not just conveniently.",
            },
            cta: {
              headline: "Start Anywhere. Grow Everywhere.",
              tagline: "Set up your business presence without heavy overheads — the smart way.",
              buttonText: "Set Up Virtual Office + GST",
            },
          },
        ],
      },

      {
        subCategoryId: "gst-compliance",
        subCategoryName: "GST Compliance",
        services: [
          {
            serviceId: "gst-amendment",
            name: "GST Amendment Services",
            tagline: "Keep Your GST Registration Accurate, Compliant & Business-Ready",
            whyChoose: {
              heading: "Why GST Amendments Matter",
              paragraphs: [
                "Your GST registration is not a one-time activity — it must evolve with your business. Changes in business details, structure, or operations require timely updates in GST records to avoid penalties, disruptions, and compliance risks.",
                "At Insight Consulting, we ensure your GST data is always accurate, updated, and aligned with your business reality.",
              ],
            },
            idealFor: [
              "Businesses changing name, address, or activity",
              "Companies with director or partner changes",
              "Businesses updating bank details or contact information",
              "Any GST-registered entity with changed business details",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Compliance Issues",
                desc: "Incorrect GST details can lead to notices, penalties, or cancellation risks.",
              },
              {
                iconKey: "cycle",
                title: "Smooth Operations",
                desc: "Accurate data prevents mismatches in e-invoicing, e-way bills, and ITC claims.",
              },
              {
                iconKey: "building",
                title: "Business Credibility",
                desc: "Accurate GST records build trust with customers, vendors, and authorities.",
              },
              {
                iconKey: "bolt",
                title: "Quick & Accurate",
                desc: "We identify amendment type and handle the process end-to-end.",
              },
            ],
            importantNote:
              "Core amendments (name, address, directors) require departmental approval, while non-core changes (bank, contact details) are auto-approved.",
            requirements: {
              eligibility: {
                heading: "Amendment Types",
                items: [
                  "Core changes — business name, place of business, partners/directors, authorized signatory",
                  "Non-core changes — bank details, additional place of business, contact details",
                ],
              },
              documents: [
                "Address change: rental agreement, NOC, utility bill",
                "Director/Partner change: PAN, Aadhaar, photograph, board resolution",
                "Bank change: cancelled cheque or bank proof",
              ],
            },
            process: [
              "Understanding the required amendment type",
              "Document verification and preparation",
              "Filing amendment application on GST portal",
              "OTP / verification handling",
              "Follow-up with GST department (if approval required)",
              "Amendment completion & confirmation",
            ],
            processSummary: "Quick. Accurate. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond form filing:",
              points: [
                "Identify whether change is core vs non-core",
                "Ensure supporting documents are error-free",
                "Prevent future compliance risks & notices",
                "Align amendments with your overall tax & business structure",
              ],
            },
            commonMistakes: [
              "Delay in updating GST details",
              "Incorrect document submission",
              "Wrong classification of amendment type",
              "Ignoring impact on GST returns & ITC",
            ],
            postSupportTitle: "Post-Amendment Support",
            postSupport: [
              "Updating changes in GST returns",
              "Ensuring ITC continuity",
              "Advisory on compliance impact",
              "Handling any notices or queries",
            ],
            growthInsight: null,
            cta: {
              headline: "Keep Your GST Clean & Compliant",
              tagline: "Outdated GST data can cost you — update it the right way, at the right time.",
              buttonText: "Amend GST Registration",
            },
          },

          {
            serviceId: "gst-revocation",
            name: "GST Revocation of Cancellation",
            tagline: "Restore Your GST Registration. Resume Business Without Disruption.",
            whyChoose: {
              heading: "GST Cancelled? Don't Panic — Act Fast",
              paragraphs: [
                "GST registration may get cancelled due to non-compliance, non-filing of returns, or other procedural issues. The good news? You can restore your GST registration through revocation — if handled correctly and within timelines.",
                "At Insight Consulting, we specialize in quick, compliant, and strategic revocation support to get your business back on track.",
              ],
            },
            idealForHeading: "Common Reasons for GST Cancellation",
            idealFor: [
              "Businesses with cancelled GST due to non-filing",
              "GST cancelled voluntarily but now required again",
              "Entities facing departmental cancellation",
              "Businesses needing urgent restoration",
            ],
            keyAdvantages: [
              {
                iconKey: "cycle",
                title: "Resume Operations",
                desc: "Without GST, you cannot issue valid invoices or claim Input Tax Credit.",
              },
              {
                iconKey: "shield",
                title: "Avoid Further Loss",
                desc: "Cancellation leads to customer loss, vendor restrictions, and penalties.",
              },
              {
                iconKey: "building",
                title: "Restore Credibility",
                desc: "Active GST status is crucial for business trust and operations.",
              },
              {
                iconKey: "trending",
                title: "Strategic Revival",
                desc: "We not only restore but strengthen compliance to prevent future issues.",
              },
            ],
            importantNote:
              "Application must be filed within 30 days from the date of cancellation order. Extension may be possible with proper justification.",
            requirements: {
              eligibility: {
                heading: "Before Filing Revocation",
                items: [
                  "All pending GST returns must be filed",
                  "Outstanding tax, interest, and late fees must be paid",
                  "Proper explanation for cancellation required",
                  "Supporting documents as required by department",
                ],
              },
              documents: [
                "GST cancellation order",
                "Filed GST returns (all pending)",
                "Tax payment challans",
                "Explanation letter for cancellation reason",
              ],
            },
            process: [
              "Diagnosis of cancellation reason",
              "Filing all pending returns & liability computation",
              "Payment of tax, interest, and penalty dues",
              "Filing revocation application on GST portal",
              "Drafting reply to GST officer (if notice issued)",
              "Follow-up until GST is restored",
            ],
            processSummary: "Fast action. Strong representation. Successful revival.",
            insightAdvantage: {
              intro: "We go beyond application filing:",
              points: [
                "Strategic handling of notices & replies",
                "Ensuring complete compliance before submission",
                "Reducing risk of rejection or further queries",
                "Advisory to prevent future cancellations",
              ],
            },
            commonMistakes: [
              "Delayed application beyond time limit",
              "Filing revocation without clearing pending returns",
              "Weak or incorrect explanation to department",
              "Ignoring follow-ups with GST officer",
            ],
            postSupportTitle: "Post-Revocation Support",
            postSupport: [
              "GST return filing regularization",
              "Compliance calendar setup",
              "ITC reconciliation",
              "Ongoing GST advisory",
            ],
            growthInsight: null,
            cta: {
              headline: "Get Your GST Back — Quickly & Correctly",
              tagline: "Every day matters when your GST is cancelled.",
              buttonText: "Apply for GST Revocation",
            },
          },

          {
            serviceId: "gst-notice-response",
            name: "GST Notice Response & Representation",
            tagline: "Handle GST Notices with Confidence, Clarity & Expert Support",
            whyChoose: {
              heading: "Received a GST Notice? Stay Calm — Respond Smartly",
              paragraphs: [
                "A GST notice does not always mean a penalty — but how you respond determines the outcome.",
                "At Insight Consulting, we ensure your response is accurate, well-drafted, and strategically positioned to protect your business.",
              ],
            },
            idealForHeading: "Received a GST Notice?",
            idealFor: [
              "Businesses receiving GST show cause notices",
              "Entities with ITC mismatch or excess ITC claims",
              "Businesses with differences in returns vs IT data",
              "Cases involving e-way bill or e-invoice discrepancies",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Penalties & Litigation",
                desc: "Incorrect or delayed replies lead to penalties, interest, and cancellation.",
              },
              {
                iconKey: "wallet",
                title: "Protect ITC & Cash Flow",
                desc: "Improper handling may result in denial of Input Tax Credit.",
              },
              {
                iconKey: "building",
                title: "Maintain Compliance Record",
                desc: "A strong response builds your credibility with tax authorities.",
              },
              {
                iconKey: "award",
                title: "Expert Representation",
                desc: "We appear before GST officers on your behalf when required.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Common Notice Types We Handle",
                items: [
                  "Non-filing of returns (GSTR-3B / GSTR-1)",
                  "Mismatch in Input Tax Credit (ITC)",
                  "Excess ITC claim",
                  "Difference between GST returns & Income Tax data",
                  "E-way bill / e-invoice discrepancies",
                  "Show Cause Notices (SCN)",
                ],
              },
              documents: [
                "Copy of GST notice",
                "Relevant GST returns & documents",
                "Invoices and supporting records",
                "Any prior correspondence with GST department",
              ],
            },
            process: [
              "Detailed analysis of the notice",
              "Identification of issue & risk exposure",
              "Drafting a strong, compliant response",
              "Submission on GST portal",
              "Representation before GST officer (if required)",
              "Closure tracking & follow-up",
            ],
            processSummary: "Structured. Strategic. Result-oriented.",
            insightAdvantage: {
              intro: "We don't just reply — we defend your position effectively:",
              points: [
                "Strong technical interpretation of GST law",
                "Well-drafted, legally sound responses",
                "Strategic approach to minimize tax exposure",
                "Experience in handling complex GST notices",
              ],
            },
            commonMistakes: [
              "Ignoring or delaying notice response",
              "Submitting incomplete or incorrect replies",
              "Not addressing the root issue",
              "Lack of proper documentation",
            ],
            postSupportTitle: "Post-Notice Support",
            postSupport: [
              "Rectification of errors in returns",
              "ITC reconciliation",
              "Compliance system strengthening",
              "Ongoing GST advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "A GST notice is not just a compliance issue — it's an opportunity to:",
              weHelpYou: [
                "Identify gaps",
                "Strengthen processes",
                "Improve financial discipline",
              ],
              closing: "We help you turn a risk into a structured improvement.",
            },
            cta: {
              headline: "Respond Right. Stay Protected.",
              tagline: "Don't let a GST notice disrupt your business.",
              buttonText: "Get Expert GST Notice Help",
            },
          },

          {
            serviceId: "gst-return-filing",
            name: "GST Return Filing",
            tagline: "Accurate Filing. Timely Compliance. Better Cash Flow Management.",
            whyChoose: {
              heading: "GST Returns — More Than Just Filing",
              paragraphs: [
                "GST return filing is not just a routine task — it directly impacts your tax liability, input tax credit (ITC), and working capital.",
                "At Insight Consulting, we ensure your GST returns are accurate, optimized, and strategically aligned with your business operations.",
              ],
            },
            idealForHeading: "Who Needs GST Return Filing?",
            idealFor: [
              "All GST-registered businesses",
              "Businesses wanting to maximize ITC claims",
              "Companies needing accurate monthly/quarterly filing",
              "Businesses with complex supply chains",
            ],
            keyAdvantages: [
              {
                iconKey: "wallet",
                title: "Maximize Input Tax Credit",
                desc: "Ensure eligible ITC is claimed without future reversals.",
              },
              {
                iconKey: "shield",
                title: "Avoid Penalties & Notices",
                desc: "Late or incorrect filing leads to late fees, interest, and GST notices.",
              },
              {
                iconKey: "trending",
                title: "Accurate Financial Reporting",
                desc: "GST data directly affects profitability and business decisions.",
              },
              {
                iconKey: "cycle",
                title: "Full Return Coverage",
                desc: "GSTR-1, GSTR-3B, GSTR-9/9C, GSTR-5, GSTR-6/7/8 — all handled.",
              },
            ],
            importantNote: null,
            formsHandled: {
              heading: "Types of GST Returns We Handle",
              items: [
                "GSTR-1 – Outward supplies (sales)",
                "GSTR-3B – Monthly summary return",
                "GSTR-9 / 9C – Annual return & reconciliation",
                "GSTR-5 – For non-resident taxpayers",
                "GSTR-6 / 7 / 8 – Specialized returns (ISD, TDS, e-commerce)",
              ],
              note: "Complete coverage for all GST return requirements.",
            },
            requirements: {
              eligibility: {
                heading: "Returns We Handle",
                items: [
                  "GSTR-1 — Outward supplies (sales)",
                  "GSTR-3B — Monthly summary return",
                  "GSTR-9 / 9C — Annual return & reconciliation",
                  "GSTR-5 — For non-resident taxpayers",
                  "GSTR-6 / 7 / 8 — Specialized returns (ISD, TDS, e-commerce)",
                ],
              },
              documents: [
                "Sales invoices",
                "Purchase invoices",
                "Expense details",
                "Bank statements (if required)",
                "Previous GST returns",
              ],
            },
            process: [
              "Data collection & validation",
              "Reconciliation (Sales vs Returns vs Books)",
              "ITC eligibility review",
              "Return preparation",
              "Filing on GST portal",
              "Payment advisory (if tax payable)",
            ],
            processSummary: "Accurate. Timely. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond basic filing:",
              points: [
                "Detailed GST reconciliation",
                "ITC optimization & risk control",
                "Identification of mismatches before filing",
                "Alignment with income tax & financials",
              ],
            },
            commonMistakes: [
              "Incorrect ITC claims",
              "Mismatch between GSTR-1 & 3B",
              "Ignoring vendor compliance (affecting ITC)",
              "Delayed filing leading to penalties",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "ITC reconciliation (GSTR-2B vs Books)",
              "GST notices handling",
              "Annual return preparation",
              "Ongoing GST advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "GST returns are not just compliance — they are a financial control tool.",
              listPrefix: "We help you use GST data to:",
              weHelpYou: [
                "Improve cash flow",
                "Control tax leakage",
                "Strengthen financial discipline",
              ],
            },
            cta: {
              headline: "Stay Compliant. Stay Confident.",
              tagline: "Avoid errors, save taxes, and keep your business running smoothly.",
              buttonText: "File GST Returns",
            },
          },

          {
            serviceId: "gst-lut-filing",
            name: "GST LUT Filing",
            tagline: "Export Without Paying GST — Improve Your Cash Flow",
            whyChoose: {
              heading: "What is LUT & Why It Matters",
              paragraphs: [
                "If you are an exporter of goods or services, filing a Letter of Undertaking (LUT) allows you to export without paying GST upfront — no blocking of working capital, no need to claim refunds later.",
                "At Insight Consulting, we ensure your LUT is filed correctly and on time — so your exports remain smooth and tax-efficient.",
              ],
            },
            idealForHeading: "Who Should File LUT?",
            idealFor: [
              "Exporters of goods and services",
              "Businesses supplying to SEZ units or developers",
              "IT and service companies with foreign clients",
              "Businesses making zero-rated supplies under GST",
            ],
            keyAdvantages: [
              {
                iconKey: "wallet",
                title: "No GST on Exports",
                desc: "Export without paying IGST upfront — preserve your working capital.",
              },
              {
                iconKey: "bolt",
                title: "Faster Operations",
                desc: "Avoid delays caused by GST refund processes.",
              },
              {
                iconKey: "reduce",
                title: "Reduced Compliance Burden",
                desc: "No need to track and claim large GST refunds.",
              },
              {
                iconKey: "cycle",
                title: "Annual Renewal",
                desc: "Valid for one financial year — we handle timely renewal.",
              },
            ],
            importantNote:
              "LUT must be filed before commencing exports. It is valid for one financial year and must be renewed annually.",
            requirements: {
              eligibility: {
                heading: "Who Should File LUT",
                items: [
                  "Exporters of goods and services",
                  "Businesses supplying to SEZ units / developers",
                  "Applicable for zero-rated supplies under GST",
                ],
              },
              documents: [
                "GST registration details",
                "PAN of business",
                "Previous LUT (if renewal)",
                "Basic export details",
              ],
            },
            process: [
              "Eligibility check for LUT",
              "Preparation of LUT application",
              "Filing on GST portal",
              "Acknowledgment generation",
              "Annual renewal reminders and support",
            ],
            processSummary: "Quick filing. Zero errors. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond just filing:",
              points: [
                "Ensure continuous LUT validity (no business disruption)",
                "Align LUT with your export and GST strategy",
                "Guide on export documentation & compliance",
                "Support in case of department queries",
              ],
            },
            commonMistakes: [
              "Missing annual LUT renewal",
              "Filing LUT after starting exports (risk of tax liability)",
              "Incorrect understanding of zero-rated supplies",
              "Not aligning LUT with export documentation",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Export GST compliance guidance",
              "Refund advisory (if applicable)",
              "GST return alignment for exports",
              "Ongoing GST advisory",
            ],
            growthInsight: null,
            cta: {
              headline: "Export Smart. Stay Efficient.",
              tagline: "Don't block your funds unnecessarily — use LUT the right way.",
              buttonText: "File GST LUT",
            },
          },

          {
            serviceId: "gst-annual-return",
            name: "GST Annual Return (GSTR-9 & 9C)",
            tagline: "Close Your GST Year with Accuracy, Compliance & Confidence",
            whyChoose: {
              heading: "Why GST Annual Return is Critical",
              paragraphs: [
                "GST Annual Return is not just a compliance formality — it is a complete financial reconciliation of your business under GST. It validates your turnover, tax payments, Input Tax Credit, and compliance accuracy across the year.",
                "At Insight Consulting, we ensure your annual return is accurate, reconciled, and risk-free.",
              ],
            },
            idealFor: [
              "All GST-registered regular taxpayers",
              "Businesses with turnover above GSTR-9C threshold",
              "Companies wanting full-year GST reconciliation",
              "Businesses preparing for audits or due diligence",
            ],
            keyAdvantages: [
              {
                iconKey: "trending",
                title: "Full-Year Reconciliation",
                desc: "Books vs GST returns, GSTR-1 vs 3B, ITC vs GSTR-2B — all matched.",
              },
              {
                iconKey: "shield",
                title: "Identify & Correct Errors",
                desc: "Avoid future notices, penalties, and ITC reversals.",
              },
              {
                iconKey: "wallet",
                title: "Optimize Tax Position",
                desc: "Ensure no excess tax payment or missed credits across the year.",
              },
              {
                iconKey: "award",
                title: "Complete Coverage",
                desc: "GSTR-9 (annual return) + GSTR-9C (reconciliation statement) — both handled.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Applicable Returns",
                items: [
                  "GSTR-9 — Annual return for all regular taxpayers",
                  "GSTR-9C — Reconciliation statement (for applicable turnover limits)",
                ],
              },
              documents: [
                "GST returns (GSTR-1, 3B for the year)",
                "Purchase & sales data",
                "Financial statements",
                "ITC details (GSTR-2B / 2A)",
              ],
            },
            process: [
              "Data collection & validation",
              "Detailed reconciliation (Books vs Returns vs ITC)",
              "ITC review & adjustments",
              "Preparation of GSTR-9 / 9C",
              "Filing on GST portal",
              "Final review & reporting",
            ],
            processSummary: "Thorough. Accurate. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond basic filing:",
              points: [
                "Deep GST reconciliation expertise",
                "Identification of hidden risks & mismatches",
                "Alignment with income tax & financials",
                "Strategic tax correction before filing",
              ],
            },
            commonMistakes: [
              "Filing without proper reconciliation",
              "Ignoring ITC mismatches",
              "Errors in turnover reporting",
              "Last-minute filing without review",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Handling GST notices (if any)",
              "ITC corrections & advisory",
              "Compliance improvement for next year",
              "Ongoing GST support",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "GST Annual Return is a health check of your business compliance.",
              listPrefix: "We use this process to:",
              weHelpYou: [
                "Strengthen your systems",
                "Improve accuracy",
                "Reduce future risks",
              ],
            },
            cta: {
              headline: "Close Your GST Year the Right Way",
              tagline: "Avoid errors. Stay compliant. Gain clarity.",
              buttonText: "File GST Annual Return",
            },
          },

          {
            serviceId: "gstr-10-filing",
            name: "GSTR-10 Filing (Final Return)",
            tagline: "Close Your GST Registration Properly — Avoid Future Notices & Penalties",
            whyChoose: {
              heading: "What is GSTR-10?",
              paragraphs: [
                "GSTR-10 is the Final Return that must be filed when your GST registration is cancelled or surrendered. It ensures a complete and proper exit from GST compliance. Many businesses ignore this step — but failure to file GSTR-10 attracts heavy late fees of ₹100 per day under both CGST and SGST.",
                "At Insight Consulting, we ensure your GST exit is clean, complete, and free from future notices or complications.",
              ],
            },
            idealFor: [
              "Businesses that have cancelled or surrendered GST",
              "Companies closing down operations",
              "Businesses restructuring to a different entity",
              "Entities with departmental GST cancellation",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Heavy Penalties",
                desc: "₹100/day under CGST + SGST for non-filing — no cap on accumulation.",
              },
              {
                iconKey: "cycle",
                title: "Clean GST Exit",
                desc: "Properly declare closing stock and settle all tax liabilities.",
              },
              {
                iconKey: "building",
                title: "No Future Notices",
                desc: "Proper filing prevents continuous departmental notices.",
              },
              {
                iconKey: "award",
                title: "Complete Closure",
                desc: "Ensures no pending liability remains after business closure.",
              },
            ],
            importantNote:
              "GSTR-10 must be filed within 3 months from the date of GST cancellation order or cancellation date, whichever is later.",
            requirements: {
              eligibility: {
                heading: "What GSTR-10 Covers",
                items: [
                  "Stock and capital goods held on the date of cancellation",
                  "Tax liability on unsold stock and capital goods",
                  "Final compliance closure",
                ],
              },
              documents: [
                "GST cancellation order",
                "Details of closing stock",
                "Purchase invoices",
                "Capital goods details",
                "Last filed GST returns",
              ],
            },
            process: [
              "Understanding the reason for cancellation",
              "Computation of tax liability on closing stock",
              "Data collection & validation",
              "Preparation of GSTR-10",
              "Filing on GST portal",
              "Final closure confirmation",
            ],
            processSummary: "Accurate closure. No future surprises.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Accurate tax computation on stock & assets",
                "Identification of potential risks before filing",
                "Ensuring clean GST exit (no pending liabilities)",
                "Advisory on business restructuring impact",
              ],
            },
            commonMistakes: [
              "Not filing GSTR-10 after cancellation",
              "Incorrect stock valuation",
              "Ignoring tax liability on capital goods",
              "Missing the due date",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Closure documentation support",
              "Advisory for new business setup (if applicable)",
              "Assistance in case of notices",
              "Strategic restructuring guidance",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "GST closure is not just compliance — it's a financial and legal exit process.",
              listPrefix: "We ensure your business exits GST:",
              weHelpYou: [
                "Cleanly",
                "Completely",
                "Without future risks",
              ],
            },
            cta: {
              headline: "Close Your GST the Right Way",
              tagline: "Don't leave loose ends — ensure a proper and compliant GST closure.",
              buttonText: "File GSTR-10",
            },
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CATEGORY 3: INCOME TAX
  ═══════════════════════════════════════════════════════ */
  {
    categoryId: "income-tax",
    categoryName: "Income Tax",
    subcategories: [
      {
        subCategoryId: "it-filing",
        subCategoryName: "IT Filing",
        services: [
          {
            serviceId: "income-tax-efiling",
            name: "Income Tax e-Filing",
            tagline: "Accurate Filing. Smart Tax Planning. Complete Peace of Mind.",
            whyChoose: {
              heading: "Income Tax Filing — More Than Just Compliance",
              paragraphs: [
                "Filing your Income Tax Return (ITR) is not just about meeting deadlines — it's about optimizing your tax liability, avoiding notices, and maintaining financial clarity.",
                "At Insight Consulting, we ensure your tax filing is accurate, compliant, and strategically optimized.",
              ],
            },
            idealForHeading: "Who Should File Income Tax Returns?",
            idealFor: [
              "Salaried individuals",
              "Business owners & professionals",
              "Freelancers & consultants",
              "Companies, LLPs & firms",
              "Individuals with capital gains, foreign income / assets, or high-value transactions",
            ],
            formsHandled: {
              heading: "Types of Returns We Handle",
              items: [
                "ITR-1 / ITR-2 – Individuals (salary, capital gains)",
                "ITR-3 – Business & professionals",
                "ITR-4 – Presumptive income",
                "ITR-5 / 6 / 7 – Firms, LLPs, Companies, Trusts",
              ],
              note: "Complete coverage for all taxpayer categories.",
            },
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Correct Form Selection",
                desc: "We select the right ITR form (ITR-1 to ITR-7) based on your income type.",
              },
              {
                iconKey: "wallet",
                title: "Tax Optimization",
                desc: "Maximize deductions and select the right tax regime (old vs new).",
              },
              {
                iconKey: "trending",
                title: "Avoid Notices",
                desc: "Proactive approach to ensure accuracy in AIS / Form 26AS alignment.",
              },
              {
                iconKey: "award",
                title: "Complete Coverage",
                desc: "ITR-1 through ITR-7 — all taxpayer categories covered.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: null,
              documents: [
                "PAN & Aadhaar",
                "Form 16 / Income details",
                "Bank statements",
                "Investment proofs (80C, 80D, etc.)",
                "Capital gains details (if any)",
              ],
            },
            process: [
              "Data collection & review",
              "Income & deduction analysis",
              "Tax computation & optimization",
              "Return preparation",
              "Filing on Income Tax portal",
              "Verification (ITR-V / Aadhaar OTP)",
            ],
            processSummary: "Smooth. Accurate. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond basic filing:",
              points: [
                "Smart tax planning & deduction optimization",
                "Selection of right tax regime (old vs new)",
                "Alignment with GST & financial data (for businesses)",
                "Proactive approach to avoid notices",
              ],
            },
            commonMistakes: [
              "Choosing wrong ITR form",
              "Missing eligible deductions",
              "Incorrect reporting of income",
              "Ignoring AIS / Form 26AS mismatches",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling & response",
              "Rectification & revised returns",
              "Tax planning for next year",
              "Advisory for investments & savings",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Income tax filing is not just about the past — it's about planning your financial future.",
              weHelpYou: [
                "Reduce tax legally",
                "Improve financial discipline",
                "Make smarter investment decisions",
              ],
            },
            cta: {
              headline: "File Smart. Save More.",
              tagline: "Don't just file — optimize your taxes with expert guidance.",
              buttonText: "File Income Tax Return",
            },
          },

          {
            serviceId: "partnership-itr",
            name: "Partnership Firm ITR Filing",
            tagline: "Accurate Tax Filing. Optimized Profit Allocation. Complete Compliance.",
            whyChoose: {
              heading: "Partnership Tax Filing — More Than Just Return Submission",
              paragraphs: [
                "Filing Income Tax Return (ITR) for a partnership firm is not just compliance — it directly impacts partner remuneration, profit sharing, and tax liability.",
                "At Insight Consulting, we ensure your partnership tax filing is accurate, optimized, and aligned with your business structure.",
              ],
            },
            idealForHeading: "Who Needs This Service?",
            idealFor: [
              "Registered partnership firms",
              "Unregistered partnership firms",
              "Professional firms (CA, consultants, etc.)",
              "Family-run partnership businesses",
            ],
            formsHandled: {
              heading: "Applicable ITR Form",
              items: ["ITR-5 – Mandatory for partnership firms (including LLPs)"],
              note: null,
            },
            keyAdvantages: [
              {
                iconKey: "wallet",
                title: "Optimize Tax Liability",
                desc: "Proper structuring of partner salary, interest on capital, and profit allocation.",
              },
              {
                iconKey: "shield",
                title: "Avoid Disallowances",
                desc: "Incorrect claims lead to disallowance of partner remuneration and higher tax.",
              },
              {
                iconKey: "handshake",
                title: "Deed-Aligned Filing",
                desc: "Ensuring returns align with partnership deed, books, and GST data.",
              },
              {
                iconKey: "award",
                title: "ITR-5 Expertise",
                desc: "Mandatory form for partnership firms — filed accurately and on time.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Applicable to",
                items: [
                  "All partnership firms (registered & unregistered)",
                  "Applicable ITR Form: ITR-5",
                ],
              },
              documents: [
                "PAN of firm",
                "Partnership deed",
                "Financial statements (P&L, Balance Sheet)",
                "Capital accounts of partners",
                "GST returns (if applicable)",
                "Bank statements",
              ],
            },
            process: [
              "Data collection & review",
              "Verification of partnership deed clauses",
              "Tax computation & optimization",
              "ITR-5 preparation",
              "Filing on Income Tax portal",
              "Verification & acknowledgment",
            ],
            processSummary: "Accurate. Compliant. Strategically optimized.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Proper structuring of partner remuneration & interest",
                "Ensuring tax efficiency within legal limits",
                "Alignment with GST & financial data",
                "Identification of risk areas before filing",
              ],
            },
            commonMistakes: [
              "Incorrect calculation of partner remuneration",
              "Not following partnership deed provisions",
              "Mismatch between books & tax return",
              "Missing deductions and allowances",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling & response",
              "Tax planning for next year",
              "Profit structuring advisory",
              "Compliance support",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Partnership taxation is not just about filing — it's about how profits are structured and distributed.",
              weHelpYou: [
                "Maximize partner benefits",
                "Reduce tax burden",
                "Maintain compliance clarity",
              ],
            },
            cta: {
              headline: "File Smart. Distribute Better.",
              tagline: "Don't let tax inefficiencies reduce your profits.",
              buttonText: "File Partnership ITR",
            },
          },

          {
            serviceId: "company-itr",
            name: "Company Income Tax Return (ITR-6)",
            tagline: "Accurate Compliance. Strategic Tax Planning. Strong Financial Positioning.",
            whyChoose: {
              heading: "Company Tax Filing — More Than Compliance",
              paragraphs: [
                "Filing Income Tax Return for a company is not just about meeting statutory requirements — it is about accurate reporting of financial performance, strategic tax planning, and building credibility with stakeholders.",
                "At Insight Consulting, we ensure your company's tax filing is accurate, optimized, and aligned with your growth strategy.",
              ],
            },
            idealForHeading: "Who Needs This Service?",
            idealFor: [
              "Private Limited Companies",
              "Public Limited Companies",
              "Startups & funded entities",
              "Companies with domestic or international transactions",
            ],
            formsHandled: {
              heading: "Applicable ITR Form",
              items: ["ITR-6 – Applicable for companies (other than those claiming exemption under Section 11)"],
              note: null,
            },
            keyAdvantages: [
              {
                iconKey: "wallet",
                title: "Tax Optimization",
                desc: "Proper deduction claims, loss utilization, and MAT planning.",
              },
              {
                iconKey: "shield",
                title: "Avoid Scrutiny",
                desc: "Incorrect filing leads to income tax notices and penalties.",
              },
              {
                iconKey: "trending",
                title: "Financial Alignment",
                desc: "Consistency between financial statements, GST returns, and income tax filings.",
              },
              {
                iconKey: "building",
                title: "Investor Confidence",
                desc: "Clean tax records strengthen investor trust and company valuation.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Applicable Form",
                items: [
                  "ITR-6 — Applicable for all companies other than those claiming exemption under Section 11",
                  "Mandatory even if income is nil or company is in loss",
                ],
              },
              documents: [
                "PAN of company",
                "Financial statements (P&L, Balance Sheet)",
                "Audit report (if applicable)",
                "TDS details (Form 26AS / AIS)",
                "GST returns (if applicable)",
              ],
            },
            process: [
              "Data collection & review",
              "Financial & tax analysis",
              "Tax computation & optimization",
              "ITR-6 preparation",
              "Filing on Income Tax portal",
              "Verification & acknowledgment",
            ],
            processSummary: "Accurate. Compliant. Strategically optimized.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Strategic tax planning & optimization",
                "MAT computation & planning",
                "Alignment with ROC & GST data",
                "Identification of risk areas before filing",
              ],
            },
            commonMistakes: [
              "Incorrect tax computation",
              "Ignoring MAT provisions",
              "Mismatch between books & returns",
              "Missing deductions and set-offs",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling & representation",
              "Tax planning for next year",
              "Advance tax computation",
              "CFO advisory services",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Company taxation is not just compliance — it is a key driver of profitability and valuation.",
              weHelpYou: [
                "Reduce tax burden legally",
                "Improve financial clarity",
                "Strengthen investor confidence",
              ],
            },
            cta: {
              headline: "File Smart. Grow Strong.",
              tagline: "Don't just comply — optimize your company's tax position.",
              buttonText: "File Company ITR",
            },
          },

          {
            serviceId: "trust-ngo-itr",
            name: "Trust / NGO ITR Filing",
            tagline: "Ensure Compliance. Preserve Exemptions. Build Credibility.",
            whyChoose: {
              heading: "NGO & Trust Tax Filing — Beyond Compliance",
              paragraphs: [
                "For Trusts and NGOs, Income Tax filing is not just about submission — it is about maintaining tax exemption status, ensuring proper utilization of funds, and building credibility with donors and authorities.",
                "At Insight Consulting, we ensure your filings are accurate, compliant, and aligned with regulatory requirements.",
              ],
            },
            idealForHeading: "Who Needs This Service?",
            idealFor: [
              "Charitable and Religious Trusts",
              "NGOs and Societies",
              "Section 8 Companies",
              "Institutions registered under 12A / 80G",
            ],
            formsHandled: {
              heading: "Applicable ITR Forms",
              items: ["ITR-7 – For trusts, NGOs, and institutions claiming exemption"],
              note: "Applicable for entities registered under relevant sections of the Income Tax Act",
            },
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Preserve Tax Exemption",
                desc: "Incorrect filing may lead to loss of exemption and full taxation of income.",
              },
              {
                iconKey: "trending",
                title: "85% Application Compliance",
                desc: "Ensure proper compliance with income application and accumulation provisions.",
              },
              {
                iconKey: "award",
                title: "Audit-Ready Filing",
                desc: "ITR-7 preparation aligned with audit and regulatory requirements.",
              },
              {
                iconKey: "building",
                title: "Donor Credibility",
                desc: "Clean compliance records build confidence among donors and grant agencies.",
              },
            ],
            importantNote:
              "ITR-7 filing is mandatory even if income is fully exempt. Proper documentation of fund utilization is critical.",
            requirements: {
              eligibility: {
                heading: "Applicable Form",
                items: [
                  "ITR-7 — For trusts, NGOs, and institutions claiming exemption",
                  "Applicable for entities registered under Sections 11, 12, 10(23C), etc.",
                ],
              },
              documents: [
                "Registration certificates (12A / 80G, if applicable)",
                "Financial statements (Receipts & Payments, Income & Expenditure, Balance Sheet)",
                "Details of donations received",
                "Utilization of funds",
                "Audit report (if applicable)",
              ],
            },
            process: [
              "Data collection & review",
              "Verification of exemption eligibility",
              "Analysis of fund utilization",
              "ITR-7 preparation",
              "Filing on Income Tax portal",
              "Verification & acknowledgment",
            ],
            processSummary: "Compliant. Accurate. Audit-ready.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Ensuring compliance with 12A & 80G conditions",
                "Proper income application & accumulation planning",
                "Alignment with audit and regulatory requirements",
                "Advisory on maintaining exemption status",
              ],
            },
            commonMistakes: [
              "Incorrect reporting of donations",
              "Non-compliance with application of income rules",
              "Missing audit requirements",
              "Improper documentation",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling & response",
              "Advisory on donor compliance",
              "Audit support",
              "Ongoing compliance & structuring",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "For NGOs and Trusts, compliance is directly linked to:",
              weHelpYou: [
                "Credibility",
                "Funding opportunities",
                "Long-term sustainability",
              ],
              closing: "We help you build a strong compliance foundation that supports your mission.",
            },
            cta: {
              headline: "Stay Compliant. Stay Trusted.",
              tagline: "Focus on your mission — let us handle your compliance.",
              buttonText: "File NGO / Trust ITR",
            },
          },

          {
            serviceId: "updated-itr-u",
            name: "Updated Return (ITR-U) Filing",
            tagline: "Correct Past Mistakes. Stay Compliant. Avoid Future Notices.",
            whyChoose: {
              heading: "Missed or Incorrect ITR? You Still Have a Chance",
              paragraphs: [
                "The Updated Return (ITR-U) allows taxpayers to correct errors or report missed income — even after the original due date has passed.",
                "At Insight Consulting, we help you regularize past filings safely and strategically, reducing the risk of penalties and notices.",
              ],
            },
            idealForHeading: "Who Should File ITR-U?",
            idealFor: [
              "Missed filing ITR within the due date",
              "Reported lower income in original return",
              "Want to voluntarily correct errors",
              "Missed certain income (interest, capital gains, etc.)",
              "Claimed incorrect deductions",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Notices & Litigation",
                desc: "Correct errors before the department flags them.",
              },
              {
                iconKey: "cycle",
                title: "Voluntary Compliance",
                desc: "Regularize your tax position without waiting for a notice.",
              },
              {
                iconKey: "reduce",
                title: "Reduce Penalty Exposure",
                desc: "Early correction reduces risk of heavier penalties later.",
              },
              {
                iconKey: "trending",
                title: "Clean Tax History",
                desc: "Build a compliant financial profile for future loans, visas, and investments.",
              },
            ],
            importantNote:
              "ITR-U can only be used for additional income reporting — it cannot be used to claim refunds, reduce tax liability, or increase losses.",
            requirements: {
              eligibility: {
                heading: "Time Limit",
                items: [
                  "ITR-U can be filed within 24 months from the end of the relevant assessment year",
                  "Can only be filed to report additional income (not to reduce tax or claim refunds)",
                ],
              },
              documents: [
                "Previously filed ITR (if any)",
                "Income details (missed / corrected)",
                "Form 26AS / AIS / TIS",
                "Supporting documents (investments, expenses, etc.)",
              ],
            },
            process: [
              "Review of previous return",
              "Identification of discrepancies",
              "Re-computation of tax liability",
              "Preparation of ITR-U",
              "Filing on Income Tax portal",
              "Verification & acknowledgment",
            ],
            processSummary: "Accurate correction. Full compliance.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Detailed gap analysis using AIS & financial data",
                "Strategic approach to minimize additional tax & penalty",
                "Ensuring complete and correct disclosure",
                "Advisory to prevent future compliance issues",
              ],
            },
            commonMistakes: [
              "Filing ITR-U without proper analysis",
              "Missing additional income again",
              "Incorrect tax computation",
              "Ignoring AIS mismatches",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling (if any)",
              "Future tax planning",
              "Compliance advisory",
              "Financial structuring guidance",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "ITR-U is a powerful compliance tool — if used correctly.",
              weHelpYou: [
                "Clean your tax history",
                "Reduce risk exposure",
                "Build a compliant financial profile",
              ],
            },
            cta: {
              headline: "Fix It Before It Becomes a Problem",
              tagline: "Don't wait for a notice — correct your return proactively.",
              buttonText: "File Updated Return (ITR-U)",
            },
          },

          {
            serviceId: "business-taxation",
            name: "Business Taxation & Filing",
            tagline: "Comprehensive Compliance. Strategic Tax Planning. Sustainable Growth.",
            whyChoose: {
              heading: "Business Taxation — Beyond Filing",
              paragraphs: [
                "Business taxation is not just about submitting returns — it directly impacts your profitability, cash flow, and growth potential.",
                "At Insight Consulting, we offer end-to-end business taxation services that combine compliance, planning, and strategic advisory.",
              ],
            },
            idealForHeading: "Who Needs This Service?",
            idealFor: [
              "Proprietorships, Partnerships & LLPs",
              "Private Limited Companies",
              "Startups & growing businesses",
              "Businesses wanting integrated tax & compliance support",
            ],
            keyAdvantages: [
              {
                iconKey: "trending",
                title: "Integrated Tax Management",
                desc: "GST + Income Tax + Financials — all aligned together.",
              },
              {
                iconKey: "wallet",
                title: "Tax Efficiency & Cash Flow",
                desc: "Focus on tax efficiency and working capital optimization.",
              },
              {
                iconKey: "shield",
                title: "Risk Identification",
                desc: "Identify risk areas before they become compliance issues.",
              },
              {
                iconKey: "award",
                title: "CFO-Level Advisory",
                desc: "Strategic advisory for scaling businesses — beyond basic compliance.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Services Covered",
                items: [
                  "Income Tax filing for all business structures",
                  "Advance tax computation",
                  "Tax audit support",
                  "GST return filing & ITC reconciliation",
                  "Tax planning, deduction planning, expense structuring",
                  "Books vs GST vs Income Tax reconciliation",
                ],
              },
              documents: [
                "Financial statements",
                "Sales & purchase data",
                "Bank statements",
                "GST returns (if applicable)",
                "Previous tax filings",
              ],
            },
            process: [
              "Data collection & validation",
              "Financial & tax analysis",
              "Tax computation & planning",
              "Filing of applicable returns",
              "Review & compliance check",
              "Ongoing advisory support",
            ],
            processSummary: "Structured. Accurate. Growth-oriented.",
            insightAdvantage: {
              intro: "We go beyond compliance:",
              points: [
                "Integrated approach — GST + Income Tax + Financials",
                "Focus on tax efficiency & cash flow optimization",
                "Identification of risk areas before they become issues",
                "CFO-level advisory for scaling businesses",
              ],
            },
            commonMistakes: [
              "Treating tax as year-end activity",
              "Ignoring GST and income tax alignment",
              "Missing deductions and tax-saving opportunities",
              "Poor financial structuring",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Notice handling & representation",
              "Advance tax planning",
              "Monthly / quarterly compliance",
              "CFO advisory services",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Taxation is not just compliance — it is a business strategy tool.",
              weHelpYou: [
                "Improve profitability",
                "Strengthen financial discipline",
                "Build a scalable business structure",
              ],
            },
            cta: {
              headline: "Manage Your Taxes the Smart Way",
              tagline: "Don't just file — plan, optimize, and grow.",
              buttonText: "Get Business Tax Support",
            },
          },
        ],
      },

      {
        subCategoryId: "tds-compliance",
        subCategoryName: "TDS Compliance",
        services: [
          {
            serviceId: "tan-tds-compliance",
            name: "TAN Registration & TDS Compliance",
            tagline: "Stay Compliant with TDS. Avoid Penalties. Manage Deductions Seamlessly.",
            whyChoose: {
              heading: "What is TAN & Why It Matters",
              paragraphs: [
                "TAN (Tax Deduction and Collection Account Number) is a mandatory requirement for businesses deducting or collecting tax at source (TDS/TCS). Without TAN: You cannot deduct TDS legally, you cannot file TDS returns, and you may face penalties.",
                "At Insight Consulting, we ensure your TAN registration and compliance are smooth, accurate, and fully compliant.",
              ],
            },
            idealForHeading: "Who Needs TAN?",
            idealFor: [
              "Businesses deducting TDS on salaries, rent, or contractor payments",
              "Companies, LLPs, firms & individuals liable for TDS",
              "New businesses starting operations",
              "Entities needing complete TDS compliance setup",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Legal TDS Deduction",
                desc: "TAN is mandatory before deducting any TDS — avoid penalties.",
              },
              {
                iconKey: "wallet",
                title: "Correct Rate Selection",
                desc: "Avoid short deduction, excess deduction, and disallowance risks.",
              },
              {
                iconKey: "cycle",
                title: "Quarterly Filing",
                desc: "Form 24Q, 26Q, 27Q, 27EQ — all quarterly returns handled.",
              },
              {
                iconKey: "award",
                title: "TDS Certificates",
                desc: "Accurate Form 16 and Form 16A issued for employees and vendors.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Who Needs TAN",
                items: [
                  "Businesses deducting TDS on salaries, contractor payments, rent, professional fees, interest",
                  "Companies, LLPs, firms, and individuals (if liable for TDS)",
                ],
              },
              documents: [
                "PAN of applicant",
                "Business registration details",
                "Address proof",
                "Contact details",
              ],
            },
            process: [
              "Understanding TDS applicability for your business",
              "TAN application filing",
              "TAN allotment",
              "TDS compliance system setup",
              "Ongoing quarterly TDS return filing",
            ],
            processSummary: "Complete support — from registration to compliance.",
            insightAdvantage: {
              intro: "We go beyond registration:",
              points: [
                "Identification of TDS applicability across transactions",
                "Correct rate selection & deduction timing",
                "Avoidance of interest & penalty exposure",
                "Integration with GST & income tax systems",
              ],
            },
            commonMistakes: [
              "Not obtaining TAN before deducting TDS",
              "Wrong TDS rate application",
              "Delay in deposit of TDS",
              "Late filing of TDS returns",
            ],
            postSupportTitle: "Post-Registration Support",
            postSupport: [
              "Quarterly TDS return filing",
              "TDS reconciliation (Form 26AS)",
              "Notice handling & response",
              "Compliance calendar setup",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "TDS is not just compliance — it impacts your:",
              weHelpYou: [
                "Vendor relationships",
                "Cash flow",
                "Tax credibility",
              ],
              closing: "We ensure your TDS processes are efficient, compliant, and risk-free.",
            },
            cta: {
              headline: "Stay TDS Compliant — Stay Protected",
              tagline: "Avoid penalties and compliance risks — get your TAN and TDS handled by experts.",
              buttonText: "Apply for TAN & TDS Setup",
            },
          },

          {
            serviceId: "tds-return-filing",
            name: "TDS Return Filing",
            tagline: "Accurate Deduction. Timely Filing. Zero Penalty Risk.",
            whyChoose: {
              heading: "TDS Compliance — Critical for Every Business",
              paragraphs: [
                "Tax Deducted at Source (TDS) is a key compliance requirement that ensures timely tax collection by the government. But incorrect deduction or delayed filing can lead to penalties, interest, and disallowance of expenses.",
                "At Insight Consulting, we ensure your TDS compliance is accurate, timely, and fully aligned with regulations.",
              ],
            },
            idealForHeading: "Who Needs TDS Return Filing?",
            idealFor: [
              "Businesses deducting TDS on salaries, contractor, professional, or rent payments",
              "Companies, LLPs, Firms & Individuals liable for TDS",
              "Businesses needing accurate Form 16 / 16A generation",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Penalties",
                desc: "Late filing fee: ₹200 per day (u/s 234E) plus additional penalties.",
              },
              {
                iconKey: "wallet",
                title: "Correct Deduction",
                desc: "Avoid short deduction, excess deduction, and disallowance risks.",
              },
              {
                iconKey: "trending",
                title: "Accurate Reporting",
                desc: "Ensure proper reflection in Form 26AS and AIS of deductees.",
              },
              {
                iconKey: "award",
                title: "Complete Coverage",
                desc: "Form 24Q, 26Q, 27Q, 27EQ — all TDS/TCS return types handled.",
              },
            ],
            importantNote: null,
            formsHandled: {
              heading: "Types of TDS Returns We Handle",
              items: [
                "Form 24Q – TDS on salaries",
                "Form 26Q – TDS on domestic payments",
                "Form 27Q – TDS on payments to non-residents",
                "Form 27EQ – TCS returns",
              ],
              note: "Complete coverage of TDS / TCS compliance.",
            },
            requirements: {
              eligibility: {
                heading: "Quarterly Due Dates",
                items: [
                  "Q1 (Apr–Jun): Due 31st July",
                  "Q2 (Jul–Sep): Due 31st October",
                  "Q3 (Oct–Dec): Due 31st January",
                  "Q4 (Jan–Mar): Due 31st May",
                ],
              },
              documents: [
                "TDS details (payments & deductions)",
                "PAN of deductees",
                "Challan details (TDS payment)",
                "Salary / expense details",
              ],
            },
            process: [
              "Data collection & validation",
              "TDS computation & reconciliation",
              "Return preparation",
              "Filing on TRACES / Income Tax portal",
              "Acknowledgment generation",
              "Issuance of TDS certificates (Form 16 / 16A)",
            ],
            processSummary: "Accurate. Timely. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Correct section-wise TDS applicability",
                "Avoidance of interest & disallowance risks",
                "Reconciliation with books & Form 26AS",
                "End-to-end compliance including certificates issuance",
              ],
            },
            commonMistakes: [
              "Late filing of TDS returns",
              "Incorrect PAN of deductees",
              "Mismatch in challan details",
              "Wrong TDS rate application",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Correction returns (if needed)",
              "Notice handling & response",
              "TDS reconciliation",
              "Compliance tracking",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "TDS compliance is not just a statutory requirement — it affects:",
              weHelpYou: [
                "Vendor relationships",
                "Expense allowability",
                "Financial credibility",
              ],
              closing: "We ensure your TDS process is efficient, compliant, and risk-free.",
            },
            cta: {
              headline: "Stay Compliant. Stay Penalty-Free.",
              tagline: "Don't let TDS errors cost your business.",
              buttonText: "File TDS Returns",
            },
          },
        ],
      },

      {
        subCategoryId: "international-tax",
        subCategoryName: "International Tax",
        services: [
          {
            serviceId: "form-15ca-15cb",
            name: "Form 15CA & 15CB Filing",
            tagline: "Compliant Foreign Remittances. Zero Hassle. Complete Clarity.",
            whyChoose: {
              heading: "Sending Money Abroad? Ensure Proper Compliance",
              paragraphs: [
                "When making payments to non-residents, compliance with Income Tax regulations is critical. Form 15CA & 15CB are mandatory for most foreign remittances to ensure correct tax deduction (TDS) and proper reporting to the Income Tax Department.",
                "At Insight Consulting, we ensure your remittances are fully compliant, tax-efficient, and processed without delays.",
              ],
            },
            idealFor: [
              "Businesses making payments to foreign vendors or partners",
              "Companies importing services or paying royalties",
              "Entities remitting interest, dividends, or commissions abroad",
              "Anyone making payments to non-residents",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Wrong TDS Deduction",
                desc: "Incorrect tax deduction leads to penalties, disallowance, and future scrutiny.",
              },
              {
                iconKey: "trending",
                title: "DTAA Benefits",
                desc: "Correct application of tax treaty benefits to minimize tax outflow.",
              },
              {
                iconKey: "building",
                title: "Smooth Bank Processing",
                desc: "Banks require proper documentation before releasing international funds.",
              },
              {
                iconKey: "award",
                title: "CA-Certified",
                desc: "Form 15CB is a CA certificate — issued with expert analysis.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "When 15CA / 15CB Is Required",
                items: [
                  "Payments to foreign vendors",
                  "Import of services",
                  "Royalty / technical fees to non-residents",
                  "Commission payments abroad",
                  "Interest / dividend remittances",
                ],
              },
              documents: [
                "PAN of remitter",
                "Details of remittance (amount, nature)",
                "Agreement / invoice with foreign party",
                "Bank details",
                "TRC (Tax Residency Certificate) of recipient (if DTAA benefit claimed)",
              ],
            },
            process: [
              "Analysis of remittance nature and taxability",
              "Determination of TDS applicability & rate",
              "DTAA evaluation (if applicable)",
              "Preparation of Form 15CB (CA certificate)",
              "Filing of Form 15CA online",
              "Documentation for bank submission",
            ],
            processSummary: "Accurate. Compliant. Hassle-free.",
            insightAdvantage: {
              intro: "We go beyond form filing:",
              points: [
                "Expert analysis of taxability of remittance",
                "Correct application of DTAA provisions",
                "Minimizing tax outflow legally",
                "End-to-end support including bank coordination",
              ],
            },
            commonMistakes: [
              "Incorrect classification of remittance",
              "Wrong TDS deduction rate",
              "Ignoring DTAA benefits",
              "Filing incomplete or incorrect forms",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "Advisory on recurring remittances",
              "TDS compliance support",
              "Income tax assessments (if applicable)",
              "Documentation support for audits",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Foreign remittances are not just transactions — they are tax-sensitive events.",
              listPrefix: "We ensure:",
              weHelpYou: [
                "Compliance is strong",
                "Tax is optimized",
                "Documentation is audit-ready",
              ],
            },
            cta: {
              headline: "Send Money Abroad — The Right Way",
              tagline: "Avoid delays, penalties, and errors.",
              buttonText: "File Form 15CA & 15CB",
            },
          },
        ],
      },

      {
        subCategoryId: "tax-notices",
        subCategoryName: "Tax Notices",
        services: [
          {
            serviceId: "income-tax-notice",
            name: "Income Tax Notice Handling",
            tagline: "Respond Smartly. Stay Compliant. Protect Your Finances.",
            whyChoose: {
              heading: "Received an Income Tax Notice? Stay Calm — Act Strategically",
              paragraphs: [
                "An Income Tax notice does not always mean a penalty — but ignoring or mishandling it can create serious consequences.",
                "At Insight Consulting, we ensure your notice is analyzed correctly, responded professionally, and resolved efficiently.",
              ],
            },
            idealForHeading: "Received an Income Tax Notice?",
            idealFor: [
              "Individuals and businesses receiving IT notices",
              "Cases with AIS / Form 26AS discrepancies",
              "Scrutiny notices and demand notices",
              "High-value transaction alerts and TDS mismatches",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Penalties & Litigation",
                desc: "Incorrect or delayed response leads to penalties, interest, and scrutiny.",
              },
              {
                iconKey: "trending",
                title: "Protect Financial Position",
                desc: "Ensure correct income reporting and proper justification of claims.",
              },
              {
                iconKey: "building",
                title: "Maintain Compliance Record",
                desc: "A strong response builds your credibility with the tax department.",
              },
              {
                iconKey: "award",
                title: "Expert Representation",
                desc: "We represent you before Income Tax authorities when required.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Notice Types We Handle",
                items: [
                  "Defective Return Notice (Section 139(9))",
                  "Mismatch Notice (AIS / Form 26AS discrepancies)",
                  "Scrutiny Notice (Section 143(2))",
                  "Demand Notice (Section 156)",
                  "Income Escaping Assessment (Section 148)",
                  "TDS / High-value transaction alerts",
                ],
              },
              documents: [
                "Copy of notice received",
                "Filed ITR & computation",
                "Supporting documents (income, deductions, investments)",
                "Bank statements / financial records",
              ],
            },
            process: [
              "Detailed analysis of the notice",
              "Identification of issue & exposure",
              "Drafting a clear, strong response",
              "Submission on Income Tax portal",
              "Representation before authorities (if required)",
              "Follow-up until closure",
            ],
            processSummary: "Strategic. Professional. Result-oriented.",
            insightAdvantage: {
              intro: "We go beyond replying:",
              points: [
                "Strong technical interpretation of tax laws",
                "Well-drafted, legally sound responses",
                "Strategic approach to minimize tax liability",
                "Experience in handling complex tax notices",
              ],
            },
            commonMistakes: [
              "Ignoring notices or delaying response",
              "Submitting incomplete or incorrect replies",
              "Not addressing the root issue",
              "Lack of proper documentation",
            ],
            postSupportTitle: "Post-Notice Support",
            postSupport: [
              "Rectification / revised return filing",
              "Tax planning & correction",
              "Documentation strengthening",
              "Ongoing compliance advisory",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "An Income Tax notice is not just a compliance issue — it's a signal to strengthen your financial systems.",
              weHelpYou: [
                "Identify gaps",
                "Fix errors",
                "Build stronger compliance practices",
              ],
            },
            cta: {
              headline: "Respond Right. Stay Protected.",
              tagline: "Don't let a notice escalate into a problem.",
              buttonText: "Handle IT Notice",
            },
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CATEGORY 4: MCA COMPLIANCE
  ═══════════════════════════════════════════════════════ */
  {
    categoryId: "mca",
    categoryName: "MCA Compliance",
    subcategories: [
      {
        subCategoryId: "company-compliance",
        subCategoryName: "Company Compliance",
        services: [
          {
            serviceId: "company-mca-compliance",
            name: "Company MCA Compliance",
            tagline: "Stay Legally Compliant. Avoid Penalties. Build a Strong Corporate Foundation.",
            whyChoose: {
              heading: "MCA Compliance — Non-Negotiable for Companies",
              paragraphs: [
                "Every company registered in India must comply with Ministry of Corporate Affairs (MCA) regulations — regardless of turnover or activity. Non-compliance can lead to heavy penalties, director disqualification, and company strike-off.",
                "At Insight Consulting, we ensure your company remains fully compliant, well-structured, and penalty-free.",
              ],
            },
            idealFor: [
              "Private Limited Companies",
              "Public Limited Companies",
              "Startups with MCA registration",
              "Companies with pending filings",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Heavy Penalties",
                desc: "Late filing fees can be significant — no upper cap in many cases.",
              },
              {
                iconKey: "building",
                title: "Maintain Active Status",
                desc: "Non-compliance can result in company strike-off and DIN disqualification.",
              },
              {
                iconKey: "trending",
                title: "Enhance Business Credibility",
                desc: "Clean compliance improves investor confidence and bank credibility.",
              },
              {
                iconKey: "cycle",
                title: "Event-Based Coverage",
                desc: "Director changes, share allotment, capital increase, charges — all handled.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Mandatory MCA Compliances",
                items: [
                  "AOC-4 — Filing of financial statements (annual)",
                  "MGT-7 / MGT-7A — Annual return",
                  "Event-based: Director appointment/resignation, share changes, address change",
                  "Board meetings, statutory registers, minutes maintenance",
                ],
              },
              documents: [
                "Incorporation documents",
                "Financial statements",
                "Director details",
                "Shareholding details",
                "Previous filings (if any)",
              ],
            },
            process: [
              "Compliance status review",
              "Identification of pending filings",
              "Preparation of required MCA forms",
              "Filing with MCA portal",
              "Documentation & record maintenance",
              "Compliance tracking & reminders",
            ],
            processSummary: "Complete compliance. Zero stress.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Proactive compliance tracking system",
                "Error-free documentation & filings",
                "Alignment with income tax & GST data",
                "Advisory on corporate structuring & governance",
              ],
            },
            commonMistakes: [
              "Missing annual filing deadlines",
              "Incorrect or incomplete filings",
              "Ignoring event-based compliances",
              "Poor documentation of board decisions",
            ],
            postSupportTitle: "Post-Compliance Support",
            postSupport: [
              "Ongoing compliance calendar",
              "Advisory on corporate restructuring",
              "Support for funding & due diligence",
              "CFO advisory services",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "MCA compliance is not just legal — it directly impacts:",
              weHelpYou: [
                "Business continuity",
                "Fundraising ability",
                "Corporate reputation",
              ],
              closing: "We ensure your company is compliance-strong and growth-ready.",
            },
            cta: {
              headline: "Stay Compliant. Stay Credible.",
              tagline: "Avoid penalties and build a strong corporate image.",
              buttonText: "Get MCA Compliance Support",
            },
          },

          {
            serviceId: "opc-compliance",
            name: "OPC Compliance Services",
            tagline: "Stay Compliant. Stay Protected. Grow Your Solo Business with Confidence.",
            whyChoose: {
              heading: "OPC Compliance — Simple Structure, Serious Responsibility",
              paragraphs: [
                "A One Person Company (OPC) offers single ownership with corporate status, but still requires mandatory compliance under MCA and Income Tax laws. Non-compliance can lead to penalties, director disqualification, and company strike-off.",
                "At Insight Consulting, we ensure your OPC remains fully compliant, well-managed, and growth-ready.",
              ],
            },
            idealFor: [
              "One Person Companies with active or dormant status",
              "Solo entrepreneurs with OPC registration",
              "OPCs needing compliance catch-up",
              "OPC owners planning future conversion to Pvt Ltd",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Penalties",
                desc: "Late MCA filings attract heavy additional fees.",
              },
              {
                iconKey: "building",
                title: "Maintain Active Status",
                desc: "Non-compliance may result in strike-off and loss of business continuity.",
              },
              {
                iconKey: "award",
                title: "Build Credibility",
                desc: "A compliant OPC is more trusted by banks, clients, and vendors.",
              },
              {
                iconKey: "trending",
                title: "Growth-Ready",
                desc: "Clean compliance prepares your OPC for future scaling or conversion.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Mandatory OPC Compliances",
                items: [
                  "AOC-4 — Filing of financial statements",
                  "MGT-7A — Annual return (simplified for OPC & small companies)",
                  "ITR-6 Filing — Mandatory income tax return",
                  "Minimum one board meeting per half year",
                  "Maintenance of minutes and statutory registers",
                ],
              },
              documents: [
                "Incorporation documents",
                "Financial statements",
                "Director details",
                "Bank statements",
                "Previous filings (if any)",
              ],
            },
            process: [
              "Compliance status review",
              "Identification of pending filings",
              "Preparation of AOC-4 & MGT-7A",
              "Filing with MCA",
              "Income tax return filing",
              "Compliance tracking & reminders",
            ],
            processSummary: "Complete compliance. Zero stress.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Proactive compliance tracking system",
                "Error-free documentation & filings",
                "Alignment with GST & income tax data",
                "Advisory on future conversion to Pvt Ltd",
              ],
            },
            commonMistakes: [
              "Missing annual filing deadlines",
              "Ignoring board meeting requirements",
              "Incorrect financial reporting",
              "Lack of compliance planning",
            ],
            postSupportTitle: "Post-Compliance Support",
            postSupport: [
              "Compliance calendar setup",
              "Advisory on business scaling",
              "Conversion to Private Limited Company",
              "Ongoing accounting & tax support",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "OPC is often the first step toward building a scalable company.",
              weHelpYou: [
                "Stay compliant",
                "Build financial discipline",
                "Prepare for future growth",
              ],
            },
            cta: {
              headline: "Stay Compliant. Stay Growth-Ready.",
              tagline: "Focus on your business — we'll handle your compliance.",
              buttonText: "Get OPC Compliance Support",
            },
          },

          {
            serviceId: "llp-mca-compliance",
            name: "LLP Compliance Services",
            tagline: "Stay Compliant. Avoid Penalties. Run Your LLP with Confidence.",
            whyChoose: {
              heading: "LLP Compliance — Simple but Critical",
              paragraphs: [
                "LLPs enjoy lower compliance compared to companies, but timely filings are mandatory. Failure to comply can lead to heavy penalties (₹100 per day with no upper limit), LLP being marked inactive, and difficulty in closure or restructuring.",
                "At Insight Consulting, we ensure your LLP remains fully compliant, organized, and penalty-free.",
              ],
            },
            idealFor: [
              "All Limited Liability Partnerships",
              "LLPs with pending annual filings",
              "Professional firms with LLP structure",
              "LLPs planning conversion to Pvt Ltd",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Heavy Penalties",
                desc: "₹100 per day penalty with no upper cap for late LLP filings.",
              },
              {
                iconKey: "building",
                title: "Maintain Active Status",
                desc: "Non-compliance can lead to inactive status and operational issues.",
              },
              {
                iconKey: "trending",
                title: "Build Business Credibility",
                desc: "Clean compliance improves bank confidence and vendor trust.",
              },
              {
                iconKey: "cycle",
                title: "Complete Coverage",
                desc: "Form 8, Form 11, and ITR-5 — all LLP filings handled.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Mandatory LLP Compliances",
                items: [
                  "Form 11 — Annual Return (Due: 30th May every year)",
                  "Form 8 — Statement of Accounts & Solvency (Due: 30th October every year)",
                  "Income Tax Return (ITR-5) — annually",
                ],
              },
              documents: [
                "LLP Incorporation documents",
                "LLP Agreement",
                "Financial statements",
                "Partner details",
                "Previous filings (if any)",
              ],
            },
            process: [
              "Compliance status review",
              "Identification of pending filings",
              "Preparation of Form 8 & Form 11",
              "Filing with MCA",
              "Income tax return filing (ITR-5)",
              "Compliance tracking & reminders",
            ],
            processSummary: "Timely. Accurate. Fully managed.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Proactive compliance tracking system",
                "Error-free documentation & filings",
                "Alignment with GST & income tax data",
                "Advisory on partner structuring & remuneration",
              ],
            },
            commonMistakes: [
              "Missing compliance deadlines",
              "Incorrect financial reporting",
              "Ignoring LLP agreement provisions",
              "Lack of compliance tracking",
            ],
            postSupportTitle: "Post-Compliance Support",
            postSupport: [
              "Compliance calendar setup",
              "Advisory on LLP restructuring",
              "Conversion to Pvt Ltd (if needed)",
              "Ongoing accounting & tax support",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "LLP compliance is not just about filing — it ensures your business remains:",
              weHelpYou: [
                "Legally strong",
                "Financially structured",
                "Operationally smooth",
              ],
              closing: "We help you stay compliant while focusing on growth.",
            },
            cta: {
              headline: "Stay Compliant. Stay Stress-Free.",
              tagline: "Avoid penalties and last-minute rush.",
              buttonText: "Get LLP Compliance Support",
            },
          },
        ],
      },

      {
        subCategoryId: "corporate-changes",
        subCategoryName: "Corporate Changes",
        services: [
          {
            serviceId: "company-name-change",
            name: "Company Name Change",
            tagline: "Rebrand Your Business. Stay Compliant. Make a Stronger Market Impact.",
            whyChoose: {
              heading: "Planning to Change Your Company Name?",
              paragraphs: [
                "Your company name is your brand identity — and sometimes, it needs to evolve with your business. Whether it's for rebranding, expansion, or strategic repositioning, changing your company name requires proper legal compliance under MCA.",
                "At Insight Consulting, we ensure your name change is smooth, compliant, and strategically aligned with your business vision.",
              ],
            },
            idealFor: [
              "Business rebranding or repositioning",
              "Change in business activity",
              "Mergers or restructuring",
              "Trademark conflicts",
              "Expanding into new markets",
            ],
            keyAdvantages: [
              {
                iconKey: "award",
                title: "Stronger Brand Identity",
                desc: "Align your name with your current business vision.",
              },
              {
                iconKey: "trending",
                title: "Better Market Positioning",
                desc: "Create a more impactful and relevant brand presence.",
              },
              {
                iconKey: "building",
                title: "Legal Recognition",
                desc: "Official name change recognized across all regulatory platforms.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Legal Process Involved",
                items: [
                  "Board Resolution — approval for name change",
                  "Name Approval (RUN / SPICe+) — application to MCA",
                  "Shareholder Approval — special resolution required",
                  "MCA Filings — MGT-14 and INC-24",
                  "Fresh Certificate of Incorporation with new name",
                ],
              },
              documents: [
                "Incorporation documents",
                "MOA & AOA",
                "Board resolution",
                "Shareholder resolution",
                "Proposed names (options)",
              ],
            },
            process: [
              "Name availability check & strategy",
              "Drafting resolutions",
              "Filing name approval application",
              "MCA filings (MGT-14, INC-24)",
              "Obtaining new Certificate of Incorporation",
              "Post-change updates (PAN, GST, bank, etc.)",
            ],
            processSummary: "Smooth transition. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Strategic name selection & approval guidance",
                "Ensuring compliance with MCA naming rules",
                "Complete support for post-name change updates",
                "Avoidance of rejection or delays",
              ],
            },
            commonMistakes: [
              "Choosing names that get rejected",
              "Incomplete documentation",
              "Missing post-change updates",
              "Non-compliance with MCA procedures",
            ],
            postSupportTitle: "Post-Name Change Support",
            postSupport: [
              "PAN, TAN updates",
              "GST amendment",
              "Bank account changes",
              "Branding & compliance alignment",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "A name change is not just legal — it's a branding and business strategy decision.",
              listPrefix: "We ensure your transition is:",
              weHelpYou: [
                "Legally smooth",
                "Operationally seamless",
                "Strategically aligned",
              ],
            },
            cta: {
              headline: "Rebrand the Right Way",
              tagline: "Your new identity deserves a smooth and compliant transition.",
              buttonText: "Change Company Name",
            },
          },

          {
            serviceId: "registered-office-change",
            name: "Registered Office Change",
            tagline: "Seamless Address Update. Full Compliance. Zero Disruption.",
            whyChoose: {
              heading: "Changing Your Business Address? Do It the Right Way",
              paragraphs: [
                "Your registered office is your company's official legal address — used for all government communication and compliance. Any change must be updated with MCA and other authorities promptly to avoid penalties and disruptions.",
                "At Insight Consulting, we ensure your address change is smooth, compliant, and hassle-free.",
              ],
            },
            idealFor: [
              "Companies relocating within the same city",
              "Businesses moving to a different ROC jurisdiction",
              "Companies shifting to a different state",
              "Entities updating address post-merger or restructuring",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Penalties",
                desc: "Delay in updating registered office can lead to compliance fines.",
              },
              {
                iconKey: "building",
                title: "Ensure Proper Communication",
                desc: "All official notices and government communication go to your registered address.",
              },
              {
                iconKey: "trending",
                title: "Maintain Credibility",
                desc: "Updated records reflect professionalism and compliance reliability.",
              },
              {
                iconKey: "cycle",
                title: "All Change Types Handled",
                desc: "Same city, same state (different ROC), or inter-state — all covered.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Types of Registered Office Change",
                items: [
                  "Within Same City — board resolution required",
                  "Within Same State (different ROC) — additional approvals required",
                  "From One State to Another — Regional Director approval required",
                ],
              },
              documents: [
                "Address proof (rental agreement / ownership proof)",
                "NOC from property owner",
                "Latest utility bill",
                "Board resolution",
                "Shareholder resolution (if required)",
              ],
            },
            process: [
              "Understanding type of address change",
              "Drafting board and shareholder resolutions",
              "Filing forms with MCA (INC-22, MGT-14, etc.)",
              "Approval and confirmation",
              "Post-change updates (GST, bank, licenses, etc.)",
            ],
            processSummary: "Smooth execution. Full compliance.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Correct classification of type of office change",
                "Ensuring complete documentation (avoids rejection)",
                "Handling complex inter-state changes",
                "Support for all post-change updates",
              ],
            },
            commonMistakes: [
              "Delay in updating registered office",
              "Incomplete or incorrect documentation",
              "Ignoring post-change compliance updates",
              "Wrong filing category (leading to rejection)",
            ],
            postSupportTitle: "Post-Change Support",
            postSupport: [
              "GST amendment",
              "PAN / TAN update",
              "Bank account update",
              "ROC compliance alignment",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Your registered office is not just a formality — it impacts:",
              weHelpYou: [
                "Legal communication",
                "Compliance jurisdiction",
                "Business credibility",
              ],
              closing: "We ensure your transition is legally strong and operationally smooth.",
            },
            cta: {
              headline: "Move Smart. Stay Compliant.",
              tagline: "Changing your office? Make sure your compliance moves with you.",
              buttonText: "Update Registered Office",
            },
          },

          {
            serviceId: "director-removal",
            name: "Director Removal / Resignation",
            tagline: "Handle Director Exit Smoothly. Stay Compliant. Avoid Future Risks.",
            whyChoose: {
              heading: "Director Exit? Handle It the Right Way",
              paragraphs: [
                "When a director resigns or is removed, it is not just an internal decision — it requires proper legal documentation and MCA filings. Improper handling can lead to compliance issues, disputes, and continued liability for the outgoing director.",
                "At Insight Consulting, we ensure a clean, compliant, and well-documented exit process.",
              ],
            },
            idealFor: [
              "Companies with resigning directors",
              "Boards removing a director through shareholder process",
              "Director removal due to regulatory issues",
              "Companies restructuring their board",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Avoid Future Liability",
                desc: "Ensure the outgoing director is legally relieved of responsibilities.",
              },
              {
                iconKey: "building",
                title: "MCA Compliance",
                desc: "Director details must be updated in official MCA records promptly.",
              },
              {
                iconKey: "handshake",
                title: "Prevent Disputes",
                desc: "Proper documentation avoids legal conflicts and ownership misunderstandings.",
              },
              {
                iconKey: "cycle",
                title: "Complete Process",
                desc: "Resignation letter, board resolution, MCA filings — all handled together.",
              },
            ],
            importantNote: null,
            requirements: {
              eligibility: {
                heading: "Types of Director Removal",
                items: [
                  "Voluntary Resignation — director steps down with resignation letter",
                  "Removal by Company — through shareholder approval (board/special resolution)",
                  "Disqualification / Non-Compliance Cases — regulatory removal",
                ],
              },
              documents: [
                "Resignation letter",
                "Board resolution",
                "Shareholder resolution (if required)",
                "PAN & DIN of director",
                "Consent / acknowledgment",
              ],
            },
            process: [
              "Understanding type of removal",
              "Drafting resignation / removal documents",
              "Passing board / shareholder resolutions",
              "Filing with MCA (DIR-12, DIR-11 if applicable)",
              "Updating MCA records",
              "Confirmation of removal",
            ],
            processSummary: "Clean exit. Full compliance.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Ensuring proper legal documentation",
                "Protecting both company and director interests",
                "Avoiding future disputes or liabilities",
                "Handling complete end-to-end compliance",
              ],
            },
            commonMistakes: [
              "Delay in filing DIR-12",
              "Improper resignation documentation",
              "Not filing DIR-11 (where required)",
              "Ignoring legal closure of responsibilities",
            ],
            postSupportTitle: "Post-Removal Support",
            postSupport: [
              "Updating statutory registers",
              "Advisory on board restructuring",
              "Compliance tracking",
              "Support for new director appointment",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Director exit is not just compliance — it impacts:",
              weHelpYou: [
                "Business continuity",
                "Governance structure",
                "Legal responsibility",
              ],
              closing: "We ensure the transition is smooth, compliant, and risk-free.",
            },
            cta: {
              headline: "Ensure a Clean & Compliant Exit",
              tagline: "Avoid complications — handle director removal professionally.",
              buttonText: "Manage Director Exit",
            },
          },
        ],
      },

      {
        subCategoryId: "director-services",
        subCategoryName: "Director Services",
        services: [
          {
            serviceId: "din-ekyc",
            name: "DIN eKYC Filing (DIR-3 KYC / DIR-3 KYC Web)",
            tagline: "Keep Your Director Status Active. Stay MCA Compliant.",
            whyChoose: {
              heading: "What is DIN eKYC & Why It Matters",
              paragraphs: [
                "Every director holding a DIN (Director Identification Number) must complete annual KYC filing with MCA. Failure to comply results in: DIN being marked 'Deactivated due to non-filing of KYC', inability to act as director or sign documents, and a late fee of ₹5,000 for reactivation.",
                "At Insight Consulting, we ensure your DIN remains active, compliant, and penalty-free.",
              ],
            },
            idealFor: [
              "All directors with an approved DIN",
              "Directors of Private Limited Companies, Public Companies, and LLPs",
              "Mandatory even if you are not actively involved in business",
            ],
            keyAdvantages: [
              {
                iconKey: "shield",
                title: "Keep DIN Active",
                desc: "Deactivated DIN means you cannot act as director or sign documents.",
              },
              {
                iconKey: "bolt",
                title: "Annual Requirement",
                desc: "Due every 30th September — timely filing avoids ₹5,000 reactivation fee.",
              },
              {
                iconKey: "award",
                title: "Two Filing Options",
                desc: "DIR-3 KYC (form-based) or DIR-3 KYC Web (OTP-based for no-change cases).",
              },
              {
                iconKey: "cycle",
                title: "Mandatory Even If Inactive",
                desc: "Required even if you are not actively involved in any company.",
              },
            ],
            importantNote:
              "Late filing after 30th September attracts ₹5,000 government fee for DIN reactivation.",
            requirements: {
              eligibility: {
                heading: "DIN eKYC Types",
                items: [
                  "DIR-3 KYC — Required if filing for the first time or updating details",
                  "DIR-3 KYC Web — For directors with no change in details (simple OTP verification)",
                  "Due Date: 30th September every year",
                ],
              },
              documents: [
                "PAN card",
                "Aadhaar card",
                "Mobile number (linked with Aadhaar)",
                "Email ID",
                "Passport (for foreign directors)",
                "Details must match MCA records exactly",
              ],
            },
            process: [
              "Verification of DIN status",
              "Collection & validation of documents",
              "Preparation of DIR-3 KYC (if required)",
              "OTP verification / DSC-based filing",
              "Filing with MCA",
              "Confirmation of active DIN status",
            ],
            processSummary: "Quick. Accurate. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Ensuring error-free submission (no rejection)",
                "Assistance in DIN reactivation (if deactivated)",
                "Handling DSC-related issues smoothly",
                "Tracking compliance deadlines proactively",
              ],
            },
            commonMistakes: [
              "Missing the due date",
              "Incorrect email or mobile details",
              "Mismatch in PAN / Aadhaar data",
              "Ignoring DIN status until it gets deactivated",
            ],
            postSupportTitle: "Post-Filing Support",
            postSupport: [
              "DIN status tracking",
              "Director compliance advisory",
              "MCA compliance calendar setup",
              "Support for future filings",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "Director compliance is not just procedural — it impacts your ability to:",
              weHelpYou: [
                "Sign documents",
                "Manage companies",
                "Maintain legal standing",
              ],
              closing: "We ensure your director credentials remain active and compliant at all times.",
            },
            cta: {
              headline: "Don't Let Your DIN Get Deactivated",
              tagline: "A simple filing can prevent major compliance issues.",
              buttonText: "File DIN eKYC",
            },
          },

          {
            serviceId: "din-reactivation",
            name: "DIN Reactivation",
            tagline: "Restore Your DIN. Regain Your Director Status. Stay MCA Compliant.",
            whyChoose: {
              heading: "DIN Deactivated? Act Quickly",
              paragraphs: [
                "If your DIN (Director Identification Number) is marked as 'Deactivated due to non-filing of KYC', you cannot act as a director, sign MCA documents, or participate in company compliance.",
                "At Insight Consulting, we help you reactivate your DIN quickly and correctly — ensuring full compliance and minimal disruption.",
              ],
            },
            idealFor: [
              "Directors with deactivated DIN",
              "Directors who missed the annual KYC deadline",
              "Cases with incorrect or incomplete KYC details",
              "Directors needing urgent reactivation",
            ],
            keyAdvantages: [
              {
                iconKey: "cycle",
                title: "Restore Legal Authority",
                desc: "Regain your ability to act as a director and sign documents.",
              },
              {
                iconKey: "shield",
                title: "Avoid Compliance Disruption",
                desc: "Inactive DIN can delay:",
                bullets: ["Company filings", "Business decisions", "Regulatory approvals"],
              },
              {
                iconKey: "building",
                title: "Maintain Professional Credibility",
                desc: "Active DIN is essential for maintaining your role in business entities.",
              },
            ],
            importantNote:
              "Government fee for reactivation: ₹5,000 (applicable when KYC is not filed within due date).",
            requirements: {
              eligibility: {
                heading: "Common Reasons for Deactivation",
                items: [
                  "Non-filing of DIR-3 KYC",
                  "Missing annual DIN eKYC deadline",
                  "Incorrect or incomplete KYC details",
                ],
              },
              documents: [
                "PAN card",
                "Aadhaar card",
                "Email ID & mobile number",
                "Passport (for foreign directors)",
              ],
            },
            process: [
              "DIN status verification",
              "Document collection & validation",
              "Preparation of DIR-3 KYC form",
              "DSC-based filing with MCA",
              "Payment of government fee",
              "Reactivation confirmation",
            ],
            processSummary: "Fast. Accurate. Fully compliant.",
            insightAdvantage: {
              intro: "We go beyond filing:",
              points: [
                "Quick diagnosis of deactivation issue",
                "Error-free KYC filing to avoid rejection",
                "Assistance with DSC issues & verification",
                "Ensuring future compliance tracking",
              ],
            },
            commonMistakes: [
              "Delay in reactivation",
              "Incorrect KYC filing",
              "Mismatch in PAN/Aadhaar details",
              "Ignoring DIN status",
            ],
            postSupportTitle: "Post-Reactivation Support",
            postSupport: [
              "DIN compliance tracking",
              "Annual KYC reminders",
              "Director compliance advisory",
              "MCA filing support",
            ],
            growthInsight: {
              heading: "Strategic Insight",
              description:
                "DIN is not just an ID — it is your legal identity as a director.",
              listPrefix: "We ensure:",
              weHelpYou: [
                "It remains active",
                "It stays compliant",
                "It supports your business operations",
              ],
            },
            cta: {
              headline: "Get Your DIN Back — Without Delay",
              tagline: "Don't let a deactivated DIN disrupt your business.",
              buttonText: "Reactivate DIN",
            },
          },
        ],
      },
    ],
  },
];

/* ─── Helpers ─────────────────────────────────────── */
export const findService = (categoryId, subCategoryId, serviceId) => {
  const cat = servicesData.find((c) => c.categoryId === categoryId);
  if (!cat) return null;
  const sub = cat.subcategories.find((s) => s.subCategoryId === subCategoryId);
  if (!sub) return null;
  if (!serviceId) return null;
  return sub.services.find((s) => s.serviceId === serviceId) || null;
};

export const findSubcategory = (categoryId, subCategoryId) => {
  const cat = servicesData.find((c) => c.categoryId === categoryId);
  if (!cat) return null;
  return cat.subcategories.find((s) => s.subCategoryId === subCategoryId) || null;
};
