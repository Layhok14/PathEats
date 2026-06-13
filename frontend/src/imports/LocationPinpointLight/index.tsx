import svgPaths from "./svg-jo1ti32kan";
import imgMapBackground from "./0f478ac5ca927ac7d563427fb2c70efb55537682.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] whitespace-nowrap">
          <p className="leading-[31.2px]">Stall Mangement</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p7281a80} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container2 />
    </div>
  );
}

function Container3() {
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
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.99px] items-center relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="bg-[#f8f9ff] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function MapBackground() {
  return (
    <div className="flex-[1_0_0] min-h-px mix-blend-multiply opacity-60 relative w-full" data-name="Map background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[104.17%] left-0 max-w-none top-[-2.08%] w-full" src={imgMapBackground} />
      </div>
    </div>
  );
}

function SimulatedMapBackground() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start justify-center" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.05) 2.5%, rgba(0, 0, 0, 0) 2.5%), linear-gradient(rgba(0, 0, 0, 0.05) 2.5%, rgba(0, 0, 0, 0) 2.5%), linear-gradient(90deg, rgb(226, 232, 240) 0%, rgb(226, 232, 240) 100%)" }} data-name="Simulated Map Background">
      <MapBackground />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[25px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 25">
        <g id="Container">
          <path d={svgPaths.p27200f00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#006e2f] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center p-[10px] relative rounded-[9999px] shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
      <Container4 />
    </div>
  );
}

function PinShadowBaseMargin() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pt-[4px] relative shrink-0 w-[8px]" data-name="Pin shadow/base:margin">
      <div className="bg-[rgba(11,28,48,0.3)] blur-[0.5px] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Pin shadow/base" />
    </div>
  );
}

function DraggablePinMarker() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center left-[475px] top-[412px]" data-name="Draggable Pin Marker">
      <BackgroundBorderShadow />
      <PinShadowBaseMargin />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] w-full">
        <p className="leading-[28px]">Set Stall Location</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] w-full">
        <p className="leading-[24px] mb-0">{`Drag the pin to your stall's exact location on`}</p>
        <p className="leading-[24px]">the path.</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading1 />
        <Container6 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 size-[21.9px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9 21.9">
        <g id="Container">
          <path d={svgPaths.p3488f2a0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[15.6px]">CURRENT SELECTION</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">40.7128° N, 74.0060° W</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-[157.45px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function CoordinatesAddressDisplay() {
  return (
    <div className="bg-[#e5eeff] relative rounded-[8px] shrink-0 w-full" data-name="Coordinates/Address Display">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center p-[17px] relative size-full">
          <Container7 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center px-[17px] py-[13px] relative rounded-[4px] shrink-0 w-[170px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#6d7b6c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Cancel</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#22c55e] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center pb-[13.59px] pt-[12px] px-[16px] relative rounded-[4px] shrink-0 w-[168px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Confirm Location</p>
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Action Buttons">
      <Button2 />
      <Button3 />
    </div>
  );
}

function ActionButtonsMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Action Buttons:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <ActionButtons />
      </div>
    </div>
  );
}

function FloatingActionPanelSidebarOverlay() {
  return (
    <div className="absolute bg-[#f8f9ff] bottom-[32px] content-stretch flex flex-col gap-[16px] items-start left-[32px] p-[25px] rounded-[12px] w-[400px]" data-name="Floating Action Panel (Sidebar/Overlay)">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container5 />
      <CoordinatesAddressDisplay />
      <ActionButtonsMargin />
    </div>
  );
}

function MainInteractiveMapArea() {
  return (
    <div className="bg-[#eff4ff] flex-[1_0_0] min-h-px overflow-clip relative w-full z-[1]" data-name="Main - Interactive Map Area">
      <SimulatedMapBackground />
      <DraggablePinMarker />
      <FloatingActionPanelSidebarOverlay />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full isolate items-start min-w-px relative" data-name="Main Content Area">
      <HeaderTopAppBar />
      <MainInteractiveMapArea />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[40px] relative w-[32px]" data-name="image 4">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
        <p className="leading-[28px]">PathEat</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading />
      <Container14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[78.77px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Dashboard</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container16 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20.094px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0939 18">
        <g id="Container">
          <path d={svgPaths.p209d4440} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[130.22px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
          <p className="leading-[19.6px]">Stall Management</p>
        </div>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container18 />
          <Container19 />
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
          <path d={svgPaths.p5dfbb10} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[82.38px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Menu Items</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p13965980} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[148.36px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Support/Onboarding</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[57.27px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Settings</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container24 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-auto relative rounded-[inherit] size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[47.88px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Logout</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container27 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Link5 />
      </div>
    </div>
  );
}

function SideNavBarDesktopOnly() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1024px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[280px]" data-name="SideNavBar (Desktop Only)">
      <div aria-hidden className="absolute border-r border-solid border-white inset-0 pointer-events-none" />
      <Margin />
      <Container15 />
      <Container26 />
    </div>
  );
}

export default function LocationPinpointLight() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Location Pinpoint (Light)">
      <MainContentArea />
      <SideNavBarDesktopOnly />
    </div>
  );
}