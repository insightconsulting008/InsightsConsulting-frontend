import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Info, Building2, Heart, Tag } from "lucide-react";

const TABLE_HEADER_ICONS = {
  '12A':     <Building2 size={13} className="text-red flex-shrink-0" />,
  '80G':     <Heart size={13} className="text-red flex-shrink-0" />,
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
  <div className="flex items-center gap-2.5 mb-3">
    <span className="w-5 h-0.5 bg-red rounded-full inline-block" />
    <span className="text-[11px] font-bold tracking-widest uppercase text-red">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────
   CARD SECTION HEADING  (primary title inside cards)
───────────────────────────────────────────────────────── */
const CardHeading = ({ text }) => (
  <div className="flex items-start gap-3 mb-6">
    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
    <h3 className="text-[18px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
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
const NoteBox = ({ text, dark = false }) => {
  if (!text) return null;
  const clean = stripLeadingEmoji(text);
  if (dark) {
    return (
      <div className="flex items-start gap-3 border-l-[3px] border-red/40 bg-white/5 rounded-r-lg px-4 py-3 mt-4">
        <Info size={13} className="text-red/60 flex-shrink-0 mt-[2px]" />
        <p className="text-gray-400 text-[13px] lg:text-sm leading-relaxed">{clean}</p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 border-l-[3px] border-amber-400 bg-amber-50/70 rounded-r-lg px-4 py-3 mt-4">
      <Info size={13} className="text-amber-500 flex-shrink-0 mt-[2px]" />
      <p className="text-gray-700 text-[13px] lg:text-sm leading-relaxed">{clean}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LIGHT ITEM CARD
───────────────────────────────────────────────────────── */
const ItemCard = ({ group }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col gap-2.5">
    {group.header && (
      <p className="text-[15px] font-bold text-gray-900 leading-snug mb-1">
        {stripLeadingEmoji(group.header)}
      </p>
    )}
    {group.description && (
      <p className="text-gray-500 text-sm lg:text-[14px] leading-relaxed">
        {stripLeadingEmoji(group.description)}
      </p>
    )}
    {group.items.length > 0 && (
      <div className="space-y-2 mt-0.5">
        {group.items.map((it, i) =>
          it.endsWith(':') ? (
            <p key={i} className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mt-2.5 mb-0.5">
              {stripLeadingEmoji(it)}
            </p>
          ) : (
            <div key={i} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px] leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
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
  <div className="bg-gray-800/80 border border-gray-700/60 rounded-xl p-5 lg:p-6 flex flex-col gap-2.5">
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
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
              {stripLeadingEmoji(it)}
            </div>
          )
        )}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────
   GENERIC SECTION CARD  (light)
───────────────────────────────────────────────────────── */
const GenericSectionCard = ({ section }) => {
  if (!section) return null;
  const { heading, paragraphs, items, note, footerNote, subSections, serviceItems, processSteps, table, comparisonTable, nestedItems, subheading, closingText, closingParagraphs, extraItems, whatIs } = section;
  const groups = parseGroups(items);

  return (
    <div className="bg-secondary rounded-2xl p-7 lg:p-10">

      {heading && <CardHeading text={heading} />}

      {/* paragraphs — question sentences get a special callout style */}
      {paragraphs?.length > 0 && (
        <div className="space-y-3 mb-4">
          {paragraphs.map((p, i) =>
            p.endsWith('?') ? (
              <div key={i} className="bg-red/5 border-l-4 border-red/40 rounded-r-xl px-5 py-3 my-1">
                <p className="text-gray-900 text-[15px] lg:text-base font-semibold leading-relaxed">
                  {stripLeadingEmoji(p)}
                </p>
              </div>
            ) : (
              <p key={i} className="text-gray-700 text-[15px] lg:text-base leading-relaxed">
                {stripLeadingEmoji(p)}
              </p>
            )
          )}
        </div>
      )}

      {/* WHAT IS side-by-side cards */}
      {whatIs?.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-2 mb-4">
          {whatIs.map((card, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col gap-3">
              <p className="text-[11px] font-bold tracking-widest uppercase text-red">
                {card.heading}
              </p>
              <div className="space-y-2.5">
                {card.paragraphs?.map((p, j) => (
                  <p key={j} className="text-gray-600 text-sm lg:text-[15px] leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* inline sub-heading (sits between title and items) */}
      {subheading && (
        <p className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">
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
          {items.map((item, i) =>
            item.startsWith('👉') ? (
              <NoteBox key={i} text={item} />
            ) : (
              <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            )
          )}
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
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2.5 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {stripLeadingEmoji(item.text)}
              </div>
            )
          )}
        </div>
      )}

      {/* inline note — appears right after items when extraItems also exist */}
      {note && (
        note.startsWith('✔') ? (
          <div className="mt-3 inline-flex items-center gap-2 bg-red/10 border border-red/20 text-red text-sm font-semibold rounded-full px-4 py-2">
            {note}
          </div>
        ) : (
          <NoteBox text={note} />
        )
      )}

      {/* closing paragraphs — shown after items, before extraItems */}
      {closingParagraphs?.map((p, i) => (
        <p key={i} className="text-gray-700 text-[15px] lg:text-base leading-relaxed mt-3">
          {p}
        </p>
      ))}

      {/* extra items — consequence list with ❌ prefix */}
      {extraItems?.length > 0 && (
        <ul className="space-y-2 mt-3 mb-4">
          {extraItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-[15px] lg:text-base leading-relaxed">
              <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
              {stripLeadingEmoji(item)}
            </li>
          ))}
        </ul>
      )}

      {/* closing text — plain paragraph after items/nestedItems */}
      {closingText && (
        <p className="text-gray-600 text-[15px] lg:text-base leading-relaxed mt-3 mb-4">
          {closingText}
        </p>
      )}

      {/* sub-sections → card grid */}
      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-4 mb-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 shadow-sm">
              <p className="text-[15px] font-bold text-gray-900 leading-snug mb-3">
                {stripLeadingEmoji(sub.heading)}
              </p>
              {sub.description && (
                <p className="text-gray-500 text-sm lg:text-[15px] leading-relaxed mb-2">
                  {stripLeadingEmoji(sub.description)}
                </p>
              )}
              {sub.nestedItems?.length > 0 && (
                <div className="space-y-2">
                  {sub.nestedItems.map((item, j) =>
                    item.subItems?.length > 0 ? (
                      <div key={j}>
                        <div className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px] mb-1">
                          <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {stripLeadingEmoji(item.text)}
                        </div>
                        <div className="pl-5 space-y-1.5">
                          {item.subItems.map((si, k) => (
                            <div key={k} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px]">
                              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                              {si}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div key={j} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px]">
                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
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
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
                          {it.label}
                        </p>
                        <div className="pl-3 space-y-1">
                          {it.subItems.map((si, k) => (
                            <div key={k} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px]">
                              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                              {si}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : it.startsWith('👉') ? (
                      <NoteBox key={j} text={it} />
                    ) : (
                      <div key={j} className="flex items-start gap-2 text-gray-600 text-sm lg:text-[14px]">
                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {stripLeadingEmoji(it)}
                      </div>
                    )
                  )}
                </div>
              )}
              {sub.extraDescription && (
                <p className="text-gray-500 text-sm lg:text-[14px] leading-relaxed mt-2 pt-2 border-t border-gray-100">
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
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 shadow-sm">
              <p className="text-[15px] font-bold text-gray-900 leading-snug mb-2.5">
                {stripLeadingEmoji(item.name)}
              </p>
              {item.description && (
                <p className="text-gray-500 text-sm lg:text-[14px] leading-relaxed">
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
              <li key={i} className="bg-white border border-gray-200 rounded-xl p-5 lg:p-6 shadow-sm flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] lg:text-base font-semibold text-gray-900">
                    {stripLeadingEmoji(step.name)}
                  </p>
                  {step.description && (
                    <p className="text-gray-500 text-sm lg:text-[15px] leading-relaxed mt-1">
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
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th key={i} className={`border border-gray-200 bg-white px-4 py-3 font-bold text-gray-800 text-[13px] lg:text-sm ${i > 0 ? 'text-center' : ''}`}>
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
                    <td key={j} className={`border border-gray-200 px-4 py-3 text-gray-700 text-[13px] lg:text-sm ${j > 0 ? 'text-center' : ''}`}>
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
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {comparisonTable.headers.map((h, i) => (
                  <th key={i} className={`border border-gray-200 bg-white px-4 py-3 font-bold text-gray-800 text-[13px] lg:text-sm ${i > 0 ? 'text-center' : ''}`}>
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
                    <td key={j} className={`border border-gray-200 px-4 py-3 text-gray-700 text-[13px] lg:text-sm ${j === 0 ? "font-semibold" : "text-center"}`}>
                      {j === 0 ? stripLeadingEmoji(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {footerNote && (
        footerNote.startsWith('✔') ? (
          <div className="mt-3 inline-flex items-center gap-2 bg-red/10 border border-red/20 text-red text-sm font-semibold rounded-full px-4 py-2">
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
const GenericDarkCard = ({ section }) => {
  if (!section) return null;
  const { heading, paragraphs, items, closingText, closingParagraphs, extraItems, subSections, note } = section;
  const groups = parseGroups(items);

  return (
    <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-7 lg:p-9">

      {heading && (
        <div className="flex items-start gap-3 mb-6">
          <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
          <h3 className="text-[18px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
            {stripLeadingEmoji(heading)}
          </h3>
        </div>
      )}

      {paragraphs?.length > 0 && (
        <div className="space-y-3 mb-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-300 text-[15px] lg:text-base leading-relaxed">
              {stripLeadingEmoji(p)}
            </p>
          ))}
        </div>
      )}

      {groups ? (
        <div className={`grid ${items.filter(isHeader).length <= 2 ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-3`}>
          {groups.map((g, i) => <DarkItemCard key={i} group={g} />)}
        </div>
      ) : items?.length > 0 && (
        <ul className="space-y-3">
          {items.map((item, i) =>
            item.startsWith('👉') || (item.startsWith('We ') && !item.endsWith(':')) ? (
              <NoteBox key={i} text={item} dark />
            ) : (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] lg:text-base">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            )
          )}
        </ul>
      )}

      {closingParagraphs?.map((p, i) => (
        <p key={i} className="text-gray-300 text-[15px] lg:text-base leading-relaxed mt-4">
          {p}
        </p>
      ))}

      {extraItems?.length > 0 && (
        <ul className="space-y-2 mt-3">
          {extraItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-[15px] lg:text-base">
              <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
              {stripLeadingEmoji(item)}
            </li>
          ))}
        </ul>
      )}

      {closingText && (
        <p className="text-gray-300 text-[15px] lg:text-base leading-relaxed mt-4">
          {closingText}
        </p>
      )}

      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-3 mt-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="bg-gray-800/70 border border-gray-700/50 rounded-xl p-4 lg:p-5">
              <div className="flex items-start gap-2 mb-2.5 pb-2 border-b border-gray-700/60">
                
                <p className="text-[14px] font-bold text-white leading-snug">
                  {stripLeadingEmoji(sub.heading)}
                </p>
              </div>
              {sub.description && (
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  {sub.description}
                </p>
              )}
              {sub.items?.length > 0 && (
                <ul className="space-y-1.5">
                  {sub.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {note && (
        <p className="text-red/80 text-sm font-medium mt-4 leading-relaxed">
          {note}
        </p>
      )}

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
      <h2 className="text-2xl lg:text-[32px] font-bold text-gray-900 mb-10 leading-tight">
        {stripLeadingEmoji(advantages.heading)}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {advantages.items.map((item, i) => (
          <div key={i} className="bg-secondary rounded-2xl p-7 lg:p-8">
            <p className="text-[17px] font-bold text-red leading-snug mb-3">
              {stripLeadingEmoji(item.title)}
            </p>
            <p className="text-gray-700 text-[15px] lg:text-base leading-relaxed mb-3">
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
    <div className="bg-secondary rounded-2xl p-7 lg:p-10">
      {title && <CardHeading text={title} />}
      {description && (
        <p className="text-gray-700 text-[15px] lg:text-base leading-relaxed mb-3">
          {stripLeadingEmoji(description)}
        </p>
      )}
      {points?.length > 0 && (
        <ul className="space-y-2.5">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
              {stripLeadingEmoji(pt)}
            </li>
          ))}
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
    <div className="bg-secondary rounded-2xl p-7 lg:p-10">
      <div className="flex items-start gap-3 mb-6">
        <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
        <h3 className="text-[18px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">Our End-to-End Process</h3>
      </div>
      <ol className="space-y-3.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
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
  const isDocSection = (s) => {
    const h = s?.heading?.toLowerCase() || '';
    return h.includes('document') || h.includes('what we need');
  };
  const mainContentSections = service.contentSections?.filter((s) => !isDocSection(s)) || [];
  const docContentSections  = service.contentSections?.filter(isDocSection) || [];

  /* Registration documents (from requirements) */
  const regDocs = isRegistration ? service.requirements?.documents : null;

  return (
    <div className="bg-white">

      <div className="container mx-auto px-4 lg:px-12">

        {/* ────────────────────────────────────────────────
            OVERVIEW — Ideal For + Important Note (registration)
        ──────────────────────────────────────────────── */}
        {(service.idealFor?.length > 0 || service.formsHandled || service.importantNote || service.establishment) && (
          <section id="overview" className="py-8 lg:py-14">
            <div className="grid lg:grid-cols-2 gap-5">

              {service.idealFor?.length > 0 && (
                <div className="bg-secondary rounded-2xl p-7 lg:p-10">
                  <CardHeading text={service.idealForHeading || "Ideal For"} />
                  <ul className="space-y-3">
                    {service.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.formsHandled && (
                <div className="bg-secondary rounded-2xl p-7 lg:p-10">
                  <CardHeading text={service.formsHandled.heading} />
                  <ul className="space-y-3">
                    {service.formsHandled.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="mt-[9px] flex-shrink-0 text-[11px] font-bold text-red w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                  {service.formsHandled.note && <NoteBox text={service.formsHandled.note} />}
                </div>
              )}

              {service.importantNote && (
                <ImportantNoteSection importantNote={service.importantNote} />
              )}

              {service.establishment && (
                <ImportantNoteSection importantNote={service.establishment} />
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
        {isRegistration && (service.requirements?.eligibility || regDocs?.length > 0) && (
          <section id="requirements" className="py-8 lg:py-14">
            <SectionLabel label="Requirements" />
            <h2 className="text-2xl lg:text-[32px] font-bold text-gray-900 mb-10 leading-tight">
              What You Need to Get Started
            </h2>

            <div className={`grid gap-5 ${service.requirements?.eligibility && regDocs?.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}>

              {/* Eligibility */}
              {service.requirements?.eligibility && (
                <div className="bg-secondary rounded-2xl p-7 lg:p-9">
                  <CardHeading text={service.requirements.eligibility.heading} />
                  <ul className="space-y-3">
                    {service.requirements.eligibility.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents Required */}
              {regDocs?.length > 0 && (
                <div className="bg-secondary rounded-2xl p-7 lg:p-9">
                  <CardHeading text="Documents Required" />
                  <ul className="space-y-3">
                    {regDocs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="flex-shrink-0 min-w-[28px] h-6 rounded-md bg-red/10 text-red text-[11px] font-bold flex items-center justify-center mt-[2px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {stripLeadingEmoji(doc)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ────────────────────────────────────────────────
            GENERIC CONTENT SECTIONS  (non-document)
        ──────────────────────────────────────────────── */}
        {mainContentSections.length > 0 && (
          <>
            {mainContentSections.map((section, i) => (
              <section key={i} className="py-6 lg:py-10">
                <GenericSectionCard section={section} />
              </section>
            ))}
          </>
        )}

        {/* ────────────────────────────────────────────────
            DOCUMENT SECTIONS from contentSections (non-registration)
            — still renders just before Insight for GST/MCA/etc.
        ──────────────────────────────────────────────── */}
        {docContentSections.length > 0 && (() => {
          const docTitle = docContentSections.length === 1 && docContentSections[0].heading
            ? stripLeadingEmoji(docContentSections[0].heading)
            : 'Documents Required';
          return (
          <section id="documents" className="py-8 lg:py-14">
            {docTitle !== 'Documents Required' && <SectionLabel label="Documents" />}
            <h2 className="text-2xl lg:text-[32px] font-bold text-gray-900 mb-10 leading-tight">
              {docTitle}
            </h2>
            <div className={`grid gap-5 ${docContentSections.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {docContentSections.map((section, i) => (
                <GenericSectionCard key={i} section={{ ...section, heading: null }} />
              ))}
            </div>
          </section>
          );
        })()}

      </div>

      {/* ═══════════════════════════════════════════════════
          INSIGHT CONSULTING ADVANTAGE — dark
      ═══════════════════════════════════════════════════ */}
      {(service.insightAdvantage || service.postSupport?.length > 0 || service.commonMistakes?.length > 0 || service.growthInsight || service.darkSections?.length > 0) && (
        <section id="insight" className="bg-secondary py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-12">
            {!service.hideInsightTitle && (
              <h2 className="text-2xl lg:text-[32px] font-bold text-black mb-12 leading-tight">
                The Insight Consulting Advantage
              </h2>
            )}

            <div className="grid sm:grid-cols-2 gap-5">

              {service.insightAdvantage && (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-7 lg:p-9">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[18px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.insightAdvantage.intro)}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.insightAdvantage.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                        {stripLeadingEmoji(point)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.postSupport?.length > 0 && (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-7 lg:p-9">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[18px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.postSupportTitle) || "Post-Filing Support"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.postSupport.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="flex-shrink-0 text-[11px] font-bold text-red w-5 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-gray-300 text-[15px] lg:text-base leading-relaxed">
                          {stripLeadingEmoji(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.commonMistakes?.length > 0 && (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-7 lg:p-9">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[18px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      Common Mistakes We Help You Avoid
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                        <span className="text-gray-300 text-[15px] lg:text-base leading-relaxed">
                          {stripLeadingEmoji(mistake)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.growthInsight && (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-7 lg:p-9">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[18px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.growthInsight.heading)}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-[15px] lg:text-base leading-relaxed">
                    {stripLeadingEmoji(service.growthInsight.description)}
                  </p>
                  {service.growthInsight.weHelpYou?.length > 0 && (
                    <>
                      {(service.growthInsight.listPrefix ?? "We help you:") && (
                        <p className="text-white text-sm font-semibold mt-5 mb-3">
                          {service.growthInsight.listPrefix ?? "We help you:"}
                        </p>
                      )}
                      <ul className="space-y-2">
                        {service.growthInsight.weHelpYou.map((point, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px] lg:text-base">
                            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                            {stripLeadingEmoji(point)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {service.darkSections?.map((section, i) => (
                <div key={i} className={`h-full${section.fullWidth ? ' sm:col-span-2' : ''}`}>
                  <GenericDarkCard section={section} />
                </div>
              ))}

            </div>

            {service.serviceNote && (
              <div className="mt-6 w-full">
                <NoteBox text={service.serviceNote} />
              </div>
            )}
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
            <section key={i} className="py-6 lg:py-10">
              <GenericSectionCard section={section} />
            </section>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          FINAL CTA  (hidden when parent renders it separately)
      ═══════════════════════════════════════════════════ */}
      {!hideCta && service.cta && (
        <section className="relative overflow-hidden bg-gray-950 py-16 lg:py-20">
          <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-red/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-red/15 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />

          <div className="relative container mx-auto px-4 lg:px-12 text-center">
            <div className="max-w-3xl mx-auto">

              <div className="inline-flex items-center gap-2 bg-red/15 border border-red/30 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                <span className="text-red text-[11px] font-bold tracking-widest uppercase">
                  Ready to get started?
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
                {stripLeadingEmoji(service.cta.headline || service.cta.tagline)}
              </h2>

              {service.cta.headline && service.cta.tagline && (
                <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-10">
                  {stripLeadingEmoji(service.cta.tagline)}
                </p>
              )}

              {service.cta.buttonText && (
                <button
                  onClick={() => setPopupOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-red hover:bg-[#b01712] text-white font-bold text-base px-9 py-3.5 rounded-xl transition-all duration-300 shadow-xl"
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
  );
};

export default ServiceContent;
