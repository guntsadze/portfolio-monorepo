"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export default function AppSidebar() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu`,
          {
            withCredentials: true, // ✅ cookie–ს ავტომატურად გაუგზავნის
          }
        );
        setMenus(res.data);
      } catch (error) {
        console.error("Failed to load menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => (
      <SidebarItem
        key={item.id}
        label={item.title}
        icon={item.icon}
        isActive={pathname.startsWith(item.path)}
        onClick={() => router.push(item.path)}
      >
        {item.children && item.children.length > 0 && renderMenu(item.children)}
      </SidebarItem>
    ));

  return <Sidebar>{renderMenu(menus)}</Sidebar>;
}
