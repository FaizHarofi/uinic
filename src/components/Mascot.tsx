import Image from 'next/image';

export type MascotPose =
  | 'main'
  | 'investigating'
  | 'alert'
  | 'thinking'
  | 'hint'
  | 'success'
  | 'completion'
  | 'avatar';

export function Mascot({ name, alt, className, style }: { name: MascotPose; alt: string; className?: string; style?: React.CSSProperties }) {
  return (
    <Image
      src={`/assets/mascot/${name}.svg`}
      alt={alt}
      width={200}
      height={200}
      unoptimized
      draggable={false}
      className={className}
      style={style}
    />
  );
}
