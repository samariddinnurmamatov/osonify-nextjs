import { memo } from "react";
import { cn } from "@/shared/lib/utils";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  /** Whether the layout should be fixed height (uses flexbox) */
  fixed?: boolean;
  /** Whether the content should be fluid (no max-width constraint) */
  fluid?: boolean;
};

/**
 * Main content area component
 * 
 * Provides consistent layout and spacing for page content.
 * Supports both fixed and fluid layout modes with responsive container queries.
 * 
 * @param props - Standard HTML main element props plus layout options
 * 
 * @example
 * ```tsx
 * <Main fixed>
 *   <PageContent />
 * </Main>
 * 
 * <Main fluid>
 *   <FullWidthContent />
 * </Main>
 * ```
 */
export const Main = memo(function Main({
  fixed,
  className,
  fluid,
  ...props
}: MainProps) {
  return (
    <main
      data-layout={fixed ? "fixed" : "auto"}
      className={cn(
        "px-4",
        // If layout is fixed, make the main container flex and grow
        fixed && "flex grow flex-col overflow-hidden",
        // If layout is not fluid, set the max-width using container queries
        !fluid &&
          "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
        className
      )}
      {...props}
    />
  );
});

