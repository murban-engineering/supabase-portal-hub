interface BrandWordmarkProps {
  className?: string;
  murbanClassName?: string;
  engineeringClassName?: string;
}

const BrandWordmark = ({
  className = "",
  murbanClassName = "",
  engineeringClassName = "",
}: BrandWordmarkProps) => {
  return (
    <span
      className={`brand-wordmark inline-flex flex-col leading-none uppercase ${className}`}
      aria-label="MURBAN ENGINEERING LTD"
    >
      <span
        className={`brand-wordmark__murban font-bold text-[#A60D0F] ${murbanClassName}`}
      >
        MURBAN
      </span>
      <span
        className={`brand-wordmark__engineering font-light text-[#213164] ${engineeringClassName}`}
      >
        ENGINEERING LTD
      </span>
    </span>
  );
};

export default BrandWordmark;
