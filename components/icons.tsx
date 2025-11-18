import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

// أيقونة جوجل
export const GoogleIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">
      G
    </text>
  </svg>
);

// أيقونة فيسبوك
export const FacebookIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">
      f
    </text>
  </svg>
);

// أيقونة مايكروسوفت
export const MicrosoftIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="7" height="7" />
    <rect x="13" y="4" width="7" height="7" />
    <rect x="4" y="13" width="7" height="7" />
    <rect x="13" y="13" width="7" height="7" />
  </svg>
);

// أيقونة رفع ملف
export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* سهم لأعلى */}
    <path d="M12 3l-4 4h3v5h2V7h3z" />
    {/* خط تحت */}
    <rect x="5" y="17" width="14" height="2" />
  </svg>
);

// أيقونة X (إغلاق)
export const XIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// أيقونة علامة صح داخل دائرة
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
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
