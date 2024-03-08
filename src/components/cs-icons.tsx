/**
 * Resuable SVG icons with configurable classNames.
 */

import * as React from "react";
import type { SVGProps } from "react";
import clsx from "clsx";

export const ChevronUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path fill="#fff" d="M0 0h20v20H0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      className={clsx("stroke-gray-700", props.className)}
      d="M3.333 11.667 10 5l6.667 6.667m-10 2.5L10 10.832l3.333 3.333"
    />
  </svg>
);

export const LogIn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      className={clsx("stroke-gray-600", props.className)}
      d="M6.667 6.667V6.25v0c0-.542 0-.813.026-1.04a4 4 0 0 1 3.517-3.517c.227-.026.498-.026 1.04-.026h1.25c1.707 0 2.561 0 3.242.256a4 4 0 0 1 2.335 2.335c.256.68.256 1.535.256 3.242v5c0 1.707 0 2.561-.256 3.242a4 4 0 0 1-2.335 2.335c-.68.256-1.535.256-3.242.256h-1.25c-.542 0-.813 0-1.04-.026a4 4 0 0 1-3.517-3.516c-.026-.228-.026-.5-.026-1.041v0-.417m-5-3.333h12.5m0 0-3.334-3.333M14.167 10l-3.334 3.333"
    />
  </svg>
);

export const Home = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        className={clsx("stroke-gray-600", props.className)}
        d="M18.333 14.167v-3.713c0-1.355 0-2.033-.165-2.66a5.001 5.001 0 0 0-.818-1.702c-.387-.521-.916-.945-1.974-1.791l-.378-.303h0c-1.784-1.427-2.676-2.14-3.665-2.414a5 5 0 0 0-2.666 0c-.99.274-1.88.987-3.664 2.414h0l-.379.303c-1.058.846-1.587 1.27-1.974 1.79a5 5 0 0 0-.818 1.703c-.165.627-.165 1.305-.165 2.66v3.713a4.167 4.167 0 0 0 4.166 4.166c.92 0 1.667-.746 1.667-1.666v-3.334a2.5 2.5 0 0 1 5 0v3.334c0 .92.746 1.666 1.667 1.666a4.167 4.167 0 0 0 4.166-4.166Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const Comment = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      className={clsx("stroke-gray-700", props.className)}
      d="M1.333 7.333c0-.929 0-1.393.062-1.782A5 5 0 0 1 5.55 1.395c.388-.062.853-.062 1.782-.062H8c1.55 0 2.325 0 2.96.17a5 5 0 0 1 3.536 3.536c.17.636.17 1.411.17 2.961v4.78a1.445 1.445 0 0 1-2.189 1.24v0A4.818 4.818 0 0 0 10 13.333H7.333c-.929 0-1.394 0-1.782-.061a5 5 0 0 1-4.156-4.156c-.062-.39-.062-.854-.062-1.783v0Z"
    />
  </svg>
);

export const CommentText = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      className={clsx("stroke-gray-700", props.className)}
      d="M5.833 6.667H12.5M5.833 10h3.333m6.43 7.525v0c.403.242.605.362.759.414a1.5 1.5 0 0 0 1.943-1.1c.035-.16.035-.394.035-.863v-6.31c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.184c-1.07-.545-2.47-.545-5.27-.545H9.166c-2.33 0-3.494 0-4.413.38a5 5 0 0 0-2.706 2.706c-.38.92-.38 2.084-.38 4.414v0c0 2.33 0 3.494.38 4.413a5 5 0 0 0 2.706 2.706c.919.38 2.084.38 4.413.38h3.332c.281 0 .422 0 .56.008a5 5 0 0 1 2.055.57c.123.064.243.136.484.28Z"
    />
  </svg>
);

export const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      className={clsx("stroke-gray-800", props.className)}
      d="M8.333 4.167 2.5 10m0 0 5.833 5.833M2.5 10h15"
    />
  </svg>
);
