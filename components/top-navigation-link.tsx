"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type TopNavigationLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export function TopNavigationLink({
  onClick,
  ...props
}: TopNavigationLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  return <Link {...props} onClick={handleClick} scroll />;
}
