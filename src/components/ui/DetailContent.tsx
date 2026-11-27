import { DETAIL_ACCENT as ACCENT } from "../../constants/theme";

export type BulletItem = string | readonly [string, string];

const isTuple = (item: BulletItem): item is readonly [string, string] =>
  typeof item !== "string";

const bulletItems = (items: readonly BulletItem[]) =>
  items.map((item, index) => ({
    key: index,
    title: isTuple(item) ? item[0] : item,
    detail: isTuple(item) ? item[1] : undefined,
  }));

/** Bulleted list; a tuple item renders as a bold title with its detail after a colon. */
export const BulletList = ({
  items,
  size = "sm",
}: {
  items: readonly BulletItem[];
  size?: "sm" | "md";
}) => (
  <ul className="space-y-2.5 mt-1">
    {bulletItems(items).map(({ key, title, detail }) => (
      <li key={key} className="flex items-start gap-3">
        <span
          className={`${size === "sm" ? "mt-2" : "mt-1.5"} w-1.5 h-1.5 rounded-full shrink-0`}
          style={{ background: ACCENT }}
        />
        <span className={`${size === "sm" ? "text-sm" : "text-sm md:text-base"} text-gray-600 leading-relaxed`}>
          {detail ? (
            <>
              <span className="font-semibold text-gray-800">{title}: </span>
              {detail}
            </>
          ) : (
            title
          )}
        </span>
      </li>
    ))}
  </ul>
);

/** Two/three-column grid of single-line bullets. */
export const BulletGrid = ({
  items,
  columns = 3,
}: {
  items: readonly string[];
  columns?: 2 | 3;
}) => (
  <div
    className={
      columns === 3
        ? "grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2"
        : "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
    }
  >
    {items.map((item) => (
      <div key={item} className="flex items-start gap-2">
        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
      </div>
    ))}
  </div>
);

/** Ordered list with a small numbered badge and an inline "Title: detail" line. */
export const NumberedList = ({
  items,
  size = "sm",
}: {
  items: readonly (readonly [string, string])[];
  size?: "sm" | "md";
}) => (
  <ol className="space-y-3 mt-1">
    {items.map(([title, desc], index) => (
      <li key={title} className="flex items-start gap-3">
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
          style={{ background: ACCENT }}
        >
          {index + 1}
        </span>
        <span
          className={`${size === "md" ? "text-sm md:text-base" : "text-sm"} text-gray-600 leading-relaxed`}
        >
          <span className="font-semibold text-gray-800">{title}: </span>
          {desc}
        </span>
      </li>
    ))}
  </ol>
);

export interface NumberedStep {
  num: string | number;
  title: string;
  desc: string;
}

/** Numbered process steps with a filled accent badge. */
export const NumberedSteps = ({
  items,
  size = "md",
  className,
}: {
  items: readonly NumberedStep[];
  size?: "md" | "sm";
  className?: string;
}) => (
  <div className={className ?? (size === "md" ? "space-y-4" : "space-y-3")}>
    {items.map((item) => (
      <div key={item.num} className="flex items-start gap-4">
        <span
          className={`shrink-0 ${size === "md" ? "w-7 h-7" : "w-6 h-6"} rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5`}
          style={{ background: ACCENT }}
        >
          {item.num}
        </span>
        <div>
          <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);
