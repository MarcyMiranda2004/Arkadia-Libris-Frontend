import { useState } from "react";

export interface LinkItem {
  label: string;
  href: string;
}

export const linkItems: LinkItem[] = [
  { label: "Novità",  href: "#novita"  },
  { label: "Popolari", href: "#popolari" },
  { label: "Offerte", href: "#offerta" },
  { label: "Libri",   href: "#libri"   },
  { label: "Comix",   href: "#comix"   },
  { label: "Manga",   href: "#manga"   },
];

export const useNavbarLogic = () => {
  const [activeKey, setActiveKey] = useState<string>(linkItems[0].label);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setActiveKey(selectedKey);
    }
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return {
    linkItems,
    activeKey,
    onSelect,
    isLoggedIn,
    handleLogin,
    handleLogout,
  };
};
