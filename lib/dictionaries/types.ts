import { en } from "./en";

/**
 * The shape every locale dictionary must satisfy.
 *
 * `Widen<T>` strips the literal types that the English source content acquires
 * from `as const` (so `"Studio"` becomes `string`), while keeping the exact
 * structure — every key, array length and nesting level. The result is that
 * `Dictionary` is derived from the English dictionary automatically, and a
 * translation that is missing or misspells any field fails `tsc`.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { readonly [K in keyof T]: Widen<T[K]> }
          : T;

/**
 * Literal unions components switch on. `Widen` intentionally flattens these to
 * `string`, so they are re-applied by hand below: a typo in a translated accent
 * or icon name is then a type error, not a silently wrong colour.
 */
export type Accent = "violet" | "cyan" | "lime";
export type ServiceIconName =
  | "layout"
  | "cube"
  | "bolt"
  | "compass"
  | "cart"
  | "wave";

type Shape = Widen<typeof en>;

export type Project = Omit<Shape["projects"]["items"][number], "accent"> & {
  readonly accent: Accent;
};

export type Service = Omit<Shape["services"]["items"][number], "icon"> & {
  readonly icon: ServiceIconName;
};

export type TeamMember = Omit<Shape["team"]["members"][number], "accent"> & {
  readonly accent: Accent;
};

export type Dictionary = Omit<Shape, "projects" | "services" | "team"> & {
  readonly projects: Omit<Shape["projects"], "items"> & {
    readonly items: readonly Project[];
  };
  readonly services: Omit<Shape["services"], "items"> & {
    readonly items: readonly Service[];
  };
  readonly team: Omit<Shape["team"], "members"> & {
    readonly members: readonly TeamMember[];
  };
};

/** Non-localised link shapes, used by the nav, footer and 404. */
export type NavLink = { label: string; href: string };
export type TextLink = { label: string; href: string };
