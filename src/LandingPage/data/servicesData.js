import registrationData from './registration';
import data2 from './registration2';
import cfo from './cfo';
import gst from './Gst';
import incometax from './incometax';
import mca from './mca';

// ─── URL-safe id ────────────────────────────────────────────────────────────
const toId = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

// ─── Registration.js normalizer ─────────────────────────────────────────────
function normalizeRegistrationService(rawData) {
  const getEligibility = () => {
    for (const key of ['directors_shareholders', 'eligibility', 'partners']) {
      if (rawData.requirements?.[key]) {
        const e = rawData.requirements[key];
        return { heading: e.title, items: e.points };
      }
    }
    return undefined;
  };

  const getGrowthInsight = () => {
    for (const key of ['strategy', 'conversion', 'growth']) {
      if (!rawData[key]) continue;
      const g = rawData[key];
      if (key === 'conversion') {
        return { heading: g.title, description: g.description, weHelpYou: [] };
      }
      const descs = Array.isArray(g.description) ? g.description : [g.description];
      const rawItems = descs.slice(1);
      const isNoteItem = (d) => d.startsWith('We ') && !d.endsWith(':');
      const listItems = rawItems.filter((d) => !isNoteItem(d) && !d.startsWith('👉'));
      const closing = rawItems.find((d) => isNoteItem(d) || d.startsWith('👉')) || undefined;
      return {
        heading: g.title,
        description: descs[0],
        weHelpYou: listItems,
        closing,
        listPrefix: '',
      };
    }
    return undefined;
  };

  const importantNote = (() => {
    for (const key of ['important_feature', 'important']) {
      if (rawData[key]) return rawData[key];
    }
    return rawData.establishment || undefined;
  })();

  return {
    tagline: rawData.tagline,
    whyChoose: rawData.why_choose
      ? { heading: rawData.why_choose.title, paragraphs: rawData.why_choose.description || [] }
      : undefined,
    process: rawData.process?.steps || registrationData.common_process?.steps || [],
    processSummary: rawData.process?.highlight || registrationData.common_process?.highlight,
    idealFor: rawData.ideal_for?.points || [],
    idealForHeading: rawData.ideal_for?.title,
    advantages: rawData.advantages
      ? {
          heading: rawData.advantages.title,
          items: rawData.advantages.items.map((item) => ({
            title: item.title,
            description: item.description,
            subPoints: item.sub_points,
          })),
        }
      : undefined,
    importantNote,
    establishment: rawData.establishment || undefined,
    requirements: {
      eligibility: getEligibility(),
      documents: rawData.requirements?.documents?.points || rawData.documents?.points || [],
    },
    insightAdvantage: rawData.advantage_section
      ? { intro: rawData.advantage_section.description, points: rawData.advantage_section.points || [] }
      : undefined,
    postSupport: rawData.post_support?.points,
    postSupportTitle: rawData.post_support?.title,
    commonMistakes: rawData.mistakes?.points,
    growthInsight: (() => { const g = getGrowthInsight(); return g ? { ...g, closing: undefined } : undefined; })(),
    serviceNote: getGrowthInsight()?.closing,
    cta: rawData.cta
      ? { headline: rawData.cta.title, tagline: rawData.cta.description, buttonText: rawData.cta.action }
      : undefined,
    contentSections: [],
    darkSections: [],
  };
}

// ─── Sections-based normalizer (incometax / mca) ─────────────────────────────
const DARK_KEYWORDS = [
  'insight consulting',
  'common mistake',
  'strategic insight',
  'why insight',
  'we go beyond',
  'important points',
];
const isDarkHeading = (title = '') => {
  const t = title.toLowerCase();
  return DARK_KEYWORDS.some((kw) => t.includes(kw)) || t.startsWith('post-');
};

function buildPointsField(points) {
  if (!points?.length) return {};
  // Detect label-with-subItems pattern: item ending with ':' followed by short items
  const hasLabel = points.some((p, i) =>
    p.endsWith(':') && i + 1 < points.length && points[i + 1].length < 60
  );
  if (!hasLabel) return { items: points };
  // Convert to nestedItems
  const nestedItems = [];
  let i = 0;
  while (i < points.length) {
    const pt = points[i];
    if (pt.endsWith(':') && i + 1 < points.length && points[i + 1].length < 60) {
      const subItems = [];
      i++;
      while (i < points.length && !points[i].endsWith(':') && points[i].length < 60) {
        subItems.push(points[i]);
        i++;
      }
      nestedItems.push({ text: pt, subItems });
    } else {
      nestedItems.push({ text: pt, subItems: [] });
      i++;
    }
  }
  return { nestedItems };
}

function rawSectionToGeneric(s) {
  if (!s || s.title === 'Shape') return null;
  const paragraphs = [];
  if (Array.isArray(s.description)) paragraphs.push(...s.description);
  else if (s.description) paragraphs.push(s.description);
  const hasPoints = !!s.points?.length;
  const hasExtraPoints = !!s.extraPoints?.length;
  const ed = s.extraDescription;
  const edIsArr = Array.isArray(ed);
  // extraDescription goes into paragraphs only when no points AND no extraPoints
  if (ed && !hasPoints && !hasExtraPoints) {
    if (edIsArr) paragraphs.push(...ed);
    else paragraphs.push(ed);
  }
  return {
    heading: s.title,
    ...(paragraphs.length && { paragraphs }),
    ...buildPointsField(s.points),
    // when points exist: extraDescription → closingParagraphs (array) or intro text for extraItems (string wrapped)
    ...(hasPoints && ed && (
      edIsArr
        ? { closingParagraphs: ed }
        : hasExtraPoints
          ? { closingParagraphs: [ed] }
          : { closingText: ed }
    )),
    ...(hasExtraPoints && { extraItems: s.extraPoints }),
    ...(s.closingText && { closingText: s.closingText }),
    // note: inline (after items, before extraItems) when extraPoints exist; footerNote: at card bottom otherwise
    ...(s.note && (hasExtraPoints ? { note: s.note } : { footerNote: s.note })),
    ...(s.table && {
      table: Array.isArray(s.table)
        ? {
            headers: Object.keys(s.table[0]).map((k) =>
              k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()
            ),
            rows: s.table.map((row) => Object.values(row)),
          }
        : s.table,
    }),
    ...(s.comparisonTable && { comparisonTable: s.comparisonTable }),
    ...(s.subSections?.length && {
      subSections: s.subSections.map((sub) => {
        // If subSection has description + points, make description a nested parent bullet
        if (sub.description && sub.points?.length) {
          const nestedItems = [
            { text: sub.description, subItems: sub.points },
            ...(sub.extraDescription ? [{ text: sub.extraDescription, subItems: [] }] : []),
          ];
          return { heading: sub.title, nestedItems };
        }
        return {
          heading: sub.title,
          ...(sub.description && { description: sub.description }),
          ...buildPointsField(sub.points),
          ...(sub.extraDescription && { extraDescription: sub.extraDescription }),
        };
      }),
    }),
  };
}

function normalizeSectionsService(rawData) {
  const sections = rawData.sections || [];
  const introSection = sections.find(
    (s) => s && s.title !== 'Shape' && (s.description || s.extraDescription)
  );
  const processSection = sections.find((s) => s?.title === 'Our End-to-End Process');
  const ctaSection = sections.find((s) => s?.title === 'CTA');

  const skipTitles = new Set([introSection?.title, processSection?.title, ctaSection?.title, 'Shape']);

  // Build indexed list so we can detect sections that fall after all dark sections
  const indexed = sections
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s && !skipTitles.has(s.title))
    .map(({ s, i }) => ({ generic: rawSectionToGeneric(s), origIdx: i }))
    .filter(({ generic }) => generic !== null);

  const lastDarkOrigIdx = indexed
    .filter(({ generic }) => isDarkHeading(generic.heading))
    .reduce((acc, { origIdx }) => Math.max(acc, origIdx), -1);

  const lightIndexed = indexed.filter(({ generic }) => !isDarkHeading(generic.heading));

  // contentSections: light sections BEFORE (or when no dark sections, all light)
  const contentSections = lightIndexed
    .filter(({ origIdx }) => lastDarkOrigIdx < 0 || origIdx < lastDarkOrigIdx)
    .map(({ generic }) => generic);

  // tailSections: light sections that come AFTER all dark sections (render after insight block)
  const tailSections = lastDarkOrigIdx >= 0
    ? lightIndexed.filter(({ origIdx }) => origIdx > lastDarkOrigIdx).map(({ generic }) => generic)
    : [];

  return {
    tagline: rawData.tagline,
    whyChoose:
      introSection
        ? (() => {
            const hasPoints = !!introSection.points?.length;
            const hasExtraPoints = !!introSection.extraPoints?.length;
            const desc = Array.isArray(introSection.description)
              ? introSection.description
              : introSection.description ? [introSection.description] : [];
            const ed = introSection.extraDescription;
            const edIsArr = Array.isArray(ed);
            return {
              heading: introSection.title,
              paragraphs: hasPoints
                ? desc
                : [...desc, ...(ed ? (edIsArr ? ed : [ed]) : [])],
              ...(hasPoints && { items: introSection.points }),
              ...(introSection.note && { note: introSection.note }),
              ...(hasPoints && ed && (
                edIsArr
                  ? { closingParagraphs: ed }
                  : hasExtraPoints
                    ? { closingParagraphs: [ed] }
                    : { closingText: ed }
              )),
              ...(hasExtraPoints && { extraItems: introSection.extraPoints }),
              ...(introSection.closingText && { closingText: introSection.closingText }),
            };
          })()
        : undefined,
    process: processSection?.points || [],
    processSummary: processSection?.note,
    contentSections,
    tailSections,
    ...(() => {
      const dark = indexed.filter(({ generic }) => isDarkHeading(generic.heading)).map(({ generic }) => generic);
      // Extract closingText from any dark section (e.g. Strategic Insight) → serviceNote
      let serviceNote = null;
      const cleanDark = dark.map((s) => {
        if (s.closingText) {
          serviceNote = serviceNote || s.closingText;
          const { closingText, ...rest } = s;
          return rest;
        }
        return s;
      });
      return { darkSections: cleanDark, serviceNote };
    })(),
    cta: ctaSection
      ? { headline: ctaSection.description, tagline: ctaSection.extraDescription, buttonText: ctaSection.action }
      : undefined,
  };
}

// ─── GST helper: move "We …" closing note from strategy → advantage closingNote ─
function mergeStrategyNote(sections) {
  const stratIdx = sections.findIndex(s => s.heading?.toLowerCase().includes('strategic'));
  let serviceNote = null;
  if (stratIdx >= 0) {
    const strat = sections[stratIdx];
    const note  = strat.items?.find(item => item.startsWith('We ') && !item.endsWith(':'));
    if (note) {
      serviceNote = note;
      strat.items = strat.items.filter(item => item !== note);
      if (!strat.items?.length) sections.splice(stratIdx, 1);
    }
  }
  return { sections, serviceNote };
}

// ─── GST normalizer ──────────────────────────────────────────────────────────
function buildGstSection(key, d) {
  if (!d) return null;
  if (Array.isArray(d)) {
    const [heading, ...paragraphs] = d;
    return { heading, paragraphs };
  }
  // Mixed mandatory array: may contain {label, subItems} objects alongside strings
  const hasMixedMandatory = d.mandatory?.some(item => typeof item === 'object');
  const sec = {
    heading: d.title || key,
    ...(d.subheading && { subheading: d.subheading }),
    ...(d.description && {
      paragraphs: Array.isArray(d.description) ? d.description : [d.description],
    }),
    ...(d.points?.length && { items: d.points }),
    ...(d.note && { note: d.note }),
    ...(!hasMixedMandatory && d.mandatory?.length && { items: d.mandatory }),
    ...(hasMixedMandatory && {
      nestedItems: d.mandatory.map(item =>
        typeof item === 'object'
          ? { text: item.label, subItems: item.subItems || [] }
          : { text: item, subItems: [] }
      ),
    }),
  };
  // sub-structures
  if (d.items?.length && d.items[0]?.title) {
    sec.serviceItems = d.items.map((item) => ({ name: item.title, description: item.description }));
    delete sec.items;
  }
  if (d.core || d.non_core) {
    sec.subSections = [
      d.core && { heading: 'Core Amendments', items: d.core },
      d.non_core && { heading: 'Non-Core Amendments', items: d.non_core },
    ].filter(Boolean);
  }
  if (d.foreign || d.authorized_signatory) {
    sec.subSections = [
      d.foreign && { heading: 'Foreign Business / Individual', items: d.foreign },
      d.authorized_signatory && { heading: 'Authorized Signatory', items: d.authorized_signatory },
    ].filter(Boolean);
    if (d.note) sec.note = d.note;
  }
  if (d.proprietorship || d.company) {
    sec.subSections = [
      d.proprietorship && { heading: 'Proprietorship', items: d.proprietorship },
      d.company && { heading: 'Companies / LLP / Firms', items: d.company },
    ].filter(Boolean);
    if (d.note) sec.note = d.note;
  }
  if (d.address || d.director || d.bank) {
    sec.subSections = [
      d.address && { heading: 'Address Change', items: d.address },
      d.director && { heading: 'Director Change', items: d.director },
      d.bank && { heading: 'Bank Details', items: d.bank },
    ].filter(Boolean);
    if (d.note) sec.note = d.note;
  }
  return sec;
}

function normalizeGstSection(rawData) {
  // First GST section wraps everything under main_section
  if (rawData.main_section) {
    const ms = rawData.main_section;
    const LIGHT_KEYS = ['who_needs', 'benefits', 'documents'];
    const DARK_KEYS = ['advantage', 'mistakes', 'post_support', 'strategy'];
    return {
      tagline: ms.tagline,
      whyChoose: ms.why_matters
        ? { heading: ms.why_matters.title, paragraphs: ms.why_matters.description || [] }
        : undefined,
      process: ms.process?.steps || [],
      processSummary: ms.process?.highlight,
      contentSections: LIGHT_KEYS.map((k) => buildGstSection(k, ms[k])).filter(Boolean),
      ...(() => {
        const { sections, serviceNote } = mergeStrategyNote(DARK_KEYS.map((k) => buildGstSection(k, ms[k])).filter(Boolean));
        return { darkSections: sections, serviceNote };
      })(),
      cta: ms.cta
        ? { headline: ms.cta.title, tagline: ms.cta.points?.[0], buttonText: ms.cta.points?.[1] }
        : undefined,
    };
  }

  // Flat structure – also capture outer intro/features/note
  const LIGHT_KEYS = ['who_needs', 'features', 'types', 'when_required', 'reasons', 'time_limit', 'importance', 'requirements', 'documents', 'ideal_for', 'intro', 'why', 'who_should_file', 'benefits', 'validity', 'applicable_returns', 'due_date', 'coverage'];
  const DARK_KEYS = ['advantage', 'use_cases', 'mistakes', 'post_support', 'strategy'];

  const whyChooseRaw = rawData.intro || rawData.why;
  let whyChoose;
  if (Array.isArray(whyChooseRaw)) {
    const [heading, ...paragraphs] = whyChooseRaw;
    whyChoose = { heading, paragraphs };
  } else if (whyChooseRaw?.title) {
    const baseParagraphs = Array.isArray(whyChooseRaw.description)
      ? whyChooseRaw.description
      : [whyChooseRaw.description].filter(Boolean);
    whyChoose = {
      heading: whyChooseRaw.title,
      paragraphs: [
        ...baseParagraphs,
        ...(whyChooseRaw.subheading ? [whyChooseRaw.subheading] : []),
      ],
      ...(whyChooseRaw.points?.length && { items: whyChooseRaw.points }),
      ...(whyChooseRaw.note && { note: whyChooseRaw.note }),
    };
  }

  // Capture outer intro, features, note (previously missing)
  const extraTopSections = [];
  if (rawData.intro && typeof rawData.intro === 'string') {
    extraTopSections.push({ heading: 'Intro', paragraphs: [rawData.intro] });
  }
  if (rawData.features && Array.isArray(rawData.features)) {
    extraTopSections.push({ heading: 'Features', items: rawData.features });
  }
  if (rawData.note && typeof rawData.note === 'string') {
    extraTopSections.push({ heading: 'Note', paragraphs: [rawData.note] });
  }

  const skipIntroKey = rawData.intro ? 'intro' : rawData.why ? 'why' : null;
  const lightSections = LIGHT_KEYS.filter((k) => k !== skipIntroKey)
    .map((k) => buildGstSection(k, rawData[k]))
    .filter(Boolean);

  // Combine extra top sections with other light sections
  const allLightSections = [...extraTopSections, ...lightSections];

  // Place "What You Get" directly after "Ideal For"
  const idealIdx = allLightSections.findIndex(s => s.heading?.toLowerCase().includes('ideal for'));
  const featIdx  = allLightSections.findIndex(s => s.heading?.toLowerCase().includes('what you get'));
  if (idealIdx >= 0 && featIdx >= 0 && featIdx !== idealIdx + 1) {
    const [feat] = allLightSections.splice(featIdx, 1);
    const newIdx = allLightSections.findIndex(s => s.heading?.toLowerCase().includes('ideal for'));
    allLightSections.splice(newIdx + 1, 0, feat);
  }

  return {
    tagline: rawData.tagline,
    whyChoose,
    process: rawData.process?.steps || [],
    processSummary: rawData.process?.highlight,
    contentSections: allLightSections,
    ...(() => {
      const { sections, serviceNote } = mergeStrategyNote(DARK_KEYS.map((k) => buildGstSection(k, rawData[k])).filter(Boolean));
      return { darkSections: sections, serviceNote };
    })(),
    cta: rawData.cta
      ? { headline: rawData.cta.title, tagline: rawData.cta.points?.[0], buttonText: rawData.cta.points?.[1] }
      : undefined,
  };
}

// ─── Compliance (registration2.js) normalizer ────────────────────────────────
function normalizeComplianceSection(rawData) {
  const contentSections = [];
  const darkSections = [];
  let whyChoose;
  let process = [];
  let heroIntro;

  // ── 12A & 80G ──
  if (rawData.twelveA || rawData.eightyG) {
    process = [
      'Review of NGO structure & eligibility',
      'Documentation preparation & verification',
      'Filing 12A application with Income Tax Department',
      'Filing 80G application (simultaneously or after 12A)',
      'Follow-up with department & query resolution',
      'Receipt of approval orders',
    ];

    heroIntro = {
      twelveA: rawData.twelveA ? {
        title: rawData.twelveA.title,
        description: rawData.twelveA.description,
        listHeading: "Why it's essential:",
        items: rawData.twelveA.why_essential || [],
        note: rawData.twelveA.note,
      } : null,
      eightyG: rawData.eightyG ? {
        title: rawData.eightyG.title,
        description: rawData.eightyG.description,
        listHeading: "Why it's essential:",
        items: rawData.eightyG.why_essential || [],
        note: rawData.eightyG.example,
      } : null,
    };

    // Combined benefits & eligibility first
    if (rawData.combined_benefits) {
      const cb = rawData.combined_benefits;
      contentSections.push({ heading: cb.title, table: cb.table, items: cb.points, note: cb.note });
    }
    if (rawData.eligibility_12A) {
      contentSections.push({ heading: rawData.eligibility_12A.title, items: rawData.eligibility_12A.points });
    }
    if (rawData.eligibility_80G) {
      const e = rawData.eligibility_80G;
      contentSections.push({
        heading: e.title,
        paragraphs: e.subtitle ? [e.subtitle] : undefined,
        note: e.note,
        items: e.points,
      });
    }
    if (rawData.difference) {
      contentSections.push({ heading: rawData.difference.title, table: rawData.difference.table });
    }

  }

  // ── NGO Darpan ──
  if (rawData.about) {
    whyChoose = {
      heading: rawData.about.title,
      paragraphs: Array.isArray(rawData.about.description)
        ? rawData.about.description
        : [rawData.about.description],
    };
    process = Array.isArray(rawData.services) && typeof rawData.services[0] === 'string'
      ? rawData.services
      : [];
    if (rawData.importance) {
      darkSections.push({ heading: rawData.importance.title, items: rawData.importance.points, fullWidth: true });
    }
    if (rawData.eligibility) {
      const pts = rawData.eligibility.points;
      const haveIdx = pts.findIndex(p => p === 'Have:');
      const beforeHave = haveIdx > 0 ? pts.slice(0, haveIdx) : pts;
      const afterHave = haveIdx >= 0 ? pts.slice(haveIdx + 1) : [];
      const nestedItems = [
        ...beforeHave.map(t => ({ text: t, subItems: [] })),
        ...(afterHave.length > 0 ? [{ text: 'Have:', subItems: afterHave }] : []),
      ];
      contentSections.push({
        heading: rawData.eligibility.title,
        paragraphs: ['To register, an NGO must:'],
        nestedItems,
      });
    }
  }

  // ── DSC ──
  if (rawData.what_is_dsc) {
    // strip *bold* markers from DSC data (authored with markdown-style asterisks)
    const stripMd = (s) => typeof s === 'string' ? s.replace(/\*/g, '').trim() : s;

    whyChoose = { heading: undefined, paragraphs: rawData.what_is_dsc.description || [] };

    if (rawData.importance) {
      darkSections.push({
        heading: stripMd(rawData.importance.title),
        items: rawData.importance.points.map(stripMd),
        fullWidth: true,
      });
    }

    if (rawData.types) {
      contentSections.push({
        heading: stripMd(rawData.types.title),
        subSections: rawData.types.items.map((item) => ({
          heading: stripMd(item.title),
          items: [
            ...(item.usage ? [{ isGroup: true, label: 'Used for:', subItems: item.usage }] : []),
            ...(item.validity ? [`Validity: ${stripMd(item.validity)}`] : []),
            ...(item.note ? [stripMd(item.note)] : []),
            ...(item.details ? item.details.map(stripMd) : []),
          ],
        })),
      });
    }

    if (rawData.documents_required) {
      const dr = rawData.documents_required;
      const subSections = [];

      if (dr.individual) {
        const ind = dr.individual;
        const items = [];
        if (ind.identity_proof) items.push({ isGroup: true, label: stripMd(ind.identity_proof.title), subItems: ind.identity_proof.points });
        if (ind.address_proof)  items.push({ isGroup: true, label: stripMd(ind.address_proof.title),  subItems: ind.address_proof.points });
        if (ind.pan)   items.push(stripMd(ind.pan));
        if (ind.photo) items.push(stripMd(ind.photo));
        if (ind.contact) items.push({ isGroup: true, label: stripMd(ind.contact.title), subItems: ind.contact.points });
        subSections.push({ heading: stripMd(ind.title), items });
      }

      if (dr.organization) {
        const orgItems = dr.organization.points.map((pt) =>
          pt.startsWith('*') && pt.endsWith('*') ? stripMd(pt) + ':' : pt
        );
        subSections.push({ heading: stripMd(dr.organization.title), items: orgItems });
      }

      contentSections.push({
        heading: stripMd(dr.title),
        paragraphs: dr.intro ? [dr.intro] : undefined,
        subSections,
      });
    }

    if (rawData.verification) {
      contentSections.push({
        heading: stripMd(rawData.verification.title),
        paragraphs: rawData.verification.intro ? [rawData.verification.intro] : undefined,
        items: rawData.verification.points,
      });
    }

    if (rawData.usb_token) {
      contentSections.push({
        heading: stripMd(rawData.usb_token.title),
        items: rawData.usb_token.points,
      });
    }

    if (rawData.tips) {
      darkSections.push({ heading: stripMd(rawData.tips.title), items: rawData.tips.points, fullWidth: true });
    }

    if (rawData.special_cases) {
      contentSections.push({
        heading: stripMd(rawData.special_cases.title),
        items: rawData.special_cases.points,
      });
    }
  }

  // ── Udyam ──
  if (rawData.why_required) {
    whyChoose = {
      heading: rawData.why_required.title,
      paragraphs: rawData.why_required.description || [],
    };
    if (rawData.who_should_register) {
      const wsr = rawData.who_should_register;
      const mainPoints = wsr.points.filter(p => !p.startsWith('✔'));
      const tagLine   = wsr.points.find(p => p.startsWith('✔'));
      contentSections.push({
        heading: wsr.title,
        paragraphs: ['If your business falls under any of the below, Udyam is a must:'],
        items: mainPoints,
        note: tagLine,
      });
    }
    if (rawData.classification) {
      contentSections.push({ heading: rawData.classification.title, table: rawData.classification.table });
    }
    if (rawData.benefits) {
      contentSections.push({
        heading: rawData.benefits.title,
        subSections: rawData.benefits.items.map((item) => ({ heading: item.title, items: item.points })),
      });
    }
    if (rawData.documents) {
      contentSections.push({ heading: rawData.documents.title, items: rawData.documents.points });
    }
    if (rawData.support) {
      process = rawData.support.points || [];
      darkSections.push({ heading: rawData.support.title, items: rawData.support.points, fullWidth: true });
    }
  }

  // Notes array is intentionally skipped (developer instructions, not user content)

  return { tagline: undefined, whyChoose, process, processSummary: undefined, contentSections, darkSections, cta: undefined, heroIntro };
}

// ─── CFO normalizer ──────────────────────────────────────────────────────────
function normalizeCfoService(rawData) {
  const contentSections = [];
  const darkSections = [];
  const heroSections = [];

  // Hero-only sections (top): VCFO ONBOARDING only
  const HERO_TITLES = ['VCFO - SEAMLESS ON-BOARDING PROCESS'];

  // Combine "UNDERSTANDING THE ROLE" + both "WHAT IS" sections into one block
  const WHAT_IS_TITLES = ['WHAT IS A FULL-TIME CFO?', 'WHAT IS A VIRTUAL CFO?'];
  const UNDERSTANDING_TITLE = 'UNDERSTANDING THE ROLE';
  let understandingSection = null;
  const whatIsSections = [];

  rawData.sections.forEach((sec) => {
    if (sec.title === UNDERSTANDING_TITLE && sec.content) {
      understandingSection = sec;
    } else if (WHAT_IS_TITLES.includes(sec.title) && sec.content) {
      whatIsSections.push(sec);
    }
  });

  if (understandingSection) {
    contentSections.push({
      heading: understandingSection.title,
      paragraphs: understandingSection.content,
      ...(whatIsSections.length > 0 && {
        whatIs: whatIsSections.map((s) => ({ heading: s.title, paragraphs: s.content })),
      }),
    });
  }

  const SKIP_TITLES = new Set([UNDERSTANDING_TITLE, ...WHAT_IS_TITLES]);

  rawData.sections.forEach((sec) => {
    if (SKIP_TITLES.has(sec.title)) return;
    const isHero = HERO_TITLES.includes(sec.title);

    if (sec.content) {
      const entry = { heading: sec.title, paragraphs: sec.content };
      isHero ? heroSections.push(entry) : contentSections.push(entry);
    } else if (sec.comparison) {
      const keys = Object.keys(sec.comparison.virtualCFO);
      contentSections.push({
        heading: sec.title,
        comparisonTable: {
          headers: ['', 'Virtual CFO', 'Full-time CFO'],
          rows: keys.map((k) => [k, sec.comparison.virtualCFO[k], sec.comparison.fullTimeCFO[k]]),
        },
      });
    } else if (sec.services) {
      contentSections.push({
        heading: sec.title,
        serviceItems: sec.services.map((s) => ({ name: s.name, description: s.description })),
      });
    } else if (sec.steps) {
      const entry = {
        heading: sec.title,
        processSteps: sec.steps.map((s) => ({ name: s.name, description: s.description })),
      };
      isHero ? heroSections.push(entry) : contentSections.push(entry);
    } else if (sec.description) {
      const isWhyInsight = sec.title?.toLowerCase().includes('why insight');
      darkSections.push({
        heading: sec.title,
        paragraphs: [sec.description],
        ...(isWhyInsight && { fullWidth: true }),
      });
    }
  });

  return {
    tagline: rawData.title,
    whyChoose: rawData.introduction
      ? { heading: 'Introduction', paragraphs: [rawData.introduction] }
      : undefined,
    heroSections,
    process: [],
    processSummary: undefined,
    contentSections,
    darkSections,
    hideInsightTitle: true,
    cta: undefined,
  };
}

// ─── Builder ─────────────────────────────────────────────────────────────────
function buildService(serviceId, name, dataType, rawData) {
  let normalized;
  switch (dataType) {
    case 'registration':   normalized = normalizeRegistrationService(rawData); break;
    case 'incometax':
    case 'mca':            normalized = normalizeSectionsService(rawData);     break;
    case 'gst':            normalized = normalizeGstSection(rawData);          break;
    case 'compliance':     normalized = normalizeComplianceSection(rawData);   break;
    case 'cfo':            normalized = normalizeCfoService(rawData);          break;
    default:               normalized = {};
  }
  return { serviceId, name, dataType, rawData, ...normalized };
}

// ─── Name resolvers ──────────────────────────────────────────────────────────
const stripEmoji = (t) =>
  t ? t.replace(/^(?:\p{Extended_Pictographic}[\uFE0F\u20E3]?\u200D?)+\s*/gu, '').trim() : t;

// Registration.js stores short names — map to full display names
const REGISTRATION_NAMES = {
  'Private Limited Company':            'Private Limited Company Registration in India',
  'One Person Company (OPC)':           'One Person Company (OPC) Registration in India',
  'Limited Liability Partnership (LLP)':'Limited Liability Partnership (LLP) Registration in India',
  'Partnership':                        'Partnership Firm Registration in India',
  'Proprietorship':                     'Proprietorship Firm Registration in India',
};
const regName = (raw) => REGISTRATION_NAMES[raw] || raw;

// Compliance all-caps titles — normalise to title case
const COMPLIANCE_NAMES = {
  'NGO DARPAN REGISTRATION': 'NGO Darpan Registration',
  'UDHYAM REGISTRATION':     'Udyam Registration',
};
const compName = (raw) => COMPLIANCE_NAMES[raw] || raw;

// GST — first section wraps content under main_section; use inner title for display
const gstDisplayName = (s) => {
  if (s.main_section?.title) return stripEmoji(s.main_section.title);
  return s.title ? stripEmoji(s.title) : 'GST Service';
};

// ─── Export ──────────────────────────────────────────────────────────────────
export const servicesData = [
  {
    categoryId: 'registration',
    categoryName: 'Registration',
    subcategories: [
      {
        subCategoryId: 'company-registration',
        subCategoryName: 'Company Registration',
        services: registrationData.services.map((s) =>
          buildService(toId(s.name), regName(s.name), 'registration', s)
        ),
      },
    ],
  },
  {
    categoryId: 'compliance',
    categoryName: 'Compliance & Registrations',
    subcategories: [
      {
        subCategoryId: 'ngo-compliance',
        subCategoryName: 'NGO & Compliance',
        services: data2.sections.map((s) =>
          buildService(toId(s.title), compName(s.title), 'compliance', s)
        ),
      },
    ],
  },
  {
    categoryId: 'gst',
    categoryName: 'GST Services',
    subcategories: [
      {
        subCategoryId: 'gst-services',
        subCategoryName: 'GST Services',
        services: gst.sections.map((s, i) =>
          buildService(toId(s.title || `gst-${i}`), gstDisplayName(s), 'gst', s)
        ),
      },
    ],
  },
  {
    categoryId: 'income-tax',
    categoryName: 'Income Tax',
    subcategories: [
      {
        subCategoryId: 'income-tax-services',
        subCategoryName: 'Income Tax Services',
        services: incometax.content.map((s) => buildService(toId(s.serviceName), s.serviceName, 'incometax', s)),
      },
    ],
  },
  {
    categoryId: 'mca',
    categoryName: 'MCA Compliance',
    subcategories: [
      {
        subCategoryId: 'mca-services',
        subCategoryName: 'MCA Services',
        services: mca.content.map((s) => buildService(toId(s.serviceName), s.serviceName, 'mca', s)),
      },
    ],
  },
  {
    categoryId: 'cfo',
    categoryName: 'CFO Services',
    subcategories: [
      {
        subCategoryId: 'cfo-services',
        subCategoryName: 'CFO Services',
        services: [buildService('cfo-services', cfo.serviceName, 'cfo', cfo)],
      },
    ],
  },
];

export const findSubcategory = (categoryId, subCategoryId) => {
  const cat = servicesData.find((c) => c.categoryId === categoryId);
  return cat?.subcategories.find((s) => s.subCategoryId === subCategoryId);
};

export const findService = (categoryId, subCategoryId, serviceId) => {
  const sub = findSubcategory(categoryId, subCategoryId);
  return sub?.services.find((s) => s.serviceId === serviceId);
};