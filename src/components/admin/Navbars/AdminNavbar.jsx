import React from "react";

import UserDropdown from "../Dropdowns/UserDropdown";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a className="text-first text-sm uppercase hidden lg:inline-block font-bold" href="/admin">
            Dashboard
          </a>
          {/* User */}
          <ul className="flex-col md:flex-row items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
