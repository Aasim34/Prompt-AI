import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export function PageHeader({
  title,
  subtitle,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <section
      className={cn("w-full py-16 md:py-20 bg-background", className)}
      {...props}
    >
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
