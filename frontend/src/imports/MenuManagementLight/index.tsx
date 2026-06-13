import svgPaths from "./svg-xnoqlxq77o";
import imgVendorProfileAvatar from "./b9e68286f066f9845fecee980280adb6bdd9237f.png";
import imgHainaneseChickenRice from "./64bcee27d506f8ca00c42c0edfde1c6167202446.png";
import imgPadThai from "./d978092d545961af31c4690f308298bbf2fbe607.png";
import imgIcedThaiMilkTea from "./a1e6c28e3a22c1fcd4e2b23c8c514ce49aab333e.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function MobileMenuTriggerBrand() {
  return (
    <div className="relative shrink-0" data-name="Mobile Menu Trigger & Brand">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] whitespace-nowrap">
          <p className="leading-[31.2px]">Menu Items</p>
        </div>
      </div>
    </div>
  );
}

function Container() {
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
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Container />
    </div>
  );
}

function Container1() {
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
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Container1 />
      <div className="absolute bg-[#ef4444] right-[-0.02px] rounded-[9999px] size-[8px] top-0" data-name="Background" />
    </div>
  );
}

function VendorProfileAvatar() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Vendor profile avatar">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgVendorProfileAvatar} />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#d3e4fe] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <VendorProfileAvatar />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[12px] relative shrink-0 w-[44px]" data-name="Margin">
      <BackgroundBorder />
    </div>
  );
}

function TrailingActions() {
  return (
    <div className="relative shrink-0" data-name="Trailing Actions">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Button1 />
        <Margin />
      </div>
    </div>
  );
}

function HeaderTopAppBarMobileGlobalActions() {
  return (
    <div className="bg-[#f8f9ff] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header - TopAppBar (Mobile & Global Actions)">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
          <MobileMenuTriggerBrand />
          <TrailingActions />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#22c55e] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#004b1e] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">All Items</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Rice</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Noodles</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Drinks</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[16px] w-full">
          <p className="leading-[normal]">Search menu...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[16px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[9px] pl-[41px] pr-[17px] pt-[8px] relative size-full">
          <Container4 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[rgba(86,94,116,0.3)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bottom-[21.43%] content-stretch flex flex-col items-start left-[12px] top-[21.43%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[256px]" data-name="Container">
      <Input />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-58.45px)] size-[11.667px] top-1/2" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p20803d40} fill="var(--fill-0, #004B1E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#22c55e] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[44px] relative rounded-[8px] shrink-0 w-[184.89px]" data-name="Button">
      <Container6 />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] left-[calc(50%+14px)] not-italic text-[#004b1e] text-[14px] text-center top-[calc(50%-0.8px)] whitespace-nowrap">
        <p className="leading-[19.6px]">Add Menu Item</p>
      </div>
    </div>
  );
}

function PageActionsFilters() {
  return (
    <div className="relative shrink-0 w-full" data-name="Page Actions & Filters">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container2 />
          <Container3 />
          <Button6 />
        </div>
      </div>
    </div>
  );
}

function HainaneseChickenRice() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Hainanese Chicken Rice">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[177.08%] left-0 max-w-none top-[-38.54%] w-full" src={imgHainaneseChickenRice} />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(248,249,255,0.9)] content-stretch flex flex-col items-start px-[9px] py-[5px] right-[12px] rounded-[4px] top-[12px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">$8.50</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#d3e4fe] h-[160px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <HainaneseChickenRice />
        <OverlayBorderOverlayBlur />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip pr-[29.31px] relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Signature Chicken…</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container9 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Heading1 />
        <Button7 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[31.19px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[23.09px] tracking-[0.24px] w-[249.07px]">
        <p className="leading-[15.6px] mb-0">Poached chicken with fragrant ginger</p>
        <p className="leading-[15.6px] mb-0">rice, served with house-made chili and…</p>
        <p className="leading-[15.6px]">dark soy sauce.</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Container10 />
    </div>
  );
}

function Label() {
  return <div className="bg-[#22c55e] h-[20px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Image() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="image">
          <path d={svgPaths.pc296280} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#2563eb] right-[-4px] rounded-[9999px] size-[28px] top-[-4px]" data-name="Input">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[4px] relative rounded-[inherit] size-full">
        <Image />
      </div>
      <div aria-hidden className="absolute border-4 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[40px]" data-name="Container">
      <Label />
      <Input1 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] relative shrink-0 w-[48px]" data-name="Margin">
      <Container11 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Available</p>
      </div>
    </div>
  );
}

function Toggle() {
  return (
    <div className="relative shrink-0" data-name="Toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Margin3 />
        <Container12 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p10054d00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container15 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[13px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#d3e4fe] border-solid border-t inset-0 pointer-events-none" />
      <Toggle />
      <Container13 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[16px] relative size-full">
        <Margin1 />
        <Margin2 />
        <HorizontalBorder />
      </div>
    </div>
  );
}

function ItemCard() {
  return (
    <div className="bg-[#f8f9ff] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Item Card 1">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Background />
        <Container7 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function PadThai() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Pad Thai">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[177.08%] left-0 max-w-none top-[-38.54%] w-full" src={imgPadThai} />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(248,249,255,0.9)] content-stretch flex flex-col items-start px-[9px] py-[5px] right-[12px] rounded-[4px] top-[12px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">$7.20</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#d3e4fe] h-[160px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <PadThai />
        <OverlayBorderOverlayBlur1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Classic Pad Thai</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container18 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Heading2 />
        <Button10 />
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[31.19px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[23.09px] tracking-[0.24px] w-[238.88px]">
        <p className="leading-[15.6px] mb-0">Stir-fried rice noodles with egg,</p>
        <p className="leading-[15.6px] mb-0">peanuts, bean sprouts, and tamarind…</p>
        <p className="leading-[15.6px]">sauce.</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Container19 />
    </div>
  );
}

function Label1() {
  return <div className="bg-[#22c55e] h-[20px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Image1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="image">
          <path d={svgPaths.pc296280} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Input2() {
  return (
    <div className="absolute bg-[#2563eb] right-[-4px] rounded-[9999px] size-[28px] top-[-4px]" data-name="Input">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[4px] relative rounded-[inherit] size-full">
        <Image1 />
      </div>
      <div aria-hidden className="absolute border-4 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[40px]" data-name="Container">
      <Label1 />
      <Input2 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] relative shrink-0 w-[48px]" data-name="Margin">
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Available</p>
      </div>
    </div>
  );
}

function Toggle1() {
  return (
    <div className="relative shrink-0" data-name="Toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Margin6 />
        <Container21 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p10054d00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container24 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button11 />
        <Button12 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#d3e4fe] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pt-[13px] relative size-full">
          <Toggle1 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[16px] relative size-full">
        <Margin4 />
        <Margin5 />
        <HorizontalBorder1 />
      </div>
    </div>
  );
}

function ItemCard1() {
  return (
    <div className="bg-[#f8f9ff] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Item Card 2">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Background1 />
        <Container16 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function IcedThaiMilkTea() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Iced Thai Milk Tea">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[177.09%] left-0 max-w-none top-[-38.54%] w-full" src={imgIcedThaiMilkTea} />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#f8f9ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start px-[13px] py-[9px] relative rounded-[6px] shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Sold Out Today</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-[1px] bg-[rgba(248,249,255,0.2)] content-stretch flex inset-[0_-0.01px_0_0] items-center justify-center" data-name="Overlay+OverlayBlur">
      <BackgroundBorderShadow />
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(248,249,255,0.9)] content-stretch flex flex-col items-start px-[9px] py-[5px] right-[11.98px] rounded-[4px] top-[12px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">$3.50</p>
      </div>
    </div>
  );
}

function OverlayBackground() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="Overlay+Background">
      <div aria-hidden className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none">
        <div className="absolute bg-[#d3e4fe] bg-clip-padding border-0 border-[transparent] border-solid inset-0" />
        <div className="absolute bg-[rgba(255,255,255,0.5)] bg-clip-padding border-0 border-[transparent] border-solid inset-0 mix-blend-saturation" />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <IcedThaiMilkTea />
        <OverlayOverlayBlur />
        <OverlayBorderOverlayBlur2 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Iced Thai Milk Tea</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container27 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Button13 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[31.19px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[15.3px] tracking-[0.24px] w-[192.99px]">
        <p className="leading-[15.6px] mb-0">Authentic brewed Thai tea with</p>
        <p className="leading-[15.6px]">condensed milk and ice.</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Container28 />
    </div>
  );
}

function Label2() {
  return <div className="bg-[#bccbb9] h-[20px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[40px]" data-name="Container">
      <Label2 />
      <div className="absolute bg-white left-0 rounded-[9999px] size-[20px] top-0" data-name="Input">
        <div aria-hidden className="absolute border-4 border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] relative shrink-0 w-[48px]" data-name="Margin">
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Hidden</p>
      </div>
    </div>
  );
}

function Toggle2() {
  return (
    <div className="relative shrink-0" data-name="Toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Margin9 />
        <Container30 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p10054d00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1af14480} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#d3e4fe] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <Container33 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[13px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#d3e4fe] border-solid border-t inset-0 pointer-events-none" />
      <Toggle2 />
      <Container31 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[16px] relative size-full">
        <Margin7 />
        <Margin8 />
        <HorizontalBorder2 />
      </div>
    </div>
  );
}

function ItemCard3UnavailableState() {
  return (
    <div className="bg-[#f8f9ff] col-3 justify-self-stretch opacity-75 relative rounded-[12px] row-1 self-start shrink-0" data-name="Item Card 3 (Unavailable State)">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <OverlayBackground />
        <Container25 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function BentoGridList() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_322.19px] relative shrink-0 w-full" data-name="Bento Grid List">
      <ItemCard />
      <ItemCard1 />
      <ItemCard3UnavailableState />
    </div>
  );
}

function MainPageCanvas() {
  return (
    <div className="bg-[#f8f9ff] flex-[1_0_0] min-h-px relative w-full z-[1]" data-name="Main - Page Canvas">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start p-[48px] relative size-full">
          <PageActionsFilters />
          <BentoGridList />
        </div>
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full isolate items-start min-w-px overflow-clip relative" data-name="Main Content Area">
      <HeaderTopAppBarMobileGlobalActions />
      <MainPageCanvas />
    </div>
  );
}

function Background2() {
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

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading />
      <Container36 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[24px] right-0 top-0" data-name="Container">
      <Background2 />
      <Container35 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[215px]" data-name="Header">
      <Container34 />
    </div>
  );
}

function HeaderMargin() {
  return (
    <div className="h-[84px] relative shrink-0 w-[279px]" data-name="Header:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Header />
      </div>
    </div>
  );
}

function Container37() {
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

function Container38() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[78.77px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Dashboard</p>
      </div>
    </div>
  );
}

function LinkInactive() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link - Inactive">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container37 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Container39() {
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

function Container40() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[130.22px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Stall Management</p>
      </div>
    </div>
  );
}

function LinkInactive1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link - Inactive">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container39 />
          <Container40 />
        </div>
      </div>
    </div>
  );
}

function Container41() {
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

function Container42() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[82.38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#f8f9ff] text-[14px] top-[9px] whitespace-nowrap">
          <p className="leading-[19.6px]">Menu Items</p>
        </div>
      </div>
    </div>
  );
}

function LinkActive() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative shrink-0 w-full" data-name="Link - Active">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
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

function Container44() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[148.36px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Support/Onboarding</p>
      </div>
    </div>
  );
}

function LinkInactive2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link - Inactive">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container43 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Container45() {
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

function Container46() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[57.27px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Settings</p>
      </div>
    </div>
  );
}

function LinkInactive3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link - Inactive">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container45 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function NavigationLinks() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[279px]" data-name="Navigation Links">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start overflow-auto relative rounded-[inherit] size-full">
        <LinkInactive />
        <LinkInactive1 />
        <LinkActive />
        <LinkInactive2 />
        <LinkInactive3 />
      </div>
    </div>
  );
}

function Container47() {
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

function Container48() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[47.88px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Logout</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container47 />
          <Container48 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-[279px]" data-name="Footer">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] relative size-full">
        <Link />
      </div>
    </div>
  );
}

function SideNavBarDesktop() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1024px] items-start justify-between left-0 pr-px py-[24px] top-0" data-name="SideNavBar (Desktop)">
      <div aria-hidden className="absolute border-[#5c647a] border-r border-solid inset-0 pointer-events-none" />
      <HeaderMargin />
      <NavigationLinks />
      <Footer />
    </div>
  );
}

export default function MenuManagementLight() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Menu Management (Light)">
      <MainContentArea />
      <SideNavBarDesktop />
    </div>
  );
}