import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

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
