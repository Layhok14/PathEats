import svgPaths from "./svg-d2i04nbg4y";
import imgVendorProfileAvatar from "./e7fc7f76e55e9a6f8866aa739ab828f80d5471b8.png";
import imgVendorProfileAvatar1 from "./5ca851e66f74e55219ac0be53917ce61059b346e.png";
import imgImage4 from "./ef70e21ec0aaa2ffee26b321703893d006871c50.png";

function Container1() {
  return (
    <div className="h-[31.19px] relative shrink-0 w-[84px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] left-[-6px] not-italic text-[#006e2f] text-[24px] top-[15.09px] whitespace-nowrap">
          <p className="leading-[31.2px]">Settings</p>
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

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container3 />
        <Container4 />
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
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] w-full">
        <p className="leading-[24px]">Manage your vendor profile, preferences, and security.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container8 />
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
          <p className="leading-[28px]">Profile Information</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#f8f9ff] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25px] pt-[24px] px-[24px] relative size-full">
        <Heading1 />
      </div>
    </div>
  );
}

function VendorProfileAvatar1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Vendor profile avatar">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgVendorProfileAvatar1} />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p15b83880} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="absolute bg-[rgba(11,28,48,0.4)] inset-px opacity-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#e5eeff] relative rounded-[9999px] shrink-0 size-[96px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <VendorProfileAvatar1 />
        <Overlay />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center px-[17px] py-[13px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#22c55e] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[19.6px]">Change picture</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Button />
    </div>
  );
}

function Container10() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[24px] items-center justify-self-stretch pb-[16px] relative row-1 self-start shrink-0" data-name="Container">
      <BackgroundBorder />
      <Container12 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">First Name</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full">
          <p className="leading-[24px]">David</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[17px] py-[13px] relative size-full">
          <Container14 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container13() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[4.01px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label />
      <Input />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Last Name</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full">
          <p className="leading-[24px]">Chen</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[17px] py-[13px] relative size-full">
          <Container16 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[4.01px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Label1 />
      <Input1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Email Address</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] w-full">
          <p className="leading-[24px]">david.c@patheat-vendor.com</p>
        </div>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[17px] py-[13px] relative size-full">
          <Container18 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[0.24px] w-full">
        <p className="leading-[15.6px]">Contact support to change your primary email.</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container19 />
    </div>
  );
}

function Container17() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-3 self-start shrink-0" data-name="Container">
      <Label2 />
      <Input2 />
      <Margin />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Phone Number</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#eff4ff] relative rounded-bl-[8px] rounded-tl-[8px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-l border-solid border-t inset-0 pointer-events-none rounded-bl-[8px] rounded-tl-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[13.5px] pl-[17px] pr-[16px] pt-[12.5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] whitespace-nowrap">
            <p className="leading-[24px]">+1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] w-full">
          <p className="leading-[24px]">(555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-[#f8f9ff] flex-[1_0_0] min-w-px relative rounded-br-[8px] rounded-tr-[8px] self-stretch" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[17px] py-[13px] relative size-full">
          <Container22 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-br-[8px] rounded-tr-[8px]" />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex h-[50px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder1 />
      <Input3 />
    </div>
  );
}

function Container20() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[4px] items-start justify-self-stretch relative row-4 self-start shrink-0" data-name="Container">
      <Label3 />
      <Container21 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#22c55e] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Save Changes</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col items-start justify-self-stretch pt-[12px] relative row-5 self-start shrink-0" data-name="Container">
      <Button1 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_____181.59px_73.59px_97.19px_73.59px_55.59px] p-[24px] relative size-full">
        <Container10 />
        <Container13 />
        <Container15 />
        <Container17 />
        <Container20 />
        <Container23 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Container9 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20.05px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20.05">
        <g id="Container">
          <path d={svgPaths.p3f50100} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container24 />
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
          <p className="leading-[28px]">Notification Preferences</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-[#f8f9ff] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25px] pt-[24px] px-[24px] relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">New Order Alerts</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Receive an immediate push notification and sound alert for every new incoming order.</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[610.13px]" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Label4() {
  return <div className="bg-[#22c55e] h-[24px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[48px]" data-name="Container">
      <Label4 />
      <div className="absolute bg-white right-0 rounded-[9999px] size-[24px] top-0" data-name="Input">
        <div aria-hidden className="absolute border-4 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] pt-[4px] relative shrink-0 w-[56px]" data-name="Margin">
      <Container30 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Margin1 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Customer Review Alerts</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Get notified when a customer leaves a review or rating for your stall.</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[478.81px]" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Label5() {
  return <div className="bg-[#22c55e] h-[24px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[48px]" data-name="Container">
      <Label5 />
      <div className="absolute bg-white right-0 rounded-[9999px] size-[24px] top-0" data-name="Input">
        <div aria-hidden className="absolute border-4 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] pt-[4px] relative shrink-0 w-[56px]" data-name="Margin">
      <Container35 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container32 />
      <Margin2 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Daily Summary Email</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] whitespace-nowrap">
        <p className="leading-[19.6px]">Receive a daily email wrap-up of total sales, top items, and traffic metrics.</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[524.02px]" data-name="Container">
      <Container38 />
      <Container39 />
    </div>
  );
}

function Label6() {
  return <div className="bg-[#22c55e] h-[24px] relative rounded-[9999px] shrink-0 w-full" data-name="Label" />;
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[48px]" data-name="Container">
      <Label6 />
      <div className="absolute bg-white right-0 rounded-[9999px] size-[24px] top-0" data-name="Input">
        <div aria-hidden className="absolute border-4 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[8px] pt-[4px] relative shrink-0 w-[56px]" data-name="Margin">
      <Container40 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Margin3 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
        <Container26 />
        <div className="bg-[rgba(188,203,185,0.5)] h-px relative shrink-0 w-full" data-name="Horizontal Divider" />
        <Container31 />
        <div className="bg-[rgba(188,203,185,0.5)] h-px relative shrink-0 w-full" data-name="Horizontal Divider" />
        <Container36 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder1 />
        <Container25 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[21px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
        <g id="Container">
          <path d={svgPaths.p12930f00} fill="var(--fill-0, #22C55E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container41 />
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[20px] whitespace-nowrap">
          <p className="leading-[28px]">Security</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder2() {
  return (
    <div className="bg-[#f8f9ff] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[25px] pt-[24px] px-[24px] relative size-full">
        <Heading3 />
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Current Password</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">••••••••</p>
        </div>
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[17px] relative size-full">
          <Container44 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container43() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[4.01px] items-start justify-self-stretch max-w-[448px] relative row-1 self-start shrink-0" data-name="Container">
      <Label7 />
      <Input4 />
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">New Password</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">Min. 8 characters</p>
        </div>
      </div>
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-[#f8f9ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[17px] relative size-full">
          <Container46 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start max-w-[448px] relative shrink-0 w-full" data-name="Container">
      <Label8 />
      <Input5 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col items-start justify-self-stretch max-w-[448px] pt-[11px] relative row-2 self-start shrink-0" data-name="Margin">
      <Container45 />
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] w-full">
        <p className="leading-[19.6px]">Confirm New Password</p>
      </div>
    </div>
  );
}

function Input6() {
  return (
    <div className="bg-[#f8f9ff] h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container47() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col gap-[4.01px] items-start justify-self-stretch max-w-[448px] relative row-3 self-start shrink-0" data-name="Container">
      <Label9 />
      <Input6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#0b1c30] content-stretch flex items-center justify-center px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[19.6px]">Update Password</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col items-start justify-self-stretch pt-[12px] relative row-4 self-start shrink-0" data-name="Container">
      <Button2 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[____73.59px_85.59px_73.59px_55.59px] p-[24px] relative size-full">
        <Container43 />
        <Margin4 />
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder2 />
        <Container42 />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[896px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
    </div>
  );
}

function Main() {
  return (
    <div className="bg-[#f8f9ff] flex-[1_0_0] min-h-px relative w-full z-[1]" data-name="Main">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[53.89px] pt-[47px] px-[52px] relative size-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-full isolate items-start min-h-[1892px] relative shrink-0 w-[1000px]" data-name="Container">
      <HeaderTopAppBar />
      <Main />
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

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[15.6px]">Vendor Portal</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[85px]" data-name="Container">
      <Heading />
      <Container53 />
    </div>
  );
}

function Container51() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background />
          <Container52 />
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container51 />
    </div>
  );
}

function Heading4() {
  return <div className="h-[29.8px] mb-[-1px] relative shrink-0 w-full" data-name="Heading 2" />;
}

function Container55() {
  return <div className="h-[20.59px] relative shrink-0 w-full" data-name="Container" />;
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container55 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[15px] relative shrink-0 w-full" data-name="Margin">
      <Container54 />
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[24px] relative size-full">
        <Container50 />
        <Margin6 />
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[82px] mb-[-22px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container49 />
      </div>
    </div>
  );
}

function Container56() {
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

function Container57() {
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
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container56 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link:margin">
      <div className="content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link />
      </div>
    </div>
  );
}

function Container58() {
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

function Container59() {
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
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container58 />
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link:margin">
      <div className="content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link1 />
      </div>
    </div>
  );
}

function Container60() {
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

function Container61() {
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
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container60 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link:margin">
      <div className="content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link2 />
      </div>
    </div>
  );
}

function Container62() {
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

function Container63() {
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
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container62 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link:margin">
      <div className="content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link3 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p136d3100} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[19.59px] relative shrink-0 w-[57.27px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] left-0 not-italic text-[14px] text-white top-[9px] whitespace-nowrap">
          <p className="leading-[19.6px]">Settings</p>
        </div>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="bg-[rgba(63,70,92,0.2)] relative rounded-br-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border-[#22c55e] border-l-4 border-solid inset-0 pointer-events-none rounded-br-[8px] rounded-tr-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container64 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link:margin">
      <div className="content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link4 />
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px relative w-full" data-name="Nav">
      <LinkMargin />
      <LinkMargin1 />
      <LinkMargin2 />
      <LinkMargin3 />
      <LinkMargin4 />
    </div>
  );
}

function NavMargin() {
  return (
    <div className="h-[1695px] mb-[-22px] relative shrink-0 w-full" data-name="Nav:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[24px] relative size-full">
        <Nav />
      </div>
    </div>
  );
}

function Container67() {
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

function Container68() {
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
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative size-full">
          <Container67 />
          <Container68 />
        </div>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[102px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] relative size-full">
        <Link5 />
      </div>
    </div>
  );
}

function Aside() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1892px] items-start left-0 pr-px py-[24px] top-0 w-[280px]" data-name="Aside">
      <div aria-hidden className="absolute border-[#5c647a] border-r border-solid inset-0 pointer-events-none" />
      <Margin5 />
      <NavMargin />
      <Container66 />
    </div>
  );
}

export default function SettingsLight() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[280px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Settings (Light)">
      <Container />
      <Aside />
    </div>
  );
}