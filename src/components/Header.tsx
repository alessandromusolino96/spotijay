import React from "react";

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return <header className="w-full bg-blue-600 text-white py-4 px-6 text-center text-2xl font-bold shadow-md">{title}</header>;
};

export default Header;
