import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { StoryReceiptChapter } from '../../engine/storyGenerator';
import { Printer, ShieldCheck, AlertOctagon, Music, MapPin, Tag } from 'lucide-react';

import { LifeMoment } from '../../types/moments';
import { CrossConnection } from '../../engine/patternEngine';
import { LifePattern } from '../../types/patterns';
import { LifeChapter } from '../../types/chapters';
import { ReceiptConnectedGraphLinks } from './ReceiptConnectedGraphLinks';

interface ArchivalReceiptProps {
  receipt?: LifeReceipt | null;
  chapter?: StoryReceiptChapter | null;
  onPrint?: () => void;
  contextualLinks?: {
    moments: LifeMoment[];
    connections: CrossConnection[];
    patterns: LifePattern[];
    chapter?: LifeChapter;
  };
  onSelectMoment?: (m: LifeMoment) => void;
  onSelectConnection?: (c: CrossConnection) => void;
  onSelectPattern?: (p: LifePattern) => void;
  onSelectChapter?: (ch: LifeChapter) => void;
}

export const ArchivalReceipt: React.FC<ArchivalReceiptProps> = ({
  receipt,
  chapter,
  onPrint,
  contextualLinks,
  onSelectMoment,
  onSelectConnection,
  onSelectPattern,
  onSelectChapter,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  if (chapter) {
    return (
      <div className="relative mx-auto w-full max-w-sm bg-[#F4F0E6] text-[#141519] font-mono p-6 sm:p-7 shadow-receipt-physical border-t border-b border-[#D6D1C4] selection:bg-amber-900/10 selection:text-black">
        {/* Top Perforation / Tear */}
        <div className="absolute -top-2 left-0 right-0 flex justify-between overflow-hidden opacity-60 select-none">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="text-[#C8C3B4] text-[8px]">▲</span>
          ))}
        </div>

        {/* Museum Catalog Stamp Header */}
        <div className="text-center border-b border-dashed border-[#A8A395] pb-4">
          <div className="flex justify-between items-center text-[9px] text-receipt-faint mb-2">
            <span>MUSEUM ARCHIVE // EX-0{chapter.id.length}</span>
            <span>PROVENANCE: VERIFIED</span>
          </div>

          <h2 className="text-lg font-extrabold tracking-widest uppercase">
            LIFE//RECEIPTS
          </h2>
          <p className="text-[10px] text-receipt-faint tracking-wider mt-0.5">
            TERMINAL REF: PUNE-MUMBAI • {chapter.era}
          </p>

          <div className="mt-3 inline-block border border-[#141519] px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
            {chapter.badge}
          </div>

          <h3 className="mt-2 text-sm font-bold tracking-tight text-[#141519]">
            {chapter.title}
          </h3>
        </div>

        {/* Narrative Curator Note */}
        <div className="my-4 border-l-2 border-[#141519] pl-3 text-[11px] font-serif italic leading-relaxed text-[#33353D]">
          {chapter.narrative}
        </div>

        {/* Itemized Table */}
        <div className="border-b border-dashed border-[#A8A395] pb-3 text-xs">
          <div className="flex justify-between font-bold text-[9px] text-receipt-faint border-b border-[#C8C3B4] pb-1 mb-2">
            <span>RECORD / DESCRIPTION</span>
            <span>QTY / VALUE</span>
          </div>

          <div className="space-y-2">
            {chapter.receiptItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div className="pr-2">
                  <p className="font-semibold leading-snug">{item.name}</p>
                  {item.detail && (
                    <p className="text-[9px] text-receipt-faint mt-0.5">{item.detail}</p>
                  )}
                </div>
                <div className="text-right whitespace-nowrap">
                  {item.qty && <span className="text-[10px] text-receipt-faint mr-1.5">{item.qty}</span>}
                  <span className="font-bold">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotal & Total Statement */}
        <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-[#A8A395]">
          {chapter.subtotalLabel && (
            <div className="flex justify-between text-[#4E505A] text-[10px]">
              <span>{chapter.subtotalLabel}</span>
              <span className="font-semibold">{chapter.subtotalValue}</span>
            </div>
          )}
          {chapter.taxOrMoodLabel && (
            <div className="flex justify-between text-[#4E505A] text-[10px]">
              <span>{chapter.taxOrMoodLabel}</span>
              <span>{chapter.taxOrMoodValue}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold pt-1.5 text-[#141519] border-t border-[#D6D1C4]">
            <span>{chapter.totalLabel}</span>
            <span className="underline decoration-double font-mono">{chapter.totalValue}</span>
          </div>
        </div>

        {/* Official Rubber Stamp & Barcode */}
        <div className="pt-4 text-center space-y-3">
          <div className="flex justify-center">
            <span className="rubber-stamp">
              ARCHIVED BY LIFE//RECEIPTS
            </span>
          </div>

          <div className="font-mono text-base font-bold tracking-[0.25em] text-[#22242B] select-none">
            {chapter.barcode}
          </div>

          <p className="text-[9px] text-receipt-faint leading-tight">
            {chapter.footnote}
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 border border-[#141519] px-3 py-1 text-[10px] uppercase font-bold text-[#141519] hover:bg-black/5 transition-colors"
            >
              <Printer className="h-3 w-3" />
              <span>Print Thermal Copy</span>
            </button>
          </div>

          <p className="text-[8px] text-[#8C8E96] uppercase tracking-widest pt-1">
            EXHIBITION ARTIFACT • NOT A LEGAL TAX INVOICE
          </p>
        </div>

        {/* Bottom Perforation / Tear */}
        <div className="absolute -bottom-2 left-0 right-0 flex justify-between overflow-hidden opacity-60 select-none">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="text-[#C8C3B4] text-[8px]">▼</span>
          ))}
        </div>
      </div>
    );
  }

  if (receipt) {
    const isFraud = receipt.metadata?.isFraud === true;
    const sourceLabel = {
      spotify: 'SPOTIFY AUDIO ARCHIVE',
      household: 'DAILY HOUSEHOLD LEDGER',
      commerce: 'CARD COMMERCE & TELEMETRY',
    }[receipt.source];

    return (
      <div className="relative mx-auto w-full max-w-sm bg-[#F4F0E6] text-[#141519] font-mono p-6 sm:p-7 shadow-receipt-physical border-t border-b border-[#D6D1C4]">
        {/* Top Perforation */}
        <div className="absolute -top-2 left-0 right-0 flex justify-between overflow-hidden opacity-60 select-none">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="text-[#C8C3B4] text-[8px]">▲</span>
          ))}
        </div>

        {/* Header */}
        <div className="text-center border-b border-dashed border-[#A8A395] pb-4">
          <div className="flex justify-between items-center text-[9px] text-receipt-faint mb-1.5">
            <span>REG ID: #{receipt.id}</span>
            <span>{receipt.dateStr} {receipt.timeStr}</span>
          </div>

          <h2 className="text-base font-extrabold tracking-widest uppercase">
            LIFE//RECEIPT
          </h2>
          <p className="text-[10px] font-bold text-[#33353D] uppercase tracking-wider mt-0.5">
            {sourceLabel}
          </p>
          <p className="text-[9px] text-receipt-faint uppercase">
            CATEGORY: {receipt.category}
          </p>
        </div>

        {/* Receipt Body */}
        <div className="py-4 border-b border-dashed border-[#A8A395] space-y-3.5">
          <div>
            <span className="text-[8px] text-receipt-faint uppercase tracking-wider block">
              HEADLINE // RECORD
            </span>
            <p className="text-sm font-bold text-[#141519] leading-snug">{receipt.title}</p>
            {receipt.subtitle && (
              <p className="text-xs text-[#444750] mt-0.5 italic font-serif">{receipt.subtitle}</p>
            )}
          </div>

          <div>
            <span className="text-[8px] text-receipt-faint uppercase tracking-wider block">
              NARRATIVE CONTEXT
            </span>
            <p className="text-xs text-[#33353D] leading-relaxed">{receipt.description}</p>
          </div>

          {/* Spatial / Geographic Context */}
          {receipt.location?.context && (
            <div>
              <span className="text-[8px] text-receipt-faint uppercase tracking-wider block">
                SPATIAL CONTEXT
              </span>
              <p className="text-xs text-[#33353D] flex items-center space-x-1 mt-0.5">
                <MapPin className="h-3 w-3 inline text-amber-900/80 mr-1 flex-shrink-0" />
                <span>
                  {receipt.location.city ? `${receipt.location.city}, ` : ''}
                  {receipt.location.state ? `${receipt.location.state} • ` : ''}
                  {receipt.location.context}
                </span>
              </p>
            </div>
          )}

          {/* Linked Entities */}
          {receipt.entities.length > 0 && (
            <div>
              <span className="text-[8px] text-receipt-faint uppercase tracking-wider block">
                LINKED ENTITIES
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {receipt.entities.map((e, idx) => (
                  <span
                    key={idx}
                    className="border border-[#C8C3B4] bg-[#EAE5D8] px-1.5 py-0.5 text-[9px] text-[#22242B]"
                  >
                    {e.name} ({e.type})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Useful Metadata Itemization */}
          <div className="pt-2 border-t border-[#D6D1C4] text-[10px] space-y-1">
            <span className="text-[8px] text-receipt-faint uppercase tracking-wider block mb-1">
              AUTHENTICATED TELEMETRY
            </span>

            {receipt.source === 'spotify' && receipt.metadata?.durationFormatted && (
              <div className="flex justify-between text-[#444750]">
                <span>PLAYBACK TIME:</span>
                <span className="font-bold">{receipt.metadata.durationFormatted}</span>
              </div>
            )}

            {receipt.source === 'commerce' && receipt.metadata?.maskedCardNumber && (
              <div className="flex justify-between text-[#444750]">
                <span>CARD (MASKED):</span>
                <span className="font-bold font-mono">{receipt.metadata.maskedCardNumber}</span>
              </div>
            )}

            {receipt.source === 'household' && receipt.metadata?.paymentMode && (
              <div className="flex justify-between text-[#444750]">
                <span>PAYMENT MODE:</span>
                <span className="font-bold">{receipt.metadata.paymentMode}</span>
              </div>
            )}

            {receipt.metadata?.distanceKm && (
              <div className="flex justify-between text-[#444750]">
                <span>MERCHANT DISTANCE:</span>
                <span className="font-bold">{receipt.metadata.distanceKm} km</span>
              </div>
            )}

            <div className="flex justify-between text-[#444750]">
              <span>PRIVACY STATUS:</span>
              <span className="font-bold text-emerald-800">PCI-SANITY VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Amount / Metric Statement */}
        <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-[#A8A395]">
          {receipt.amount != null ? (
            <div className="flex justify-between items-center text-sm font-extrabold text-[#141519]">
              <span>NET TRANSACTION VALUE</span>
              <span className="font-mono text-base">₹{receipt.amount.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm font-extrabold text-[#141519]">
              <span>AUDIO STREAM RECORD</span>
              <span className="font-mono">{receipt.metadata?.durationFormatted || 'Played'}</span>
            </div>
          )}

          {/* Rubber Stamp for Fraud Status */}
          <div className="pt-2 flex justify-center">
            {isFraud ? (
              <span className="rubber-stamp">
                SECURITY ALERT: FRAUD INTERCEPT
              </span>
            ) : (
              <span className="rubber-stamp-verified">
                AUTHENTIC RECORD • VERIFIED
              </span>
            )}
          </div>
        </div>

        {/* Footer & Print Action */}
        <div className="pt-3 text-center space-y-2">
          <div className="font-mono text-xs font-bold tracking-[0.25em] text-[#33353D] select-none">
            ||| | |||| || ||| ||||||| |
          </div>

          <div className="flex justify-center pt-1">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 border border-[#141519] px-3 py-1 text-[10px] uppercase font-bold text-[#141519] hover:bg-black/5 transition-colors"
            >
              <Printer className="h-3 w-3" />
              <span>Print Thermal Copy</span>
            </button>
          </div>

          <p className="text-[8px] text-receipt-faint uppercase tracking-widest pt-1">
            MUSEUM ARCHIVE // RECORD #{receipt.id}
          </p>
        </div>

        {/* Bottom Perforation */}
        <div className="absolute -bottom-2 left-0 right-0 flex justify-between overflow-hidden opacity-60 select-none">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="text-[#C8C3B4] text-[8px]">▼</span>
          ))}
        </div>

        {/* Connected Life Graph Links (Moments, Connections, Patterns, Chapter) */}
        {contextualLinks && (
          <ReceiptConnectedGraphLinks
            receipt={receipt}
            contextualLinks={contextualLinks}
            onSelectMoment={onSelectMoment}
            onSelectConnection={onSelectConnection}
            onSelectPattern={onSelectPattern}
            onSelectChapter={onSelectChapter}
          />
        )}
      </div>
    );
  }

  return null;
};
