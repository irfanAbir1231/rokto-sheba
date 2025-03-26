"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    // Handle the initial page load
    if (transitionStage === "fadeIn") {
      setTransitionStage("visible");
    }
  }, [transitionStage]);

  useEffect(() => {
    // Set fadeOut stage when pathname changes
    if (children !== displayChildren && transitionStage === "visible") {
      setTransitionStage("fadeOut");

      // After fadeOut animation completes, update content and fadeIn
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");

        // After new content is rendered, set to visible
        setTimeout(() => {
          setTransitionStage("visible");
        }, 50);
      }, 200); // Should match CSS exit transition duration

      return () => clearTimeout(timeout);
    }
  }, [pathname, children, displayChildren, transitionStage]);

  return (
    <main
      className={`min-h-[calc(100vh-80px)] ${
        transitionStage === "fadeIn"
          ? "opacity-0 transform translate-y-2"
          : transitionStage === "fadeOut"
          ? "opacity-0 transform -translate-y-2"
          : "opacity-100 transform translate-y-0"
      } transition-all duration-300 ease-in-out`}
    >
      {displayChildren}
    </main>
  );
}
