import svgPaths from "./svg-161878r1yj";
import imgVendorProfileAvatar from "./66a037bcc802045147a6711455fa000235fc2231.png";
import imgBaiSachChrouk from "./3048f6f12148eeea4287f0fca295f192a3c56447.png";
import imgKuyteavSoup from "./8ee833775fae095a1334464f85b2e5451f17563d.png";
import imgFriedRice from "./617a1a225ae66b185e6c03269982907fbece9a08.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] whitespace-nowrap">
          <p className="leading-[31.2px]">Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
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

function Container4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <div className="absolute inset-[-20%_-25.12%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0195 24">
          <g id="Container">
            <path d={svgPaths.p28252700} fill="var(--fill-0, #3D4A3D)" id="Icon" />
            <rect fill="var(--fill-0, #22C55E)" height="8" id="Background" rx="4" width="8" x="12.0195" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function VendorProfileAvatar() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[32px]" data-name="Vendor profile avatar">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgVendorProfileAvatar} />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container3 />
        <Container4 />
        <VendorProfileAvatar />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#f8f9ff] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Good morning, Layhok!</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">{`Here's what happening with your stall today.`}</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[308.67px]" data-name="Container">
      <Heading1 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #0F172A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container7 />
      <div className="absolute bg-[#ef4444] right-[7.98px] rounded-[9999px] size-[8px] top-[8px]" data-name="Background" />
    </div>
  );
}

function Header1() {
  return (
    <div className="bg-white h-[80px] relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] relative size-full">
          <Container5 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
        <g id="Container">
          <path d={svgPaths.p23cfd7c0} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(34,197,94,0.1)] relative rounded-[8px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[30px] w-full">
          <p className="leading-[36px]">25</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
          <p className="leading-[20px]">Menu Items</p>
        </div>
      </div>
    </div>
  );
}

function MenuItems() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Menu Items">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Overlay />
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 15">
        <g id="Container">
          <path d={svgPaths.p3e801e80} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(130,171,255,0.1)] relative rounded-[8px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[30px] w-full">
          <p className="leading-[36px]">560</p>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
          <p className="leading-[20px]">Total Views</p>
        </div>
      </div>
    </div>
  );
}

function TotalViews() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Total Views">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Overlay1 />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[19px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
        <g id="Container">
          <path d={svgPaths.p1f93f980} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(245,158,11,0.1)] relative rounded-[8px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container14 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[30px] w-full">
          <p className="leading-[36px]">4.6</p>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
          <p className="leading-[20px]">Average Rating</p>
        </div>
      </div>
    </div>
  );
}

function AverageRating() {
  return (
    <div className="bg-white col-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Average Rating">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Overlay2 />
        <Container15 />
        <Container16 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1fe7b600} fill="var(--fill-0, #9333EA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[30px] w-full">
          <p className="leading-[36px]">120</p>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
          <p className="leading-[20px]">Total Reviews</p>
        </div>
      </div>
    </div>
  );
}

function TotalReviews() {
  return (
    <div className="bg-white col-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Total Reviews">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Background />
        <Container18 />
        <Container19 />
      </div>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_162px] relative shrink-0 w-full" data-name="Stats Row">
      <MenuItems />
      <TotalViews />
      <AverageRating />
      <TotalReviews />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[16px] w-full">
        <p className="leading-[24px]">Recent Reviews</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute left-[20px] size-0 top-[20px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] left-0 not-italic size-0 text-[#003d88] text-[0px] top-0">
        <p className="leading-[normal]">SN</p>
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="overflow-clip relative shrink-0 size-[40px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <path d="M0 0H40V0V40V40H0V40V0V0V0" fill="var(--fill-0, #E5EEFF)" id="Vector" />
      </svg>
      <Text />
    </div>
  );
}

function User() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-center justify-center max-w-[416px] overflow-clip relative rounded-[9999px] shrink-0 size-[40px]" data-name="User">
      <Image />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center relative shrink-0 text-[#0f172a] text-[14px]">
        <p className="leading-[20px]">Sokun Nuth</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center relative shrink-0 text-[#3d4a3d] text-[12px]">
        <p className="leading-[16px]">2 days ago</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[4px] relative self-stretch shrink-0" data-name="Margin">
      <Container30 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[9.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
      <Margin />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">Delicious and cheap! Very good service.</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <Paragraph />
      <Container24 />
      <Container31 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <User />
      <Container23 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute left-[20px] size-0 top-[20px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] left-0 not-italic size-0 text-[#003d88] text-[0px] top-0">
        <p className="leading-[normal]">DK</p>
      </div>
    </div>
  );
}

function Image1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[40px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <path d="M0 0H40V0V40V40H0V40V0V0V0" fill="var(--fill-0, #E5EEFF)" id="Vector" />
      </svg>
      <Text1 />
    </div>
  );
}

function User1() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-center justify-center max-w-[416px] overflow-clip relative rounded-[9999px] shrink-0 size-[40px]" data-name="User">
      <Image1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center relative shrink-0 text-[#0f172a] text-[14px]">
        <p className="leading-[20px]">Dara Kim</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center relative shrink-0 text-[#3d4a3d] text-[12px]">
        <p className="leading-[16px]">3 days ago</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.pc98bac0} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">4.0</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[4px] relative self-stretch shrink-0" data-name="Margin">
      <Container40 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex h-[9.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Margin1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">Good taste and fast!</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <Paragraph1 />
      <Container34 />
      <Container41 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <User1 />
      <Container33 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute left-[20px] size-0 top-[20px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] left-0 not-italic size-0 text-[#003d88] text-[0px] top-0">
        <p className="leading-[normal]">RT</p>
      </div>
    </div>
  );
}

function Image2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[40px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <path d="M0 0H40V0V40V40H0V40V0V0V0" fill="var(--fill-0, #E5EEFF)" id="Vector" />
      </svg>
      <Text2 />
    </div>
  );
}

function User2() {
  return (
    <div className="bg-[#e5eeff] content-stretch flex flex-col items-center justify-center max-w-[416px] overflow-clip relative rounded-[9999px] shrink-0 size-[40px]" data-name="User">
      <Image2 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center relative shrink-0 text-[#0f172a] text-[14px]">
        <p className="leading-[20px]">Ravy Touch</p>
      </div>
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center relative shrink-0 text-[#3d4a3d] text-[12px]">
        <p className="leading-[16px]">5 days ago</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="h-[9.5px] relative shrink-0 w-[10px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.5">
          <path d={svgPaths.p197ced20} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[4px] relative self-stretch shrink-0" data-name="Margin">
      <Container50 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[9.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Margin2 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">My favorite place on the way home.</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <Paragraph2 />
      <Container44 />
      <Container51 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <User2 />
      <Container43 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container22 />
        <Container32 />
        <Container42 />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">View all reviews</p>
        </div>
      </div>
    </div>
  );
}

function RecentReviews() {
  return (
    <div className="bg-white col-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Recent Reviews">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[63px] pt-[25px] px-[25px] relative size-full">
        <Container20 />
        <Container21 />
        <Container52 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[16px] w-full">
        <p className="leading-[24px]">Top Selling Items</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading3 />
      </div>
    </div>
  );
}

function BaiSachChrouk() {
  return (
    <div className="max-w-[416px] relative rounded-[8px] shrink-0 size-[48px]" data-name="Bai Sach Chrouk">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[8px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBaiSachChrouk} />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[14px] w-full">
        <p className="leading-[20px]">Bai Sach Chrouk</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">$2.00</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading4 />
        <Container56 />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[13px] relative size-full">
          <BaiSachChrouk />
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function KuyteavSoup() {
  return (
    <div className="max-w-[416px] relative rounded-[8px] shrink-0 size-[48px]" data-name="Kuyteav Soup">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[8px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgKuyteavSoup} />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[14px] w-full">
        <p className="leading-[20px]">Kuyteav Soup</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">$1.75</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading5 />
        <Container58 />
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="h-[67px] relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[13px] relative size-full">
          <KuyteavSoup />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function FriedRice() {
  return (
    <div className="max-w-[416px] relative rounded-[8px] shrink-0 size-[48px]" data-name="Fried Rice">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[8px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgFriedRice} />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[14px] w-full">
        <p className="leading-[20px]">Fried Rice</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] w-full">
        <p className="leading-[16px]">$2.00</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading6 />
        <Container60 />
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[13px] relative size-full">
          <FriedRice />
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Border />
        <Border1 />
        <Border2 />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">View all menu items</p>
        </div>
      </div>
    </div>
  );
}

function TopSellingItems() {
  return (
    <div className="bg-white col-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Top Selling Items">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Container53 />
        <Container54 />
        <Container61 />
      </div>
    </div>
  );
}

function MiddleRow() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_392px] relative shrink-0 w-full" data-name="Middle Row">
      <RecentReviews />
      <TopSellingItems />
    </div>
  );
}

function Heading7() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex font-['Poppins:Regular',sans-serif] inset-[8.25%_-1.69%_79.75%_1.69%] items-center leading-[0] not-italic whitespace-nowrap" data-name="Heading 3">
      <div className="flex flex-col justify-center relative shrink-0 text-[#0f172a] text-[16px]">
        <p className="leading-[24px]">{`Analytics `}</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#3d4a3d] text-[14px]">
        <p className="leading-[20px]">(This Week)</p>
      </div>
    </div>
  );
}

function SimpleSvgLineChartSimulation() {
  return (
    <div className="flex-[1_0_0] min-h-px overflow-clip relative w-full" data-name="Simple SVG line chart simulation">
      <div className="absolute inset-[20%_0_13.33%_0]" data-name="Vector">
        <div className="absolute inset-[-1.48%_-2.48%_-1.48%_-0.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 909.942 137.275">
            <path d={svgPaths.pa093600} id="Vector" stroke="var(--stroke-0, #22C55E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.94143" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[84%_99.43%_10.67%_-0.57%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[64%_85.14%_30.67%_13.71%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[74%_70.86%_20.67%_28%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[57.33%_56.57%_37.33%_42.29%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.33%_42.29%_57.33%_56.57%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[67.33%_28%_27.33%_70.86%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[24%_13.71%_70.67%_85.14%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[17.33%_-0.57%_77.33%_99.43%]" data-name="Vector">
        <div className="absolute inset-[0_-2.26%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3543 10.6667">
            <path d={svgPaths.p2aeef100} fill="var(--fill-0, #22C55E)" id="Vector" />
          </svg>
        </div>
      </div>
      <Heading7 />
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 10</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 11</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 12</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 13</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 14</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 15</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[10px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">MAY 16</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container64 />
        <Container65 />
        <Container66 />
        <Container67 />
        <Container68 />
        <Container69 />
        <Container70 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[231px] items-start left-[25px] right-[25px] top-[24.5px]" data-name="Container">
      <SimpleSvgLineChartSimulation />
      <Container63 />
    </div>
  );
}

function BottomRowAnalytics() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[306px] relative rounded-[12px] shrink-0 w-full" data-name="Bottom Row: Analytics">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container62 />
    </div>
  );
}

function Main() {
  return (
    <div className="flex-[1_0_0] max-w-[1280px] min-h-px relative w-full" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] p-[32px] relative size-full">
        <StatsRow />
        <MiddleRow />
        <BottomRowAnalytics />
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-[1076px] relative w-full z-[1]" data-name="Main Content Area">
      <Header1 />
      <Main />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[1174px] isolate items-start min-h-[1024px] min-w-px relative" data-name="Container">
      <Header />
      <MainContentArea />
    </div>
  );
}

function Background1() {
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

function Container73() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading />
      <Container73 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background1 />
          <Container72 />
        </div>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container71 />
      </div>
    </div>
  );
}

function Container74() {
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

function Container75() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[78.77px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
          <p className="leading-[19.6px]">Dashboard</p>
        </div>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container74 />
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Container76() {
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

function Container77() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[130.22px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Stall Management</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container76 />
          <Container77 />
        </div>
      </div>
    </div>
  );
}

function Container78() {
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

function Container79() {
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
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container78 />
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p13965980} fill="var(--fill-0, #F8F9FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[148.36px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#f8f9ff] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Support/Onboarding</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container80 />
          <Container81 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
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

function Container83() {
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
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container82 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Container85() {
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

function Container86() {
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
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container85 />
          <Container86 />
        </div>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Link5 />
      </div>
    </div>
  );
}

function Aside() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1174px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[280px]" data-name="Aside">
      <div aria-hidden className="absolute border-[#5c647a] border-r border-solid inset-0 pointer-events-none" />
      <Margin3 />
      <Nav />
      <Container84 />
    </div>
  );
}

export default function VendorDashboardLight() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Vendor Dashboard (Light)">
      <Container />
      <Aside />
    </div>
  );
}