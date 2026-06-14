import svgPaths from "./svg-bylo7ee8ou";
import imgAdministratorProfile from "./1ad1fae15ac72f58737e0a7920a4dcad133de725.png";

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">Error Logs</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Real-time system health monitoring and diagnostic tracing.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[444.77px]" data-name="Container">
      <Heading1 />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[12.083px] relative shrink-0 w-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 12.0833">
        <g id="Container">
          <path d={svgPaths.p16cc1380} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container3 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Clear History</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p1d25a580} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#006e2f] content-stretch flex gap-[8px] items-center px-[16px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Download Logs</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12.01px] items-start relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function PageHeaderActions() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Page Header & Actions">
      <Container />
      <Container2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase w-full">
          <p className="leading-[24px]">CRITICAL ERRORS</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[7px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7">
        <g id="Container">
          <path d={svgPaths.pde19380} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex items-center left-[128.78px] top-[14px]" data-name="Container">
      <Container8 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">+8%</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#ef4444] text-[32px] top-[20px] tracking-[-0.64px] whitespace-nowrap">
          <p className="leading-[40px]">12</p>
        </div>
        <Container7 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase w-full">
          <p className="leading-[24px]">WARNINGS</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[7px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7">
        <g id="Container">
          <path d={svgPaths.p9f44800} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex items-center left-[126.17px] top-[14px]" data-name="Container">
      <Container12 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">-12%</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#f59e0b] text-[32px] top-[20px] tracking-[-0.64px] whitespace-nowrap">
          <p className="leading-[40px]">84</p>
        </div>
        <Container11 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#f59e0b] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase w-full">
          <p className="leading-[24px]">API LATENCY (AVG)</p>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[7px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7">
        <g id="Container">
          <path d={svgPaths.pde19380} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex items-center left-[115.92px] top-[14px]" data-name="Container">
      <Container16 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">+24ms</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#005ac2] text-[32px] top-[20px] tracking-[-0.64px] whitespace-nowrap">
          <p className="leading-[40px]">245ms</p>
        </div>
        <Container15 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white col-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#005ac2] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase w-full">
          <p className="leading-[24px]">UPTIME</p>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex items-center left-[133.36px] top-[18.5px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Stable</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#006e2f] text-[32px] top-[20px] tracking-[-0.64px] whitespace-nowrap">
          <p className="leading-[40px]">99.98%</p>
        </div>
        <Container19 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white col-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#006e2f] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function BentoStatsSummary() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_125px] relative shrink-0 w-full" data-name="Bento Stats Summary">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[12px] relative shrink-0 w-[12.031px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0309 12">
        <g id="Container">
          <path d={svgPaths.pc9380} fill="var(--fill-0, #6D7B6C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Filters:</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="image">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageClip() {
  return (
    <div className="absolute inset-[0_-0.44px_0_0]" data-name="image clip">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[75px] pr-[9px] py-[8.5px] relative rounded-[inherit] size-full">
        <Image />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Severity: All</p>
        </div>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0" data-name="Options">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center px-[13px] py-[9px] relative size-full">
        <ImageClip />
        <Container22 />
      </div>
    </div>
  );
}

function Image1() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="image">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[4.16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Status: All Codes</p>
        </div>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0" data-name="Options">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center px-[13px] py-[9px] relative size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[113px] pr-[9px] py-[8.5px] relative rounded-[inherit] size-full">
          <Image1 />
        </div>
        <Container23 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 15">
        <g id="Container">
          <path d={svgPaths.p3b95cda0} fill="var(--fill-0, #6D7B6C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-auto relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] w-full">
        <p className="leading-[20px]">Oct 12, 2023 - Oct 19, 2023</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="relative shrink-0 w-[192px]" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container25 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
        <Container24 />
        <Input />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Reset All Filters</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="flex-[1_0_0] min-w-[116.5px] relative" data-name="Button:margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end min-w-[inherit] pl-[146.578px] relative size-full">
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function FiltersBar() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Filters Bar">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[17px] relative size-full">
          <BackgroundBorder />
          <Options />
          <Options1 />
          <BackgroundBorder1 />
          <ButtonMargin />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[152.55px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">LEVEL</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[115.81px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">STATUS</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[151.84px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">TIMESTAMP</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[313.64px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">ENDPOINT</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[320px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">MESSAGE SNIPPET</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row">
      <div className="flex flex-row justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center pr-[126.89px] relative size-full">
          <Cell />
          <Cell1 />
          <Cell2 />
          <Cell3 />
          <Cell4 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-start mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.3)] border-b border-solid inset-0 pointer-events-none" />
      <Row />
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p31e05580} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">CRITICAL</p>
      </div>
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[104.55px]" data-name="Data">
      <Container26 />
      <Container27 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#ffdad6] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">500</p>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[25.5px] relative shrink-0 w-[139.81px]" data-name="Data">
      <Background />
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative shrink-0 w-[151.84px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">2023-10-19</p>
        <p className="leading-[normal]">14:22:05</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">/api/v1/orders/create</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[25px] relative shrink-0 w-[313.64px]" data-name="Data">
      <Code />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[320px] overflow-clip px-[24px] py-[26.5px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[16px] text-ellipsis whitespace-nowrap">
        <p className="leading-[normal]">NullPointerException: Unexpected null value in routing engine...</p>
      </div>
    </div>
  );
}

function LogRow1Critical() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Log Row 1 (Critical)">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pr-[126.89px] relative size-full">
          <Data />
          <Data1 />
          <Data2 />
          <Data3 />
          <Data4 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[15.833px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 15.8333">
        <g id="Container">
          <path d={svgPaths.p1de06280} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">WARNING</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[104.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(245,158,11,0.1)] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">429</p>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[139.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[25.5px] relative size-full">
        <Overlay />
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[151.84px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">2023-10-19</p>
          <p className="leading-[normal]">14:19:33</p>
        </div>
      </div>
    </div>
  );
}

function Code1() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">/api/v1/auth/login</p>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[313.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[25px] relative size-full">
        <Code1 />
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip px-[24px] py-[26.5px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[16px] text-ellipsis whitespace-nowrap">
          <p className="leading-[normal]">Rate limit exceeded for IP: 192.168.1.45...</p>
        </div>
      </div>
    </div>
  );
}

function LogRow2Warning() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Log Row 2 (Warning)">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pr-[126.89px] pt-px relative size-full">
          <Data5 />
          <Data6 />
          <Data7 />
          <Data8 />
          <Data9 />
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p25167400} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#005ac2] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">INFO</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[104.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container30 />
        <Container31 />
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#dce9ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#005ac2] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">200</p>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[139.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[25.5px] relative size-full">
        <Background1 />
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[151.84px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">2023-10-19</p>
          <p className="leading-[normal]">14:15:10</p>
        </div>
      </div>
    </div>
  );
}

function Code2() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">/api/v1/user/profile</p>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[313.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[25px] relative size-full">
        <Code2 />
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip px-[24px] py-[26.5px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[16px] text-ellipsis whitespace-nowrap">
          <p className="leading-[normal]">Database migration completed successfully for batch 492...</p>
        </div>
      </div>
    </div>
  );
}

function LogRow3Info() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Log Row 3 (Info)">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pr-[126.89px] pt-px relative size-full">
          <Data10 />
          <Data11 />
          <Data12 />
          <Data13 />
          <Data14 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p31e05580} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">CRITICAL</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[104.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ffdad6] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">503</p>
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[139.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[25.5px] relative size-full">
        <Background2 />
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[151.84px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">2023-10-19</p>
          <p className="leading-[normal]">14:12:45</p>
        </div>
      </div>
    </div>
  );
}

function Code3() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">/api/v1/payment/stripe</p>
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[313.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[25px] relative size-full">
        <Code3 />
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip px-[24px] py-[26.5px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[16px] text-ellipsis whitespace-nowrap">
          <p className="leading-[normal]">ConnectionTimeout: Failed to reach external payment gateway...</p>
        </div>
      </div>
    </div>
  );
}

function LogRow4Critical() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Log Row 4 (Critical)">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pr-[126.89px] pt-px relative size-full">
          <Data15 />
          <Data16 />
          <Data17 />
          <Data18 />
          <Data19 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[15.833px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 15.8333">
        <g id="Container">
          <path d={svgPaths.p1de06280} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">WARNING</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[104.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(245,158,11,0.1)] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">404</p>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[139.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25px] pl-[48px] pr-[24px] pt-[25.5px] relative size-full">
        <Overlay1 />
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[151.84px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">2023-10-19</p>
          <p className="leading-[normal]">14:05:01</p>
        </div>
      </div>
    </div>
  );
}

function Code4() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Code">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">/static/images/hero_fallback.png</p>
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="relative shrink-0 w-[313.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24.5px] pt-[25px] px-[24px] relative size-full">
        <Code4 />
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip pb-[26px] pt-[26.5px] px-[24px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[16px] text-ellipsis whitespace-nowrap">
          <p className="leading-[normal]">Missing asset detected. Falling back to default placeholder...</p>
        </div>
      </div>
    </div>
  );
}

function LogRow5Warning() {
  return (
    <div className="relative shrink-0 w-full" data-name="Log Row 5 (Warning)">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pr-[126.89px] pt-px relative size-full">
          <Data20 />
          <Data21 />
          <Data22 />
          <Data23 />
          <Data24 />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <LogRow1Critical />
      <LogRow2Warning />
      <LogRow3Info />
      <LogRow4Critical />
      <LogRow5Warning />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-[1180.73px]" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Header />
        <Body />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Showing 1 to 5 of 1,248 entries</p>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[9px] relative shrink-0 w-[5.55px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.55 9">
        <g id="Container">
          <path d={svgPaths.p1250fe00} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container38 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#006e2f] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">2</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">3</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex items-center px-[4px] relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">...</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">250</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[9px] relative shrink-0 w-[5.55px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.55 9">
        <g id="Container">
          <path d={svgPaths.p4874b00} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container40 />
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button3 />
        <Button4 />
        <Button5 />
        <Button6 />
        <Container39 />
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="bg-[#eff4ff] relative shrink-0 w-[954px]" data-name="Pagination">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.3)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[17px] px-[24px] relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function MainLogTable() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-[957px]" data-name="Main Log Table">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Table />
        <Pagination />
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function SectionContentCanvas() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] inset-[64px_0_-207.5px_0] items-start p-[32px]" data-name="Section - Content Canvas">
      <PageHeaderActions />
      <BentoStatsSummary />
      <FiltersBar />
      <MainLogTable />
    </div>
  );
}

function Container43() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
          <p className="leading-[normal]">Search logs by keyword or trace ID...</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pl-[41px] pr-[17px] pt-[10px] relative size-full">
          <Container43 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bottom-[18.42%] content-stretch flex flex-col items-start left-[12px] top-[18.42%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #6D7B6C)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[448px] min-w-px relative" data-name="Container">
      <Input1 />
      <Container44 />
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[240.27px] relative size-full">
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32px]" data-name="Button">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 36">
        <g id="Button">
          <path d={svgPaths.p121cc980} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Button">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Button">
          <path d={svgPaths.p1988dd00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-right tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15px]">Admin User</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6d7b6c] text-[10px] text-right tracking-[-0.5px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">SUPER ADMIN</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[70.7px]" data-name="Container">
      <Container49 />
      <Container50 />
    </div>
  );
}

function AdministratorProfile() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[40px]" data-name="Administrator Profile">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAdministratorProfile} />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,110,47,0.2)] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container48 />
      <AdministratorProfile />
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Container46 />
        <div className="bg-[rgba(188,203,185,0.3)] h-[32px] relative shrink-0 w-px" data-name="Vertical Divider" />
        <Container47 />
      </div>
    </div>
  );
}

function HeaderTopNavigation() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-0 pb-px px-[32px] right-0 top-0" data-name="Header - Top Navigation">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <Container41 />
      <Container45 />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="h-[1024px] overflow-clip relative shrink-0 w-full" data-name="Main Content Area">
      <SectionContentCanvas />
      <HeaderTopNavigation />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] tracking-[-0.24px] w-full">
        <p className="leading-[32px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.5)] tracking-[1.4px] uppercase w-full">
        <p className="leading-[20px]">DEVELOPER PORTAL</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[24px] relative size-full">
        <Heading />
        <Container52 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container51 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Dashboard</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container53 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p254c2600} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Database Management</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container55 />
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[18px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 18">
        <g id="Container">
          <path d={svgPaths.p3c480520} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Error Logs</p>
        </div>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border-[#006e2f] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container57 />
          <Container58 />
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p5f98840} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">{`Backup & Recovery`}</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container59 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Documentation</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container61 />
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container63 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[17px] relative size-full">
        <Link4 />
        <Link5 />
      </div>
    </div>
  );
}

function AsideDesktopSidebar() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px py-[24px] top-0 w-[260px]" data-name="Aside - Desktop Sidebar">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Margin />
      <Nav />
      <HorizontalBorder />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[260px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContentArea />
      <AsideDesktopSidebar />
    </div>
  );
}