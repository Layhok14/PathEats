import svgPaths from "./svg-2f13z46yby";
import imgAb6AXuBxEtRuQbqrDsmUA14OzqxbmBmIjAfSlRclGq5JpaXdvEjUfkDhr3OGFdsoTAdnATnvmozwPfJpksoWmCknHbscfwy08DUb512VrEbpSbOl2ZvHmzs2HYp0UPAisUnCocbm51TbYuYScF7H7Lnp1QqwtQWl8AdEyTrwtXUFBys1ONLCbCu0CtNCtmn82GQfBaHdhqKeAoKfrYqmjfLqLna5S1HjkluGIqIxC02H7RCuY7XcoRzAr6IFf7X0HNgyjTe from "./c81043119be301320d9645c634cc97a6a4aa9f91.png";
import imgAb6AXuDmEk1WrYCeu1HDfiN3Hfi8WQdVbIYB0Sm0Fb1AQc12AxqJ9WucipVygDm13BHvgMmS14UgIb79KgSFfvntG5EQhfJAvuWeIpWXoqkU6O4BWAmPjTcsu226MbrWwkWKggNgp2Q1Uy9Hz5XzvAcNicJzQqxCrOwxIcPj1BmB4FWqO6AzrfJxEn1E2PqLa0Y1PyYro3MZtcbnZrcsdkJgLysbovvWdz6UyRiQ557QFrY8YSYgXqivRlJMd40AwvejFZv6Y from "./7a4f22468d7f1cba987d731daf5f4347ba9f63a2.png";
import imgAb6AXuCdruLfyiRv9HkzhvjB1S9O8EPn01WbpXecuQLy4Rfs15LD4OBCzaVx3IWmHNzdNxjNfHcKOxifAjZr4LM5DRqinpfrlPhTkqlIKydyCury9BixKakZAqdGiApqa5FLye3LxTfCTeg8JivIQsYxHIgUap4Ome2AEkKZbNkGsfR7FaFsi7QNLvZs7Vz8Dg6FqWowVx8FvEVih7HWjUh6HavDkz3Fb5374J7Xobh9OtNcdrIkgBUtsArgp5Dz1FtJot814Tw from "./aeb4e6979318b574b9164fab73d257f6002bc7cd.png";
import imgAdministratorProfile from "./90f36bf945febc5bdfcf6dee2d99f81abaa03f41.png";
import imgPathEatLogo from "./8f3b2ce436ac82121a8c2823643cbcb4082b1784.png";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">User Management</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Monitor platform activity and manage member access permissions.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[508.02px]" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p1d25a580} fill="var(--fill-0, #3D4A3D)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[17px] py-[11px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container3 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Export CSV</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p1e861900} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#006e2f] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center px-[20px] py-[11px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Add New User</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Page Header">
      <Container />
      <Container2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">TOTAL USERS</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">12,482</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[103.44px]" data-name="Container">
      <Container7 />
      <Heading1 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="h-[36px] relative shrink-0 w-[48px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 36">
        <g id="Overlay">
          <rect fill="var(--fill-0, #006E2F)" fillOpacity="0.1" height="36" rx="8" width="48" />
          <path d={svgPaths.p130c5ba0} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container6 />
        <Overlay />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[7px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7">
        <g id="Container">
          <path d={svgPaths.pde19380} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">+8.4% from last month</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function TotalUsersCard() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Total Users Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
          <Container5 />
          <Container8 />
          <div className="absolute bg-[#22c55e] bottom-px left-px top-px w-[6px]" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIVE NOW</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">1,204</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[84.67px]" data-name="Container">
      <Container13 />
      <Heading2 />
    </div>
  );
}

function Overlay1() {
  return (
    <div className="h-[44px] relative shrink-0 w-[40px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 44">
        <g id="Overlay">
          <rect fill="var(--fill-0, #005AC2)" fillOpacity="0.1" height="44" rx="8" width="40" />
          <path d={svgPaths.p3225fd00} fill="var(--fill-0, #005AC2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container12 />
        <Overlay1 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Live platform traffic</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <Container15 />
      </div>
    </div>
  );
}

function ActiveNowCard() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Active Now Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
          <Container11 />
          <Container14 />
          <div className="absolute bg-[#005ac2] bottom-px left-px top-px w-[6px]" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">PENDING APPROVAL</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">84</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[130.19px]" data-name="Container">
      <Container18 />
      <Heading3 />
    </div>
  );
}

function Overlay2() {
  return (
    <div className="h-[45px] relative shrink-0 w-[43px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 45">
        <g id="Overlay">
          <rect fill="var(--fill-0, #F59E0B)" fillOpacity="0.1" height="45" rx="8" width="43" />
          <path d={svgPaths.p268e6b00} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container17 />
        <Overlay2 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[2.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 10.5">
        <g id="Container">
          <path d={svgPaths.p24ced440} fill="var(--fill-0, #F59E0B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Requires immediate review</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function PendingApprovalCard() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Pending Approval Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
          <Container16 />
          <Container19 />
          <div className="absolute bg-[#f59e0b] bottom-px left-px top-px w-[6px]" data-name="Background" />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function BentoMetricsSection() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_154px] relative shrink-0 w-full" data-name="Bento Metrics Section">
      <TotalUsersCard />
      <ActiveNowCard />
      <PendingApprovalCard />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(0,110,47,0.05)] content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">All Members</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Students</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Vendors</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Commuters</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <Button2 />
        <Button3 />
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Showing 10 of 12,482</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p10965ac0} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="var(--fill-0, #0B1C30)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container27 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-start relative shrink-0" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <Container25 />
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container24 />
        <Margin />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative size-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative shrink-0 w-[251.06px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">USER</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative shrink-0 w-[253.33px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">EMAIL ADDRESS</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative shrink-0 w-[138.8px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">ROLE</p>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="relative shrink-0 w-[137.63px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">STATUS</p>
        </div>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="relative shrink-0 w-[173.19px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] text-right tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">ACTIONS</p>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header → Row">
      <div aria-hidden className="absolute border-[#bccbb9] border-b border-solid inset-0 pointer-events-none" />
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
    </div>
  );
}

function Ab6AXuBxEtRuQbqrDsmUA14OzqxbmBmIjAfSlRclGq5JpaXdvEjUfkDhr3OGFdsoTAdnATnvmozwPfJpksoWmCknHbscfwy08DUb512VrEbpSbOl2ZvHmzs2HYp0UPAisUnCocbm51TbYuYScF7H7Lnp1QqwtQWl8AdEyTrwtXUFBys1ONLCbCu0CtNCtmn82GQfBaHdhqKeAoKfrYqmjfLqLna5S1HjkluGIqIxC02H7RCuY7XcoRzAr6IFf7X0HNgyjTe() {
  return (
    <div className="max-w-[203.05999755859375px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="AB6AXuBxETRuQbqrDsm_uA1_4ozqxbmBMIjAf_slRclGQ5_JpaXdvEjUFKDhr3oG_FdsoTAdnATnvmozwPFJpksoWMCknHBSCFWY08DUb512VREbpSbOl2ZVHmzs2HYp0uPAisUNCocbm51TBYuYScF7h7LNP1qqwtQWl8AdEYTrwtX_u_FBys1o-nLCbCu0CtNCtmn82GQfBaHDHQKe-AOKfr-YQMJFLqLNA5-s1HjkluG-IQIxC02H7RCuY7xcoRzAr6iFf7x0hNgyjTE">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuBxEtRuQbqrDsmUA14OzqxbmBmIjAfSlRclGq5JpaXdvEjUfkDhr3OGFdsoTAdnATnvmozwPfJpksoWmCknHbscfwy08DUb512VrEbpSbOl2ZvHmzs2HYp0UPAisUnCocbm51TbYuYScF7H7Lnp1QqwtQWl8AdEyTrwtXUFBys1ONLCbCu0CtNCtmn82GQfBaHdhqKeAoKfrYqmjfLqLna5S1HjkluGIqIxC02H7RCuY7XcoRzAr6IFf7X0HNgyjTe} />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Sarah Jenkins</p>
      </div>
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[203.06px]" data-name="Data">
      <Ab6AXuBxEtRuQbqrDsmUA14OzqxbmBmIjAfSlRclGq5JpaXdvEjUfkDhr3OGFdsoTAdnATnvmozwPfJpksoWmCknHbscfwy08DUb512VrEbpSbOl2ZvHmzs2HYp0UPAisUnCocbm51TbYuYScF7H7Lnp1QqwtQWl8AdEyTrwtXUFBys1ONLCbCu0CtNCtmn82GQfBaHdhqKeAoKfrYqmjfLqLna5S1HjkluGIqIxC02H7RCuY7XcoRzAr6IFf7X0HNgyjTe />
      <Container28 />
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative shrink-0 w-[277.33px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">sarah.j@university.edu</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex items-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e40af] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Student</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative shrink-0 w-[138.8px]" data-name="Data">
      <Background />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Active</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container30 />
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[28.5px] relative shrink-0 w-[137.63px]" data-name="Data">
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p287f7a80} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container31 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[3.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 13.3333">
        <g id="Container">
          <path d={svgPaths.p246f4800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container33 />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end pl-[23.99px] relative shrink-0 w-[149.18px]" data-name="Data">
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">GT</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Green Thai Kitchen</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[203.06px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Overlay3 />
        <Container34 />
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[277.33px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">orders@greenthai.com</p>
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex items-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#166534] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Vendor</p>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[138.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <Background1 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Pending</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#f59e0b] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container36 />
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[137.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[28.5px] relative size-full">
        <Container35 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p6e98980} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container37 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container38 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[3.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 13.3333">
        <g id="Container">
          <path d={svgPaths.p246f4800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container39 />
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[149.18px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[23.99px] relative size-full">
        <Button11 />
        <Button12 />
        <Button13 />
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 2">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data5 />
      <Data6 />
      <Data7 />
      <Data8 />
      <Data9 />
    </div>
  );
}

function Ab6AXuDmEk1WrYCeu1HDfiN3Hfi8WQdVbIYB0Sm0Fb1AQc12AxqJ9WucipVygDm13BHvgMmS14UgIb79KgSFfvntG5EQhfJAvuWeIpWXoqkU6O4BWAmPjTcsu226MbrWwkWKggNgp2Q1Uy9Hz5XzvAcNicJzQqxCrOwxIcPj1BmB4FWqO6AzrfJxEn1E2PqLa0Y1PyYro3MZtcbnZrcsdkJgLysbovvWdz6UyRiQ557QFrY8YSYgXqivRlJMd40AwvejFZv6Y() {
  return (
    <div className="max-w-[203.05999755859375px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="AB6AXuDMEk1wrYCeu1hDFI-n3_-hfi8wQDVbI_yB0sm0FB1aQC12axqJ9WUCIPVygDm13bHVGMm-S14ugIB79KgSFfvntG5EQhfJAvuWEIpWXoqkU-6o4bW_AMPjTCSU226MBRWwkWKggNgp2q1Uy9HZ5XzvACNicJzQQXCrOWXIcPj1bmB4FWqO6AZRF_JxEn1E2PQLa0y1PYYro3MZtcbnZrcsdkJgLYSBOVVWdz6uyRiQ557qFrY8ySYgXQIV-rlJMd40AWVEJ_fZV6Y">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuDmEk1WrYCeu1HDfiN3Hfi8WQdVbIYB0Sm0Fb1AQc12AxqJ9WucipVygDm13BHvgMmS14UgIb79KgSFfvntG5EQhfJAvuWeIpWXoqkU6O4BWAmPjTcsu226MbrWwkWKggNgp2Q1Uy9Hz5XzvAcNicJzQqxCrOwxIcPj1BmB4FWqO6AzrfJxEn1E2PqLa0Y1PyYro3MZtcbnZrcsdkJgLysbovvWdz6UyRiQ557QFrY8YSYgXqivRlJMd40AwvejFZv6Y} />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Michael Chen</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[203.06px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Ab6AXuDmEk1WrYCeu1HDfiN3Hfi8WQdVbIYB0Sm0Fb1AQc12AxqJ9WucipVygDm13BHvgMmS14UgIb79KgSFfvntG5EQhfJAvuWeIpWXoqkU6O4BWAmPjTcsu226MbrWwkWKggNgp2Q1Uy9Hz5XzvAcNicJzQqxCrOwxIcPj1BmB4FWqO6AzrfJxEn1E2PqLa0Y1PyYro3MZtcbnZrcsdkJgLysbovvWdz6UyRiQ557QFrY8YSYgXqivRlJMd40AwvejFZv6Y />
        <Container40 />
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[277.33px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">m.chen@logistics.com</p>
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex items-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Commuter</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[138.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <Background2 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Active</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container42 />
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[137.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[28.5px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p287f7a80} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container43 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container44 />
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[3.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 13.3333">
        <g id="Container">
          <path d={svgPaths.p246f4800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container45 />
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[149.18px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[23.99px] relative size-full">
        <Button14 />
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data10 />
      <Data11 />
      <Data12 />
      <Data13 />
      <Data14 />
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(86,94,116,0.2)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">DW</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">David Wilson</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[203.06px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Overlay4 />
        <Container46 />
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[277.33px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[27px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">d.wilson@suspended.com</p>
        </div>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex items-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e40af] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Student</p>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[138.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[26.5px] relative size-full">
        <Background3 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Suspended</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#ef4444] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container48 />
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[137.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[28.5px] relative size-full">
        <Container47 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p6e98980} fill="var(--fill-0, #006E2F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container49 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container50 />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[3.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 13.3333">
        <g id="Container">
          <path d={svgPaths.p246f4800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container51 />
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[149.18px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[23.99px] relative size-full">
        <Button17 />
        <Button18 />
        <Button19 />
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="bg-[rgba(254,242,242,0.2)] content-stretch flex items-center justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 4">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data15 />
      <Data16 />
      <Data17 />
      <Data18 />
      <Data19 />
    </div>
  );
}

function Ab6AXuCdruLfyiRv9HkzhvjB1S9O8EPn01WbpXecuQLy4Rfs15LD4OBCzaVx3IWmHNzdNxjNfHcKOxifAjZr4LM5DRqinpfrlPhTkqlIKydyCury9BixKakZAqdGiApqa5FLye3LxTfCTeg8JivIQsYxHIgUap4Ome2AEkKZbNkGsfR7FaFsi7QNLvZs7Vz8Dg6FqWowVx8FvEVih7HWjUh6HavDkz3Fb5374J7Xobh9OtNcdrIkgBUtsArgp5Dz1FtJot814Tw() {
  return (
    <div className="max-w-[203.05999755859375px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="AB6AXuCDRULfyiRv9HkzhvjB1S9o8ePN01wbpXECU--qLy4Rfs15lD4oB-czaVX3IWmHNzdNxj-NFHcKOxif-AjZR4lM5dRqinpfrlPHTkqlIKydyCURY9BixKakZAqdGIApqa5fLYE3LXTfCTeg8jiv-IQsYxHIgUAP4Ome2AEkKZbNkGsfR7FaFsi7qNLvZS7VZ8dg6FqWowVX8FV_EVih7h_WJUh6HavDkz3Fb5374J7XOBH9OTNcdrIkgBUtsARGP5dz1FtJOT814tw">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuCdruLfyiRv9HkzhvjB1S9O8EPn01WbpXecuQLy4Rfs15LD4OBCzaVx3IWmHNzdNxjNfHcKOxifAjZr4LM5DRqinpfrlPhTkqlIKydyCury9BixKakZAqdGiApqa5FLye3LxTfCTeg8JivIQsYxHIgUap4Ome2AEkKZbNkGsfR7FaFsi7QNLvZs7Vz8Dg6FqWowVx8FvEVih7HWjUh6HavDkz3Fb5374J7Xobh9OtNcdrIkgBUtsArgp5Dz1FtJot814Tw} />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Elena Rodriguez</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[203.06px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Ab6AXuCdruLfyiRv9HkzhvjB1S9O8EPn01WbpXecuQLy4Rfs15LD4OBCzaVx3IWmHNzdNxjNfHcKOxifAjZr4LM5DRqinpfrlPhTkqlIKydyCury9BixKakZAqdGiApqa5FLye3LxTfCTeg8JivIQsYxHIgUap4Ome2AEkKZbNkGsfR7FaFsi7QNLvZs7Vz8Dg6FqWowVx8FvEVih7HWjUh6HavDkz3Fb5374J7Xobh9OtNcdrIkgBUtsArgp5Dz1FtJot814Tw />
        <Container52 />
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[277.33px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26.5px] pl-[48px] pr-[24px] pt-[26px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">elena.rod@campus-eats.biz</p>
        </div>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex items-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#166534] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Vendor</p>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[138.8px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[26px] pt-[26.5px] px-[24px] relative size-full">
        <Background4 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#006e2f] text-[12px] tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Active</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#006e2f] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container54 />
    </div>
  );
}

function Data23() {
  return (
    <div className="relative shrink-0 w-[137.63px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28px] pt-[28.5px] px-[24px] relative size-full">
        <Container53 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
        <g id="Container">
          <path d={svgPaths.p287f7a80} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container56 />
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[3.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 13.3333">
        <g id="Container">
          <path d={svgPaths.p246f4800} fill="var(--fill-0, #565E74)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[6px] relative shrink-0" data-name="Button">
      <Container57 />
    </div>
  );
}

function Data24() {
  return (
    <div className="relative shrink-0 w-[149.18px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[23.99px] relative size-full">
        <Button20 />
        <Button21 />
        <Button22 />
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-center justify-center pt-px relative shrink-0 w-full" data-name="Row 5">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data20 />
      <Data21 />
      <Data22 />
      <Data23 />
      <Data24 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <Row />
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Page 1 of 1,248</p>
        </div>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-50 px-[17px] py-[9px] relative rounded-[6px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Previous</p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[6px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Next</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.01px] items-start relative size-full">
        <Button23 />
        <Button24 />
      </div>
    </div>
  );
}

function FooterPagination() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Footer Pagination">
      <div aria-hidden className="absolute border-[#bccbb9] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[24px] pt-[25px] px-[24px] relative size-full">
          <Container58 />
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function DataTableSection() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Data Table Section">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Table />
        <FooterPagination />
      </div>
      <div aria-hidden className="absolute border border-[#bccbb9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="max-w-[1440px] relative shrink-0 w-full" data-name="Main Content Canvas">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] p-[32px] relative size-full">
        <PageHeader />
        <BentoMetricsSection />
        <DataTableSection />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
        <p className="leading-[normal]">Search system logs, users, or restaurants...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[10px] pl-[40px] pr-[16px] pt-[9px] relative size-full">
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
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

function Container60() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Input />
        <Container62 />
      </div>
    </div>
  );
}

function Container64() {
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

function Button25() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Container64 />
        <div className="absolute bg-[#ef4444] right-[-0.02px] rounded-[9999px] size-[8px] top-0" data-name="Background" />
      </div>
    </div>
  );
}

function Container65() {
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

function Button26() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Container65 />
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="content-stretch flex gap-[16px] items-center pr-[25px] relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-r border-solid inset-0 pointer-events-none" />
      <Button25 />
      <Button26 />
    </div>
  );
}

function Container66() {
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

function Button27() {
  return (
    <div className="bg-[#006e2f] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container66 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Add Vendor</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] text-right tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Alex Rivera</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#3d4a3d] text-[12px] text-right tracking-[0.24px] whitespace-nowrap">
        <p className="leading-[16px]">Admin</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[77.38px]" data-name="Container">
      <Container69 />
      <Container70 />
    </div>
  );
}

function AdministratorProfile() {
  return (
    <div className="max-w-[40px] relative shrink-0 size-[40px]" data-name="Administrator Profile">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAdministratorProfile} />
      </div>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#22c55e] content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shadow-[0px_0px_0px_2px_rgba(0,110,47,0.2)] shrink-0 size-[40px]" data-name="Background+Shadow">
      <AdministratorProfile />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-center pl-[16px] relative shrink-0" data-name="Container">
      <Container68 />
      <BackgroundShadow />
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <VerticalBorder />
        <Button27 />
        <Container67 />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div className="absolute bg-[#f8f9ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-[260px] pb-px px-[32px] top-0 w-[1020px]" data-name="Header - Top Navigation Bar">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <Container60 />
      <Container63 />
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

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6bff8f] text-[20px] w-full">
        <p className="leading-[28px]">PathEat Admin</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.6)] w-full">
        <p className="leading-[20px]">Management Portal</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container73 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] relative size-full">
        <PathEatLogo />
        <Container72 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[40px] relative size-full">
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
          <path d={svgPaths.p20793584} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Dashboard</p>
      </div>
    </div>
  );
}

function LinkDashboard() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link - Dashboard">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container74 />
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
          <p className="leading-[20px]">User Management</p>
        </div>
      </div>
    </div>
  );
}

function LinkUserManagementActive() {
  return (
    <div className="bg-[rgba(0,110,47,0.1)] relative shrink-0 w-full" data-name="Link - User Management Active">
      <div aria-hidden className="absolute border-[#006e2f] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[28px] pr-[24px] py-[12px] relative size-full">
          <Container76 />
          <Container77 />
        </div>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20.094px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0939 18">
        <g id="Container">
          <path d={svgPaths.p209d4440} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Restaurant Management</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
          <Container78 />
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Container80() {
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

function Container81() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Complaints</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
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
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #BEC6E0)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[12px] relative size-full">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <LinkDashboard />
        <LinkUserManagementActive />
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container84() {
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

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(190,198,224,0.7)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Support</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center py-[12px] relative size-full">
        <Container84 />
        <Container85 />
      </div>
    </div>
  );
}

function Container86() {
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

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(239,68,68,0.8)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[20px]">Logout</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center py-[12px] relative size-full">
        <Container86 />
        <Container87 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-[25px] px-[24px] relative size-full">
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <HorizontalBorder />
      </div>
    </div>
  );
}

function AsideFixedSideNavigation() {
  return (
    <div className="absolute bg-[#004b1e] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px py-[24px] top-0 w-[260px]" data-name="Aside - Fixed Side Navigation">
      <div aria-hidden className="absolute border-[rgba(188,203,185,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Margin1 />
      <Nav />
      <Margin2 />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[15px] pl-[260px] pt-[96px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContentCanvas />
      <HeaderTopNavigationBar />
      <AsideFixedSideNavigation />
    </div>
  );
}