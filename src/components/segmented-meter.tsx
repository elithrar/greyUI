import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export interface SegmentedMeterSegment {
  label: string;
  value: number;
  color?: string;
}

export interface SegmentedMeterProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  label: string;
  segments: readonly SegmentedMeterSegment[];
  max?: number;
}

type SegmentStyle = CSSProperties & { "--greyui-segment-color"?: string };

function getSegmentStyle(segment: SegmentedMeterSegment): SegmentStyle {
  const style: SegmentStyle = {
    flexGrow: Math.max(0, segment.value),
    flexBasis: 0,
  };
  if (segment.color !== undefined) {
    style["--greyui-segment-color"] = segment.color;
  }
  return style;
}

export function SegmentedMeter({
  className = "",
  label,
  segments,
  max: maxProp,
  ...props
}: SegmentedMeterProps) {
  const value = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);
  const max = Math.max(maxProp ?? value, value, 1);
  const valueText = segments.map((segment) => `${segment.label} ${segment.value}`).join(", ");

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      data-greyui-component="segmented-meter"
      className={`greyui-segmented-meter ${className}`.trim()}
      {...props}
    >
      {segments.map((segment) => (
        <span
          key={segment.label}
          aria-hidden="true"
          data-label={segment.label}
          className="greyui-segmented-meter-segment"
          style={getSegmentStyle(segment)}
          title={`${segment.label}: ${segment.value}`}
        />
      ))}
    </div>
  );
}
