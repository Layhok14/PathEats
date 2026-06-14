import svgPaths from "./svg-an25e3hke1";
import imgVendorIcon from "./d973d7829342f294a9ad0d5bcb9a7d6c97518661.png";
import imgAdministratorProfile from "./e7e6eabe3b6adfcc09ea4b52e4451785b7c83441.png";

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[32px]">Complaints Management</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Review and resolve issues reported by users and vendors.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[385.61px]" data-name="Container">
      <Heading1 />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[9px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 9">
        <g id="Container">
          <path d={svgPaths.p1b72c490} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#6d7b6c] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container3 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Filter</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, #004B1E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#22c55e] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center px-[24px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#004b1e] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Create Ticket</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Header Section">
      <Container />
      <Container2 />
    </div>
  );
}

function Background() {
  return (
    <div className="h-[34px] relative shrink-0 w-[20px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 34">
        <g id="Background">
          <rect fill="var(--fill-0, #FEF2F2)" height="34" rx="8" width="20" />
          <path d={svgPaths.p3e0f1080} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#fef2f2] content-stretch flex flex-col items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">+12% vs last week</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Background />
        <Background1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px]">URGENT PENDING</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">24</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border-[#ef4444] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container5 />
        <Heading2 />
        <Container6 />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Background">
          <rect fill="var(--fill-0, #F0FDF4)" height="36" rx="8" width="36" />
          <path d={svgPaths.p29f44320} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#f0fdf4] content-stretch flex flex-col items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">+5% daily target</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Background2 />
        <Background3 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px]">RESOLVED TODAY</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">142</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border-[#006e2f] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container7 />
        <Heading3 />
        <Container8 />
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="h-[37px] relative shrink-0 w-[34px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 37">
        <g id="Background">
          <rect fill="var(--fill-0, #EFF6FF)" height="37" rx="8" width="34" />
          <path d={svgPaths.p1f7f94c0} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#eff6ff] content-stretch flex flex-col items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#005ac2] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">-2.4m avg</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Background4 />
        <Background5 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px]">AVG RESPONSE TIME</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">18.5m</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border-[#005ac2] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container9 />
        <Heading4 />
        <Container10 />
      </div>
    </div>
  );
}

function KpiCards() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_169px] relative shrink-0 w-full" data-name="KPI Cards">
      <OverlayBorderOverlayBlur />
      <OverlayBorderOverlayBlur1 />
      <OverlayBorderOverlayBlur2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Active Tickets</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">View All Tickets</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative size-full">
          <Heading5 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[110.8px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">TICKET</p>
        <p className="leading-[normal]">ID</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[158.69px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">USER /</p>
        <p className="leading-[normal]">VENDOR</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[176.95px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">SUBJECT</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[123.22px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">PRIORITY</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[144.64px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">TIMESTAMP</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[134.39px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">STATUS</p>
      </div>
    </div>
  );
}

function Cell6() {
  return (
    <div className="content-stretch flex flex-col items-end px-[24px] py-[26px] relative shrink-0 w-[121.31px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] text-right uppercase whitespace-nowrap">
        <p className="leading-[normal]">ACTIONS</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Row">
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
      <Cell5 />
      <Cell6 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header">
      <Row />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[110.8px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">#TC-</p>
        <p className="leading-[normal]">8924</p>
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#e2e8f0] content-stretch flex h-[32px] items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[9999px] shrink-0 w-[30.41px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">JD</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Jane</p>
        <p className="leading-[16px]">Doe</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">Customer</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[50.63px]" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-center pl-[24px] relative shrink-0 w-[134.69px]" data-name="Data">
      <Background6 />
      <Container12 />
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[47.99px] pr-[24px] py-[16px] relative shrink-0 w-[200.94px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">Wrong route</p>
        <p className="leading-[normal] mb-0">suggestion for</p>
        <p className="leading-[normal]">{`'Tofu House'`}</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#b91c1c] text-[10px] tracking-[-0.25px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">CRITICAL</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[36.5px] pt-[36px] px-[24px] relative shrink-0 w-[123.22px]" data-name="Data">
      <Background7 />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[36.5px] pt-[36px] px-[24px] relative shrink-0 w-[144.64px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">2 mins ago</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">New</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[24px] relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-[#ef4444] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p1e861900} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 12.5">
        <g id="Container">
          <path d={svgPaths.p2e870a60} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container17 />
    </div>
  );
}

function Data6() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end pl-[48px] relative shrink-0 w-[121.31px]" data-name="Data">
      <Button3 />
      <Button4 />
    </div>
  );
}

function CriticalRow() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Critical Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] relative size-full">
          <Data />
          <Data1 />
          <Data2 />
          <Data3 />
          <Data4 />
          <Data5 />
          <Data6 />
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[110.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TC-</p>
          <p className="leading-[normal]">8921</p>
        </div>
      </div>
    </div>
  );
}

function VendorIcon() {
  return (
    <div className="max-w-[110.69000244140625px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Vendor Icon">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgVendorIcon} />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Pasta</p>
        <p className="leading-[16px]">Prime</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">Vendor</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[43.62px]" data-name="Container">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[134.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[24px] relative size-full">
        <VendorIcon />
        <Container18 />
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[200.94px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[47.99px] pr-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Payment</p>
          <p className="leading-[normal] mb-0">settlement delay</p>
          <p className="leading-[normal]">(3 days)</p>
        </div>
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#ffedd5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c2410c] text-[10px] tracking-[-0.25px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">HIGH</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[123.22px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[36.5px] relative size-full">
        <Background8 />
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[144.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[36.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal]">45 mins ago</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[6.16px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">In</p>
        <p className="leading-[normal]">Progress</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.99px] items-center pl-[24px] relative size-full">
        <div className="bg-[#f59e0b] h-[8px] relative rounded-[9999px] shrink-0 w-[6.88px]" data-name="Background" />
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p6e98980} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container22 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 12.5">
        <g id="Container">
          <path d={svgPaths.p2e870a60} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container23 />
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[121.31px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[48px] relative size-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function RowHighPriority() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row - High Priority">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] pt-px relative size-full">
          <Data7 />
          <Data8 />
          <Data9 />
          <Data10 />
          <Data11 />
          <Data12 />
          <Data13 />
        </div>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[110.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[19.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TC-</p>
          <p className="leading-[normal]">8919</p>
        </div>
      </div>
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex h-[32px] items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[9999px] shrink-0 w-[24.34px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#2563eb] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">MK</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Michael</p>
        <p className="leading-[16px]">King</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">Customer</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[59.13px]" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[134.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[24px] relative size-full">
        <Background9 />
        <Container24 />
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[200.94px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[47.99px] pr-[24px] py-[19.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Profile image</p>
          <p className="leading-[normal]">upload error</p>
        </div>
      </div>
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1d4ed8] text-[10px] tracking-[-0.25px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">MEDIUM</p>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[123.22px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[29.5px] relative size-full">
        <Background10 />
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[144.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[29.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal]">3 hours ago</p>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">Resolved</p>
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <Container27 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p6e98980} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-40 p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container28 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 12.5">
        <g id="Container">
          <path d={svgPaths.p2e870a60} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container29 />
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[121.31px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[48px] relative size-full">
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function RowMediumPriority() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row - Medium Priority">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] pt-px relative size-full">
          <Data14 />
          <Data15 />
          <Data16 />
          <Data17 />
          <Data18 />
          <Data19 />
          <Data20 />
        </div>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[110.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26px] pt-[26.5px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TC-</p>
          <p className="leading-[normal]">8910</p>
        </div>
      </div>
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex h-[32px] items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[9999px] shrink-0 w-[26.72px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">SW</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Sarah</p>
        <p className="leading-[16px]">West</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">Customer</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[50.63px]" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[134.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[24px] relative size-full">
        <Background11 />
        <Container30 />
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="relative shrink-0 w-[200.94px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[47.99px] pr-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Suggestion for</p>
          <p className="leading-[normal] mb-0">more dessert</p>
          <p className="leading-[normal]">filters</p>
        </div>
      </div>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[10px] tracking-[-0.25px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">LOW</p>
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="relative shrink-0 w-[123.22px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[36px] pt-[36.5px] px-[24px] relative size-full">
        <Background12 />
      </div>
    </div>
  );
}

function Data25() {
  return (
    <div className="relative shrink-0 w-[144.64px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[36px] pt-[36.5px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal]">Yesterday</p>
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[6.16px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">In</p>
        <p className="leading-[normal]">Progress</p>
      </div>
    </div>
  );
}

function Data26() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.99px] items-center pl-[24px] relative size-full">
        <div className="bg-[#f59e0b] h-[8px] relative rounded-[9999px] shrink-0 w-[6.88px]" data-name="Background" />
        <Container33 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p6e98980} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container34 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 12.5">
        <g id="Container">
          <path d={svgPaths.p2e870a60} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container35 />
    </div>
  );
}

function Data27() {
  return (
    <div className="relative shrink-0 w-[121.31px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[48px] relative size-full">
        <Button9 />
        <Button10 />
      </div>
    </div>
  );
}

function RowLowPriority() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row - Low Priority">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] pt-px relative size-full">
          <Data21 />
          <Data22 />
          <Data23 />
          <Data24 />
          <Data25 />
          <Data26 />
          <Data27 />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <CriticalRow />
      <RowHighPriority />
      <RowMediumPriority />
      <RowLowPriority />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
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
          <p className="leading-[24px]">Showing 4 of 288 active complaints</p>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">2</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">3</p>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">...</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start relative size-full">
        <Button11 />
        <Button12 />
        <Button13 />
        <Button14 />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[17px] px-[16px] relative size-full">
          <Container36 />
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function ComplaintsTableContainer() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] relative rounded-[12px] shrink-0 w-full" data-name="Complaints Table Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Table />
        <BackgroundHorizontalBorder1 />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] w-full">
          <p className="leading-[28px]">Resolution Trends</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[39.99%] opacity-0 right-[40.01%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">12</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[57.59px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container39 />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[39.8%] opacity-0 right-[39.82%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">18</p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[86.39px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.16px]" data-name="Overlay">
      <Container40 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[39.8%] opacity-0 right-[39.86%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">16</p>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[76.8px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container41 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[37.84%] opacity-0 right-[37.86%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">24</p>
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[115.19px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container42 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[37.98%] opacity-0 right-[37.99%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">32</p>
      </div>
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[163.19px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container43 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[37.94%] opacity-0 right-[37.96%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">28</p>
      </div>
    </div>
  );
}

function Overlay5() {
  return (
    <div className="bg-[rgba(0,110,47,0.2)] h-[134.39px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container44 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[37.26%] right-[37.3%] top-[-24px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">40</p>
      </div>
    </div>
  );
}

function Overlay6() {
  return (
    <div className="bg-[rgba(0,110,47,0.6)] h-[182.39px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[53.14px]" data-name="Overlay">
      <Container45 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-end justify-center pt-[8px] relative size-full">
        <Overlay />
        <Overlay1 />
        <Overlay2 />
        <Overlay3 />
        <Overlay4 />
        <Overlay5 />
        <Overlay6 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Mon</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Tue</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Wed</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Thu</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Fri</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Sat</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Sun</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container47 />
        <Container48 />
        <Container49 />
        <Container50 />
        <Container51 />
        <Container52 />
        <Container53 />
      </div>
    </div>
  );
}

function ResolutionTrends() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Resolution Trends">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[25px] relative size-full">
        <Heading6 />
        <Container38 />
        <Container46 />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Live Support Chatter</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading7 />
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Container54 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-start justify-between leading-[0] not-italic relative size-full whitespace-nowrap">
        <div className="flex flex-col justify-center relative shrink-0 text-[#006e2f] text-[16px]">
          <p className="leading-[24px]">#TC-8924 assigned to @Sarah_Supp</p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[#3d4a3d] text-[10px]">
          <p className="leading-[15px]">Just now</p>
        </div>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Italic',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[12px] w-full">
          <p className="leading-[18px]">{`"Investigating the map coordinate mismatch for Tofu House."`}</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Paragraph />
        <Container56 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-start justify-between leading-[0] not-italic relative size-full whitespace-nowrap">
        <div className="flex flex-col justify-center relative shrink-0 text-[#565e74] text-[16px]">
          <p className="leading-[24px]">#TC-8919 marked as Resolved</p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[#3d4a3d] text-[10px]">
          <p className="leading-[15px]">12m ago</p>
        </div>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Italic',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[12px] w-full">
          <p className="leading-[18px]">{`"User confirmed the image upload works on v2.1.0."`}</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Paragraph1 />
        <Container57 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="max-h-[160px] relative shrink-0 w-full" data-name="Container">
      <div className="max-h-[inherit] overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start max-h-[inherit] pr-[8px] relative size-full">
          <BackgroundBorder />
          <BackgroundBorder1 />
        </div>
      </div>
    </div>
  );
}

function RecentFeedbackSnippetsAsymmetricBentoElement() {
  return (
    <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.8)] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Recent Feedback Snippets (Asymmetric Bento Element)">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start pb-[89px] pt-[25px] px-[25px] relative size-full">
        <Margin />
        <Container55 />
      </div>
    </div>
  );
}

function SecondarySectionInsights() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_318px] relative shrink-0 w-full" data-name="Secondary Section: Insights">
      <ResolutionTrends />
      <RecentFeedbackSnippetsAsymmetricBentoElement />
    </div>
  );
}

function MainContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Content">
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-[40px] pt-[96px] px-[24px] relative size-full">
        <HeaderSection />
        <KpiCards />
        <ComplaintsTableContainer />
        <SecondarySectionInsights />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
        <p className="leading-[normal]">Search complaints, users, or ticket IDs...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[40px] pr-[16px] py-[10px] relative size-full">
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute bottom-[20%] content-stretch flex flex-col items-start left-[12px] top-[20%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[448px] min-w-px relative" data-name="Container">
      <Input />
      <Container61 />
    </div>
  );
}

function Container58() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[428px] relative size-full">
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <Container63 />
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <Container64 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function HeaderTopBar() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-[260px] pb-px px-[24px] right-0 top-0" data-name="Header - Top Bar">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <Container58 />
      <Container62 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[20px] w-full">
        <p className="leading-[28px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-70 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] w-full">
        <p className="leading-[20px]">System Controller</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Heading />
        <Container66 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[40px] relative size-full">
        <Container65 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Dashboard</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container67 />
          <Container68 />
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Container">
          <path d={svgPaths.p39955c80} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">User Management</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container69 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
        <g id="Container">
          <path d={svgPaths.p23cfd7c0} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Restaurant Management</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container71 />
          <Container72 />
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p7555480} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Complaints</p>
        </div>
      </div>
    </div>
  );
}

function LinkActiveState() {
  return (
    <div className="bg-[#1e293b] relative shrink-0 w-full" data-name="Link - Active State">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[28px] pr-[24px] py-[12px] relative size-full">
          <Container73 />
          <Container74 />
        </div>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container75 />
          <Container76 />
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
        <LinkActiveState />
        <Link3 />
      </div>
    </div>
  );
}

function AdministratorProfile() {
  return (
    <div className="max-w-[211px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Administrator Profile">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAdministratorProfile} />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
        <p className="leading-[24px]">Admin User</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Super Admin</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="relative shrink-0 w-[97.56px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container79 />
        <Container80 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pb-[16px] pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#334155] border-solid border-t inset-0 pointer-events-none" />
      <AdministratorProfile />
      <Container78 />
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <HorizontalBorder />
      </div>
    </div>
  );
}

function AsideSidebarSharedComponentBlueprint() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[1372px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[260px]" data-name="Aside - Sidebar (Shared Component Blueprint)">
      <div aria-hidden className="absolute border-[#bccbb9] border-r border-solid inset-0 pointer-events-none" />
      <Margin1 />
      <Nav />
      <Container77 />
    </div>
  );
}

export default function ComplaintsSupport1280X() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[48px] pl-[260px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Complaints & Support (1280x1024)">
      <MainContent />
      <HeaderTopBar />
      <AsideSidebarSharedComponentBlueprint />
    </div>
  );
}