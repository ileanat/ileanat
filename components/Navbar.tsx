"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/site";

function isRouteLink(href: string) {
  return href.startsWith("/");
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname !== "/") return;

      const sections = navLinks
        .filter((link) => !isRouteLink(link.href))
        .map((link) => link.href.slice(1));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const handleHashClick = (href: string) => {
    setIsOpen(false);
    const id = href.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isLinkActive = (href: string) => {
    if (isRouteLink(href)) {
      return pathname === href;
    }

    return pathname === "/" && activeSection === href.slice(1);
  };

  const linkClassName = (href: string) => {
    const isActive = isLinkActive(href);
    return `rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-accent/10 text-accent"
        : "text-muted hover:bg-white/5 hover:text-foreground"
    }`;
  };

  const mobileLinkClassName = (href: string) => {
    const isActive = isLinkActive(href);
    return `block rounded-lg px-4 py-3 text-sm transition-colors ${
      isActive
        ? "bg-accent/10 text-accent"
        : "text-muted hover:bg-white/5 hover:text-foreground"
    }`;
  };

  const renderNavLink = (link: (typeof navLinks)[number], className: string) => {
    if (isRouteLink(link.href)) {
      return (
        <Link
          href={link.href}
          onClick={() => setIsOpen(false)}
          className={className}
        >
          {link.label}
        </Link>
      );
    }

    if (pathname === "/") {
      return (
        <a
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            handleHashClick(link.href);
          }}
          className={className}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link href={`/${link.href}`} onClick={() => setIsOpen(false)} className={className}>
        {link.label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="group inline-flex items-center gap-1 transition-colors hover:text-accent"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            <Image
              src="/logo-nav.png"
              alt=""
              width={742}
              height={742}
              priority
              unoptimized
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-base font-medium leading-none tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>{renderNavLink(link, linkClassName(link.href))}</li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/40 hover:text-foreground md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              {renderNavLink(link, mobileLinkClassName(link.href))}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
