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

export function useNavbarLogic() {
  const [activeKey, setActiveKey] = useState<string>(linkItems[0].label);

  function onSelect(selectedKey: string | null) {
    if (selectedKey) {
      setActiveKey(selectedKey);
    }
  }

  return { linkItems, activeKey, onSelect };
}
