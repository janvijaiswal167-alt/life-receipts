import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { StoryReceiptChapter } from '../../engine/storyGenerator';
import { ShieldCheck, Music, AlertTriangle, Printer } from 'lucide-react';

interface ThermalReceiptProps {
  receipt?: LifeReceipt | null;
  chapter?: StoryReceiptChapter | null;
  onPrint?: () => void;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  receipt,
  chapter,
  onPrint,
}) => {
  if (chapter) {
    // Render Story Chapter Receipt
    return (
      <div className="relative mx-auto max-w-sm rounded-none bg-[#FDFBF7] text-[#111827] font-mono p-6 shadow-receipt border-t-2 border-b-2 border-dashed border-gray-400">
        {/* Jagged Edge Top */}
        <div className="absolute -top-3 left-0 right-0 flex justify-between overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="text-gray-300 text-xs select-none">▲</span>
          ))}
        </div>

        {/* Header */}
        <div className="text-center border-b border-dashed border-gray-400 pb-4">
          <h2 className="text-base font-extrabold tracking-widest uppercase">
            LIFE//RECEIPTS
          </h2>
          <p className="text-[10px] text-gray-600 tracking-wider">TERMINAL #001 • PUNE / IN</p>
          <div className="mt-2 inline-block rounded border border-gray-800 px-2 py-0.5 text-[10px] font-bold uppercase">
            {chapter.badge}
          </div>
          <h3 className="mt-2 text-sm font-bold tracking-tight text-gray-900">
            {chapter.title}
          </h3>
          <p className="text-[11px] text-gray-600 italic">{chapter.era}</p>
        </div>

        {/* Narrative Box */}
        <div className="my-3 text-[11px] leading-relaxed text-gray-700 bg-gray-100/60 p-2.5 rounded border border-gray-200">
          {chapter.narrative}
        </div>

        {/* Itemized Table */}
        <div className="border-b border-dashed border-gray-400 pb-3 text-xs">
          <div className="flex justify-between font-bold text-[10px] text-gray-500 border-b border-gray-300 pb-1 mb-2">
            <span>ITEM / DESCRIPTION</span>
            <span>QTY / AMT</span>
          </div>

          <div className="space-y-2">
            {chapter.receiptItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div className="pr-2">
                  <p className="font-semibold">{item.name}</p>
                  {item.detail && (
                    <p className="text-[9px] text-gray-500">{item.detail}</p>
                  )}
                </div>
                <div className="text-right whitespace-nowrap">
                  {item.qty && <span className="text-[10px] text-gray-500 mr-2">{item.qty}</span>}
                  <span className="font-bold">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotals & Totals */}
        <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-gray-400">
          {chapter.subtotalLabel && (
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>{chapter.subtotalLabel}</span>
              <span>{chapter.subtotalValue}</span>
            </div>
          )}
          {chapter.taxOrMoodLabel && (
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>{chapter.taxOrMoodLabel}</span>
              <span>{chapter.taxOrMoodValue}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold pt-1 text-gray-900">
            <span>{chapter.totalLabel}</span>
            <span className="underline decoration-double">{chapter.totalValue}</span>
          </div>
        </div>

        {/* Barcode & Footnote */}
        <div className="pt-4 text-center">
          <div className="font-mono text-lg font-bold tracking-[0.25em] text-gray-800 select-none">
            {chapter.barcode}
          </div>
          <p className="mt-1 text-[9px] text-gray-500 leading-tight">
            {chapter.footnote}
          </p>
          <p className="mt-2 text-[9px] text-gray-400">
            THANK YOU FOR LIVING • KEEP THIS RECEIPT
          </p>
        </div>

        {/* Jagged Edge Bottom */}
        <div className="absolute -bottom-3 left-0 right-0 flex justify-between overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="text-gray-300 text-xs select-none">▼</span>
          ))}
        </div>
      </div>
    );
  }

  if (receipt) {
    // Render Single LifeReceipt
    return (
      <div className="relative mx-auto max-w-sm rounded-none bg-[#FDFBF7] text-[#111827] font-mono p-6 shadow-receipt border-t-2 border-b-2 border-dashed border-gray-400">
        {/* Header */}
        <div className="text-center border-b border-dashed border-gray-400 pb-4">
          <h2 className="text-base font-extrabold tracking-widest uppercase">
            LIFE//RECEIPT
          </h2>
          <p className="text-[10px] text-gray-600 uppercase">
            ID: {receipt.id} • {receipt.dateStr} {receipt.timeStr}
          </p>
          <div className="mt-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-[9px] font-bold uppercase text-gray-700">
            {receipt.source} • {receipt.category}
          </div>
        </div>

        {/* Receipt Body */}
        <div className="py-4 border-b border-dashed border-gray-400 space-y-3">
          <div>
            <span className="text-[9px] text-gray-500 uppercase">TITLE / RECORD</span>
            <p className="text-sm font-bold text-gray-900">{receipt.title}</p>
          </div>

          <div>
            <span className="text-[9px] text-gray-500 uppercase">CONTEXT / DETAILS</span>
            <p className="text-xs text-gray-700">{receipt.description}</p>
          </div>

          {receipt.location?.context && (
            <div>
              <span className="text-[9px] text-gray-500 uppercase">LOCATION / ENVIRONMENT</span>
              <p className="text-xs text-gray-700">
                {receipt.location.city ? `${receipt.location.city}, ` : ''}
                {receipt.location.state ? `${receipt.location.state} • ` : ''}
                {receipt.location.context}
              </p>
            </div>
          )}

          {receipt.entities.length > 0 && (
            <div>
              <span className="text-[9px] text-gray-500 uppercase">TAGGED ENTITIES</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {receipt.entities.map((e, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-gray-200 px-1.5 py-0.5 text-[9px] text-gray-800"
                  >
                    {e.name} ({e.type})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amount & Summary */}
        <div className="py-3 text-xs space-y-1 border-b border-dashed border-gray-400">
          {receipt.amount != null ? (
            <div className="flex justify-between items-center text-sm font-extrabold text-gray-900">
              <span>TOTAL AMOUNT</span>
              <span>₹{receipt.amount.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm font-extrabold text-gray-900">
              <span>STREAM DURATION</span>
              <span>{receipt.metadata?.durationFormatted || 'Played'}</span>
            </div>
          )}

          {receipt.metadata?.isFraud && (
            <div className="flex items-center space-x-1 text-red-600 text-[11px] font-bold mt-2 bg-red-50 p-1.5 rounded border border-red-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>SECURITY FLAG: FRAUDULENT PATTERN</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 text-center">
          <div className="font-mono text-sm font-bold tracking-[0.2em] text-gray-800 select-none">
            ||| | |||| || ||| ||||||| |
          </div>
          <p className="mt-1 text-[9px] text-gray-400 uppercase">
            AUTHENTIC RECORD • LIFE//RECEIPTS
          </p>
        </div>
      </div>
    );
  }

  return null;
};
