import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, light }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <div className="eyebrow mb-4 justify-center">{eyebrow}</div>}
      <h2 className={cn("h-section", light && "text-white")}>{title}</h2>
      {description && (
        <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-white/70" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
