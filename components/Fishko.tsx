import Image from "next/image";
import type { StaticImageData } from "next/image";
import { BadgeCheck } from "lucide-react";
import fishkoImage from "@/assets/Fishko.png";
import fishkoSmallImage from "@/assets/Fishko-s.png";
import fishko1 from "@/assets/Fishko-1.png";
import fishko2 from "@/assets/Fishko-2.png";
import fishko3 from "@/assets/Fishko-3.png";
import fishko4 from "@/assets/Fishko-4.png";
import fishko5 from "@/assets/Fishko-5.png";
import fishko6 from "@/assets/Fishko-6.png";
import fishko7 from "@/assets/Fishko-7.png";
import fishko8 from "@/assets/Fishko-8.png";
import fishko9 from "@/assets/Fishko-9.png";
import fishko10 from "@/assets/Fishko-10.png";
import fishko11 from "@/assets/Fishko-11.png";
import fishko12 from "@/assets/Fishko-12.png";
import logoImage from "@/assets/SpottheFish.png";

export const fishkoVariants = [
  fishko1,
  fishko2,
  fishko3,
  fishko4,
  fishko5,
  fishko6,
  fishko7,
  fishko8,
  fishko9,
  fishko10,
  fishko11,
  fishko12,
];

export function Fishko({
  className = "",
  image = fishkoImage,
  priority = false,
}: {
  className?: string;
  image?: StaticImageData;
  priority?: boolean;
}) {
  return (
    <div className={`mx-auto flex h-32 w-32 items-center justify-center overflow-visible sm:h-44 sm:w-44 lg:h-72 lg:w-72 ${className}`} aria-label="Фішко, синя рибка-детектив">
      <Image
        src={image}
        alt="Фішко, синя рибка-детектив з лупою"
        width={800}
        height={800}
        sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 360px"
        quality={100}
        unoptimized
        className="h-full w-full scale-[1.2] object-contain drop-shadow-[0_18px_26px_rgba(29,155,240,0.18)]"
        priority={priority}
      />
    </div>
  );
}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="relative h-10 w-10 shrink-0 lg:h-12 lg:w-12">
        <Image
          src={fishkoSmallImage}
          alt="Spot the Fish"
          fill
          sizes="48px"
          quality={100}
          unoptimized
          className="object-contain drop-shadow-[0_4px_0_rgba(11,117,201,0.25)]"
        />
      </div>
    );
  }

  return (
    <div className="relative h-28 w-[360px]">
      <Image
        src={logoImage}
        alt="Spot the Fish"
        fill
        sizes="360px"
        quality={100}
        unoptimized
        className="object-contain"
      />
    </div>
  );
}

export function MascotPanel({ tip, title = "Підказка Фішка", image }: { tip: string; title?: string; image?: StaticImageData }) {
  return (
    <aside className="fish-card p-4 sm:p-6">
      <Fishko image={image} />
      <div className="mt-2 rounded-2xl bg-fish-light p-4 sm:rounded-3xl sm:p-5">
        <div className="mb-2 flex items-center gap-2 font-extrabold text-fish-dark">
          <BadgeCheck size={20} aria-hidden />
          {title}
        </div>
        <p className="text-lg font-bold leading-relaxed text-fish-text">{tip}</p>
      </div>
    </aside>
  );
}
