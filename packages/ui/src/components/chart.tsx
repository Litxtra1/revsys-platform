"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart(): ChartContextValue {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer>");
  }
  return context;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const reactId = React.useId().replace(/:/g, "");
    const chartId = `chart-${id ?? reactId}`;

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-chart={chartId}
          className={cn(
            "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, cfg]) => cfg.color);
  if (entries.length === 0) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart='${id}'] {\n${entries
          .map(([key, cfg]) => `  --color-${key}: ${cfg.color};`)
          .join("\n")}\n}`,
      }}
    />
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

type RechartsTooltipProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip>;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  RechartsTooltipProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof RechartsTooltipProps>
>(({ active, payload, label, className }, ref) => {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-soft-md",
        className
      )}
    >
      {label ? <div className="font-medium">{label}</div> : null}
      {payload.map((item, index) => {
        const key = String(item.dataKey ?? item.name ?? index);
        const itemConfig = config[key];
        return (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";
