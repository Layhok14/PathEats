import svgPaths from "./svg-60uistjfae";
import imgVendorProfileAvatar from "./378e12b1c1680351ce59975bfaff8068fe4fa6fa.png";
import imgAb6AXuDt5RnBzBegZzqpXonMmfIr6JHh343YV09LVBrWg6S9H4N136ObVgDnUdApFm5UudGpwb4RVl5EfHnnMlnOhTjVkKtGt48KCoDft9G8BRTbn7OZnPwfJ1RrZEjPd45Wi584V8Fby9Q0D5LtvDdg0Fvg46667ERMMybhBfLmQli5YTyJVi53DXiSpGfUykNSiEkaX8TBfLm5T4Z6HH8UKrcEdX0IU8DIitr5PyKDhWt00HufwmdnwovqxWqPiFeWWpfk from "./18592be59e314571cbbb415dbd2b868d180a9d49.png";
import imgAb6AXuAmMmbR9FEjClcMwEmDa31XO13OG3Vf1QezYoCiAn7KWw21JIaZidNhI4S37XcNfvq7697Pm5Ck3POma8XqTeDtmCn9C3H1977EhjICkQbl85S7OywbKgNy4U8MYz3AVTpkWYusm1JQjG4MNqzKSsZbDo6UlBjOgW5TCzlybB2Gsba6Y1UeRt6MX3HA5EJlGsruSsUNbS542WkhyRtRfuFcsYlRzts8CvpaJvc5WRsoRpNixirb8UnovujCppApTZmtYyNdfc from "./1eb479b12f24e5663ea9c903872a058f32b3e271.png";
import imgAb6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee from "./3046e4273a21668ad8ece678fbaf47de6253caf5.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function Heading() {
  return (
    <div className="relative shrink-0" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[24px] whitespace-nowrap">
          <p className="leading-[31.2px]">PathEat</p>
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

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <div className="absolute inset-[-20%_-25.12%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0195 24">
          <g id="Container">
            <path d={svgPaths.p28252700} fill="var(--fill-0, #3D4A3D)" id="Icon" />
            <rect fill="var(--fill-0, #EF4444)" height="8" id="Background+Border" rx="4" stroke="var(--stroke-0, #F8F9FF)" strokeWidth="2" width="8" x="11.0195" y="1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Container2 />
      <Container3 />
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

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Container1 />
        <BackgroundBorder />
      </div>
    </div>
  );
}

function HeaderTopAppBarAuthorityJson() {
  return (
    <div className="bg-[#f8f9ff] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header - TopAppBar (Authority: JSON)">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
          <Heading />
          <Container />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] whitespace-nowrap">
        <p className="leading-[38.4px]">My Stalls</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[46.39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Overview and management of your active vending locations.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[70.39px] relative shrink-0 w-[488.47px]" data-name="Container">
      <Heading1 />
      <Container5 />
    </div>
  );
}

function Container6() {
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

function Button() {
  return (
    <div className="bg-[#22c55e] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[7.99px] items-center px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container6 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white whitespace-nowrap">
        <p className="leading-[28px]">Register New Stall</p>
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header Section">
      <Container4 />
      <Button />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[42px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 18">
        <g id="Container">
          <path d={svgPaths.p1af688c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip py-px relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
        <p className="leading-[normal]">Search stalls by name or location...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] pt-[11px] px-[12px] relative size-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white col-[1/span_2] h-[66px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[9px] relative size-full">
          <Container7 />
          <Input />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[12px] relative shrink-0 w-[30px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 12">
        <g id="Margin">
          <path d={svgPaths.p2889b5c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Category</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[7.4px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7.4">
        <g id="Container">
          <path d={svgPaths.p1adfde00} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="flex-[1_0_0] min-w-[24.020000457763672px] relative" data-name="Margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end min-w-[inherit] pl-[53.016px] relative size-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white col-3 h-[66px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-[9px] relative size-full">
          <Margin />
          <Container9 />
          <Margin1 />
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[12px] relative shrink-0 w-[30px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 12">
        <g id="Margin">
          <path d={svgPaths.p328dc7c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Sort By</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[7.4px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7.4">
        <g id="Container">
          <path d={svgPaths.p1adfde00} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin3() {
  return (
    <div className="flex-[1_0_0] min-w-[24.020000457763672px] relative" data-name="Margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end min-w-[inherit] pl-[73.453px] relative size-full">
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white col-4 h-[66px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-[9px] relative size-full">
          <Margin2 />
          <Container11 />
          <Margin3 />
        </div>
      </div>
    </div>
  );
}

function FiltersSearchBarBentoStyleInteractionRow() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_66px] pt-[8px] relative shrink-0 w-full" data-name="Filters & Search Bar (Bento-style interaction row)">
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
    </div>
  );
}

function Ab6AXuDt5RnBzBegZzqpXonMmfIr6JHh343YV09LVBrWg6S9H4N136ObVgDnUdApFm5UudGpwb4RVl5EfHnnMlnOhTjVkKtGt48KCoDft9G8BRTbn7OZnPwfJ1RrZEjPd45Wi584V8Fby9Q0D5LtvDdg0Fvg46667ERMMybhBfLmQli5YTyJVi53DXiSpGfUykNSiEkaX8TBfLm5T4Z6HH8UKrcEdX0IU8DIitr5PyKDhWt00HufwmdnwovqxWqPiFeWWpfk() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuDT_5RNBzBEGZzqpXonMMFIr6JHh343yV09lVBrWG6S9h4N1_36obVgDNUdApFm5uudGPWB4rVl5ef-HnnMLNOhTJVkKTGt48kCODft9G8bR-TBN7OZnPwfJ1rrZEjPd45Wi_584V8Fby9Q-0d5LtvDDG-_0FVG46667e_rM_-MybhBfLmQli5YTyJVi53dXiSpGFUykNSiEkaX8TBfLM5t4z6hH8uKRCEdX0iU8dIitr5pyKDhWt00hufwmdnwovqxWqPIFeWWpfk">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[153.13%] left-0 max-w-none top-[-26.56%] w-full" src={imgAb6AXuDt5RnBzBegZzqpXonMmfIr6JHh343YV09LVBrWg6S9H4N136ObVgDnUdApFm5UudGpwb4RVl5EfHnnMlnOhTjVkKtGt48KCoDft9G8BRTbn7OZnPwfJ1RrZEjPd45Wi584V8Fby9Q0D5LtvDdg0Fvg46667ERMMybhBfLmQli5YTyJVi53DXiSpGfUykNSiEkaX8TBfLm5T4Z6HH8UKrcEdX0IU8DIitr5PyKDhWt00HufwmdnwovqxWqPiFeWWpfk} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#22c55e] content-stretch flex gap-[8px] items-center px-[12px] py-[4px] right-[15.99px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="bg-white relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Open</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(11,28,48,0.8)] content-stretch flex items-start px-[12px] py-[4.5px] relative rounded-[4px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">{`Rice & Bowls`}</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bottom-[11.59px] content-stretch flex flex-col items-start left-[16px]" data-name="Container">
      <OverlayOverlayBlur />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[192px] relative shrink-0 w-full z-[2]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Ab6AXuDt5RnBzBegZzqpXonMmfIr6JHh343YV09LVBrWg6S9H4N136ObVgDnUdApFm5UudGpwb4RVl5EfHnnMlnOhTjVkKtGt48KCoDft9G8BRTbn7OZnPwfJ1RrZEjPd45Wi584V8Fby9Q0D5LtvDdg0Fvg46667ERMMybhBfLmQli5YTyJVi53DXiSpGfUykNSiEkaX8TBfLm5T4Z6HH8UKrcEdX0IU8DIitr5PyKDhWt00HufwmdnwovqxWqPiFeWWpfk />
        <Background />
        <Container14 />
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[25.38px]" data-name="Margin">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[4px] not-italic text-[#0b1c30] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">4.8</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] whitespace-nowrap">
        <p className="leading-[31.2px]">Healthy shop</p>
      </div>
      <div className="h-[19px] relative shrink-0 w-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
          <path d={svgPaths.p3e30af00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </svg>
      </div>
      <Margin5 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-[12.25px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Material_Symbols_Outlined:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[7px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">location_on</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">North Station Corridor, Platform 4</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[19.59px] left-[calc(50%-33.29px)] top-[calc(50%+0.01px)] w-[14.02px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.02 19.59">
        <g id="Container">
          <path d={svgPaths.p24e98700} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#0b1c30] flex-[1_0_0] h-[48px] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container19 />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+11px)] not-italic text-[14px] text-center text-white top-[calc(50%-0.79px)] whitespace-nowrap">
          <p className="leading-[19.6px]">Manage</p>
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
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Container20 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex gap-[16px] items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5eeff] border-solid border-t inset-0 pointer-events-none" />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Margin4 />
        <Margin6 />
        <HorizontalBorder />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Card 1">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container13 />
        <Container15 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Ab6AXuAmMmbR9FEjClcMwEmDa31XO13OG3Vf1QezYoCiAn7KWw21JIaZidNhI4S37XcNfvq7697Pm5Ck3POma8XqTeDtmCn9C3H1977EhjICkQbl85S7OywbKgNy4U8MYz3AVTpkWYusm1JQjG4MNqzKSsZbDo6UlBjOgW5TCzlybB2Gsba6Y1UeRt6MX3HA5EJlGsruSsUNbS542WkhyRtRfuFcsYlRzts8CvpaJvc5WRsoRpNixirb8UnovujCppApTZmtYyNdfc() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAMMmbR9FEjClcMwEmDA31xO13oG3Vf1QEZYoCIAn7kWw21_jIaZIDNhI4S37XCNfvq7697PM5CK3pOMA8xqTeDtmCn9c3h1977EhjI_ckQbl85s7OywbKGNy4U8mYZ3aVTpkWYusm1JQjG4mNqzKSsZBDo6UlBJOgW5TCzlybB2GSBA6y1UeRt6mX3hA5EJlGsru_ssU-nbS542wkhyRtRfuFcsYlRZTS_8CVPAJvc5wRsoRpNixirb8unovujCppApTZmtYYNdfc">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[153.13%] left-0 max-w-none top-[-26.56%] w-full" src={imgAb6AXuAmMmbR9FEjClcMwEmDa31XO13OG3Vf1QezYoCiAn7KWw21JIaZidNhI4S37XcNfvq7697Pm5Ck3POma8XqTeDtmCn9C3H1977EhjICkQbl85S7OywbKgNy4U8MYz3AVTpkWYusm1JQjG4MNqzKSsZbDo6UlBjOgW5TCzlybB2Gsba6Y1UeRt6MX3HA5EJlGsruSsUNbS542WkhyRtRfuFcsYlRzts8CvpaJvc5WRsoRpNixirb8UnovujCppApTZmtYyNdfc} />
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-[#22c55e] content-stretch flex gap-[8px] items-center px-[12px] py-[4px] right-[15.99px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="bg-white relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Open</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur1() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(11,28,48,0.8)] content-stretch flex items-start px-[12px] py-[4.5px] relative rounded-[4px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Noodles</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bottom-[11.59px] content-stretch flex flex-col items-start left-[16px]" data-name="Container">
      <OverlayOverlayBlur1 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[192px] relative shrink-0 w-full z-[2]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Ab6AXuAmMmbR9FEjClcMwEmDa31XO13OG3Vf1QezYoCiAn7KWw21JIaZidNhI4S37XcNfvq7697Pm5Ck3POma8XqTeDtmCn9C3H1977EhjICkQbl85S7OywbKgNy4U8MYz3AVTpkWYusm1JQjG4MNqzKSsZbDo6UlBjOgW5TCzlybB2Gsba6Y1UeRt6MX3HA5EJlGsruSsUNbS542WkhyRtRfuFcsYlRzts8CvpaJvc5WRsoRpNixirb8UnovujCppApTZmtYyNdfc />
        <Background1 />
        <Container22 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[19px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
        <g id="Container">
          <path d={svgPaths.p3e30af00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin8() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[25.39px]" data-name="Margin">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[4px] not-italic text-[#0b1c30] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">4.5</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container26 />
      <Margin8 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] whitespace-nowrap">
        <p className="leading-[31.2px]">Happy food</p>
      </div>
      <Container25 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container24 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-[12.25px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Material_Symbols_Outlined:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[7px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">location_on</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Central Mall Entrance, Gate B</p>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[19.59px] left-[calc(50%-33.29px)] top-[calc(50%+0.01px)] w-[14.02px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.02 19.59">
        <g id="Container">
          <path d={svgPaths.p24e98700} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#0b1c30] flex-[1_0_0] h-[48px] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container29 />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+11px)] not-italic text-[14px] text-center text-white top-[calc(50%-0.79px)] whitespace-nowrap">
          <p className="leading-[19.6px]">Manage</p>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Container30 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5eeff] border-solid border-t inset-0 pointer-events-none" />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Margin7 />
        <Margin9 />
        <HorizontalBorder1 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Card 2">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container21 />
        <Container23 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Ab6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBIONTbT2HQU-_BkBK7JmFmfBh4Wzz05cYGziysgo1tIoG_W3TsQ1OtsCA2tZA9t8Zlp7hFIOmw-235tGUe5d1A7LLQFt7z2lYxK7f9iFnxxcF0hG3yDc9BOu_WCQbV1JBY-KYEntqEmq3SnV_kQ6hYZs1HiSQ8vXqtzNcJHvQavt6N38yjagT5wUGz_-pugSQ3CofwkevNF-Wg10dK6NteNUdImP9bZoR_vUD4lkG6mKqpcMjFp0TKYTzLxJ3j6GaY2QMgr_ikLEE">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[153.13%] left-0 max-w-none top-[-26.56%] w-full" src={imgAb6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee} />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="absolute bg-[#565e74] content-stretch flex gap-[8px] items-center px-[12px] py-[4px] right-[16px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Overlay" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Closed</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur2() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(11,28,48,0.8)] content-stretch flex items-start px-[12px] py-[4.5px] relative rounded-[4px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Western</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bottom-[11.59px] content-stretch flex flex-col items-start left-[16px]" data-name="Container">
      <OverlayOverlayBlur2 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="h-[192px] relative shrink-0 w-full z-[2]" data-name="Overlay">
      <div aria-hidden className="absolute bg-[rgba(255,255,255,0.5)] bg-clip-padding border-0 border-[transparent] border-solid inset-0 mix-blend-saturation pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Ab6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee />
        <Background2 />
        <Container31 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[19px] mr-[-0.01px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
        <g id="Container">
          <path d={svgPaths.p3e30af00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin11() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[24.52px]" data-name="Margin">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[4px] not-italic text-[#0b1c30] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">4.2</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container35 />
      <Margin11 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] whitespace-nowrap">
        <p className="leading-[31.2px]">Metro Pizza</p>
      </div>
      <Container34 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container33 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-[12.25px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Material_Symbols_Outlined:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[7px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">location_on</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">South Bus Terminal, Bay 12</p>
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container36 />
    </div>
  );
}

function Container38() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[19.59px] left-[calc(50%-33.29px)] top-[calc(50%+0.01px)] w-[14.02px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.02 19.59">
        <g id="Container">
          <path d={svgPaths.p24e98700} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#0b1c30] flex-[1_0_0] h-[48px] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container38 />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+11px)] not-italic text-[14px] text-center text-white top-[calc(50%-0.79px)] whitespace-nowrap">
          <p className="leading-[19.6px]">Manage</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Container39 />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5eeff] border-solid border-t inset-0 pointer-events-none" />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Margin10 />
        <Margin12 />
        <HorizontalBorder2 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-3 h-[399px] justify-self-stretch opacity-90 relative rounded-[12px] row-1 shrink-0" data-name="Card 3">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Overlay />
        <Container32 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Ab6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBIONTbT2HQU-_BkBK7JmFmfBh4Wzz05cYGziysgo1tIoG_W3TsQ1OtsCA2tZA9t8Zlp7hFIOmw-235tGUe5d1A7LLQFt7z2lYxK7f9iFnxxcF0hG3yDc9BOu_WCQbV1JBY-KYEntqEmq3SnV_kQ6hYZs1HiSQ8vXqtzNcJHvQavt6N38yjagT5wUGz_-pugSQ3CofwkevNF-Wg10dK6NteNUdImP9bZoR_vUD4lkG6mKqpcMjFp0TKYTzLxJ3j6GaY2QMgr_ikLEE">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[153.13%] left-0 max-w-none top-[-26.56%] w-full" src={imgAb6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee} />
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="absolute bg-[#565e74] content-stretch flex gap-[8px] items-center px-[12px] py-[4px] right-[16px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="bg-[rgba(255,255,255,0.5)] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Overlay" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Closed</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur3() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(11,28,48,0.8)] content-stretch flex items-start px-[12px] py-[4.5px] relative rounded-[4px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Western</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bottom-[11.59px] content-stretch flex flex-col items-start left-[16px]" data-name="Container">
      <OverlayOverlayBlur3 />
    </div>
  );
}

function Overlay1() {
  return (
    <div className="h-[192px] relative shrink-0 w-full z-[2]" data-name="Overlay">
      <div aria-hidden className="absolute bg-[rgba(255,255,255,0.5)] bg-clip-padding border-0 border-[transparent] border-solid inset-0 mix-blend-saturation pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Ab6AXuBionTbT2HquBkBk7JmFmfBh4Wzz05CYGziysgo1TIoGW3TsQ1OtsCa2TZa9T8Zlp7HFiOmw235TGUe5D1A7LlqFt7Z2LYxK7F9IFnxxcF0HG3YDc9BOuWcQbV1JbyKyEntqEmq3SnVKQ6HYZs1HiSq8VXqtzNcJHvQavt6N38YjagT5WUGzPugSq3CofwkevNfWg10DK6NteNUdImP9BZoRVUd4LkG6MKqpcMjFp0TkyTzLxJ3J6GaY2QMgrIkLee1 />
        <Background3 />
        <Container40 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[19px] mr-[-0.01px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
        <g id="Container">
          <path d={svgPaths.p3e30af00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin14() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[24.52px]" data-name="Margin">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[4px] not-italic text-[#0b1c30] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">4.2</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container44 />
      <Margin14 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[24px] whitespace-nowrap">
        <p className="leading-[31.2px]">Zipo Pizza</p>
      </div>
      <Container43 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container42 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-[12.25px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Material_Symbols_Outlined:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#565e74] text-[12px] top-[7px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">location_on</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">South Bus Terminal, Bay 12</p>
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[19.59px] left-[calc(50%-33.29px)] top-[calc(50%+0.01px)] w-[14.02px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.02 19.59">
        <g id="Container">
          <path d={svgPaths.p24e98700} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#0b1c30] flex-[1_0_0] h-[48px] min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container47 />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+11px)] not-italic text-[14px] text-center text-white top-[calc(50%-0.79px)] whitespace-nowrap">
          <p className="leading-[19.6px]">Manage</p>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Container48 />
      </div>
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5eeff] border-solid border-t inset-0 pointer-events-none" />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Margin13 />
        <Margin15 />
        <HorizontalBorder3 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-1 h-[399px] justify-self-stretch opacity-90 relative rounded-[12px] row-2 shrink-0" data-name="Card 4">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Overlay1 />
        <Container41 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function StallGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[__397.78px_400px] pb-[8px] relative shrink-0 w-full" data-name="Stall Grid">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
          <p className="leading-[15.6px]">© 2024 PathEat Vendor Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Support</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[16px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function FooterInfo() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[25px] relative shrink-0 w-full" data-name="Footer Info">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <Container49 />
      <Container50 />
    </div>
  );
}

function PageContent() {
  return (
    <div className="h-[1186px] max-w-[1280px] relative shrink-0 w-full z-[1]" data-name="Page Content">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] p-[32px] relative size-full">
        <HeaderSection />
        <FiltersSearchBarBentoStyleInteractionRow />
        <StallGrid />
        <FooterInfo />
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-[1250px] min-w-px relative self-stretch" data-name="Main Content Area">
      <HeaderTopAppBarAuthorityJson />
      <PageContent />
    </div>
  );
}

function ShellLayout() {
  return (
    <div className="h-[1250px] min-h-[1250px] relative shrink-0 w-full" data-name="Shell Layout">
      <div className="flex flex-row justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center min-h-[inherit] pl-[280px] relative size-full">
          <MainContentArea />
        </div>
      </div>
    </div>
  );
}

function Background4() {
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

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
        <p className="leading-[28px]">PathEat</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading2 />
      <Container54 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[24px] right-0 top-0" data-name="Container">
      <Background4 />
      <Container53 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[215px]" data-name="Header">
      <Container52 />
    </div>
  );
}

function HeaderMargin() {
  return (
    <div className="h-[84px] relative shrink-0 w-[279px]" data-name="Header:margin">
      <Header />
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <HeaderMargin />
      </div>
    </div>
  );
}

function Margin16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container51 />
      </div>
    </div>
  );
}

function Container55() {
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

function Container56() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[78.77px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Dashboard</p>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Dashboard">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container55 />
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function Container57() {
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

function Container58() {
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

function StallManagementActiveCurrentPageContext() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative shrink-0 w-full" data-name="Stall Management (ACTIVE - Current Page Context)">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
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
          <path d={svgPaths.p5dfbb10} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[82.38px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Menu Items</p>
      </div>
    </div>
  );
}

function MenuItems() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu Items">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container59 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p13965980} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[148.36px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Support/Onboarding</p>
      </div>
    </div>
  );
}

function SupportOnboarding() {
  return (
    <div className="relative shrink-0 w-full" data-name="Support/Onboarding">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
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
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[57.27px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Settings</p>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 w-full" data-name="Settings">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container63 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start px-[12px] relative size-full">
          <Dashboard />
          <StallManagementActiveCurrentPageContext />
          <MenuItems />
          <SupportOnboarding />
          <Settings />
        </div>
      </div>
    </div>
  );
}

function Container67() {
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

function Container68() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[47.88px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[14px] top-[9px] whitespace-nowrap">
        <p className="leading-[19.6px]">Logout</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container67 />
          <Container68 />
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Container66 />
      </div>
    </div>
  );
}

function AsideSideNavBarAuthorityJson() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1250px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[280px]" data-name="Aside - SideNavBar (Authority: JSON)">
      <div aria-hidden className="absolute border-[#5c647a] border-r border-solid inset-0 pointer-events-none" />
      <Margin16 />
      <Nav />
      <Container65 />
    </div>
  );
}

export default function ViewAllStall() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="view all stall">
      <ShellLayout />
      <AsideSideNavBarAuthorityJson />
    </div>
  );
}