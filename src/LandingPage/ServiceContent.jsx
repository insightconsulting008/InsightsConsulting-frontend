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
const CardHeading = ({ text, accentColor = "bg-red" }) => (
  <div className="flex items-start gap-3 mb-4 lg:mb-6">
    <span className={`w-[3px] h-6 ${accentColor} rounded-full flex-shrink-0 mt-[3px]`} />
    <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">
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
      <div className="relative flex items-start gap-3 bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-3.5 mt-4 overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-red/60" />
        <Info size={14} className="text-purple-300 flex-shrink-0 mt-[2px] ml-1" />
        <p className="text-purple-200 text-[13px] lg:text-[14px] leading-relaxed">{clean}</p>
      </div>
    );
  }
  return (
    <div className="relative flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3.5 mt-4 mb-2 overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500" />
      <Info size={14} className="text-amber-500 flex-shrink-0 mt-[2px] ml-1" />
      <p className="text-amber-900 text-[13px] lg:text-[14px] leading-relaxed">{clean}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LIGHT ITEM CARD
───────────────────────────────────────────────────────── */
const ItemCard = ({ group }) => (
  <div className="h-full bg-white border border-purple-100 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col gap-2.5">
    {group.header && (
      <p className="text-[15px] font-bold text-purple-900 leading-snug mb-1">
        {stripLeadingEmoji(group.header)}
      </p>
    )}
    {group.description && (
      <p className="text-purple-600 text-sm lg:text-[14px] leading-relaxed">
        {stripLeadingEmoji(group.description)}
      </p>
    )}
    {group.items.length > 0 && (
      <div className="space-y-2 mt-0.5">
        {group.items.map((it, i) =>
          it.endsWith(':') ? (
            <p key={i} className="text-[10px] font-bold tracking-wider uppercase text-purple-400 mt-2.5 mb-0.5">
              {stripLeadingEmoji(it)}
            </p>
          ) : (
            <div key={i} className="flex items-start gap-2 text-gray-700 text-sm lg:text-[14px] leading-relaxed">
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
  <div className="h-full bg-purple-900/40 border border-purple-600/40 rounded-xl p-5 lg:p-6 flex flex-col gap-2.5">
    {group.header && (
      <p className="text-[15px] font-bold text-white leading-snug mb-1">
        {stripLeadingEmoji(group.header)}
      </p>
    )}
    {group.description && (
      <p className="text-purple-200 text-sm lg:text-[14px] leading-relaxed">
        {stripLeadingEmoji(group.description)}
      </p>
    )}
    {group.items.length > 0 && (
      <div className="space-y-2 mt-0.5">
        {group.items.map((it, i) =>
          it.endsWith(':') ? (
            <p key={i} className="text-purple-300 text-[10px] font-bold tracking-wider uppercase mt-2.5 mb-0.5">
              {stripLeadingEmoji(it)}
            </p>
          ) : (
            <div key={i} className="flex items-start gap-2 text-purple-100 text-sm lg:text-[14px] leading-relaxed">
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
    <div className="bg-[#F7F5FF] rounded-2xl p-5 lg:p-10">

      {heading && <CardHeading text={heading} />}

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

      {whatIs?.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-2 mb-4">
          {whatIs.map((card, i) => (
            <div key={i} className="bg-white border border-purple-100 rounded-xl p-5 lg:p-6 shadow-sm flex flex-col gap-3">
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

      {subheading && (
        <p className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-purple-100">
          {subheading}
        </p>
      )}

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
              <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            );
          })}
        </ul>
      )}

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

      {closingParagraphs?.map((p, i) => (
        <p key={i} className="text-gray-700 text-[15px] lg:text-base leading-relaxed mt-3">
          {p}
        </p>
      ))}

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

      {closingText && (
        <p className="text-gray-600 text-[15px] lg:text-base leading-relaxed mt-3 mb-4">
          {closingText}
        </p>
      )}

      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-4 mb-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="h-full bg-white border border-purple-100 rounded-xl p-5 lg:p-6 shadow-sm">
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
                <p className="text-gray-500 text-sm lg:text-[14px] leading-relaxed mt-2 pt-2 border-t border-purple-100">
                  {sub.extraDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {serviceItems?.length > 0 && (
        <div className={`grid ${colClass(serviceItems.length)} gap-4 mb-4`}>
          {serviceItems.map((item, i) => (
            <div key={i} className="h-full bg-white border border-purple-100 rounded-xl p-5 lg:p-6 shadow-sm">
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

      {processSteps?.length > 0 && (
        <div className="mb-4">
          <ol className={`grid ${colClass(processSteps.length)} gap-4`}>
            {processSteps.map((step, i) => (
              <li key={i} className="h-full bg-white border border-orange-200 rounded-xl p-5 lg:p-6 shadow-sm flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
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

      {table && (
        <div className="overflow-x-auto mt-6 mb-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th key={i} className={`border border-purple-100 bg-purple-50 px-4 py-3 font-bold text-purple-900 text-[13px] lg:text-sm ${i > 0 ? 'text-center' : ''}`}>
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
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-purple-50/40"}>
                  {(Array.isArray(row) ? row : []).map((cell, j) => (
                    <td key={j} className={`border border-purple-100 px-4 py-3 text-gray-700 text-[13px] lg:text-sm ${j > 0 ? 'text-center' : ''}`}>
                      {j === 0 ? stripLeadingEmoji(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {comparisonTable && (
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {comparisonTable.headers.map((h, i) => (
                  <th key={i} className={`border border-purple-100 bg-purple-50 px-4 py-3 font-bold text-purple-900 text-[13px] lg:text-sm ${i > 0 ? 'text-center' : ''}`}>
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
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-purple-50/40"}>
                  {row.map((cell, j) => (
                    <td key={j} className={`border border-purple-100 px-4 py-3 text-gray-700 text-[13px] lg:text-sm ${j === 0 ? "font-semibold" : "text-center"}`}>
                      {j === 0 ? stripLeadingEmoji(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {note && (
        note.startsWith('✔') ? (
          <div className="mt-5 inline-flex items-center gap-2 bg-red/8 border border-red/25 text-red text-[13px] font-semibold rounded-xl px-4 py-2.5 shadow-sm">
            {note}
          </div>
        ) : (
          <NoteBox text={note} />
        )
      )}

      {footerNote && (
        footerNote.startsWith('✔') ? (
          <div className="mt-3 inline-flex items-center gap-2 bg-red/8 border border-red/25 text-red text-[13px] font-semibold rounded-xl px-4 py-2.5 shadow-sm">
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
    <div className="h-full bg-[#1e1245] border border-purple-700/50 rounded-2xl p-5 lg:p-9">

      {heading && (
        <div className="flex items-start gap-3 mb-4 lg:mb-6">
          <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
          <h3 className="text-[16px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
            {stripLeadingEmoji(heading)}
          </h3>
        </div>
      )}

      {paragraphs?.length > 0 && (
        <div className="space-y-3 mb-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-purple-100 text-[15px] lg:text-base leading-relaxed">
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
              <li key={i} className="flex items-start gap-3 text-purple-100 text-[15px] lg:text-base">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {stripLeadingEmoji(item)}
              </li>
            )
          )}
        </ul>
      )}

      {closingParagraphs?.map((p, i) => (
        <p key={i} className="text-purple-100 text-[15px] lg:text-base leading-relaxed mt-4">
          {p}
        </p>
      ))}

      {extraItems?.length > 0 && (
        <ul className="space-y-2 mt-3">
          {extraItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-purple-100 text-[15px] lg:text-base">
              <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
              {stripLeadingEmoji(item)}
            </li>
          ))}
        </ul>
      )}

      {closingText && (
        <p className="text-purple-100 text-[15px] lg:text-base leading-relaxed mt-4">
          {closingText}
        </p>
      )}

      {subSections?.length > 0 && (
        <div className={`grid ${colClass(subSections.length)} gap-3 mt-4`}>
          {subSections.map((sub, i) => (
            <div key={i} className="bg-purple-900/40 border border-purple-600/40 rounded-xl p-4 lg:p-5">
              <p className="text-[14px] font-bold text-white leading-snug mb-2.5">
                {stripLeadingEmoji(sub.heading)}
              </p>
              {sub.description && (
                <p className="text-purple-200 text-sm leading-relaxed mb-2">
                  {sub.description}
                </p>
              )}
              {sub.items?.length > 0 && (
                <ul className="space-y-1.5">
                  {sub.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2 text-purple-100 text-sm leading-relaxed">
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

      {note && <NoteBox text={note} dark />}

    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ADVANTAGES SECTION (registration)
───────────────────────────────────────────────────────── */
const ADVANTAGE_PALETTES = [
  { card: "bg-[#4F46E5]", title: "text-white", desc: "text-indigo-100", bullet: "bg-white", sub: "text-indigo-100" },
  { card: "bg-[#0F9D8A]", title: "text-white", desc: "text-teal-100",   bullet: "bg-white", sub: "text-teal-100"   },
  { card: "bg-[#E24B4A]", title: "text-white", desc: "text-red-100",    bullet: "bg-white", sub: "text-red-100"    },
  { card: "bg-[#D97706]", title: "text-white", desc: "text-amber-100",  bullet: "bg-white", sub: "text-amber-100"  },
  { card: "bg-[#7C3AED]", title: "text-white", desc: "text-violet-100", bullet: "bg-white", sub: "text-violet-100" },
  { card: "bg-[#0369A1]", title: "text-white", desc: "text-sky-100",    bullet: "bg-white", sub: "text-sky-100"    },
];

const AdvantagesSection = ({ advantages }) => {
  if (!advantages) return null;
  return (
    <section className="py-8 lg:py-12">
      <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
        {stripLeadingEmoji(advantages.heading)}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {advantages.items.map((item, i) => {
          const p = ADVANTAGE_PALETTES[i % ADVANTAGE_PALETTES.length];
          return (
            <div key={i} className={`h-full ${p.card} rounded-2xl p-5 lg:p-8`}>
              <p className={`text-[17px] font-bold ${p.title} leading-snug mb-3`}>
                {stripLeadingEmoji(item.title)}
              </p>
              <p className={`${p.desc} text-[15px] lg:text-base leading-relaxed mb-3`}>
                {stripLeadingEmoji(item.description)}
              </p>
              {item.subPoints?.length > 0 && (
                <ul className="space-y-2">
                  {item.subPoints.map((sp, j) => (
                    <li key={j} className={`flex items-start gap-2 ${p.sub} text-sm lg:text-[14px]`}>
                      <span className={`mt-[7px] w-1.5 h-1.5 rounded-full ${p.bullet} flex-shrink-0`} />
                      {stripLeadingEmoji(sp)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
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
    <div className="w-full h-full bg-amber-50 border border-amber-200 rounded-2xl p-5 lg:p-10">
      {title && <CardHeading text={title} accentColor="bg-amber-500" />}
      {description && (
        <p className="text-gray-700 text-[15px] lg:text-base leading-relaxed mb-3">
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
                    <p className="text-[13px] font-bold tracking-wider uppercase text-amber-700 mt-1 mb-0.5">
                      {clean.slice(0, -1)}
                    </p>
                  </li>
                );
              }
              return <li key={i} className="list-none"><NoteBox text={pt} /></li>;
            }
            return (
              <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
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
    <div className="bg-[#F7F5FF] rounded-2xl p-5 lg:p-10">
      <div className="flex items-start gap-3 mb-4 lg:mb-6">
        <span className="w-[3px] h-6 bg-orange-500 rounded-full flex-shrink-0 mt-[3px]" />
        <h3 className="text-[16px] lg:text-[20px] font-bold text-gray-900 leading-snug tracking-tight">Our End-to-End Process</h3>
      </div>
      <ol className="space-y-3.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
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

  const isDocSection = (s) => {
    const h = s?.heading?.toLowerCase() || '';
    return h.includes('document') || h.includes('what we need');
  };
  const mainContentSections = service.contentSections?.filter((s) => !isDocSection(s)) || [];
  const docContentSections  = service.contentSections?.filter(isDocSection) || [];

  const overviewKeys = [
    service.idealFor?.length > 0        && 'idealFor',
    service.formsHandled                 && 'formsHandled',
    service.importantNote                && 'importantNote',
    service.establishment                && 'establishment',
  ].filter(Boolean);
  const overviewLast  = overviewKeys[overviewKeys.length - 1];
  const overviewAlone = (key) => overviewKeys.length % 2 !== 0 && overviewLast === key ? 'lg:col-span-2' : '';

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

  const regDocs = isRegistration ? service.requirements?.documents : null;

  return (
    <div className="bg-white">

      <div className="container mx-auto px-4 lg:px-12">

        {/* ── OVERVIEW ── */}
        {(service.idealFor?.length > 0 || service.formsHandled || service.importantNote || service.establishment) && (
          <section id="overview" className="py-5 lg:py-14">
            <div className={`grid gap-5 ${overviewKeys.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

              {service.idealFor?.length > 0 && (
                <div className={`h-full bg-[#F7F5FF] border border-purple-100 rounded-2xl p-5 lg:p-10 ${overviewAlone('idealFor')}`}>
                  <CardHeading text={service.idealForHeading || "Ideal For"} accentColor="bg-purple-600" />
                  <ul className="space-y-3">
                    {service.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.formsHandled && (
                <div className={`h-full bg-[#F7F5FF] border border-purple-100 rounded-2xl p-5 lg:p-10 ${overviewAlone('formsHandled')}`}>
                  <CardHeading text={service.formsHandled.heading} accentColor="bg-purple-600" />
                  <ul className="space-y-3">
                    {service.formsHandled.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="mt-[9px] flex-shrink-0 text-[11px] font-bold text-purple-600 w-5">
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
                <div className={`h-full ${overviewAlone('importantNote')}`}>
                  <ImportantNoteSection importantNote={service.importantNote} />
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

        {/* ── REQUIREMENTS ── */}
        {isRegistration && (service.requirements?.eligibility || regDocs?.length > 0) && (
          <section id="requirements" className="py-5 lg:py-14">
            <SectionLabel label="Requirements" />
            <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
              What You Need to Get Started
            </h2>

            <div className={`grid gap-5 ${service.requirements?.eligibility && regDocs?.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}>

              {service.requirements?.eligibility && (
                <div className="h-full bg-[#E8FBF4] border border-teal-200 rounded-2xl p-5 lg:p-9">
                  <CardHeading text={service.requirements.eligibility.heading} accentColor="bg-teal-500" />
                  <ul className="space-y-3">
                    {service.requirements.eligibility.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                        {stripLeadingEmoji(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {regDocs?.length > 0 && (
                <div className="h-full bg-amber-50 border border-amber-200 rounded-2xl p-5 lg:p-9">
                  <CardHeading text="Documents Required" accentColor="bg-amber-500" />
                  <ul className="space-y-3">
                    {regDocs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base leading-relaxed">
                        <span className="flex-shrink-0 min-w-[28px] h-6 rounded-md bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center mt-[2px]">
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

        {/* ── GENERIC CONTENT SECTIONS ── */}
        {mainContentSections.length > 0 && (
          <>
            {mainContentSections.map((section, i) => (
              <section key={i} className="py-4 lg:py-10">
                <GenericSectionCard section={section} />
              </section>
            ))}
          </>
        )}

        {/* ── DOCUMENT SECTIONS ── */}
        {docContentSections.length > 0 && (() => {
          const docTitle = docContentSections.length === 1 && docContentSections[0].heading
            ? stripLeadingEmoji(docContentSections[0].heading)
            : 'Documents Required';
          return (
          <section id="documents" className="py-5 lg:py-14">
            {docTitle !== 'Documents Required' && <SectionLabel label="Documents" />}
            <h2 className="text-xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-10 leading-tight">
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

      {/* ── INSIGHT SECTION ── */}
      {(service.insightAdvantage || service.postSupport?.length > 0 || service.commonMistakes?.length > 0 || service.growthInsight || service.darkSections?.length > 0) && (
        <section id="insight" className="bg-[#0f0a2e] py-8 lg:py-16">
          <div className="container mx-auto px-4 lg:px-12">
            {!service.hideInsightTitle && (
              <h2 className="text-xl lg:text-[32px] font-bold text-white mb-8 lg:mb-12 leading-tight">
                The Insight Consulting Advantage
              </h2>
            )}

            <div className="grid sm:grid-cols-2 gap-5">

              {service.insightAdvantage && (
                <div className={`h-full bg-[#1e1245] border border-purple-700/50 rounded-2xl p-5 lg:p-9 ${insightSpan('insightAdvantage')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.insightAdvantage.intro)}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.insightAdvantage.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-purple-100 text-[15px] lg:text-base">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                        {stripLeadingEmoji(point)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.postSupport?.length > 0 && (
                <div className={`h-full bg-[#1e1245] border border-purple-700/50 rounded-2xl p-5 lg:p-9 ${insightSpan('postSupport')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.postSupportTitle) || "Post-Filing Support"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.postSupport.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="flex-shrink-0 text-[11px] font-bold text-red w-5 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-purple-100 text-[15px] lg:text-base leading-relaxed">
                          {stripLeadingEmoji(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.commonMistakes?.length > 0 && (
                <div className={`h-full bg-[#1e1245] border border-purple-700/50 rounded-2xl p-5 lg:p-9 ${insightSpan('commonMistakes')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      Common Mistakes We Help You Avoid
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {service.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                        <span className="text-purple-100 text-[15px] lg:text-base leading-relaxed">
                          {stripLeadingEmoji(mistake)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.growthInsight && (
                <div className={`h-full bg-[#1e1245] border border-purple-700/50 rounded-2xl p-5 lg:p-9 ${insightSpan('growthInsight')}`}>
                  <div className="flex items-start gap-3 mb-4 lg:mb-6">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-white leading-snug tracking-tight">
                      {stripLeadingEmoji(service.growthInsight.heading)}
                    </h3>
                  </div>
                  <p className="text-purple-100 text-[15px] lg:text-base leading-relaxed">
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
                          <li key={i} className="flex items-start gap-3 text-purple-100 text-[15px] lg:text-base">
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
                <div key={i} className={`h-full${section.fullWidth ? ' sm:col-span-2' : insightAlone === `dark_${i}` ? ' sm:col-span-2' : ''}`}>
                  <GenericDarkCard section={section} />
                </div>
              ))}

            </div>

            {service.serviceNote && (
              <div className="mt-8 w-full">
                <NoteBox text={service.serviceNote} dark />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TAIL SECTIONS ── */}
      {service.tailSections?.length > 0 && (
        <div className="container mx-auto px-4 lg:px-12">
          {service.tailSections.map((section, i) => (
            <section key={i} className="py-4 lg:py-10">
              <GenericSectionCard section={section} />
            </section>
          ))}
        </div>
      )}

      {/* ── CTA ── */}
      {!hideCta && service.cta && (
        <section className="relative overflow-hidden  py-16 lg:py-20">
          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-br-full border-[48px] border-red/10" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-tl-full border-[48px] border-red/10" />

          <div className="relative container mx-auto px-4 lg:px-12 text-center">
            <div className="max-w-3xl mx-auto">

              <div className="inline-flex items-center gap-2 bg-red/10 border border-red/25 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                <span className="text-red text-[11px] font-bold tracking-widest uppercase">
                  Ready to get started?
                </span>
              </div>

              <h2 className="text-center leading-tight mb-5">
                {(() => {
                  const raw = stripLeadingEmoji(service.cta.headline || service.cta.tagline) || "";
                  const words = raw.split(" ");
                  return words.map((word, i) =>
                    i % 2 === 0 ? (
                      <span key={i} className="inline-block mr-3 text-3xl lg:text-4xl xl:text-5xl font-extrabold">
                        {word}
                      </span>
                    ) : (
                      <span key={i} className="inline-block mr-3 text-3xl lg:text-4xl xl:text-5xl font-extrabold text-transparent" style={{ WebkitTextStroke: "2px #E24B4A" }}>
                        {word}
                      </span>
                    )
                  );
                })()}
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