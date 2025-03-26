"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

type LinkWithTransitionProps = {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

/**
 * Link component that supports page transitions
 * Use this instead of regular Next.js Link for smooth transitions
 */
export default function LinkWithTransition({
  href,
  children,
  className = "",
  prefetch = true,
  onClick,
  ...props
}: LinkWithTransitionProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }

    if (
      !e.defaultPrevented && // onClick prevented default
      e.button === 0 && // left click
      !(e.metaKey || e.ctrlKey) && // not opening in new tab
      !href.startsWith("http") // not external link
    ) {
      e.preventDefault();

      // Add a small delay to let the exit animation start
      setTimeout(() => {
        router.push(href);
      }, 50);
    }
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
