"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Personnages", href: "/personnages" },
  { name: "Créer un personnage", href: "/creation" },
  { name: "Arène", href: "/arenes" },
  { name: "Boutique", href: "/boutique" },
  { name: "Connexion", href: "/connexion" },
  { name: "Inscription", href: "/inscription" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuth(true);
    }
  }, []);

  function handleLogout(){
    localStorage.removeItem("jwtToken");
    setIsAuth(false);
    window.location.reload();
  }


  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img
                className="h-16 w-16"
                src="/images/street_logo.png"
                alt="Logo"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
              {navItems
                  .filter((item) =>
                    isAuth
                      ? item.name !== "Connexion" && item.name !== "Inscription"
                      : item.name !== "Créer un personnage"
                  )
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                {isAuth && (
                  <>
                    {/* <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                      {username}
                    </span> */}
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
