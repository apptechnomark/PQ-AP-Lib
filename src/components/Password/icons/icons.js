import React from "react";

const Dot = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      className="text-lightSilver text-3xl"
    >
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
    </svg>
  );
};

const Check = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      className="text-successColor text-[18px]"
    >
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
    </svg>
  );
};

const EyeOpen = () => {
  return (
    <svg width="19" height="19" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0.000000,25.000000) scale(0.004687,-0.004687)"
        fill="currentColor">
        <path d="M2260 4119 c-516 -53 -1035 -258 -1452 -571 -277 -209 -492 -437
   -681 -723 -108 -163 -127 -203 -127 -265 0 -62 20 -102 127 -265 194 -292 408
   -518 698 -736 408 -306 931 -507 1454 -559 135 -13 429 -13 567 1 872 86 1664
   563 2147 1294 108 163 127 203 127 265 0 61 -19 102 -120 255 -282 428 -657
   765 -1115 1000 -310 159 -687 269 -1039 304 -127 13 -462 12 -586 0z m670
   -364 c722 -113 1352 -510 1754 -1103 31 -45 56 -87 56 -92 0 -5 -25 -47 -56
   -92 -193 -285 -473 -555 -764 -736 -1142 -712 -2614 -432 -3423 651 -38 51
   -80 111 -94 135 l-25 42 25 43 c79 133 283 375 427 504 407 367 893 589 1437
   658 144 19 519 13 663 -10z"/>
        <path d="M2450 3584 c-14 -2 -52 -9 -85 -15 -354 -61 -672 -341 -783 -689 -37
   -115 -46 -182 -46 -320 0 -74 5 -162 12 -195 79 -370 325 -652 677 -777 113
   -41 198 -53 350 -52 116 1 157 6 240 28 388 102 671 402 757 801 16 77 16 313
   0 390 -89 414 -392 723 -797 811 -69 15 -277 27 -325 18z m296 -375 c119 -36
   201 -86 289 -174 135 -135 199 -288 199 -475 0 -187 -64 -340 -199 -475 -135
   -135 -288 -199 -475 -199 -187 0 -340 64 -475 199 -135 135 -199 288 -199 475
   0 187 64 340 199 476 68 68 97 89 176 127 52 25 119 50 149 56 30 6 64 13 75
   15 42 10 195 -4 261 -25z"/>
      </g>
    </svg>
  );
};

const EyeClose = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_4082_611782" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_4082_611782)">
        <path d="M15.2459 12.8654L14.2798 11.9458C14.4088 11.2676 14.2056 10.6579 13.6701 10.1168C13.1346 9.57557 12.4776 9.36639 11.6989 9.48922L10.7327 8.5696C10.9269 8.48667 11.1259 8.42447 11.33 8.38301C11.534 8.34153 11.7574 8.32079 12 8.32079C12.9761 8.32079 13.8047 8.64492 14.4857 9.29319C15.1668 9.94145 15.5073 10.7301 15.5073 11.6592C15.5073 11.8902 15.4856 12.1054 15.442 12.3048C15.3984 12.5043 15.3331 12.6912 15.2459 12.8654ZM17.9824 15.4133L17.0327 14.5662C17.5776 14.1704 18.0615 13.7371 18.4845 13.2662C18.9075 12.7954 19.2695 12.2597 19.5706 11.6592C18.8537 10.2808 17.8249 9.18556 16.4843 8.37353C15.1437 7.56149 13.6489 7.15547 12 7.15547C11.5842 7.15547 11.1755 7.18277 10.7741 7.23736C10.3726 7.29195 9.9783 7.37384 9.59117 7.48302L8.58862 6.52876C9.13237 6.32299 9.6877 6.17129 10.2546 6.07366C10.8215 5.97602 11.4033 5.9272 12 5.9272C14.0162 5.9272 15.8344 6.45631 17.4546 7.51452C19.0748 8.57275 20.2566 9.95431 21 11.6592C20.6812 12.3909 20.2696 13.0738 19.765 13.7079C19.2604 14.342 18.6662 14.9105 17.9824 15.4133ZM18.6772 20.1501L15.1964 16.8621C14.7552 17.0174 14.2663 17.1445 13.7297 17.2432C13.1931 17.3419 12.6165 17.3912 12 17.3912C9.97832 17.3912 8.16012 16.8621 6.54541 15.8039C4.93071 14.7457 3.7489 13.3641 3 11.6592C3.31765 10.9359 3.72795 10.2611 4.23089 9.63488C4.73384 9.00867 5.28752 8.46566 5.89193 8.00584L3.50955 5.71303L4.41618 4.8501L19.5838 19.2872L18.6772 20.1501ZM6.79853 8.86875C6.34413 9.2131 5.90212 9.627 5.47252 10.1105C5.04291 10.5939 4.6952 11.1101 4.42938 11.6592C5.1463 13.0376 6.17507 14.1328 7.5157 14.9449C8.85633 15.7569 10.3511 16.1629 12 16.1629C12.3916 16.1629 12.7815 16.1314 13.1697 16.0684C13.5579 16.0054 13.8872 15.9404 14.1574 15.8732L13.0688 14.8118C12.9221 14.8685 12.7522 14.9136 12.5592 14.9472C12.3662 14.9808 12.1798 14.9976 12 14.9976C11.0239 14.9976 10.1953 14.6735 9.51426 14.0252C8.83319 13.3769 8.49265 12.5883 8.49265 11.6592C8.49265 11.4933 8.5103 11.3198 8.5456 11.1388C8.58091 10.9577 8.62833 10.792 8.68788 10.6419L6.79853 8.86875Z" fill="currentColor" />
      </g>
    </svg>
  );
};

export { Dot, Check, EyeOpen, EyeClose };