import svgPaths from "./svg-wtd2nwlp68";
import imgAb6AXuCgzHifBfnW0VPhCyRDzO5VUoNkdOJfbN25LuuNg0TZsSx4IcPuXxEbpWgycsUDtNQxSbao7DvgtlktdLPhDibRkZsdQwRofwn20GxEpfo2Wzhq3RTrghXhNAte9KXtjRdMRku9H1PnHlb6MPabqGjLdwQ7PSwr5YH9VWw1UxyxVkVquBckBypnM7ObwLf5RXg2ZYgUIfXPtBt7IUlPvb7VTCaE3S1JCbBdwlWf4YnwDscXxC6YfGoVnrQamNwhq95E5UMyeo from "./49b87b2800802a17ece122de44942d398542956d.png";
import imgAb6AXuChVwJa22AvpvaLvSuVz4CmdPpkwan8MtNbx99CPdHRk0N3OEitDWxviVy2VVvsO259Lw933TdJgi6Cdh2KOm1E59NpdSujXi6KiQc3Ud4RYzELadMeaa06NTuww0L8O7OMSj81FoHgjpnBvKkJ5YB1D3EiuFTgMbtgbz8VwbHay5E5Dec1PrdFdPlcImI6Z3NgRpjG6Dm4DTou3Uj94Vll9WALm6FQ524YiaQcqG7QXxkjHtx5M9MrW3Cv96Lhpd24Br48Cew from "./8de98d1e8c236f45047e8fbb722a2bdeb361b6a6.png";
import imgAb6AXuDv11N022Lp9OvBLf9OgDmhmhYbmrGxmrIlbNvYcUep5VDIxCBeAtjw2ODxZyqbUiWyGdWoVecrqh5GcEh7H3XiOweZg6CdZPnEfCy2Ujx0UgYmm8Ir869ElDvOefjwwpiYkCf0Hgjn92Fc3ZUwH48QrNkbxDuUfAYv7ZtCsXyzj6GQhQ8NHdMdHfEtnnvGMdykLnDMykjscVj0APihIuCKhHFtl6LQgFv550DsNijObYHk3FVYuo2VmzBKkaDgEIdjn0Rlzk from "./56a2881bd617dee410f09bc349a82cd4f72a1a72.png";
import imgUserProfile from "./166ea5e695c279fc5b0a1d8b93c1bc3318580e1e.png";

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">TOTAL USERS</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">12,482</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[8px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Container">
          <path d={svgPaths.p19734dc0} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">+12% from last month</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[147.743px]" data-name="Container">
      <Container3 />
      <Heading1 />
      <Container4 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="h-[40px] relative shrink-0 w-[46px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 40">
        <g id="Overlay">
          <rect fill="var(--fill-0, #006E2F)" fillOpacity="0.1" height="40" rx="8" width="46" />
          <path d={svgPaths.pf853420} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container2 />
        <Overlay />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
          <Container1 />
          <div className="absolute bg-[#006e2f] h-[4px] left-px right-px top-px" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIVE RESTAURANTS</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">842</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[8px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Container">
          <path d={svgPaths.p19734dc0} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">+5% growth</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[145.3px]" data-name="Container">
      <Container9 />
      <Heading2 />
      <Container10 />
    </div>
  );
}

function Overlay1() {
  return (
    <div className="h-[42px] relative shrink-0 w-[44.094px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.0939 42">
        <g id="Overlay">
          <rect fill="var(--fill-0, #565E74)" fillOpacity="0.1" height="42" rx="8" width="44.0939" />
          <path d={svgPaths.p109f5700} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container8 />
        <Overlay1 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
          <Container7 />
          <div className="absolute bg-[#565e74] h-[4px] left-px right-px top-px" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">PENDING COMPLAINTS</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">14</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[12px] relative shrink-0 w-[2.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 12">
        <g id="Container">
          <path d={svgPaths.p1fb03780} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Requires attention</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[147.84px]" data-name="Container">
      <Container15 />
      <Heading3 />
      <Container16 />
    </div>
  );
}

function Overlay2() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="Overlay">
          <rect fill="var(--fill-0, #F59E0B)" fillOpacity="0.1" height="42" rx="8" width="42" />
          <path d={svgPaths.pa5f0240} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container14 />
        <Overlay2 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
          <Container13 />
          <div className="absolute bg-[#f59e0b] h-[4px] left-px right-px top-px" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">SYSTEM HEALTH</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">99.9%</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p363cf400} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Normal operation</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[120.673px]" data-name="Container">
      <Container21 />
      <Heading4 />
      <Container22 />
    </div>
  );
}

function Overlay3() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="Overlay">
          <rect fill="var(--fill-0, #005AC2)" fillOpacity="0.1" height="42" rx="8" width="42" />
          <path d={svgPaths.p2a2d77b0} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container20 />
        <Overlay3 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
          <Container19 />
          <div className="absolute bg-[#005ac2] h-[4px] left-px right-px top-px" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function KpiSection() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_134px] relative shrink-0 w-full" data-name="KPI Section">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Platform Activity</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Daily user traffic and orders over the last 7 days</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[316.48px]" data-name="Container">
      <Heading5 />
      <Container27 />
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

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[10.89px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Last 7 Days</p>
        </div>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-start justify-center px-[13px] py-[5px] relative rounded-[8px] shrink-0" data-name="Options">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[86px] pr-[9px] py-[4.5px] relative rounded-[inherit] size-full">
        <Image />
      </div>
      <Container28 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container26 />
        <Options />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col items-start left-[32.69%] opacity-0 px-[8px] py-[4px] right-[32.71%] rounded-[4px] top-[-32px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[15px]">12k</p>
      </div>
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[35%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
      <Background />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Mon</p>
      </div>
    </div>
  );
}

function DummyBarChart() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.52px]" data-name="Dummy Bar Chart">
      <Overlay4 />
      <Container30 />
    </div>
  );
}

function Overlay5() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[20%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Tue</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.53px]" data-name="Container">
      <Overlay5 />
      <Container32 />
    </div>
  );
}

function Overlay6() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[45%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Wed</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.52px]" data-name="Container">
      <Overlay6 />
      <Container34 />
    </div>
  );
}

function Overlay7() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[10%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Thu</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.53px]" data-name="Container">
      <Overlay7 />
      <Container36 />
    </div>
  );
}

function Overlay8() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] bottom-0 left-0 right-0 rounded-tl-[8px] rounded-tr-[8px] top-1/4" data-name="Background" />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Fri</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.52px]" data-name="Container">
      <Overlay8 />
      <Container38 />
    </div>
  );
}

function Overlay9() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[60%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Sat</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.53px]" data-name="Container">
      <Overlay9 />
      <Container40 />
    </div>
  );
}

function Overlay10() {
  return (
    <div className="bg-[rgba(34,197,94,0.2)] h-[160px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Overlay">
      <div className="absolute bg-[#22c55e] inset-[70%_0_0_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Background" />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Sun</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[91.52px]" data-name="Container">
      <Overlay10 />
      <Container42 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[256px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-between px-[8px] relative size-full">
          <DummyBarChart />
          <Container31 />
          <Container33 />
          <Container35 />
          <Container37 />
          <Container39 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function PlatformActivityChart() {
  return (
    <div className="bg-white col-[1/span_8] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Platform Activity Chart">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-[68px] pt-[25px] px-[25px] relative size-full">
        <Container25 />
        <Container29 />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
        <p className="leading-[28px]">Recent Alerts</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ef4444] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">
        <p className="leading-[15px]">LIVE</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading6 />
        <Background1 />
      </div>
    </div>
  );
}

function Overlay11() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 36">
        <g id="Overlay">
          <rect fill="var(--fill-0, #EF4444)" fillOpacity="0.2" height="36" rx="8" width="32" />
          <path d={svgPaths.p3ec87900} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">High Latency Spike</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-80 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">API Gateway reporting 450ms avg</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-50 pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[15px]">2 mins ago</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[203.23px]" data-name="Container">
      <Container46 />
      <Container47 />
      <Container48 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#1e293b] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex gap-[15.99px] items-start p-[12px] relative size-full">
        <Overlay11 />
        <Container45 />
      </div>
    </div>
  );
}

function Overlay12() {
  return (
    <div className="h-[34px] relative shrink-0 w-[36px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 34">
        <g id="Overlay">
          <rect fill="var(--fill-0, #22C55E)" fillOpacity="0.2" height="34" rx="8" width="36" />
          <path d={svgPaths.p2b90d100} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">New Support Ticket</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-80 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">{`Vendor: "Tasty Trails" login issue`}</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-50 pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[15px]">14 mins ago</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[198.56px]" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#1e293b] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex gap-[15.99px] items-start p-[12px] relative size-full">
        <Overlay12 />
        <Container49 />
      </div>
    </div>
  );
}

function Overlay13() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Overlay">
          <rect fill="var(--fill-0, #F59E0B)" fillOpacity="0.2" height="36" rx="8" width="36" />
          <path d={svgPaths.pb55180} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Suspicious Activity</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-80 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Multiple failed orders in Sector 7</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-50 pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[15px]">45 mins ago</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[193.72px]" data-name="Container">
      <Container54 />
      <Container55 />
      <Container56 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#1e293b] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex gap-[15.99px] items-start p-[12px] relative size-full">
        <Overlay13 />
        <Container53 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Background2 />
        <Background3 />
        <Background4 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-px py-[9px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[16px]">View All Logs</p>
        </div>
      </div>
    </div>
  );
}

function RecentAlerts() {
  return (
    <div className="bg-[#0f172a] col-[9/span_4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Recent Alerts">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Container43 />
        <Container44 />
        <Button />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Top Rated Vendors</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">View Leaderboard</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading7 />
        <Link />
      </div>
    </div>
  );
}

function Ab6AXuCgzHifBfnW0VPhCyRDzO5VUoNkdOJfbN25LuuNg0TZsSx4IcPuXxEbpWgycsUDtNQxSbao7DvgtlktdLPhDibRkZsdQwRofwn20GxEpfo2Wzhq3RTrghXhNAte9KXtjRdMRku9H1PnHlb6MPabqGjLdwQ7PSwr5YH9VWw1UxyxVkVquBckBypnM7ObwLf5RXg2ZYgUIfXPtBt7IUlPvb7VTCaE3S1JCbBdwlWf4YnwDscXxC6YfGoVnrQamNwhq95E5UMyeo() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[64px]" data-name="AB6AXuCGZHifBfnW0VPhCyRDzO5VUoNkdOJfbN25LuuNG0tZSSx4icPU-xxEBPWgycsUDtNQxSBAO7DvgtlktdLPh-dibRkZsdQwROFWN20gxEPFO2Wzhq3rTrghXhNAte9KXtj_RdMRku9H1PnHLB6mPabqGjLdwQ7PSwr5yH9VWw1UxyxVkVQUBckBypnM7ObwLF5rXg2zYgUIfXPtBt7_iUlPVB7vTCaE3-s1jCBBdwlWf4YnwDscXxC6yfGOVnrQamNwhq95E5uMyeo">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuCgzHifBfnW0VPhCyRDzO5VUoNkdOJfbN25LuuNg0TZsSx4IcPuXxEbpWgycsUDtNQxSbao7DvgtlktdLPhDibRkZsdQwRofwn20GxEpfo2Wzhq3RTrghXhNAte9KXtjRdMRku9H1PnHlb6MPabqGjLdwQ7PSwr5YH9VWw1UxyxVkVquBckBypnM7ObwLf5RXg2ZYgUIfXPtBt7IUlPvb7VTCaE3S1JCbBdwlWf4YnwDscXxC6YfGoVnrQamNwhq95E5UMyeo} />
      </div>
      <div aria-hidden className="absolute border-2 border-[#006e2f] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-clip pl-[15.36px] pr-[15.37px] pt-[8px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Burger Lab</p>
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">4.9</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center px-[34.34px] relative size-full">
        <Container61 />
        <Container62 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f8f9ff] min-w-[140px] relative rounded-[12px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center min-w-[inherit] p-[17px] relative size-full">
          <Ab6AXuCgzHifBfnW0VPhCyRDzO5VUoNkdOJfbN25LuuNg0TZsSx4IcPuXxEbpWgycsUDtNQxSbao7DvgtlktdLPhDibRkZsdQwRofwn20GxEpfo2Wzhq3RTrghXhNAte9KXtjRdMRku9H1PnHlb6MPabqGjLdwQ7PSwr5YH9VWw1UxyxVkVquBckBypnM7ObwLf5RXg2ZYgUIfXPtBt7IUlPvb7VTCaE3S1JCbBdwlWf4YnwDscXxC6YfGoVnrQamNwhq95E5UMyeo />
          <Container59 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Ab6AXuChVwJa22AvpvaLvSuVz4CmdPpkwan8MtNbx99CPdHRk0N3OEitDWxviVy2VVvsO259Lw933TdJgi6Cdh2KOm1E59NpdSujXi6KiQc3Ud4RYzELadMeaa06NTuww0L8O7OMSj81FoHgjpnBvKkJ5YB1D3EiuFTgMbtgbz8VwbHay5E5Dec1PrdFdPlcImI6Z3NgRpjG6Dm4DTou3Uj94Vll9WALm6FQ524YiaQcqG7QXxkjHtx5M9MrW3Cv96Lhpd24Br48Cew() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[64px]" data-name="AB6AXuCHVwJa22AVPVALvSuVZ4CmdPpkwan-8MtNBX99CPdHRk0N3OEitDWxviVY2VVvsO259lw933TdJgi6Cdh2K_om1e59npdSUJXi6KiQC3UD4RYzELadMeaa06nTUWW0l8O7oMSj81FoHgjpnBvKkJ5yB1d3eiuFTgMbtgbz8vwbHAY5E5Dec1prdFdPLCImI6z3NGRpjG6Dm4dTOU3UJ94VLL9wALm6fQ-524YIAQcqG7QXxkjHTX5m9MrW3Cv96Lhpd2-4BR48Cew">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuChVwJa22AvpvaLvSuVz4CmdPpkwan8MtNbx99CPdHRk0N3OEitDWxviVy2VVvsO259Lw933TdJgi6Cdh2KOm1E59NpdSujXi6KiQc3Ud4RYzELadMeaa06NTuww0L8O7OMSj81FoHgjpnBvKkJ5YB1D3EiuFTgMbtgbz8VwbHay5E5Dec1PrdFdPlcImI6Z3NgRpjG6Dm4DTou3Uj94Vll9WALm6FQ524YiaQcqG7QXxkjHtx5M9MrW3Cv96Lhpd24Br48Cew} />
      </div>
      <div aria-hidden className="absolute border-2 border-[#006e2f] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-clip pl-[18.44px] pr-[18.43px] pt-[8px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Pizza Hub</p>
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">4.8</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.99px] items-center justify-center pl-[34.44px] pr-[34.46px] relative size-full">
        <Container65 />
        <Container66 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f8f9ff] min-w-[140px] relative rounded-[12px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center min-w-[inherit] p-[17px] relative size-full">
          <Ab6AXuChVwJa22AvpvaLvSuVz4CmdPpkwan8MtNbx99CPdHRk0N3OEitDWxviVy2VVvsO259Lw933TdJgi6Cdh2KOm1E59NpdSujXi6KiQc3Ud4RYzELadMeaa06NTuww0L8O7OMSj81FoHgjpnBvKkJ5YB1D3EiuFTgMbtgbz8VwbHay5E5Dec1PrdFdPlcImI6Z3NgRpjG6Dm4DTou3Uj94Vll9WALm6FQ524YiaQcqG7QXxkjHtx5M9MrW3Cv96Lhpd24Br48Cew />
          <Container63 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function Ab6AXuDv11N022Lp9OvBLf9OgDmhmhYbmrGxmrIlbNvYcUep5VDIxCBeAtjw2ODxZyqbUiWyGdWoVecrqh5GcEh7H3XiOweZg6CdZPnEfCy2Ujx0UgYmm8Ir869ElDvOefjwwpiYkCf0Hgjn92Fc3ZUwH48QrNkbxDuUfAYv7ZtCsXyzj6GQhQ8NHdMdHfEtnnvGMdykLnDMykjscVj0APihIuCKhHFtl6LQgFv550DsNijObYHk3FVYuo2VmzBKkaDgEIdjn0Rlzk() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[64px]" data-name="AB6AXuDV11n022Lp9ovBLf9OgDmhmhYbmrGXMRIlbNVYcUEP5vDIxCBeATJW2o-DxZyqbUIWyGdWOVecrqh5gcEh7H3XIOweZg6cdZPnEFCy2UJX0ugYMM8Ir869ELDvOefjwwpiYk_Cf0Hgjn92fc3ZUwH48qrNKBXDuUfAYv7ZtCSXyzj6gQhQ8nHDMdHfEtnnvGMdykLnDMykjscVJ0a-PihIuCKhHFtl6LQgFV550DsNijObYHk3fVYuo2vmzBKkaDgEIdjn-0-rlzk">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuDv11N022Lp9OvBLf9OgDmhmhYbmrGxmrIlbNvYcUep5VDIxCBeAtjw2ODxZyqbUiWyGdWoVecrqh5GcEh7H3XiOweZg6CdZPnEfCy2Ujx0UgYmm8Ir869ElDvOefjwwpiYkCf0Hgjn92Fc3ZUwH48QrNkbxDuUfAYv7ZtCsXyzj6GQhQ8NHdMdHfEtnnvGMdykLnDMykjscVj0APihIuCKhHFtl6LQgFv550DsNijObYHk3FVYuo2VmzBKkaDgEIdjn0Rlzk} />
      </div>
      <div aria-hidden className="absolute border-2 border-[#006e2f] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center overflow-clip pl-[3.84px] pr-[3.85px] pt-[8px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Healthy Bowls</p>
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">4.7</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center px-[34.75px] relative size-full">
        <Container69 />
        <Container70 />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#f8f9ff] min-w-[140px] relative rounded-[12px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center min-w-[inherit] p-[17px] relative size-full">
          <Ab6AXuDv11N022Lp9OvBLf9OgDmhmhYbmrGxmrIlbNvYcUep5VDIxCBeAtjw2ODxZyqbUiWyGdWoVecrqh5GcEh7H3XiOweZg6CdZPnEfCy2Ujx0UgYmm8Ir869ElDvOefjwwpiYkCf0Hgjn92Fc3ZUwH48QrNkbxDuUfAYv7ZtCsXyzj6GQhQ8NHdMdHfEtnnvGMdykLnDMykjscVj0APihIuCKhHFtl6LQgFv550DsNijObYHk3FVYuo2VmzBKkaDgEIdjn0Rlzk />
          <Container67 />
          <Container68 />
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[158px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start overflow-auto pb-[8px] relative rounded-[inherit] size-full">
        <BackgroundBorder />
        <BackgroundBorder1 />
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow4() {
  return (
    <div className="bg-white col-[7/span_6] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <Container57 />
        <Container58 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] w-full">
          <p className="leading-[28px]">Route Popularity</p>
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[20.5px] relative shrink-0 w-[24px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 20.5">
        <g id="Container">
          <path d={svgPaths.p2384b118} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container73 />
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">North-South Highway</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">42%</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container76 />
        <Container77 />
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#e5eeff] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-[#006e2f] inset-[0_58%_0_0]" data-name="Background" />
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container75 />
      <Background5 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder3 />
      <Container74 />
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g id="Container">
          <path d={svgPaths.p14f3a300} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container79 />
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">University Corridor</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">28%</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container82 />
        <Container83 />
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#e5eeff] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-[#565e74] inset-[0_72%_0_0]" data-name="Background" />
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="Container">
      <Container81 />
      <Background6 />
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder4 />
      <Container80 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container72 />
        <Container78 />
      </div>
    </div>
  );
}

function LowerBentoSection() {
  return (
    <div className="bg-white col-[1/span_6] justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Lower Bento Section">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-[71px] pt-[25px] px-[25px] relative size-full">
          <Heading8 />
          <Container71 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function MainGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[__429px_252px] relative shrink-0 w-full" data-name="Main Grid">
      <PlatformActivityChart />
      <RecentAlerts />
      <BackgroundBorderShadow4 />
      <LowerBentoSection />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 p-[32px] right-0 top-[73px]" data-name="Main - Content Area">
      <KpiSection />
      <MainGrid />
    </div>
  );
}

function Container84() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[16px]">© 2024 PathEat Admin. All rights reserved. Version 2.4.1</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[24px] pt-[25px] px-[24px] relative size-full">
        <Container84 />
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[114px] items-start justify-end left-0 min-h-[65px] pt-[49px] right-0" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
        <p className="leading-[normal]">Search data, users, or routes...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[9999px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pl-[40px] pr-[16px] pt-[9px] relative size-full">
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute bottom-[16.67%] content-stretch flex flex-col items-start left-[12px] top-[16.67%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[448px] min-w-px relative" data-name="Container">
      <Input />
      <Container88 />
    </div>
  );
}

function Container85() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[494.31px] relative size-full">
          <Container86 />
        </div>
      </div>
    </div>
  );
}

function Container90() {
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

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container90 />
      <div className="absolute bg-[#ef4444] right-[7.98px] rounded-[9999px] size-[8px] top-[8px]" data-name="Background" />
    </div>
  );
}

function Container91() {
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

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container91 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start px-[8px] relative shrink-0 w-[17px]" data-name="Margin">
      <div className="bg-[#bccbb9] h-[32px] relative shrink-0 w-px" data-name="Vertical Divider" />
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-right tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Alex Chen</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-right tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Super Admin</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[76.66px]" data-name="Container">
      <Container94 />
      <Container95 />
    </div>
  );
}

function UserProfile() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[40px]" data-name="User Profile">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUserProfile} />
      </div>
      <div aria-hidden className="absolute border-2 border-[#22c55e] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container93 />
      <UserProfile />
    </div>
  );
}

function Container89() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button1 />
        <Button2 />
        <Margin />
        <Container92 />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute bg-[#f8f9ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between left-0 pb-[17px] pt-[16px] px-[32px] right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <Container85 />
      <Container89 />
    </div>
  );
}

function MainContentWrapper() {
  return (
    <div className="flex-[1_0_0] min-h-[1114px] min-w-px relative self-stretch" data-name="Main Content Wrapper">
      <MainContentArea />
      <FooterMargin />
      <HeaderTopAppBar />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[1114px] items-start justify-center min-h-[1114px] relative shrink-0 w-full" data-name="Container">
      <MainContentWrapper />
    </div>
  );
}

function Container96() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1b1d6580} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#0f172a] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-0" data-name="Button:shadow" />
      <Container96 />
    </div>
  );
}

function ThemeSwitcherFloatingActionOptionalUxTouch() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex flex-col items-start right-[24px]" data-name="Theme Switcher Floating Action (Optional UX touch)">
      <Button3 />
    </div>
  );
}

function Background7() {
  return (
    <div className="relative shrink-0 size-[34px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="Background">
          <rect fill="var(--fill-0, #22C55E)" height="34" rx="8" width="34" />
          <path d={svgPaths.p16d51800} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#002109] text-[24px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[24px]">PathEat</p>
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-70 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Admin Portal</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[88.59px]" data-name="Container">
      <Heading />
      <Container100 />
    </div>
  );
}

function Container98() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Background7 />
      <Container99 />
    </div>
  );
}

function Container97() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] pt-[24px] px-[24px] relative size-full">
        <Container98 />
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p191dcc80} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container102() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function LinkDashboardActive() {
  return (
    <div className="bg-[rgba(34,197,94,0.1)] relative shrink-0 w-full" data-name="Link - Dashboard Active">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container101 />
          <Container102 />
        </div>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Container">
          <path d={svgPaths.p39955c80} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container104() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">User Management</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container103 />
          <Container104 />
        </div>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
        <g id="Container">
          <path d={svgPaths.p23cfd7c0} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container106() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[67.94px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Restaurant</p>
        <p className="leading-[24px]">Management</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container105 />
          <Container106 />
        </div>
      </div>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p7555480} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container108() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Complaints</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container107 />
          <Container108 />
        </div>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container110() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Settings</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container109 />
          <Container110 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start px-[12px] relative size-full">
        <LinkDashboardActive />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#006e2f] content-stretch flex items-center justify-center py-[12px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Export Report</p>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Logout</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container112 />
          <Container113 />
        </div>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function AsideSideNavBar() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col h-[1114px] items-start justify-between left-0 pr-px top-0 w-[260px]" data-name="Aside - SideNavBar">
      <div aria-hidden className="absolute border-[#bccbb9] border-r border-solid inset-0 pointer-events-none" />
      <Container97 />
      <Nav />
      <Container111 />
    </div>
  );
}

export default function AdminDashboard1280X() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Admin Dashboard (1280x1024)">
      <Container />
      <ThemeSwitcherFloatingActionOptionalUxTouch />
      <AsideSideNavBar />
    </div>
  );
}