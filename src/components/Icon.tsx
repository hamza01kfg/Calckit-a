type Props = {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
};

/** UI icon from /icons/ui/{name}.svg */
export function UiIcon({ name, size = 18, className = "", alt = "" }: Props) {
  return (
    <img
      src={`/icons/ui/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={`ui-icon ${className}`.trim()}
      draggable={false}
    />
  );
}

/** Tool icon from /icons/tools/ or custom src */
export function ToolIcon({
  src,
  size = 40,
  className = "",
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`tool-icon-img ${className}`.trim()}
      loading="lazy"
      draggable={false}
    />
  );
}

export function BrandLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/icons/icon.svg"
      alt="CalcKit"
      width={size}
      height={size}
      className="brand-logo"
      draggable={false}
    />
  );
}
