import React from "react";

interface HospitalLogoProps {
  className?: string;
}

export default function HospitalLogo({ className = "w-12 h-12" }: HospitalLogoProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Green Ring */}
      <circle cx="250" cy="250" r="235" fill="#049c54" />
      
      {/* Inner White Circle */}
      <circle cx="250" cy="250" r="175" fill="white" />
      
      {/* Outer Green Ring Borders */}
      <circle cx="250" cy="250" r="242" stroke="#049c54" strokeWidth="6" />
      <circle cx="250" cy="250" r="180" stroke="#049c54" strokeWidth="4" />

      {/* SVG Path for Circular Text */}
      {/* Top text path - curves along the upper half */}
      <path
        id="topTextPath"
        d="M 85,250 A 165,165 0 0,1 415,250"
        fill="none"
      />
      {/* Bottom text path - curves along the lower half */}
      <path
        id="bottomTextPath"
        d="M 415,250 A 165,165 0 0,1 85,250"
        fill="none"
      />

      {/* Top Text: BỆNH VIỆN ĐA KHOA KHU VỰC */}
      <text fill="white" fontSize="23" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">
        <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
          BỆNH VIỆN ĐA KHOA KHU VỰC
        </textPath>
      </text>

      {/* Bottom Text: MIỀN NÚI PHÍA BẮC QUẢNG NAM */}
      <text fill="white" fontSize="21" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
        <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
          MIỀN NÚI PHÍA BẮC QUẢNG NAM
        </textPath>
      </text>

      {/* Three Stars on Left (on the green ring, separating top and bottom text) */}
      <g fill="white">
        {/* Star 1 */}
        <polygon points="65,220 68,227 75,227 70,232 72,239 65,234 58,239 60,232 55,227 62,227" />
        {/* Star 2 */}
        <polygon points="55,250 58,257 65,257 60,262 62,269 55,264 48,269 50,262 45,257 52,257" />
        {/* Star 3 */}
        <polygon points="65,280 68,287 75,287 70,292 72,299 65,294 58,299 60,292 55,287 62,287" />
      </g>

      {/* Three Stars on Right */}
      <g fill="white">
        {/* Star 1 */}
        <polygon points="435,220 438,227 445,227 440,232 442,239 435,234 428,239 430,232 425,227 432,227" />
        {/* Star 2 */}
        <polygon points="445,250 448,257 455,257 450,262 452,269 445,264 438,269 440,262 435,257 442,257" />
        {/* Star 3 */}
        <polygon points="435,280 438,287 445,287 440,292 442,299 435,294 428,299 430,292 425,287 432,287" />
      </g>

      {/* --- Inner Circle Design (Mountains and Staff of Asclepius) --- */}
      <g>
        {/* Mountain 1 (Left background) */}
        <path
          d="M 130,350 L 210,210 L 250,270 L 290,210 L 370,350 Z"
          fill="#049c54"
        />
        {/* Snow cap on Left Mountain */}
        <path
          d="M 210,210 L 195,236 L 202,238 L 208,234 L 213,238 L 221,234 L 225,236 Z"
          fill="white"
        />
        {/* Snow cap on Right Mountain */}
        <path
          d="M 290,210 L 275,236 L 282,238 L 288,234 L 293,238 L 301,234 L 305,236 Z"
          fill="white"
        />

        {/* Big Middle Mountain */}
        <path
          d="M 170,350 L 250,150 L 330,350 Z"
          fill="#038245"
        />
        {/* Snow cap on Big Middle Mountain */}
        <path
          d="M 250,150 L 230,195 L 240,198 L 248,192 L 254,198 L 262,192 L 270,195 Z"
          fill="white"
        />

        {/* Staff of Asclepius (Orange) */}
        {/* Ball on top */}
        <circle cx="250" cy="115" r="15" fill="#f05a28" />
        <path
          d="M 245,130 Q 250,132 255,130"
          stroke="#f05a28"
          strokeWidth="4"
          fill="none"
        />
        {/* The rod */}
        <rect x="246" y="132" width="8" height="225" rx="3" fill="#f05a28" />

        {/* Snake (Orange) */}
        <path
          d="M 250,345 
             C 210,320 220,290 250,275 
             C 290,255 280,215 250,205
             C 210,190 220,150 250,140"
          stroke="#f05a28"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* Snake Head */}
        <path
          d="M 250,140 Q 242,143 234,142 C 228,141 224,136 226,132 C 228,128 234,127 240,131 Z"
          fill="#f05a28"
        />
        {/* Snake Eye (White dot) */}
        <circle cx="232" cy="133" r="1.5" fill="white" />
        {/* Snake tongue */}
        <path
          d="M 226,132 Q 220,134 214,131 L 210,133"
          stroke="#f05a28"
          strokeWidth="2.5"
          fill="none"
        />
      </g>

      {/* Date Text: 20/03/2001 (Founding date) */}
      <text
        x="250"
        y="410"
        textAnchor="middle"
        fill="#111"
        fontSize="34"
        fontWeight="bold"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        20/03/2001
      </text>
    </svg>
  );
}
