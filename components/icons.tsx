import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

// Google
export const GoogleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">
      G
    </text>
  </svg>
);

// Facebook
export const FacebookIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">
      f
    </text>
  </svg>
);

// Microsoft
export const MicrosoftIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="4" y="4" width="7" height="7" />
    <rect x="13" y="4" width="7" height="7" />
    <rect x="4" y="13" width="7" height="7" />
    <rect x="13" y="13" width="7" height="7" />
  </svg>
);

// Upload
export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M12 3l-4 4h3v5h2V7h3z" />
    <rect x="5" y="17" width="14" height="2" />
  </svg>
);

// X (إغلاق)
export const XIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// دائرة بعلامة صح
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
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

// أيقونة النسخ (Clipboard)
export const ClipboardCopyIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="9" y="3" width="6" height="2" rx="1" />
    <rect
      x="7"
      y="5"
      width="10"
      height="14"
      rx="2"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
    />
    <rect
      x="5"
      y="7"
      width="10"
      height="14"
      rx="2"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      opacity="0.5"
    />
  </svg>
);

// Translate
export const TranslateIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="3" y="4" width="9" height="8" rx="1" />
    <rect x="12" y="12" width="9" height="8" rx="1" />
    <path
      d="M6 8h3M7.5 6.5v3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M14 16h4M16 14v4"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// XCircle (دائرة فيها X)
export const XCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Search (عدسة مكبّرة)
export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <circle
      cx="11"
      cy="11"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="15"
      y1="15"
      x2="20"
      y2="20"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// Trash (سلة المهملات)
export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="7" y="8" width="10" height="11" rx="1" />
    <rect x="9" y="4" width="6" height="2" rx="1" />
    <line x1="5" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Sparkles (نجوم/تأثير سحري)
export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <path
      d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"
      fill="currentColor"
    />
    <path
      d="M6 14l0.8 1.8L9 16.5 7.2 17.2 6 19 5.3 17.2 3.5 16.5 5.3 15.8 6 14z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M17 14l0.8 1.8L20 16.5 18.2 17.2 17 19 16.3 17.2 14.5 16.5 16.3 15.8 17 14z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
);

// Pencil (قلم تعديل)
export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <path
      d="M5 19l1-4 9-9 3 3-9 9-4 1z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M14 6l3 3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// LogOut (خروج)
export const LogOutIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <path
      d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M14 9l3 3-3 3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="11"
      y1="12"
      x2="21"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
