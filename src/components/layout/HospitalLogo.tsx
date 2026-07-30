interface HospitalLogoProps {
  className?: string;
}

export default function HospitalLogo({ className = "w-12 h-12" }: HospitalLogoProps) {
  return (
    <img
      src="/images/logo/Logo_bqn.png"
      alt="BVĐK Quảng Nam"
      className={`${className} object-contain`}
    />
  );
}
