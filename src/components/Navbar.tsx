"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isIndexPage = pathname === "/";

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isIndexPage ? "bg-white" : "bg-transparent"
      } dark:bg-gray-900/80`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gradient">
              Spendly
            </Link>
          </div>
          <div className="hidden md:flex ml-auto">
            <div className="flex items-center space-x-4">
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#how-it-works">How It Works</NavLink>
              <NavLink href="/#testimonials">Testimonials</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              {!session?.user ? (
                <>
                  {pathname !== "/sign-in" && pathname !== "/sign-up" && (
                    <>
                      <Link href="/sign-in">
                        <Button variant="outline" className="mr-2">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button className="gradient-bg text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/#features" mobile>
              Features
            </NavLink>
            <NavLink href="/#how-it-works" mobile>
              How It Works
            </NavLink>
            <NavLink href="/#testimonials" mobile>
              Testimonials
            </NavLink>
            <NavLink href="/dashboard" mobile>
              Dashboard
            </NavLink>
            {!session?.user ? (
              <>
                {pathname !== "/sign-in" && pathname !== "/sign-up" && (
                  <>
                    <Link href="/sign-in">
                      <Button variant="outline" className="w-full mt-2">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full mt-2 gradient-bg text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${
        mobile ? "block" : "inline-block"
      } px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-300 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800`}
    >
      {children}
    </Link>
  );
}