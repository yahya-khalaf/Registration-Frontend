"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import the hooks

const menuIcon = (
  <div>
    <IoMenu className="h-8 w-8 text-[#035fe9]" />
  </div>
);
const signedInIcon = (
  <div>
    <FaUserCircle className="h-10 w-10 text-[#035fe9]" />
  </div>
);

const Navbar = () => {
  const [token, setToken] = useState<any>();
  const [userRole, setUserRole] = useState<any>();
  const router = useRouter();

  const checkAuth = () => {
    const expiryDate = localStorage.getItem("expiryDate");
    if (
      expiryDate &&
      Math.floor(new Date().getTime() / 1000) > Number(expiryDate)
    ) {
      localStorage.clear();
    }
    setToken(localStorage.getItem("jwt"));
    setUserRole(localStorage.getItem("userRole"));
  };

  return (
    <nav className="h-14 bg-white border border-b-[1px] sticky top-0 z-10 pb-8">
      <div className="max-w-full md:max-w-[90%] min-[1130px]:max-w-[75%] flex justify-between items-center mx-auto">
        <Link href="/">
          <div className="flex justify-center items-center">
            <img className="w-14 h-14" src="/assets/logo.png" alt="logo" />
            <span className="texl-base md:text-xl">Registration</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
