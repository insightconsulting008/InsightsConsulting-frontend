import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Building2, Heart, Tag, Sparkles } from "lucide-react";

const TABLE_HEADER_ICONS = {
  '12A':     <Building2 size={13} className="text-primary flex-shrink-0" />,
  '80G':     <Heart size={13} className="text-primary flex-shrink-0" />,
  'Benefit': <Tag size={13} className="text-gray-500 flex-shrink-0" />,
  'Criteria': <Tag size={13} className="text-gray-500 flex-shrink-0" />,
};
import { findService } from "./data/servicesData";
import EnquiryPopup from "./reusable/Popup";

/* ─────────────────────────────────────────────────────────
   STRIP LEADING EMOJI
───────────────────────────────────────────────────────── */
const stripLeadingEmoji = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/^(?:\p{Extended_Pictographic}[\uFE0F\u20E3]?\u200D?)+\s*/gu, '')
    .replace(/\*/g, '')
    .trim();
};

/* ─────────────────────────────────────────────────────────
   SECTION LABEL  (red accent + small caps)
───────────────────────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <div className="inline-flex items-center gap-2.5 mb-5 bg-primary/[0.08] border border-primary/25 rounded-full px-4 py-2">
    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
    <span className="text-[11px] font-bold tracking-widest uppercase text-primary">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────
   CARD SECTION HEADING  (primary title inside cards)
───────────────────────────────────────────────────────── */
const CardHeading = ({ text }) => (
  <div className="flex items-start gap-3 mb-5 lg:mb-7">
    <span className="w-[4px] h-7 bg-primary rounded-full flex-shrink-0 mt-[2px]" />
    <h3 className="text-[18px] lg:text-[22px] font-bold text-gray-900 leading-snug tracking-tight">
      {stripLeadingEmoji(text)}
    </h3>
  </div>
);

/* ─────────────────────────────────────────────────────────
   GROUPED-ITEMS PARSER
───────────────────────────────────────────────────────── */
const HEADER_STARTS = [
  '✅','⚠️','📌','🔐','🧾','💰','📈','🏛️','📉','🔓','👤','🛡️','⏳',
  '🤝','📑','🔍','📝','🏢','🔄','🏦','📬','📞','📊','👥','🌟','⚡',
  '🎯','🔔','🌐','📋','💡','🏆','🔑','🧩','🌍','🆔','🔹','⚖️','📦',
];
const isHeader = (text) =>
  text && !text.startsWith('👉') && HEADER_STARTS.some((p) => text.startsWith(p));

const parseGroups = (items) => {
  if (!items?.length) return null;
  if (items.filter(isHeader).length < 2) return null;
  const groups = [];
  let current = null;
  items.forEach((item) => {
    if (isHeader(item)) {
      if (current) groups.push(current);
      current = { header: item, description: null, items: [], notes: [] };
    } else if (item.startsWith('👉')) {
      if (current) current.notes.push(item);
      else groups.push({ header: null, description: null, items: [], notes: [item] });
    } else {
      if (!current) current = { header: null, description: null, items: [], notes: [] };
      if (!current.description && current.items.length === 0 && item.length > 30)
        current.description = item;
      else current.items.push(item);
    }
  });
  if (current) groups.push(current);
  return groups;
};

const colClass = (count) =>
  count === 1 ? 'grid-cols-1' : count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

/* ─────────────────────────────────────────────────────────
   NOTE / CALLOUT BOX
───────────────────────────────────────────────────────── */
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-[1px]">
    <path
      d="M10 1.5l2.163 5.674H18l-4.619 3.414 1.764 5.441L10 12.746l-5.145 3.283 1.764-5.441L2 7.174h5.837L10 1.5z"
      fill="#7C3AED"
      fillOpacity="0.9"
    />
    <path
      d="M10 1.5l2.163 5.674H18l-4.619 3.414 1.764 5.441L10 12.746l-5.145 3.283 1.764-5.441L2 7.174h5.837L10 1.5z"
      stroke="#7C3AED"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

const NoteBox = ({ text }) => {
  if (!text) return null;
  const clean = stripLeadingEmoji(text);
  return (
    <div className="flex items-start gap-3 mt-4 mb-1 bg-primary/[0.06] border border-primary/30 rounded-xl px-4 py-3.5 shadow-[0_2px_8px_rgba(124,58,237,0.08)]">
      <StarIcon />
      <p className="text-[15px] lg:text-[16px] leading-relaxed font-semibold italic text-primary/90 tracking-tight">
        {clean}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LIGHT ITEM CARD
───────────────────────────────────────────────────────── */
const ItemCard = ({ group }) => (
  <div className="h-full bg-white border border-primary/15 rounded-xl p-5 lg:p-7 shadow-[0_2px_12px_rgba(124,58,237,0.07)] flex flex-col gap-3 hover:border-primary/35 hover:shadow-[0_4px_20px_rgba(124,58,237,0.12)] transition-all duration-200">
    {group.header && (
      <p className="text-[16px] lg:text-[17px] font-bold text-gray-900 leading-snug mb-1">
        {stripLeadingEmoji(group.header)}
      </p>
    )}
    {group.description && (
      <p className="text-gray-600 text-[14px] lg:text-[15px] leading-relaxed">
        {stripLeadingEmoji(group.description)}
      </p>
    )}
    {group.items.length > 0 && (
      <div className="space-y-2.5 mt-0.5">
        {group.items.map((it, i) =>
          it.endsWith(':') ? (
            <p key={i} className="text-[11px] font-bold tracking-wider uppercase text-gray-400 mt-3 mb-0.5">
              {stripLeadingEmoji(it)}
            </p>
          ) : (
            <div key={i} className="flex items-start gap-2.5 text-gray-700 text-[14px] lg:text-[15px] leading-relaxed">
              <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {stripLeadingEmoji(it)}
            </div>
          )
        )}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────
   DARK ITEM CARD
───────────────────────────────────────────────────────── */
const DarkItemCard = ({ group }) => (
  <div className="h-full bg-gray-800/80 border border-gray-700/60 rounded-xl p-5 lg:p-6 flex flex-col gap-2.5">
    {group.header && (
      <p className="text-[15px] font-bold text-white leading-snug mb-1">
        {stripLeadingEmoji(group.header)}
      </p>
    )}
    {group.description && (
      <p className="text-gray-400 text-sm lg:text-[14px] leading-relaxed">
        {stripLeadingEmoji(group.description)}
      </p>
    )}
    {group.items.length > 0 && (
      <div className="space-y-2 mt-0.5">
        {group.items.map((it, i) =>
          it.endsWith(':') ? (
            <p key={i} className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mt-2.5 mb-0.5">
              {stripLeadingEmoji(it)}
            </p>
          ) : (
            <div key={i} className="flex items-start gap-2 text-gray-300 text-sm lg:text-[14px] leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {stripLeadingEmoji(it)}
            </div>
          )
        )}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────
   GROUPED SECTION BOX — multiple sections in one card
───────────────────────────────────────────────────────── */
const GroupedSectionBox = ({ sections }) => {
  if (!sections?.length) return null;
  return (
    <div className="bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">
      {sections.map((sec, idx) => {
        const { heading, paragraphs, items, table, subSections, nestedItems, closingParagraphs, extraItems, footerNote, note } = sec;
        const groups = parseGroups(items);
        return (
          <div key={idx}>
            {idx > 0 && <div className="border-t border-gray-200 my-6" />}
            {heading && <CardHeading text={heading} />}
            {paragraphs?.length > 0 && (
              <div className="space-y-3 mb-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                    {stripLeadingEmoji(p)}
                  </p>
                ))}
              </div>
            )}
            {groups ? (
              <div className={`grid ${colClass(groups.length)} gap-4 mb-4`}>
                {groups.map((g, i) => <ItemCard key={i} group={g} />)}
              </div>
            ) : items?.length > 0 && (
              <ul className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {stripLeadingEmoji(item)}
                  </li>
                ))}
              </ul>
            )}
            {table && (
              <div className="overflow-x-auto mt-2 mb-4">
                <table className="w-auto text-left border-collapse">
                  <thead>
                    <tr>
                      {table.headers.map((h, i) => (
                        <th key={i} className={`border border-gray-200 bg-primary/[0.06] px-5 py-4 font-bold text-gray-900 text-[15px] lg:text-[17px] whitespace-nowrap ${i > 0 ? 'text-center' : ''}`}>
                          {stripLeadingEmoji(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {(Array.isArray(row) ? row : []).map((cell, j) => (
                          <td key={j} className={`border border-gray-200 px-5 py-3.5 text-gray-700 text-[14px] lg:text-[16px] leading-relaxed ${j > 0 ? 'text-center' : ''}`}>
                            {j === 0 ? stripLeadingEmoji(cell) : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {subSections?.length > 0 && (
              <div className={`grid ${colClass(subSections.length)} gap-4 mb-4`}>
                {subSections.map((sub, i) => (
                  <div key={i} className="h-full bg-white border border-primary/15 rounded-xl p-5 lg:p-6 shadow-[0_2px_12px_rgba(124,58,237,0.06)]">
                    <p className="text-[16px] lg:text-[17px] font-bold text-gray-900 leading-snug mb-3">
                      {stripLeadingEmoji(sub.heading)}
                    </p>
                    {sub.description && (
                      <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mb-2">
                        {stripLeadingEmoji(sub.description)}
                      </p>
                    )}
                    {sub.items?.length > 0 && (
                      <div className="space-y-2">
                        {sub.items.map((it, j) => (
                          <div key={j} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-base">
                            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                            {stripLeadingEmoji(it)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {closingParagraphs?.map((p, i) => (
              <p key={i} className="text-gray-700 text-[15px] lg:text-[17px] leading-relaxed mt-3">{p}</p>
            ))}
            {extraItems?.length > 0 && (
              <ul className="space-y-2 mt-3 mb-4">
                {extraItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                    <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
                    {stripLeadingEmoji(item)}
                  </li>
                ))}
              </ul>
            )}
            {(note || footerNote) && <NoteBox text={note || footerNote} />}
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   GENERIC SECTION CARD  (light)
───────────────────────────────────────────────────────── */
const GenericSectionCard = ({ section }) => {
  if (!section) return null;
  const { heading, paragraphs, items, note, footerNote, subSections, serviceItems, processSteps, table, comparisonTable, nestedItems, subheading, closingText, closingParagraphs, extraItems, whatIs, preHeading, helpItems, transitionText } = section;
  const groups = parseGroups(items);

  return (
    <div className="bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">

      {preHeading && (
        <p className="text-[16px] lg:text-[17px] text-gray-700 leading-relaxed mb-4 pb-4 border-b border-gray-200">
          {Array.isArray(preHeading)
            ? preHeading.map((seg, i) =>
                seg.bold
                  ? <strong key={i} className="text-gray-900 font-bold">{seg.text}</strong>
                  : <span key={i}>{seg.text}</span>
              )
            : preHeading}
        </p>
      )}
      {heading && <CardHeading text={heading} />}

      {/* paragraphs — question sentences get a special callout style */}
      {paragraphs?.length > 0 && (
        <div className="space-y-3 mb-4">
          {paragraphs.map((p, i) =>
            p.endsWith('?') ? (
              <div key={i} className="bg-primary/5 border-l-4 border-primary/40 rounded-r-xl px-5 py-3 my-1">
                <p className="text-gray-900 text-[15px] lg:text-[17px] font-semibold leading-relaxed">
                  {stripLeadingEmoji(p)}
                </p>
              </div>
            ) : (
              <p key={i} className="text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                {stripLeadingEmoji(p)}
              </p>
            )
          )}
        </div>
      )}

      {/* inline sub-heading (sits between title and items) */}
      {subheading && (
        <p className="text-[15px] lg:text-[17px] font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 leading-snug">
          {subheading}
        </p>
      )}

      {/* items: grouped → cards / flat → bullets */}
      {groups ? (
        <>
          <div className={`grid ${colClass(groups.length)} gap-4 mb-4`}>
            {groups.map((g, i) => <ItemCard key={i} group={g} />)}
          </div>
          {groups.flatMap(g => g.notes).map((note, i) => (
            <div key={i} className="mt-3">
              <NoteBox text={note} />
            </div>
          ))}
        </>
      ) : items?.length > 0 && (
        <ul className="space-y-3 mb-4">
          {items.map((item, i) => {
            if (item.startsWith('👉')) {
              const clean = stripLeadingEmoji(item);
              /* ends with ':' → sub-label/intro title, not a callout note */
              if (clean.endsWith(':')) {
                return (
                  <li key={i} className="list-none">
                    <p className="text-[13px] font-bold tracking-wider uppercase text-gray-500 mt-1 mb-0.5">
                      {clean.slice(0, -1)}
                    </p>
                  </li>
                );
              }
              return <NoteBox key={i} text={item} />;
            }
            return (
              <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            );
          })}
        </ul>
      )}

      {/* nested items (e.g. NGO eligibility with sub-bullets) */}
      {nestedItems?.length > 0 && (
        <div className="space-y-2 mb-4">
          {nestedItems.map((item, i) =>
            item.subItems?.length > 0 ? (
              <div key={i}>
                <p className="text-sm font-semibold text-gray-700 mb-1.5">
                  {stripLeadingEmoji(item.text)}
                </p>
                <div className="pl-4 space-y-1.5">
                  {item.subItems.map((sub, j) => (
                    <div key={j} className="flex items-start gap-2 text-gray-600 text-[14px] leading-relaxed">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2.5 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {stripLeadingEmoji(item.text)}
              </div>
            )
          )}
        </div>
      )}

      {/* help items — intro subtitle + styled bullet list (e.g. CFO vCFO pitch) */}
      {helpItems && (
        <div className="mt-6">
          {helpItems.intro && (
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-[4px] h-6 bg-primary rounded-full flex-shrink-0" />
              <p className="text-gray-900 text-[17px] lg:text-[19px] font-bold leading-snug">
                {helpItems.intro}
              </p>
            </div>
          )}
          {helpItems.points?.length > 0 && (
            <ul className="space-y-2.5 pl-1">
              {helpItems.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                  <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {stripLeadingEmoji(pt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* closing paragraphs — "With Insight Consulting..." + "But here's the real question?" */}
      {closingParagraphs?.length > 0 && (
        <div className="mt-5 space-y-3">
          {closingParagraphs.map((p, i) =>
            p.startsWith('👉') ? (
              <NoteBox key={i} text={p} />
            ) : p.endsWith('?') ? (
              <div key={i} className="bg-primary/5 border-l-4 border-primary/40 rounded-r-xl px-5 py-3">
                <p className="text-gray-900 text-[15px] lg:text-[17px] font-semibold leading-relaxed">
                  {p}
                </p>
              </div>
            ) : (
              <p key={i} className="text-gray-700 text-[15px] lg:text-[17px] font-medium leading-relaxed">
                {p}
              </p>
            )
          )}
        </div>
      )}

      {/* transition text — "Let's compare..." subtitle, comes after the question */}
      {transitionText && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-gray-800 text-[16px] lg:text-[18px] font-semibold leading-snug italic">
            {transitionText}
          </p>
        </div>
      )}

      {/* WHAT IS side-by-side cards — follow immediately after "Let's compare..." */}
      {whatIs?.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          {whatIs.map((card, i) => (
            <div key={i} className="bg-primary/[0.03] border border-primary/20 rounded-2xl p-6 lg:p-7 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-[3px] h-5 bg-primary rounded-full flex-shrink-0" />
                <p className="text-[13px] lg:text-[14px] font-bold tracking-widest uppercase text-primary">
                  {card.heading}
                </p>
              </div>
              <div className="space-y-3">
                {card.paragraphs?.map((p, j) => (
                  <p key={j} className="text-gray-700 text-[14px] lg:text-[16px] leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* extra items — consequence list with ❌ prefix */}
      {extraItems?.length > 0 && (
        <ul className="space-y-2 mt-3 mb-4">
          {extraItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
              <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
              {stripLeadingEmoji(item)}
            </li>
          ))}
        </ul>
      )}

      {/* closing text — plain paragraph after items/nestedItems */}
      {closingText && (
        <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mt-3 mb-4">
          {closingText}
        </p>
      )}

      {/* sub-sections → card grid */}
      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-4 mb-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="h-full bg-white border border-primary/15 rounded-xl p-5 lg:p-6 shadow-[0_2px_12px_rgba(124,58,237,0.06)]">
              <p className="text-[16px] lg:text-[17px] font-bold text-gray-900 leading-snug mb-3">
                {stripLeadingEmoji(sub.heading)}
              </p>
              {sub.description && (
                <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mb-2">
                  {stripLeadingEmoji(sub.description)}
                </p>
              )}
              {sub.nestedItems?.length > 0 && (
                <div className="space-y-2">
                  {sub.nestedItems.map((item, j) =>
                    item.subItems?.length > 0 ? (
                      <div key={j}>
                        <div className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-base mb-1">
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {stripLeadingEmoji(item.text)}
                        </div>
                        <div className="pl-5 space-y-1.5">
                          {item.subItems.map((si, k) => (
                            <div key={k} className="flex items-start gap-2 text-gray-600 text-[14px] lg:text-[15px]">
                              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {si}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div key={j} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {stripLeadingEmoji(item.text)}
                      </div>
                    )
                  )}
                </div>
              )}
              {sub.items?.length > 0 && (
                <div className="space-y-2">
                  {sub.items.map((it, j) =>
                    it?.isGroup ? (
                      <div key={j} className="space-y-1">
                        <p className="text-[12px] font-bold tracking-widest uppercase text-gray-500">
                          {it.label}
                        </p>
                        <div className="pl-3 space-y-1.5">
                          {it.subItems.map((si, k) => (
                            <div key={k} className="flex items-start gap-2 text-gray-600 text-[15px] lg:text-base">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                              {si}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : it.startsWith('👉') ? (
                      <NoteBox key={j} text={it} />
                    ) : (
                      <div key={j} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-[16px] leading-relaxed">
                        <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {stripLeadingEmoji(it)}
                      </div>
                    )
                  )}
                </div>
              )}
              {sub.extraDescription && (
                <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mt-2 pt-2 border-t border-gray-100">
                  {sub.extraDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* service items → card grid */}
      {serviceItems?.length > 0 && (
        <div className={`grid ${colClass(serviceItems.length)} gap-4 mb-4`}>
          {serviceItems.map((item, i) => (
            <div key={i} className="h-full bg-white border border-primary/15 rounded-xl p-5 lg:p-6 shadow-[0_2px_12px_rgba(124,58,237,0.06)] hover:border-primary/30 transition-all duration-200">
              <p className="text-[16px] lg:text-[17px] font-bold text-gray-900 leading-snug mb-2.5">
                {stripLeadingEmoji(item.name)}
              </p>
              {item.description && (
                <p className="text-gray-600 text-[14px] lg:text-[15px] leading-relaxed">
                  {stripLeadingEmoji(item.description)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* process steps → highlighted numbered cards */}
      {processSteps?.length > 0 && (
        <div className="mb-4">
          <ol className={`grid ${colClass(processSteps.length)} gap-4`}>
            {processSteps.map((step, i) => (
              <li key={i} className="h-full bg-white border border-primary/15 rounded-xl p-5 lg:p-6 shadow-[0_2px_12px_rgba(124,58,237,0.07)] flex items-start gap-3 hover:border-primary/30 transition-all duration-200">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] lg:text-[17px] font-semibold text-gray-900">
                    {stripLeadingEmoji(step.name)}
                  </p>
                  {step.description && (
                    <p className="text-gray-600 text-[14px] lg:text-[15px] leading-relaxed mt-1">
                      {stripLeadingEmoji(step.description)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* standard table */}
      {table && (
        <div className="overflow-x-auto mt-6 mb-4">
          <table className="w-auto text-left border-collapse">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th key={i} className={`border border-gray-200 bg-primary/[0.06] px-5 py-4 font-bold text-gray-900 text-[15px] lg:text-[17px] whitespace-nowrap ${i > 0 ? 'text-center' : ''}`}>
                    <span className={`inline-flex items-center gap-1.5 ${i > 0 ? 'justify-center' : ''}`}>
                      {TABLE_HEADER_ICONS[h]}
                      {stripLeadingEmoji(h)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {(Array.isArray(row) ? row : []).map((cell, j) => (
                    <td key={j} className={`border border-gray-200 px-5 py-3.5 text-gray-700 text-[14px] lg:text-[16px] leading-relaxed ${j > 0 ? 'text-center' : ''}`}>
                      {j === 0 ? stripLeadingEmoji(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* comparison table */}
      {comparisonTable && (
        <div className="overflow-x-auto mb-4">
          <table className="w-auto text-left border-collapse">
            <thead>
              <tr>
                {comparisonTable.headers.map((h, i) => (
                  <th key={i} className={`border border-gray-200 bg-primary/[0.06] px-5 py-4 font-bold text-gray-900 text-[15px] lg:text-[17px] whitespace-nowrap ${i > 0 ? 'text-center' : ''}`}>
                    <span className={`inline-flex items-center gap-1.5 ${i > 0 ? 'justify-center' : ''}`}>
                      {TABLE_HEADER_ICONS[h]}
                      {stripLeadingEmoji(h)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTable.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className={`border border-gray-200 px-5 py-3.5 text-gray-700 text-[14px] lg:text-[16px] leading-relaxed ${j === 0 ? "font-semibold" : "text-center"}`}>
                      {j === 0 ? stripLeadingEmoji(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* note — always rendered at the bottom, after all content */}
      {note && (
        note.startsWith('✔') ? (
          <div className="mt-5 inline-flex items-center gap-2 bg-primary/8 border border-primary/25 text-primary text-[13px] font-semibold rounded-xl px-4 py-2.5 shadow-sm">
            {note}
          </div>
        ) : (
          <NoteBox text={note} />
        )
      )}

      {footerNote && (
        footerNote.startsWith('✔') ? (
          <div className="mt-3 inline-flex items-center gap-2 bg-primary/8 border border-primary/25 text-primary text-[13px] font-semibold rounded-xl px-4 py-2.5 shadow-sm">
            {footerNote}
          </div>
        ) : (
          <NoteBox text={footerNote} />
        )
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   GENERIC DARK CARD
───────────────────────────────────────────────────────── */
const GenericDarkCard = ({ section, serviceNote }) => {
  if (!section) return null;
  const { heading, paragraphs, items, closingText, closingParagraphs, extraItems, subSections, note } = section;
  const groups = parseGroups(items);

  return (
    <div className="h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">

      {heading && (
        <div className="flex items-start gap-3 mb-4 lg:mb-6">
          <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
          <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
            {stripLeadingEmoji(heading)}
          </h3>
        </div>
      )}

      {paragraphs?.length > 0 && (
        <div className="space-y-3 mb-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed">
              {stripLeadingEmoji(p)}
            </p>
          ))}
        </div>
      )}

      {groups ? (
        <div className={`grid ${items.filter(isHeader).length <= 2 ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-3`}>
          {groups.map((g, i) => <ItemCard key={i} group={g} />)}
        </div>
      ) : items?.length > 0 && (
        <ul className="space-y-3">
          {items.map((item, i) =>
            item.startsWith('👉') || (item.startsWith('We ') && !item.endsWith(':')) ? (
              <NoteBox key={i} text={item} />
            ) : (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-[15px] lg:text-base">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            )
          )}
        </ul>
      )}

      {closingParagraphs?.map((p, i) => (
        <p key={i} className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mt-4">
          {p}
        </p>
      ))}

      {extraItems?.length > 0 && (
        <ul className="space-y-2 mt-3">
          {extraItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600 text-[15px] lg:text-base">
              <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
              {stripLeadingEmoji(item)}
            </li>
          ))}
        </ul>
      )}

      {closingText && (
        <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed mt-4">
          {closingText}
        </p>
      )}

      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-3 mt-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="bg-primary/[0.04] border border-primary/15 rounded-xl p-4 lg:p-5">
              <p className="text-[14px] font-bold text-gray-900 leading-snug mb-2.5">
                {stripLeadingEmoji(sub.heading)}
              </p>
              {sub.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {sub.description}
                </p>
              )}
              {sub.items?.length > 0 && (
                <ul className="space-y-1.5">
                  {sub.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {note && <NoteBox text={note} />}
      {serviceNote && <NoteBox text={serviceNote} />}

    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ADVANTAGES SECTION (registration)
───────────────────────────────────────────────────────── */
const AdvantagesSection = ({ advantages }) => {
  if (!advantages) return null;
  return (
    <section className="py-8 lg:py-12">
      <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
        {stripLeadingEmoji(advantages.heading)}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {advantages.items.map((item, i) => (
          <div key={i} className="h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-8 shadow-[0_2px_16px_rgba(124,58,237,0.07)] hover:border-primary/30 transition-all duration-200">
            <p className="text-[17px] font-bold text-primary leading-snug mb-3">
              {stripLeadingEmoji(item.title)}
            </p>
            <p className="text-gray-700 text-[15px] lg:text-[17px] leading-relaxed mb-3">
              {stripLeadingEmoji(item.description)}
            </p>
            {item.subPoints?.length > 0 && (
              <ul className="space-y-2">
                {item.subPoints.map((sp, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px]">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {stripLeadingEmoji(sp)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   IMPORTANT NOTE SECTION (registration)
───────────────────────────────────────────────────────── */
const ImportantNoteSection = ({ importantNote }) => {
  if (!importantNote) return null;
  const { title, points, description, highlight } = importantNote;
  return (
    <div className="w-full h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">
      {title && <CardHeading text={title} />}
      {description && (
        <p className="text-gray-700 text-[15px] lg:text-[17px] leading-relaxed mb-3">
          {stripLeadingEmoji(description)}
        </p>
      )}
      {points?.length > 0 && (
        <ul className="space-y-2.5">
          {points.map((pt, i) => {
            if (pt.startsWith('👉')) {
              const clean = stripLeadingEmoji(pt);
              if (clean.endsWith(':')) {
                return (
                  <li key={i} className="list-none">
                    <p className="text-[13px] font-bold tracking-wider uppercase text-gray-500 mt-1 mb-0.5">
                      {clean.slice(0, -1)}
                    </p>
                  </li>
                );
              }
              return <li key={i} className="list-none"><NoteBox text={pt} /></li>;
            }
            return (
              <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {stripLeadingEmoji(pt)}
              </li>
            );
          })}
        </ul>
      )}
      {highlight && <NoteBox text={highlight} />}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   INLINE PROCESS LIST  (registration section overview)
───────────────────────────────────────────────────────── */
const ProcessList = ({ steps, note }) => {
  if (!steps?.length) return null;
  return (
    <div className="bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">
      <div className="flex items-start gap-3 mb-4 lg:mb-6">
        <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
        <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">Our End-to-End Process</h3>
      </div>
      <ol className="space-y-3.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            {stripLeadingEmoji(step)}
          </li>
        ))}
      </ol>
      {note && <NoteBox text={note} />}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const ServiceContent = ({ hideCta = false }) => {
  const { categoryId, subCategoryId, serviceId } = useParams();
  const service = findService(categoryId, subCategoryId, serviceId);
  const [popupOpen, setPopupOpen] = useState(false);

  if (!service) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm">
        Service details not available.
      </div>
    );
  }

  const isRegistration = service.dataType === 'registration';

  /* ── Separate "Documents" sections so they always render just before Insight ── */
  const isImportantNotesSection = (s) => {
    const h = s?.heading?.toLowerCase() || '';
    return h.includes('important points');
  };
  const isSupportSection = (s) => {
    const h = s?.heading?.toLowerCase() || '';
    return h.includes('our support');
  };
  const isDocSection = (s) => {
    const h = s?.heading?.toLowerCase() || '';
    return h.includes('document') || h.includes('what we need') || isImportantNotesSection(s) || isSupportSection(s);
  };
  const mainContentSections = service.contentSections?.filter((s) => !isDocSection(s)) || [];
  const docContentSections  = service.contentSections?.filter(isDocSection) || [];

  /* ── Overview grid: compute which cards are visible, span last if alone ── */
  const overviewKeys = [
    service.idealFor?.length > 0        && 'idealFor',
    service.formsHandled                 && 'formsHandled',
    service.establishment                && 'establishment',
  ].filter(Boolean);
  const overviewLast  = overviewKeys[overviewKeys.length - 1];
  const overviewAlone = (key) => overviewKeys.length % 2 !== 0 && overviewLast === key ? 'lg:col-span-2' : '';

  /* ── Insight grid: simulate 2-col flow to detect lone last card ── */
  const insightFlow = [
    service.insightAdvantage            && { key: 'insightAdvantage', full: false },
    service.postSupport?.length > 0     && { key: 'postSupport',      full: false },
    service.commonMistakes?.length > 0  && { key: 'commonMistakes',   full: false },
    service.growthInsight               && { key: 'growthInsight',    full: false },
    ...(service.darkSections?.map((s, i) => ({ key: `dark_${i}`, full: !!s.fullWidth })) || []),
  ].filter(Boolean);
  let _rowPos = 0, _loneKey = null;
  insightFlow.forEach(({ key, full }) => {
    if (full) { _rowPos = 0; }
    else { if (_rowPos === 0) _loneKey = key; _rowPos = (_rowPos + 1) % 2; }
  });
  const insightAlone = _rowPos === 1 ? _loneKey : null;
  const insightSpan  = (key) => insightAlone === key ? 'sm:col-span-2' : '';

  /* Registration documents (from requirements) */
  const regDocs = isRegistration ? service.requirements?.documents : null;

  return (
    <div
      className="relative"
      style={{
        backgroundImage: "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* gradient overlay: let image breathe at top, fade to clean white towards body */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.93) 40%, rgba(255,255,255,0.97) 100%)'}} />

      <div className="relative">
      <div className="container mx-auto px-4 lg:px-12">

        {/* ────────────────────────────────────────────────
            OVERVIEW — Ideal For + Important Note (registration)
        ──────────────────────────────────────────────── */}
        {(service.idealFor?.length > 0 || service.formsHandled || service.establishment) && (
          <section id="overview" className="py-5 lg:py-14">
            <div className={`grid gap-5 ${overviewKeys.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

              {service.idealFor?.length > 0 && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${overviewAlone('idealFor')}`}>
                  <CardHeading text={service.idealForHeading || "Ideal For"} />
                  <ul className="space-y-3">
                    {service.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.formsHandled && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-10 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${overviewAlone('formsHandled')}`}>
                  <CardHeading text={service.formsHandled.heading} />
                  <ul className="space-y-3">
                    {service.formsHandled.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                        <span className="mt-[9px] flex-shrink-0 text-[11px] font-bold text-primary w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                  {service.formsHandled.note && <NoteBox text={service.formsHandled.note} />}
                </div>
              )}

              {service.establishment && (
                <div className={`h-full ${overviewAlone('establishment')}`}>
                  <ImportantNoteSection importantNote={service.establishment} />
                </div>
              )}

            </div>
          </section>
        )}

        {/* Advantages (registration) */}
        {isRegistration && service.advantages && (
          <AdvantagesSection advantages={service.advantages} />
        )}

        {/* ────────────────────────────────────────────────
            REQUIREMENTS — eligibility + documents together
            Both boxes side-by-side on desktop under one heading
        ──────────────────────────────────────────────── */}
        {isRegistration && (service.requirements?.eligibility || regDocs?.length > 0 || service.importantNote) && (
          <section id="requirements" className="py-5 lg:py-14">
            <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
              What You Need to Get Started
            </h2>

            <div className={`grid gap-5 ${service.requirements?.eligibility && regDocs?.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}>

              {/* Eligibility */}
              {service.requirements?.eligibility && (
                <div className="h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">
                  <CardHeading text={service.requirements.eligibility.heading} />
                  <ul className="space-y-3">
                    {service.requirements.eligibility.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents Required */}
              {regDocs?.length > 0 && (
                <div className="h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)]">
                  <ul className="space-y-3">
                    {regDocs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-[17px] leading-relaxed">
                        <span className="flex-shrink-0 min-w-[28px] h-6 rounded-md bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-[2px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {stripLeadingEmoji(doc)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* ── Notes: Important Feature / Consideration ── */}
            {service.importantNote?.points?.length > 0 && (
              <div className="mt-5 space-y-1.5">
                {isHeader(service.importantNote.points[0]) ? (
                  <>
                    <p className="text-[13px] font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      {stripLeadingEmoji(service.importantNote.points[0])}
                    </p>
                    {service.importantNote.points.slice(1).map((pt, i) => (
                      <NoteBox key={i} text={pt} />
                    ))}
                  </>
                ) : (
                  service.importantNote.points.map((pt, i) => (
                    <NoteBox key={i} text={pt} />
                  ))
                )}
              </div>
            )}

          </section>
        )}

        {/* ────────────────────────────────────────────────
            GENERIC CONTENT SECTIONS  (non-document)
        ──────────────────────────────────────────────── */}
        {mainContentSections.length > 0 && (
          <>
            {mainContentSections.map((section, i) => (
              <section key={i} className="py-4 lg:py-10">
                {section.pairedSections?.length > 0
                  ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {section.pairedSections.map((s, j) => (
                        <GenericSectionCard key={j} section={s} />
                      ))}
                    </div>
                  )
                  : section.groupedSections?.length > 0
                  ? <GroupedSectionBox sections={section.groupedSections} />
                  : <GenericSectionCard section={section} />
                }
              </section>
            ))}
          </>
        )}

        {/* ────────────────────────────────────────────────
            DOCUMENT SECTIONS from contentSections (non-registration)
            — still renders just before Insight for GST/MCA/etc.
        ──────────────────────────────────────────────── */}
        {docContentSections.length > 0 && (() => {
          const regularDocSections = docContentSections.filter((s) => !isImportantNotesSection(s) && !isSupportSection(s));
          const importantNotesSections = docContentSections.filter(isImportantNotesSection);
          const supportSections = docContentSections.filter(isSupportSection);
          const docTitle = regularDocSections.length === 1 && regularDocSections[0].heading
            ? stripLeadingEmoji(regularDocSections[0].heading)
            : 'Documents Required';
          return (
          <section id="documents" className="py-5 lg:py-14">
          
            {regularDocSections.length > 0 && (
              <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
                {docTitle}
              </h2>
            )}
            {regularDocSections.length > 0 && (
              <div className={`grid gap-5 ${regularDocSections.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                {regularDocSections.map((section, i) => (
                  <GenericSectionCard key={i} section={{ ...section, heading: null }} />
                ))}
              </div>
            )}
            {importantNotesSections.map((section, i) => (
              <div key={`imp-${i}`} className="mt-6 space-y-1">
                <p className="text-[13px] font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  {stripLeadingEmoji(section.heading)}
                </p>
                {section.subSections?.map((sub, j) => (
                  <div key={j} className="mb-2">
                    {(sub.heading || sub.title) && (
                      <p className="text-[13px] font-semibold text-gray-700 mb-1">{sub.heading || sub.title}</p>
                    )}
                    {sub.description && <NoteBox text={sub.description} />}
                    {sub.items?.map((pt, k) => <NoteBox key={k} text={pt} />)}
                    {sub.nestedItems?.map((ni, k) => (
                      <div key={k}>
                        {ni.text && <NoteBox text={ni.text} />}
                        {ni.subItems?.map((sp, m) => <NoteBox key={m} text={sp} />)}
                      </div>
                    ))}
                  </div>
                ))}
                {section.items?.map((pt, k) => <NoteBox key={k} text={pt} />)}
                {(section.note || section.footerNote) && (
                  <NoteBox text={section.note || section.footerNote} />
                )}
              </div>
            ))}
            {supportSections.map((section, i) => (
              <div key={`sup-${i}`} className="mt-5">
                <GenericSectionCard section={section} />
              </div>
            ))}
          </section>
          );
        })()}

      </div>

      {/* ═══════════════════════════════════════════════════
          INSIGHT CONSULTING ADVANTAGE — dark
      ═══════════════════════════════════════════════════ */}
      {(service.insightAdvantage || service.postSupport?.length > 0 || service.commonMistakes?.length > 0 || service.growthInsight || service.darkSections?.length > 0) && (
        <section id="insight" className="bg-primary/[0.04] backdrop-blur-[1.5px] border-t border-primary/10 py-8 lg:py-16">
          <div className="container mx-auto px-4 lg:px-12">
            {!service.hideInsightTitle && (
              <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-8 lg:mb-12 leading-tight">
                The Insight Consulting Advantage
              </h2>
            )}

            <div className="grid sm:grid-cols-2 gap-5">

              {service.insightAdvantage && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${insightSpan('insightAdvantage')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
                      {stripLeadingEmoji(service.insightAdvantage.intro)}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.insightAdvantage.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {stripLeadingEmoji(point)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.postSupport?.length > 0 && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${insightSpan('postSupport')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
                      {stripLeadingEmoji(service.postSupportTitle) || "Post-Filing Support"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.postSupport.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="flex-shrink-0 text-[11px] font-bold text-primary w-5 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed">
                          {stripLeadingEmoji(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.commonMistakes?.length > 0 && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${insightSpan('commonMistakes')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
                      Common Mistakes We Help You Avoid
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed">
                          {stripLeadingEmoji(mistake)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.growthInsight && (
                <div className={`h-full bg-white border border-primary/15 rounded-2xl p-5 lg:p-9 shadow-[0_2px_24px_rgba(124,58,237,0.07)] ${insightSpan('growthInsight')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-primary rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
                      {stripLeadingEmoji(service.growthInsight.heading)}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[15px] lg:text-[16px] leading-relaxed">
                    {stripLeadingEmoji(service.growthInsight.description)}
                  </p>
                  {service.growthInsight.weHelpYou?.length > 0 && (
                    <>
                      {(service.growthInsight.listPrefix ?? "We help you:") && (
                        <p className="text-gray-900 text-sm font-semibold mt-5 mb-3">
                          {service.growthInsight.listPrefix ?? "We help you:"}
                        </p>
                      )}
                      <ul className="space-y-2">
                        {service.growthInsight.weHelpYou.map((point, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 text-[15px] lg:text-base">
                            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {stripLeadingEmoji(point)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {service.serviceNote && <NoteBox text={service.serviceNote} />}
                </div>
              )}

              {service.darkSections?.map((section, i) => {
                const isLast = i === service.darkSections.length - 1;
                return (
                  <div key={i} className={`h-full${section.fullWidth ? ' sm:col-span-2' : insightAlone === `dark_${i}` ? ' sm:col-span-2' : ''}`}>
                    <GenericDarkCard
                      section={section}
                      serviceNote={isLast && !service.growthInsight ? service.serviceNote : undefined}
                    />
                  </div>
                );
              })}

            </div>

          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          TAIL SECTIONS — light sections that come after all dark sections
          (e.g. scheme info, special notices placed after Insight block)
      ═══════════════════════════════════════════════════ */}
      {service.tailSections?.length > 0 && (
        <div className="container mx-auto px-4 lg:px-12">
          {service.tailSections.map((section, i) => (
            <section key={i} className="py-4 lg:py-10">
              {section.cfoInfographic ? (
                /* ── CFO infographic + closing tagline ── */
                <div className="flex flex-col items-center gap-8">
                  <div className="w-full rounded-2xl overflow-hidden border border-primary/10 shadow-[0_4px_32px_rgba(29,78,216,0.08)]">
                    <img
                      src={section.imageSrc}
                      alt="CFO Benefits Infographic"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  {section.closingTagline && (
                    <div className="text-center py-6">
                      <p className="text-primary text-[24px] lg:text-[32px] font-bold tracking-tight italic">
                        {section.closingTagline}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <GenericSectionCard section={section} />
              )}
            </section>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          FINAL CTA  (hidden when parent renders it separately)
      ═══════════════════════════════════════════════════ */}
      {!hideCta && service.cta && (
  <section
    className="relative overflow-hidden py-16 lg:py-20"
    style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #38BDF8 100%)' }}
  >
    {/* decorative circles */}
    <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5" />

    {/* top shimmer line */}
    <div className="absolute inset-x-0 top-0 h-px bg-white/30" />

    <div className="relative container mx-auto px-4 lg:px-12 text-center">
      <div className="max-w-3xl mx-auto">

        {/* badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={12} className="text-white" />
          <span className="text-white text-[11px] font-bold tracking-widest uppercase">
            Ready to get started?
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-sm">
          {stripLeadingEmoji(service.cta.headline || service.cta.tagline)}
        </h2>

        {service.cta.headline && service.cta.tagline && (
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-10">
            {stripLeadingEmoji(service.cta.tagline)}
          </p>
        )}

        {service.cta.buttonText && (
          <button
            onClick={() => setPopupOpen(true)}
            className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-blue-700 font-bold text-base px-9 py-3.5 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)] hover:-translate-y-0.5"
          >
            {stripLeadingEmoji(service.cta.buttonText)}
          </button>
        )}

      </div>
    </div>
  </section>
)}

      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} initialService={service?.name || ""} />

      </div>
    </div>
  );
};

export default ServiceContent;
