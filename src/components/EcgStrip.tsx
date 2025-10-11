import React from 'react';

interface EcgStripProps {
  path: string;
  viewBox?: string;
}

const EcgStrip: React.FC<EcgStripProps> = ({ path, viewBox = "0 0 300 60" }) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-2 my-4 overflow-hidden border border-green-200 dark:border-green-800">
      <svg
        width="100%"
        height="60"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Grid background */}
        <defs>
          <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,0,0,0.1)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="url(#smallGrid)" />
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,0,0,0.2)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* ECG Path */}
        <path
          d={path}
          fill="none"
          stroke="#00c853"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default EcgStrip;