import svgPaths from "./svg-bhewfxd2dg";
import imgSaffronBowl from "./56307b06c5b51cea8f21ddc31cf9e3580991136e.png";
import imgTheBrewLab from "./2b921830afb8a143cac0aed58f4eaafd43f42716.png";
import imgNoodleNation from "./8b870c1b2a66ad38d57258492dcad27a24627dad.png";
import imgUrbanBurgerCo from "./d0a374688ae7241e024a1086c0a4142c0e1f50e7.png";
import imgDragonDimSum from "./1e8a110cf72fb5c7fc3254f3868c6fb19ada71a4.png";
import imgSweetSerenity from "./b2a0d92422ce0a9ca3e62eb17644db27d56c855b.png";
import imgTheGoldenGrain from "./dc301f5dbcce333cfeb500f366ec57d837081772.png";
import imgAdministratorProfile from "./91276b5379be296264af4a08b37ecf78f5df810f.png";
import imgPathEatLogo from "./8f3b2ce436ac82121a8c2823643cbcb4082b1784.png";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Pending Approvals</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Review new restaurant submissions for platform eligibility</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[379.88px]" data-name="Container">
      <Heading />
      <Container3 />
    </div>
  );
}

function Container5() {
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

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-center justify-center p-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container5 />
    </div>
  );
}

function Container6() {
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

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-center justify-center p-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container6 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-start relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container4 />
    </div>
  );
}

function SaffronBowl() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Saffron Bowl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSaffronBowl} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[56px]" data-name="Background">
      <SaffronBowl />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center mb-[-0.5px] relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px]">
        <p className="leading-[20px]">Saffron Bowl</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[#006e2f] text-[12px] tracking-[-0.6px] uppercase">
        <p className="leading-[16px]">FINE DINING</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background />
      <Paragraph />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container9 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(61,74,61,0.6)] tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[16px]">2h ago</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
        <g id="Container">
          <path d={svgPaths.p1a900f00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Downtown Core, Lane 5</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 13.5">
        <g id="Container">
          <path d={svgPaths.p23b825a0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">admin@saffronbowl.com</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-[190.91px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.5px] items-start relative size-full">
        <Container11 />
        <Container13 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center justify-self-start pl-[49.94px] pr-[49.93px] py-[11px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Reject</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#006e2f] col-2 content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center justify-self-start pb-[11.5px] pl-[42.3px] pr-[42.29px] pt-[10.5px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Approve</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_42px] inline-grid pt-[8px] relative size-full">
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function ApprovalCard() {
  return (
    <div className="absolute bg-white bottom-[16px] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start left-[8px] min-w-[340px] p-[21px] rounded-[12px] top-0" data-name="Approval Card 1">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container8 />
      <Container10 />
      <Container15 />
    </div>
  );
}

function TheBrewLab() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="The Brew Lab">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgTheBrewLab} />
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[56px]" data-name="Background">
      <TheBrewLab />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.5px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">The Brew Lab</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading1 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[-0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ARTISAN COFFEE</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background1 />
      <Container18 />
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container17 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(61,74,61,0.6)] tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[16px]">5h ago</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[15px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
        <g id="Container">
          <path d={svgPaths.p1a900f00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tech Park, Block B</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 13.5">
        <g id="Container">
          <path d={svgPaths.p23b825a0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">hello@brewlab.cafe</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-[156.91px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.5px] items-start relative size-full">
        <Container20 />
        <Container22 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center justify-self-start pl-[49.94px] pr-[49.93px] py-[11px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Reject</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#006e2f] col-2 content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center justify-self-start pb-[11.5px] pl-[42.3px] pr-[42.29px] pt-[10.5px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Approve</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_42px] inline-grid pt-[8px] relative size-full">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function ApprovalCard1() {
  return (
    <div className="absolute bg-white bottom-[16px] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start left-[372px] min-w-[340px] p-[21px] rounded-[12px] top-0" data-name="Approval Card 2">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container16 />
      <Container19 />
      <Container24 />
    </div>
  );
}

function NoodleNation() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Noodle Nation">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgNoodleNation} />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[56px]" data-name="Background">
      <NoodleNation />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center mb-[-0.5px] relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px]">
        <p className="leading-[20px]">Noodle Nation</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[#006e2f] text-[12px] tracking-[-0.6px] uppercase">
        <p className="leading-[16px]">FAST CASUAL</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background2 />
      <Paragraph1 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container26 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(61,74,61,0.6)] tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[16px]">Yesterday</p>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[15px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
        <g id="Container">
          <path d={svgPaths.p1a900f00} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Waterfront Esplanade</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 13.5">
        <g id="Container">
          <path d={svgPaths.p23b825a0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">ops@noodlenation.com</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-[182.53px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.5px] items-start relative size-full">
        <Container28 />
        <Container30 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center justify-self-start pl-[49.94px] pr-[49.93px] py-[11px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Reject</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#006e2f] col-2 content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center justify-self-start pb-[11.5px] pl-[42.3px] pr-[42.29px] pt-[10.5px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Approve</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_42px] inline-grid pt-[8px] relative size-full">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function ApprovalCard2() {
  return (
    <div className="absolute bg-white bottom-[16px] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start left-[736px] min-w-[340px] p-[21px] rounded-[12px] top-0" data-name="Approval Card 3">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container25 />
      <Container27 />
      <Container32 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[248px] overflow-auto relative shrink-0 w-[972px]" data-name="Container">
      <ApprovalCard />
      <ApprovalCard1 />
      <ApprovalCard2 />
    </div>
  );
}

function SectionPendingVendorApprovals() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Section - Pending Vendor Approvals">
      <Container1 />
      <Container7 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Active Directory</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Manage and monitor all currently listed vendors</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-[314.95px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading2 />
        <Container34 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#006e2f] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">All</p>
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Noodles</p>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Rice</p>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Cafe</p>
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Dessert</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white content-stretch flex items-start p-[5px] relative rounded-[8px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[10px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 10">
        <g id="Container">
          <path d={svgPaths.p113f700} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container36 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">More Filters</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <BackgroundBorder />
        <Button13 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[25px] pt-[24px] px-[24px] relative size-full">
          <Container33 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[236.77px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">RESTAURANT</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[201.81px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">LOCATION</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[124.69px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">CATEGORY</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[16px] relative shrink-0 w-[145.05px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">STATUS</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-center px-[24px] py-[16px] relative shrink-0 w-[101.77px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-center tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">RATING</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="content-stretch flex flex-col items-end px-[24px] py-[16px] relative shrink-0 w-[143.92px]" data-name="Cell">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-right tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIONS</p>
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
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-start mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Row />
    </div>
  );
}

function UrbanBurgerCo() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Urban Burger Co">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUrbanBurgerCo} />
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[6px] shrink-0 size-[40px]" data-name="Background">
      <UrbanBurgerCo />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Urban Burger Co</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(61,74,61,0.7)] whitespace-nowrap">
        <p className="leading-[20px]">ID: PH-92381</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[115.2px]" data-name="Container">
      <Container38 />
      <Container39 />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[188.77px]" data-name="Data">
      <Background3 />
      <Container37 />
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative shrink-0 w-[225.81px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Central Mall, Level 3</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(218,226,253,0.5)] content-stretch flex items-start px-[10px] py-[3.5px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#5c647a] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Cafe</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[25.5px] pt-[24.5px] px-[24px] relative shrink-0 w-[124.69px]" data-name="Data">
      <Overlay />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIVE</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[24px] relative shrink-0 w-[121.05px]" data-name="Data">
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container40 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.25">
        <g id="Container">
          <path d={svgPaths.p389def00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">4.8</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center pl-[47.99px] relative shrink-0 w-[101.76px]" data-name="Data">
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container43 />
    </div>
  );
}

function Container44() {
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

function Button15() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container44 />
    </div>
  );
}

function Data5() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-center justify-end opacity-0 pl-[48px] relative shrink-0 w-[143.92px]" data-name="Data">
      <Button14 />
      <Button15 />
    </div>
  );
}

function TableRow() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] relative shrink-0 w-full" data-name="Table Row 1">
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
      <Data5 />
    </div>
  );
}

function DragonDimSum() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Dragon Dim Sum">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgDragonDimSum} />
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[6px] shrink-0 size-[40px]" data-name="Background">
      <DragonDimSum />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Dragon Dim Sum</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(61,74,61,0.7)] whitespace-nowrap">
        <p className="leading-[20px]">ID: PH-92442</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[115.11px]" data-name="Container">
      <Container46 />
      <Container47 />
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[188.77px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Background4 />
        <Container45 />
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[225.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">North Wing, Plaza</p>
        </div>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(218,226,253,0.5)] content-stretch flex items-start px-[10px] py-[3.5px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#5c647a] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Noodles</p>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[124.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25.5px] pt-[24.5px] px-[24px] relative size-full">
        <Overlay1 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] tracking-[0.24px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">SUSPENDED</p>
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[121.05px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#f59e0b] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <Container48 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.25">
        <g id="Container">
          <path d={svgPaths.p1aba2b80} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">3.2</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[101.76px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center pl-[47.99px] relative size-full">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container51 />
    </div>
  );
}

function Container52() {
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

function Button17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container52 />
    </div>
  );
}

function Data11() {
  return (
    <div className="opacity-0 relative shrink-0 w-[143.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-end pl-[48px] relative size-full">
        <Button16 />
        <Button17 />
      </div>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Table Row 2">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Data6 />
      <Data7 />
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
    </div>
  );
}

function SweetSerenity() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Sweet Serenity">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSweetSerenity} />
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[6px] shrink-0 size-[40px]" data-name="Background">
      <SweetSerenity />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Sweet Serenity</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(61,74,61,0.7)] whitespace-nowrap">
        <p className="leading-[20px]">ID: PH-92510</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[104.27px]" data-name="Container">
      <Container54 />
      <Container55 />
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[188.77px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Background5 />
        <Container53 />
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[225.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">East Market, Stand 12</p>
        </div>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(218,226,253,0.5)] content-stretch flex items-start px-[10px] py-[3.5px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#5c647a] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Dessert</p>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[124.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25.5px] pt-[24.5px] px-[24px] relative size-full">
        <Overlay2 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(61,74,61,0.4)] tracking-[0.24px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">INACTIVE</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[121.05px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[rgba(61,74,61,0.4)] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Overlay" />
        <Container56 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.25">
        <g id="Container">
          <path d={svgPaths.p389def00} fill="var(--fill-0, #3D4A3D)" fillOpacity="0.2" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">N/A</p>
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[101.76px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center pl-[47.99px] relative size-full">
        <Container57 />
        <Container58 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container59 />
    </div>
  );
}

function Container60() {
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

function Button19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container60 />
    </div>
  );
}

function Data17() {
  return (
    <div className="opacity-0 relative shrink-0 w-[143.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-end pl-[48px] relative size-full">
        <Button18 />
        <Button19 />
      </div>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Table Row 3">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Data12 />
      <Data13 />
      <Data14 />
      <Data15 />
      <Data16 />
      <Data17 />
    </div>
  );
}

function TheGoldenGrain() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="The Golden Grain">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgTheGoldenGrain} />
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[6px] shrink-0 size-[40px]" data-name="Background">
      <TheGoldenGrain />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">The Golden Grain</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(61,74,61,0.7)] whitespace-nowrap">
        <p className="leading-[20px]">ID: PH-92688</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[119.83px]" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[188.77px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Background6 />
        <Container61 />
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[225.81px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26.5px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">South Plaza, 1st Floor</p>
        </div>
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(218,226,253,0.5)] content-stretch flex items-start px-[10px] py-[3.5px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#5c647a] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Rice</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[124.69px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25px] pt-[24.5px] px-[24px] relative size-full">
        <Overlay3 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIVE</p>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[121.05px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center pl-[24px] relative size-full">
        <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <Container64 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.25">
        <g id="Container">
          <path d={svgPaths.p389def00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">4.5</p>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[101.76px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-center pl-[47.99px] relative size-full">
        <Container65 />
        <Container66 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container67 />
    </div>
  );
}

function Container68() {
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

function Button21() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container68 />
    </div>
  );
}

function Data23() {
  return (
    <div className="opacity-0 relative shrink-0 w-[143.92px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-end pl-[48px] relative size-full">
        <Button20 />
        <Button21 />
      </div>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="content-stretch flex items-center justify-center pt-px relative shrink-0 w-full" data-name="Table Row 4">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Data18 />
      <Data19 />
      <Data20 />
      <Data21 />
      <Data22 />
      <Data23 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <TableRow />
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
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

function Container69() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Showing 4 of 124 active vendors</p>
        </div>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-30 px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Previous</p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="bg-[#006e2f] content-stretch flex flex-col items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">2</p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">3</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">...</p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">12</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Container">
      <Button23 />
      <Button24 />
      <Button25 />
      <Container72 />
      <Button26 />
    </div>
  );
}

function Button27() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-center tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Next</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button22 />
        <Container71 />
        <Button27 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[24px] pt-[25px] px-[24px] relative size-full">
          <Container69 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function SectionVendorActiveDirectory() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Section - Vendor Active Directory">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <HorizontalBorder />
        <Table />
        <HorizontalBorder1 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.2)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-0 p-[32px] right-0 top-[64px]" data-name="Container">
      <SectionPendingVendorApprovals />
      <SectionVendorActiveDirectory />
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(61,74,61,0.6)] text-center tracking-[1.2px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">© 2024 PATHEAT SYSTEMS. HIGH EFFICIENCY ROUTE MANAGEMENT.</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-[32px] pt-[33px] px-[32px] right-0 top-[1008px]" data-name="Footer">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Container73 />
    </div>
  );
}

function Container75() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
          <p className="leading-[normal]">Search vendors, locations, or IDs...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pl-[41px] pr-[17px] pt-[10px] relative size-full">
          <Container75 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[rgba(188,203,185,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute bottom-[18.42%] content-stretch flex flex-col items-start left-[12px] top-[18.42%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #3D4A3D)" fillOpacity="0.6" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input />
        <Container76 />
      </div>
    </div>
  );
}

function Container78() {
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

function Button28() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container78 />
      <div className="absolute bg-[#ef4444] right-[-4.01px] rounded-[9999px] size-[8px] top-[-4px]" data-name="Background" />
    </div>
  );
}

function Container79() {
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

function Button29() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container79 />
    </div>
  );
}

function Container80() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="bg-[#006e2f] content-stretch flex gap-[8px] items-center px-[20px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container80 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Add Vendor</p>
      </div>
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

function Container77() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Button28 />
        <Button29 />
        <div className="bg-[rgba(188,203,185,0.3)] h-[32px] relative shrink-0 w-px" data-name="Vertical Divider" />
        <Button30 />
        <AdministratorProfile />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div className="absolute bg-[#f8f9ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-0 pb-px px-[32px] right-0 top-0" data-name="Header - Top Navigation Bar">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <Container74 />
      <Container77 />
    </div>
  );
}

function MainContentShell() {
  return (
    <div className="absolute h-[1113px] left-[260px] right-0 top-0" data-name="Main Content Shell">
      <Container />
      <Footer />
      <HeaderTopNavigationBar />
    </div>
  );
}

function PathEatLogo() {
  return (
    <div className="max-w-[259px] relative shrink-0 size-[40px]" data-name="PathEat Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-full left-[-273.75%] max-w-none top-0 w-[647.5%]" src={imgPathEatLogo} />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6bff8f] text-[20px] w-full">
        <p className="leading-[28px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.6)] w-full">
        <p className="leading-[20px]">Management Portal</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container83 />
    </div>
  );
}

function Container81() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] relative size-full">
        <PathEatLogo />
        <Container82 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[40px] relative size-full">
        <Container81 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
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
          <Container84 />
          <Container85 />
        </div>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
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
          <Container86 />
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Container88() {
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

function Container89() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">Restaurant Management</p>
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
        <div className="content-stretch flex gap-[12px] items-center pl-[28px] pr-[24px] py-[12px] relative size-full">
          <Container88 />
          <Container89 />
        </div>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p396ca1c0} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Complaints</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container90 />
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container92 />
          <Container93 />
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
        <Link4 />
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Support</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center py-[12px] relative size-full">
        <Container94 />
        <Container95 />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #EF4444)" fillOpacity="0.8" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(239,68,68,0.8)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Logout</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center py-[12px] relative size-full">
        <Container96 />
        <Container97 />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-[25px] px-[24px] relative size-full">
        <Link5 />
        <Link6 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <HorizontalBorder2 />
      </div>
    </div>
  );
}

function AsideSidebarNavigation() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px py-[24px] top-0 w-[260px]" data-name="Aside - Sidebar Navigation">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Margin />
      <Nav />
      <Margin1 />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContentShell />
      <AsideSidebarNavigation />
    </div>
  );
}