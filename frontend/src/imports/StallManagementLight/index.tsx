import svgPaths from "./svg-c1ncoj9plr";
import imgVendorProfileAvatar from "./e7fc7f76e55e9a6f8866aa739ab828f80d5471b8.png";
import imgStitchPlaceholder300X300Svg from "./f1d3102a755d46742bcf8f85752c4472ca9a450b.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function Container() {
  return (
    <div className="h-[31.19px] relative shrink-0 w-[84px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] left-0 not-italic text-[#006e2f] text-[24px] top-[15px] whitespace-nowrap">
          <p className="leading-[31.2px]">Stall Management</p>
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
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
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

function Border() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[32px]" data-name="Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <VendorProfileAvatar />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container2 />
        <Container3 />
        <Border />
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

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] whitespace-nowrap">
        <p className="leading-[38.4px]">Stall Details</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Keep your stall information up to date to help customers find you.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[523px]" data-name="Container">
      <Heading1 />
      <Container7 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex h-[71px] items-center left-0 right-0 top-0" data-name="Container">
      <Container6 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] w-full">
        <p className="leading-[28px]">Basic Information</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Stall Name</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full">
          <p className="leading-[normal]">{`Spice & Wok Haven`}</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-[466px]" data-name="Input">
      <div className="content-stretch flex flex-col items-start overflow-clip px-[13px] py-[15px] relative rounded-[inherit] size-full">
        <Container9 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label />
        <Input />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Stall Photo</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[33.333px] relative shrink-0 w-[36.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.6667 33.3333">
        <g id="Container">
          <path d={svgPaths.p7fca4c0} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[19.6px]">Drag and drop or click to upload</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col gap-[8px] h-[160px] items-center justify-center p-[2px] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#bccbb9] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[456px]" data-name="Container">
      <Label1 />
      <BackgroundBorder1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Primary Category</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Rice Bowls</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#22c55e] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0.31px_0.41px_0] rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[19.6px]">{`Noodles & Stir-fry`}</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Snacks</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Beverages</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container14 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8.01px] items-start relative size-full">
        <Container11 />
        <Label2 />
        <Margin />
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Description</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full whitespace-pre-wrap">
          <p className="leading-[24px] mb-0">{`Serving authentic, fire-kissed stir-fry noodles right near the main `}</p>
          <p className="leading-[24px]">station entrance. Quick service for busy commuters.</p>
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-[486px]" data-name="Textarea">
      <div className="content-stretch flex flex-col items-start overflow-auto pb-[37px] pt-[13px] px-[13px] relative rounded-[inherit] size-full">
        <Container16 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8.01px] items-start relative size-full">
        <Label3 />
        <Textarea />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <Heading3Margin />
        <Container8 />
        <Container10 />
        <Container15 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-[213px]">
        <p className="leading-[28px]">Operating hours</p>
      </div>
    </div>
  );
}

function Heading3Margin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25px] pb-[8px] right-[684px] top-[24.97px]" data-name="Heading 3:margin">
      <Heading3 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 16">
        <g id="Container">
          <path d={svgPaths.p3c97a140} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Currently Open</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Visible to customers</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[126px]" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container17() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[12px] items-center left-[12px] top-1/2" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Label4() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-center left-[306px] top-1/2" data-name="Label">
      <div className="bg-[#22c55e] h-[24px] relative rounded-[9999px] shrink-0 w-[44px]" data-name="Background" />
      <div className="absolute bg-white left-[22px] rounded-[9999px] size-[20px] top-[2px]" data-name="Background+Border">
        <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="absolute bg-white border border-[#bccbb9] border-solid h-[61.59px] left-[527px] rounded-[8px] top-[74.97px] w-[364px]" data-name="Background+Border">
      <Container17 />
      <Label4 />
    </div>
  );
}

function Container24() {
  return (
    <div className="col-[1/span_3] content-stretch flex flex-col items-start justify-self-stretch pb-[0.59px] relative row-1 self-center shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Monday-Friday</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[0] not-italic relative self-stretch shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] w-[57.03px] whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-px top-[7px]">
        <p className="leading-[15.6px]">09</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[14.48px] top-[7px]">
        <p className="leading-[15.6px]">:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[19.06px] top-[7px]">
        <p className="leading-[15.6px]">00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[36.2px] top-[7px]">
        <p className="leading-[15.6px]">AM</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[15.59px] items-start min-w-px overflow-clip relative" data-name="Container">
      <Paragraph />
    </div>
  );
}

function Image() {
  return <div className="relative shrink-0 size-[12.59px]" data-name="image" />;
}

function ButtonMenu() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative shrink-0 size-[18.59px]" data-name="Button menu">
      <Image />
    </div>
  );
}

function ButtonMenuMargin() {
  return (
    <div className="content-stretch flex flex-col h-[18.59px] items-start pl-[8px] relative shrink-0 w-[26.59px]" data-name="Button menu:margin">
      <ButtonMenu />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container26 />
        <ButtonMenuMargin />
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white col-[4/span_4] justify-self-stretch relative rounded-[4px] row-1 self-center shrink-0" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[9px] relative size-full">
          <Container25 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="col-8 content-stretch flex flex-col items-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">-</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[0] not-italic relative self-stretch shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] w-[55.03px] whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-px top-[7px]">
        <p className="leading-[15.6px]">09</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[14.48px] top-[7px]">
        <p className="leading-[15.6px]">:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[19.06px] top-[7px]">
        <p className="leading-[15.6px]">00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[36.2px] top-[7px]">
        <p className="leading-[15.6px]">PM</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[15.59px] items-start min-w-px overflow-clip relative" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Image1() {
  return <div className="relative shrink-0 size-[12.59px]" data-name="image" />;
}

function ButtonMenu1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative shrink-0 size-[18.59px]" data-name="Button menu">
      <Image1 />
    </div>
  );
}

function ButtonMenuMargin1() {
  return (
    <div className="content-stretch flex flex-col h-[18.59px] items-start pl-[8px] relative shrink-0 w-[26.59px]" data-name="Button menu:margin">
      <ButtonMenu1 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container29 />
        <ButtonMenuMargin1 />
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white col-[9/span_4] justify-self-stretch relative rounded-[4px] row-1 self-center shrink-0" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[9px] relative size-full">
          <Container28 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_36.59px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Input1 />
      <Container27 />
      <Input2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container23 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="col-[1/span_3] content-stretch flex flex-col items-start justify-self-stretch pb-[0.59px] relative row-1 self-center shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Saturday-Sunday</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[0] not-italic relative self-stretch shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] w-[57.03px] whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-px top-[7px]">
        <p className="leading-[15.6px]">09</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[14.48px] top-[7px]">
        <p className="leading-[15.6px]">:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[19.06px] top-[7px]">
        <p className="leading-[15.6px]">00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[36.2px] top-[7px]">
        <p className="leading-[15.6px]">AM</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[15.59px] items-start min-w-px overflow-clip relative" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Image2() {
  return <div className="relative shrink-0 size-[12.59px]" data-name="image" />;
}

function ButtonMenu2() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative shrink-0 size-[18.59px]" data-name="Button menu">
      <Image2 />
    </div>
  );
}

function ButtonMenuMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[18.59px] items-start pl-[8px] relative shrink-0 w-[26.59px]" data-name="Button menu:margin">
      <ButtonMenu2 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container34 />
        <ButtonMenuMargin2 />
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white col-[4/span_4] justify-self-stretch relative rounded-[4px] row-1 self-center shrink-0" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[9px] relative size-full">
          <Container33 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container35() {
  return (
    <div className="col-8 content-stretch flex flex-col items-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">-</p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="[word-break:break-word] font-['Poppins:Regular',sans-serif] leading-[0] not-italic relative self-stretch shrink-0 text-[#0b1c30] text-[12px] tracking-[0.24px] w-[55.03px] whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-px top-[7px]">
        <p className="leading-[15.6px]">09</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[14.48px] top-[7px]">
        <p className="leading-[15.6px]">:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[19.06px] top-[7px]">
        <p className="leading-[15.6px]">00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[36.2px] top-[7px]">
        <p className="leading-[15.6px]">PM</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[15.59px] items-start min-w-px overflow-clip relative" data-name="Container">
      <Paragraph3 />
    </div>
  );
}

function Image3() {
  return <div className="relative shrink-0 size-[12.59px]" data-name="image" />;
}

function ButtonMenu3() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[3px] relative shrink-0 size-[18.59px]" data-name="Button menu">
      <Image3 />
    </div>
  );
}

function ButtonMenuMargin3() {
  return (
    <div className="content-stretch flex flex-col h-[18.59px] items-start pl-[8px] relative shrink-0 w-[26.59px]" data-name="Button menu:margin">
      <ButtonMenu3 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container37 />
        <ButtonMenuMargin3 />
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white col-[9/span_4] justify-self-stretch relative rounded-[4px] row-1 self-center shrink-0" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[9px] relative size-full">
          <Container36 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_36.59px] relative shrink-0 w-full" data-name="Container">
      <Container32 />
      <Input3 />
      <Container35 />
      <Input4 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container31 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[25px] pt-[17px] top-[60.97px] w-[469px]" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <Container22 />
      <Container30 />
    </div>
  );
}

function Margin1() {
  return <div className="absolute h-[150.188px] left-[25px] right-[25px] top-[304.78px]" data-name="Margin" />;
}

function Heading4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[527px] top-[32.97px] w-[500px]" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-[213px]">
        <p className="leading-[28px]">Operating Status</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#f8f9ff] h-[220px] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading3Margin1 />
      <BackgroundBorder3 />
      <HorizontalBorder />
      <Margin1 />
      <Heading4 />
    </div>
  );
}

function FormPrimaryColumn() {
  return (
    <div className="col-[1/span_7] content-stretch flex flex-col gap-[24px] items-start justify-self-start relative row-[1/span_2] self-start shrink-0 w-[904px]" data-name="Form Primary Column">
      <BackgroundBorder />
      <BackgroundBorder2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] w-full">
          <p className="leading-[28px]">Location Pin</p>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.59px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] w-full">
          <p className="leading-[15.6px]">Drag the pin to set exact coordinates.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7px] items-start pb-[25px] pt-[24px] px-[24px] relative size-full">
        <Heading5 />
        <Container38 />
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute inset-[42%]" data-name="Clip path group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7056 57.7056">
        <g id="Clip path group">
          <mask height="58" id="mask0_1_1469" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="58" x="0" y="0">
            <path d={svgPaths.p28fc8c80} fill="var(--fill-0, white)" id="Vector" />
          </mask>
          <g mask="url(#mask0_1_1469)">
            <path d={svgPaths.p38f35900} fill="var(--fill-0, #7168F6)" id="Vector_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function StitchPlaceholder300X300Svg() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[360.66px] top-1/2" data-name="stitch-placeholder-300x300.svg">
      <img alt="" className="absolute block inset-0 max-w-none size-full" height="360.66" src={imgStitchPlaceholder300X300Svg} width="360.66" />
      <ClipPathGroup />
    </div>
  );
}

function StitchPlaceholder300X300SvgClip() {
  return (
    <div className="absolute inset-[0_0.01px_0_0] overflow-clip" data-name="stitch-placeholder-300x300.svg clip">
      <StitchPlaceholder300X300Svg />
    </div>
  );
}

function PinMarker() {
  return (
    <div className="absolute bottom-1/2 content-stretch drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] flex flex-col items-start left-[44.45%] right-[44.45%] top-[36.5%]" data-name="Pin Marker">
      <div className="h-[33.333px] relative shrink-0 w-[26.667px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6667 33.3333">
          <path d={svgPaths.p19df3a60} fill="var(--fill-0, #EF4444)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p2bb32400} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Button:shadow" />
      <Container40 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[2px] relative shrink-0 w-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
        <g id="Container">
          <path d="M0 2V0H14V2H0V2" fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Button:shadow" />
      <Container41 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bottom-[16px] content-stretch flex flex-col gap-[8px] items-start right-[16.02px]" data-name="Container">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#dce9ff] h-[296.19px] min-h-[250px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <StitchPlaceholder300X300SvgClip />
        <PinMarker />
        <Container39 />
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Landmark / Station</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full">
          <p className="leading-[normal]">Central Station, East Concourse</p>
        </div>
      </div>
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-[#f8f9ff] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[33px] pr-[13px] py-[15px] relative size-full">
          <Container44 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bottom-1/4 content-stretch flex flex-col items-start left-[12px] top-1/4" data-name="Container">
      <div className="h-[19px] relative shrink-0 w-[16px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 19">
          <path d={svgPaths.p155d85e0} fill="var(--fill-0, #565E74)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input5 />
      <Container45 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[8.01px] items-start relative shrink-0 w-full" data-name="Container">
      <Label5 />
      <Container43 />
    </div>
  );
}

function Label6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-[0.59px] right-0 top-[-1px]" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Latitude</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-auto relative rounded-[inherit] size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#3d4a3d] text-[12px] top-[7px] tracking-[0.24px] w-[40.7px]">
          <p className="leading-[15.6px]">179</p>
        </div>
      </div>
    </div>
  );
}

function Input6() {
  return (
    <div className="absolute bg-[#e5eeff] left-0 right-0 rounded-[4px] top-[23.59px]" data-name="Input">
      <div className="content-stretch flex flex-col items-start overflow-clip px-[13px] py-[9px] relative rounded-[inherit] size-full">
        <Container48 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container47() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="Container">
      <Label6 />
      <Input6 />
    </div>
  );
}

function Label7() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-[0.59px] right-0 top-[-1px]" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Longitude</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[15.59px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-auto relative rounded-[inherit] size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[#3d4a3d] text-[12px] top-[7px] tracking-[0.24px] w-[44.93px]">
          <p className="leading-[15.6px]">79</p>
        </div>
      </div>
    </div>
  );
}

function Input7() {
  return (
    <div className="absolute bg-[#e5eeff] left-0 right-0 rounded-[4px] top-[23.59px]" data-name="Input">
      <div className="content-stretch flex flex-col items-start overflow-clip px-[13px] py-[9px] relative rounded-[inherit] size-full">
        <Container50 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container49() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="Container">
      <Label7 />
      <Input7 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[12px] h-[57.19px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container47 />
      <Container49 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12.01px] items-start p-[24px] relative size-full">
        <Container42 />
        <Container46 />
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#f8f9ff] min-h-[400px] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start min-h-[inherit] overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Background />
        <Background1 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function MapLocationColumn() {
  return (
    <div className="col-[8/span_5] content-stretch flex flex-col items-start justify-center justify-self-stretch relative row-1 self-start shrink-0" data-name="Map/Location Column">
      <BackgroundBorder4 />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[__591.56px_85px] h-[700.562px] left-0 right-0 top-[103px]" data-name="Form">
      <FormPrimaryColumn />
      <MapLocationColumn />
    </div>
  );
}

function Container51() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-57.14px)] size-[15px] top-[calc(50%-0.5px)]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p54b6980} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#22c55e] h-[48px] left-[731px] rounded-[8px] top-[1003px] w-[175.28px]" data-name="Button">
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] h-[48px] left-0 right-0 rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] top-1/2" data-name="Button:shadow" />
      <Container51 />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] left-[calc(50%+11.36px)] not-italic text-[14px] text-center text-white top-1/2 whitespace-nowrap">
        <p className="leading-[19.6px]">Update Details</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] h-[48px] items-center justify-center px-[25px] py-[13px] right-[167.97px] rounded-[8px] top-[calc(50%+497.5px)]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container52 />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Delete Stall</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[586.7px] top-[1003px]">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[1059px] max-w-[1000px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Form />
      <Group />
    </div>
  );
}

function MainCanvas() {
  return (
    <div className="h-[1140px] relative shrink-0 w-full z-[1]" data-name="Main - Canvas">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[48px] relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[1204px] isolate items-start min-w-px relative" data-name="Main Content Area">
      <HeaderTopAppBar />
      <MainCanvas />
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

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading />
      <Container56 />
    </div>
  );
}

function Container54() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background2 />
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container54 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[40px] px-[24px] relative size-full">
        <Container53 />
      </div>
    </div>
  );
}

function Container57() {
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

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Dashboard</p>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
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
    <div className="h-[18px] relative shrink-0 w-[20.094px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0939 18">
        <g id="Container">
          <path d={svgPaths.p725c500} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[19.6px]">Stall Management</p>
        </div>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative shrink-0 w-full" data-name="Item">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
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
          <path d={svgPaths.p5dfbb10} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Menu Items</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container61 />
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Container63() {
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

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Support/Onboarding</p>
      </div>
    </div>
  );
}

function Item3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container63 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function Container65() {
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

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Settings</p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container65 />
          <Container66 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Item />
        <Item1 />
        <Item2 />
        <Item3 />
        <Item4 />
      </div>
    </div>
  );
}

function Container68() {
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

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Logout</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="relative shrink-0 w-full" data-name="List → Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container68 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] relative size-full">
        <ListItem />
      </div>
    </div>
  );
}

function SideNavBar() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1204px] items-start justify-between left-0 pr-px py-[24px] top-0 w-[280px]" data-name="SideNavBar">
      <div aria-hidden className="absolute border-[#5c647a] border-r border-solid inset-0 pointer-events-none" />
      <Margin2 />
      <List />
      <Container67 />
    </div>
  );
}

export default function StallManagementLight() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Stall Management (Light)">
      <MainContentArea />
      <SideNavBar />
    </div>
  );
}