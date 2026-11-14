import type { ReactNode } from "react";

function Icon({ size = 18, stroke = 2.2, children }: { size?: number; stroke?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const ArrowIcon = () => <Icon stroke={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const BagIcon = () => <Icon><path d="M5 8h14l-1.2 12H6.2L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></Icon>;
export const PlusIcon = () => <Icon><path d="M12 5v14M5 12h14" /></Icon>;
export const CheckIcon = () => <Icon stroke={2.6}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>;
export const PlaneIcon = () => <Icon size={20} stroke={2.4}><path d="M21 3 10 14" /><path d="M21 3 14.5 21 10 14 3 9.5z" /></Icon>;
export const CloseIcon = () => <Icon size={20} stroke={2.4}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
