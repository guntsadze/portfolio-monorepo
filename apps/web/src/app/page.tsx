"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Home } from "lucide-react"; // ახალი: icons loading-ისთვის
import { toast } from "react-hot-toast"; // თუ არ გაქვს, შეცვალე console-ით

interface MenuItem {
  _id: string;
  title: string;
  icon?: string; // ახალი: იკონის მხარდაჭერა
  parentId?: string | null;
  children?: MenuItem[];
}

export default function MenuHierarchy() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState<MenuItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true); // ახალი: loading state

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu`);
      setMenus(res.data);
      setCurrentLevel(res.data.filter((m: MenuItem) => !m.parentId)); // Root level
      toast.success("Menus loaded!"); // ახალი: feedback
    } catch (error) {
      console.error("Failed to fetch menus", error);
      toast.error("Failed to load menus"); // ახალი: error toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleClick = (menu: MenuItem) => {
    // Smooth animation trigger
    setBreadcrumbs((prev) => [...prev, menu]);
    const children = menus.filter((m) => m.parentId === menu._id);
    setCurrentLevel(children);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    const last = newBreadcrumbs[newBreadcrumbs.length - 1];
    const children = menus.filter((m) => m.parentId === last?._id);
    setCurrentLevel(children);
  };

  const handleReset = () => {
    setBreadcrumbs([]);
    setCurrentLevel(menus.filter((m) => !m.parentId));
  };

  if (loading) {
    // ახალი: Loading screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading menu hierarchy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8"> {/* ახალი: Dark gradient background */}
      <div className="max-w-6xl mx-auto"> {/* ახალი: Centered container */}

        {/* Breadcrumbs - გაუმჯობესებული */}
        {breadcrumbs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50"> {/* ახალი: Styled container */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border-blue-500/30 text-blue-300 transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              მთავარი
            </Button>
            {breadcrumbs.map((b, idx) => (
              <Button
                key={b._id}
                size="sm"
                variant="secondary"
                onClick={() => handleBreadcrumbClick(idx)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-all duration-300 hover:scale-105 rounded-full" // ახალი: Pill shape + animation
              >
                {b.icon && <span className="mr-2 text-lg">{b.icon}</span>} {/* იკონი ბრედკრამბში */}
                {b.title}
              </Button>
            ))}
          </div>
        )}

        {/* Current Level Cards - გაუმჯობესებული */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* ახალი: Responsive + უფრო მეტი space */}
          {currentLevel.length > 0 ? (
            currentLevel.map((menu, index) => (
              <Card 
                key={menu._id} 
                className="p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-500 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl group" // ახალი: Bigger padding, animations, glow
                onClick={() => handleClick(menu)}
                style={{ animationDelay: `${index * 100}ms` }} // ახალი: Staggered fade-in
              >
                {/* Icon */}
                {menu.icon && (
                  <div className="flex justify-center mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300"> {/* ახალი: Icon animation */}
                      {menu.icon}
                    </span>
                  </div>
                )}
                {/* Title */}
                <h3 className="font-bold text-xl text-white text-center mb-2 group-hover:text-purple-300 transition-colors duration-300"> {/* ახალი: Bigger text + color change */}
                  {menu.title}
                </h3>
                {/* Subtle description or level indicator */}
                <p className="text-slate-400 text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  აქ დაეწერება დეტალური შედარებით დეტალური ინფორმაცია კატეგორიაზე
                </p>
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Card>
            ))
          ) : (
            // ახალი: Empty state
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 text-lg">No menu items at this level. Go back or add new ones!</p>
              <Button 
                onClick={handleReset} 
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}