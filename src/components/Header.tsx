// react
import React from "react";

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return <header className="w-full bg-blue-600 text-white py-4 px-4 md:px-8 text-center text-xl md:text-2xl font-bold">{title}</header>;
};

export default Header;
