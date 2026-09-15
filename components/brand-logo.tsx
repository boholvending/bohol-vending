import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="brand-lockup" aria-hidden="true">
      <Image
        className="brand-logo-image"
        src="/images/brand/bohol-nav-mark.png"
        alt=""
        width={192}
        height={192}
        priority
      />
      <span>
        BOHOL<small>VENDING TECHNOLOGY</small>
      </span>
    </span>
  );
}
