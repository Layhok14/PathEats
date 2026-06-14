import svgPaths from "./svg-i15c8eke8h";
import imgAdministratorProfile from "./e485821ee2fe07c57b58c8166607cd12a32a7f14.png";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">{`Backup & Recovery`}</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Ensure data integrity with automated recovery points and</p>
        <p className="leading-[24px]">{`secure archival of PathEat's core routing and vendor databases.`}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[483.91px]" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Container">
          <path d={svgPaths.p1de1cd80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#006e2f] content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.02px_0_0] rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,110,47,0.2),0px_4px_6px_-4px_rgba(0,110,47,0.2)]" data-name="Button:shadow" />
      <Container3 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px] mb-0">Create</p>
        <p className="leading-[24px] mb-0">Full</p>
        <p className="leading-[24px]">Backup</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[22px] relative shrink-0 w-[19px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 22">
        <g id="Container">
          <path d={svgPaths.p131c5700} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#0f172a] content-stretch flex gap-[8px] items-center px-[20px] py-[34px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Differential</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[18px] relative shrink-0 w-[21.05px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.05 18">
        <g id="Container">
          <path d={svgPaths.p28255100} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[21px] py-[34px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#006e2f] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container5 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Incremental</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
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

function Overlay() {
  return (
    <div className="h-[32px] relative shrink-0 w-[34px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 32">
        <g id="Overlay">
          <rect fill="var(--fill-0, #006E2F)" fillOpacity="0.1" height="32" rx="8" width="34" />
          <path d={svgPaths.p3d481d00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">+2.4%</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">STORAGE USED</p>
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">1.2 TB</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#006e2f] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container6 />
        <Container7 />
        <Heading2 />
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[38px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 32">
        <g id="Overlay">
          <rect fill="var(--fill-0, #005AC2)" fillOpacity="0.1" height="32" rx="8" width="38" />
          <path d={svgPaths.p71fe080} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay1 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#005ac2] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Stable</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">ACTIVE BACKUPS</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">48</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#005ac2] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container8 />
        <Container9 />
        <Heading3 />
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Overlay">
          <rect fill="var(--fill-0, #F59E0B)" fillOpacity="0.1" height="36" rx="8" width="36" />
          <path d={svgPaths.p96d500} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay2 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">On Time</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">LAST SUCCESS</p>
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">2h ago</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white col-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#f59e0b] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container10 />
        <Container11 />
        <Heading4 />
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 36">
        <g id="Overlay">
          <rect fill="var(--fill-0, #006E2F)" fillOpacity="0.1" height="36" rx="8" width="32" />
          <path d={svgPaths.ped25480} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay3 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Optimal</p>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">RECOVERY HEALTH</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">99.9%</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white col-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#4ae176] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[25px] relative size-full">
        <Container12 />
        <Container13 />
        <Heading5 />
      </div>
    </div>
  );
}

function KpiGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_169px] relative shrink-0 w-full" data-name="KPI Grid">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
          <p className="leading-[28px]">Recent Backup Archive</p>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">View All</p>
        </div>
        <Container14 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Heading6 />
          <Button3 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[295.97px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">BACKUP NAME</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[128.14px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">DATE</p>
        <p className="leading-[normal]">CREATED</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[87.75px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">SIZE</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26px] relative shrink-0 w-[130.61px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">STATUS</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-end px-[24px] py-[26px] relative shrink-0 w-[126.89px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] text-right tracking-[0.8px] uppercase whitespace-nowrap">
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

function Container16() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p31289500} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">Daily_Full_Main_DB</p>
      </div>
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[247.97px]" data-name="Data">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[16px] relative shrink-0 w-[152.14px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">Oct 24,</p>
        <p className="leading-[normal] mb-0">2023</p>
        <p className="leading-[normal]">04:00 AM</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[87.75px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">24.5</p>
        <p className="leading-[normal]">GB</p>
      </div>
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">COMPLETED</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[36.5px] pt-[36px] px-[24px] relative shrink-0 w-[130.61px]" data-name="Data">
      <Overlay4 />
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p31915d00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container19 />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex gap-[8.5px] items-start pb-[24.5px] pl-[26.39px] pr-[24px] pt-[24px] relative shrink-0 w-[126.89px]" data-name="Data">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Row1() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] relative size-full">
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

function Container20() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p27589980} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">Asset_Bucket_Partial</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[247.97px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[152.14px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Oct 24,</p>
          <p className="leading-[normal] mb-0">2023</p>
          <p className="leading-[normal]">02:15 AM</p>
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[87.75px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">156.2</p>
          <p className="leading-[normal]">GB</p>
        </div>
      </div>
    </div>
  );
}

function Overlay5() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">COMPLETED</p>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[130.61px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[36.5px] relative size-full">
        <Overlay5 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p31915d00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container22 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container23 />
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[126.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.5px] items-start pl-[26.39px] pr-[24px] py-[24.5px] relative size-full">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pt-px relative size-full">
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

function Container24() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p22876fc0} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">Log_Rotation_Final</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[247.97px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[152.14px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Oct 23,</p>
          <p className="leading-[normal] mb-0">2023</p>
          <p className="leading-[normal]">11:59 PM</p>
        </div>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[87.75px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">8.4</p>
          <p className="leading-[normal]">GB</p>
        </div>
      </div>
    </div>
  );
}

function Overlay6() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">COMPLETED</p>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[130.61px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[36.5px] relative size-full">
        <Overlay6 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p31915d00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container27 />
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[126.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.5px] items-start pl-[26.39px] pr-[24px] py-[24.5px] relative size-full">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pt-px relative size-full">
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

function Container28() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p31289500} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[normal]">Vendor_Metadata_Snapshot</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[247.97px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[152.14px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">Oct 23,</p>
          <p className="leading-[normal] mb-0">2023</p>
          <p className="leading-[normal]">09:30 PM</p>
        </div>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[87.75px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26px] pt-[26.5px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">12.1</p>
          <p className="leading-[normal]">GB</p>
        </div>
      </div>
    </div>
  );
}

function Overlay7() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">COMPLETED</p>
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[130.61px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[36px] pt-[36.5px] px-[24px] relative size-full">
        <Overlay7 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p31915d00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container31 />
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[126.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.5px] items-start pb-[24px] pl-[26.39px] pr-[24px] pt-[24.5px] relative size-full">
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[24px] pt-px relative size-full">
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

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[769.36px]" data-name="Table">
      <Header />
      <Body />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <Table />
      </div>
    </div>
  );
}

function BackupTable23Width() {
  return (
    <div className="bg-white col-[1/span_2] h-[518px] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Backup Table (2/3 width)">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[315px] pt-px px-px relative rounded-[inherit] size-full">
        <HorizontalBorder />
        <Container15 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.pea74a00} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Retention Policy</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-center relative shrink-0 w-full" data-name="Container">
      <Container34 />
      <Heading7 />
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[15.667px] relative shrink-0 w-[11.667px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 15.6667">
        <g id="Margin">
          <path d={svgPaths.p5dab080} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Daily Snapshots</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Retained for 30 consecutive</p>
        <p className="leading-[20px]">days.</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[185.83px]" data-name="Container">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-start relative shrink-0 w-full" data-name="Item">
      <Margin />
      <Container35 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[15.667px] relative shrink-0 w-[11.667px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 15.6667">
        <g id="Margin">
          <path d={svgPaths.p5dab080} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Monthly Archives</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Stored securely for 12 months.</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[201.58px]" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-start relative shrink-0 w-full" data-name="Item">
      <Margin1 />
      <Container38 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pb-[8px] relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Edit Policy</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container33 />
        <List />
        <Button12 />
      </div>
    </div>
  );
}

function RetentionPolicyCard() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Retention Policy Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
          <div className="absolute bg-[rgba(0,110,47,0.05)] right-[-63.01px] rounded-[9999px] size-[128px] top-[-63px]" data-name="Overlay" />
          <Container32 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function SideInfoCards13Width() {
  return (
    <div className="col-3 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Side Info Cards (1/3 width)">
      <RetentionPolicyCard />
    </div>
  );
}

function MainContentGrid() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_820px] h-[518px] relative shrink-0 w-full" data-name="Main Content Grid">
      <BackupTable23Width />
      <SideInfoCards13Width />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[986px] items-start left-[260px] max-w-[1440px] p-[32px] right-0 top-[64px]" data-name="Main Content">
      <HeaderSection />
      <KpiGrid />
      <MainContentGrid />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
        <p className="leading-[normal]">Search backups...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start justify-center overflow-clip pb-[8px] pl-[40px] pr-[16px] pt-[7px] relative rounded-[8px] shrink-0 w-[256px]" data-name="Input">
      <Container43 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bottom-[12.5%] content-stretch flex flex-col items-start left-[12px] top-[12.5%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Input />
      <Container44 />
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[16px] relative shrink-0" data-name="Heading 2:margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Admin Portal</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container42 />
        <Heading2Margin />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container46 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container47 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-right tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Admin User</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-right tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">System Architect</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-[101.95px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function AdministratorProfile() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[40px]" data-name="Administrator Profile">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAdministratorProfile} />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,110,47,0.2)] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[17px] relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.3)] border-l border-solid inset-0 pointer-events-none" />
      <Container48 />
      <AdministratorProfile />
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Button13 />
        <Button14 />
        <VerticalBorder />
      </div>
    </div>
  );
}

function HeaderTopNavBar() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[64px] max-w-[1180px] relative shrink-0 w-full" data-name="Header - TopNavBar">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] pb-px px-[32px] relative size-full">
          <Container41 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopNavBarMargin() {
  return (
    <div className="absolute content-stretch flex flex-col h-[64px] items-start left-0 max-w-[1440px] pl-[260px] right-0 top-0" data-name="Header - TopNavBar:margin">
      <HeaderTopNavBar />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] tracking-[-0.24px] w-full">
        <p className="leading-[32px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.5)] w-full">
        <p className="leading-[20px]">Developer Portal</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Heading1 />
        <Container52 />
      </div>
    </div>
  );
}

function Margin2() {
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
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
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
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
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
          <path d={svgPaths.p3c480520} fill="var(--fill-0, #CBDBF5)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Error Logs</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
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
          <path d={svgPaths.p5f98840} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">{`Backup & Recovery`}</p>
        </div>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border-[#006e2f] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
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
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Documentation</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[8px] pt-[12px] px-[16px] relative size-full">
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
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(203,219,245,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative size-full">
          <Container63 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[17px] px-[16px] relative size-full">
        <Link4 />
        <Link5 />
      </div>
    </div>
  );
}

function AsideSideNavBar() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[1024px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[260px]" data-name="Aside - SideNavBar">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Margin2 />
      <Nav />
      <HorizontalBorder1 />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContent />
      <HeaderTopNavBarMargin />
      <AsideSideNavBar />
    </div>
  );
}