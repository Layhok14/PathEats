import svgPaths from "./svg-sir7yav2j1";
import imgPathEatAdminAvatar from "./5b2e6dd70fdb928ec5f79883b3374a73d340d1d2.png";

function Container2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
          <p className="leading-[normal]">Search tickets...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[9px] pl-[41px] pr-[17px] pt-[8px] relative size-full">
          <Container2 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bottom-[14.71%] content-stretch flex flex-col items-start left-[12px] top-[14.71%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #6D7B6C)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[448px] min-w-px relative" data-name="Container">
      <Input />
      <Container3 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pr-[434.27px] relative size-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
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

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]" data-name="Button">
      <Container5 />
    </div>
  );
}

function Container6() {
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

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]" data-name="Button">
      <Container6 />
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

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Admin Portal</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Button1 />
        <Margin />
        <Container7 />
      </div>
    </div>
  );
}

function HeaderTopBar() {
  return (
    <div className="bg-[#f8f9ff] h-[64px] max-w-[1180px] relative shrink-0 w-full" data-name="Header / Top Bar">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] pb-px px-[32px] relative size-full">
          <Container />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopBarMargin() {
  return (
    <div className="absolute content-stretch flex flex-col h-[64px] items-start left-0 max-w-[1440px] pl-[260px] right-0 top-0" data-name="Header / Top Bar:margin">
      <HeaderTopBar />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p5dfbb10} fill="var(--fill-0, #004B1E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#22c55e] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Background">
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6bff8f] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center p-[24px] relative size-full">
          <Background />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="opacity-50 relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[1.2px] uppercase w-full">
          <p className="leading-[16px]">MENU</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
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

function Container13() {
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
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[16px] py-[12px] right-0 top-0" data-name="Link">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">User Information</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[16px] py-[12px] right-0 top-[96px]" data-name="Link">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p3f976180} fill="var(--fill-0, #6BFF8F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#6bff8f] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Complaints</p>
        </div>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute bg-[rgba(0,110,47,0.1)] content-stretch flex gap-[12px] items-center left-0 pl-[20px] pr-[16px] py-[12px] right-0 top-[48px]" data-name="Link">
      <div aria-hidden className="absolute border-[#006e2f] border-l-4 border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Container17 />
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function NavMargin() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav:margin">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
          <Nav />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#006e2f] relative rounded-[4px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
            <p className="leading-[20px]">Generate Report</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container19() {
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

function Container20() {
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
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative size-full">
          <Container19 />
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Logout</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative size-full">
          <Container21 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function PathEatAdminAvatar() {
  return (
    <div className="max-w-[227px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="PathEat Admin Avatar">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgPathEatAdminAvatar} />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">System Controller</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">admin@patheat.com</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[123.92px]" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(30,41,59,0.5)] relative rounded-[4px] shrink-0 w-full" data-name="Overlay">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative size-full">
          <PathEatAdminAvatar />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pb-[16px] pt-[17px] px-[16px] relative size-full">
        <Button2 />
        <Container18 />
        <Overlay />
      </div>
    </div>
  );
}

function AsideSidebarSection() {
  return (
    <div className="absolute bg-[#0f172a] h-[1038px] left-0 top-0 w-[260px]" data-name="Aside - Sidebar Section">
      <div className="content-stretch flex flex-col items-start justify-between overflow-clip pr-px relative rounded-[inherit] size-full">
        <Container8 />
        <Container11 />
        <NavMargin />
        <HorizontalBorder />
      </div>
      <div aria-hidden className="absolute border-[#bccbb9] border-r border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">Ticket Resolution Center</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Manage and respond to system-wide customer and vendor complaints.</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[538.92px]" data-name="Container">
      <Heading />
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p2bb32400} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#006e2f] content-stretch flex gap-[7.99px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container29 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">New Ticket</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <Button3 />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Page Header">
      <Container26 />
      <Container28 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">CRITICAL ISSUES</p>
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">12</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[8px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Container">
          <path d={svgPaths.p19734dc0} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container34 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">+3%</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-between relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#ef4444] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[17px] pt-[20px] px-[17px] relative size-full">
        <Container30 />
        <Container31 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">IN PROGRESS</p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">48</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[1.333px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 1.33333">
        <g id="Container">
          <path d={svgPaths.p2d612680} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container39 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Stable</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-between relative size-full">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#f59e0b] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[17px] pt-[20px] px-[17px] relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">RESOLVED TODAY</p>
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">124</p>
      </div>
    </div>
  );
}

function Container44() {
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

function Container43() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container44 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">+12%</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-between relative size-full">
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white col-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#006e2f] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[17px] pt-[20px] px-[17px] relative size-full">
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] uppercase w-full">
          <p className="leading-[16px]">AVG. RESOLUTION</p>
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">4.2h</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[8px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Container">
          <path d={svgPaths.p296d7f00} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container49 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#005ac2] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">-15m</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-between relative size-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white col-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-[#005ac2] border-b border-l border-r border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[17px] pt-[20px] px-[17px] relative size-full">
        <Container45 />
        <Container46 />
      </div>
    </div>
  );
}

function BentoStatsGrid() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_101px] relative shrink-0 w-full" data-name="Bento Stats Grid">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Priority Level</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f8f9ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">All</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Critical</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">High</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Medium</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Low</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e5eeff] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex items-start p-[4px] relative size-full">
        <Button4 />
        <Button5 />
        <Button6 />
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[286.54px]" data-name="Container">
      <Label />
      <Background1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Ticket Status</p>
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
    <div className="absolute inset-[0_0.16px_0_0]" data-name="image clip">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pl-[74px] pr-[9px] py-[6.5px] relative size-full">
          <Image />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] w-full">
          <p className="leading-[20px]">All Statuses</p>
        </div>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[13px] py-[7px] relative size-full">
          <ImageClip />
          <Container53 />
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[78.16px]" data-name="Container">
      <Label1 />
      <Options />
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[10px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 10">
        <g id="Container">
          <path d={svgPaths.p113f700} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#6d7b6c] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative size-full">
        <Container54 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Advanced Filters</p>
        </div>
      </div>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[12px] shrink-0 w-full" data-name="Filter Bar">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[17px] relative size-full">
          <Container50 />
          <Button9 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[111.72px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">TICKET</p>
        <p className="leading-[normal]">ID</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[141.92px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">USER</p>
        <p className="leading-[normal]">NAME</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[320px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">SUBJECT</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[129.63px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">PRIORITY</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[95.81px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal] mb-0">TIME</p>
        <p className="leading-[normal]">OPEN</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[122.55px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">STATUS</p>
      </div>
    </div>
  );
}

function Cell6() {
  return (
    <div className="content-stretch flex flex-col items-end pb-[26.5px] pt-[26px] px-[24px] relative shrink-0 w-[126.89px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-right tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[normal]">ACTIONS</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Cell />
        <Cell1 />
        <Cell2 />
        <Cell3 />
        <Cell4 />
        <Cell5 />
        <Cell6 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-start mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <Row />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative shrink-0 w-[111.72px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">#TK-</p>
        <p className="leading-[normal]">8821</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#dce9ff] content-stretch flex h-[32px] items-center justify-center relative rounded-[9999px] shrink-0 w-[27.55px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">JD</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[21.73px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Jane</p>
        <p className="leading-[20px]">Doe</p>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[24px] relative shrink-0 w-[141.92px]" data-name="Data">
      <Background2 />
      <Container56 />
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[320px] overflow-clip pb-[27px] pt-[26px] px-[24px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#0b1c30] text-[14px] text-ellipsis whitespace-nowrap">
        <p className="leading-[20px]">Order #9921 marked as delivered but not received</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#ffdad6] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">CRITICAL</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[27.5px] relative shrink-0 w-[129.63px]" data-name="Data">
      <Background3 />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[27px] pt-[26px] px-[24px] relative shrink-0 w-[95.81px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">2h 15m</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[24px] relative shrink-0 w-[98.55px]" data-name="Data">
      <div className="bg-[#ef4444] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Open</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[17.98px] pr-[17.99px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal] mb-0">View</p>
        <p className="leading-[normal]">Detail</p>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="content-stretch flex flex-col items-end pl-[48px] pr-[24px] py-[16.5px] relative shrink-0 w-[150.89px]" data-name="Data">
      <Button10 />
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
      <Data5 />
      <Data6 />
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[111.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TK-</p>
          <p className="leading-[normal]">8819</p>
        </div>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#dce9ff] content-stretch flex h-[32px] items-center justify-center relative rounded-[9999px] shrink-0 w-[25.39px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">MS</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[6.61px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Marcus</p>
        <p className="leading-[20px]">Smith</p>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[141.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
        <Background4 />
        <Container57 />
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip pb-[27px] pt-[26px] px-[24px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Vendor app crashing on route calculation</p>
        </div>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(245,158,11,0.2)] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">HIGH</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[129.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[27.5px] relative size-full">
        <Overlay1 />
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[95.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[17px] pt-[16px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px] mb-0">5h</p>
          <p className="leading-[20px]">40m</p>
        </div>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[98.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#f59e0b] h-[8px] relative rounded-[9999px] shrink-0 w-[6.61px]" data-name="Background" />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px] mb-0">In</p>
          <p className="leading-[20px]">Progress</p>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[17.98px] pr-[17.99px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal] mb-0">View</p>
        <p className="leading-[normal]">Detail</p>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[150.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end pl-[48px] pr-[24px] py-[16.5px] relative size-full">
        <Button11 />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 2">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <Data7 />
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
      <Data12 />
      <Data13 />
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[111.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TK-</p>
          <p className="leading-[normal]">8815</p>
        </div>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#dce9ff] content-stretch flex h-[32px] items-center justify-center relative rounded-[9999px] shrink-0 w-[27.64px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">AL</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[19.55px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Anna</p>
        <p className="leading-[20px]">Lee</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[141.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
        <Background5 />
        <Container58 />
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip pb-[27px] pt-[26px] px-[24px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Incorrect dietary label on restaurant item</p>
        </div>
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">MEDIUM</p>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[129.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[27.5px] relative size-full">
        <Background6 />
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[95.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pt-[26px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">1d 2h</p>
        </div>
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[98.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Resolved</p>
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[17.98px] pr-[17.99px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal] mb-0">View</p>
        <p className="leading-[normal]">Detail</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[150.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end pl-[48px] pr-[24px] py-[16.5px] relative size-full">
        <Button12 />
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <Data14 />
      <Data15 />
      <Data16 />
      <Data17 />
      <Data18 />
      <Data19 />
      <Data20 />
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[111.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
          <p className="leading-[normal] mb-0">#TK-</p>
          <p className="leading-[normal]">8812</p>
        </div>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#dce9ff] content-stretch flex h-[32px] items-center justify-center relative rounded-[9999px] shrink-0 w-[23.66px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">RK</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[13.63px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Robert</p>
        <p className="leading-[20px]">King</p>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[141.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
        <Background7 />
        <Container59 />
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="max-w-[320px] relative shrink-0 w-[320px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip pb-[26.5px] pt-[26px] px-[24px] relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Update email address request</p>
        </div>
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-center px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-[rgba(86,94,116,0.6)] whitespace-nowrap">
        <p className="leading-[normal]">LOW</p>
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="relative shrink-0 w-[129.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pt-[27.5px] px-[24px] relative size-full">
        <Background8 />
      </div>
    </div>
  );
}

function Data25() {
  return (
    <div className="relative shrink-0 w-[95.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26.5px] pt-[26px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">2d 4h</p>
        </div>
      </div>
    </div>
  );
}

function Data26() {
  return (
    <div className="relative shrink-0 w-[98.55px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#ef4444] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Open</p>
        </div>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[17.98px] pr-[17.99px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal] mb-0">View</p>
        <p className="leading-[normal]">Detail</p>
      </div>
    </div>
  );
}

function Data27() {
  return (
    <div className="relative shrink-0 w-[150.89px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end pl-[48px] pr-[24px] py-[16px] relative size-full">
        <Button13 />
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-center justify-center pt-px relative shrink-0 w-full" data-name="Row 4">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <Data21 />
      <Data22 />
      <Data23 />
      <Data24 />
      <Data25 />
      <Data26 />
      <Data27 />
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
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1048.52px]" data-name="Table">
      <Header />
      <Body />
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <Table />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Showing 4 of 248 tickets</p>
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p3ed0080} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-30 p-[7px] relative rounded-[6px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Container62 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[7px] relative rounded-[6px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Container63 />
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-start relative size-full">
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#eff4ff] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[17px] px-[24px] relative size-full">
          <Container60 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function DataTableSection() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[12px] shrink-0 w-full" data-name="Data Table Section">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container55 />
        <BackgroundHorizontalBorder />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[292px] right-[32px] top-[96px]" data-name="Main Content Canvas">
      <PageHeader />
      <BentoStatsGrid />
      <FilterBar />
      <DataTableSection />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <HeaderTopBarMargin />
      <AsideSidebarSection />
      <MainContentCanvas />
    </div>
  );
}