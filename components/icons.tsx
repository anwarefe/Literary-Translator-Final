import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

// أيقونة جوجل
export const GoogleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">G</text>
  </svg>
);

// أيقونة فيسبوك
export const FacebookIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">f</text>
  </svg>
);

// أيقونة مايكروسوفت
export const MicrosoftIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="4" y="4" width="7" height="7" />
    <rect x="13" y="4" width="7" height="7" />
    <rect x="4" y="13" width="7" height="7" />
    <rect x="13" y="13" width="7" height="7" />
  </svg>
);

// أيقونة رفع ملف
export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M12 3l-4 4h3v5h2V7h3z" />
    <rect x="5" y="17" width="14" height="2" />
  </svg>
);

// أيقونة X (إغلاق)
export const XIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// أيقونة علامة صح داخل دائرة
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M8 12.5l2.5 2.5L16 9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// أيقونة النسخ (Clipboard Copy)
export const ClipboardCopyIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="9" y="3" width="6" height="2" rx="1" />
    <rect x="7" y="5" width="10" height="14" rx="2" stroke="currentColor" fill="none" strokeWidth="2" />
    <rect x="5" y="7" width="10" height="14" rx="2" stroke="currentColor" fill="none" strokeWidth="2" opacity="0.5" />
  </svg>
);
