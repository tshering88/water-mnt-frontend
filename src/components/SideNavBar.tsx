import { useState, useEffect } from 'react';
import { LogIn, UserPlus, ChevronRight, Map, LayoutDashboard, MapPin } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from './ui/navigation-menu';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function NavigationMenuSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname)
  const { user,fetchCurrentUser, logout } = useUserStore()


  useEffect(()=>{
    fetchCurrentUser()
  },[])

  

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/adduser', label: 'User Management', icon: UserPlus },
    { path: '/alldzongkhag', label: 'All Dzongkhags', icon: Map },
    { path: '/allgewog', label: 'All Gewogs', icon: MapPin },

  ];


  const getInitials = (name: string): string => {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

  return (
    <div
      className={`h-screen transition-all duration-300 ease-in-out 
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
        border-r border-slate-700/50 shadow-2xl backdrop-blur-xl 
        flex flex-col
      `}
    >
      <NavigationMenu className="flex flex-col h-full w-full">
        <NavigationMenuList className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-white font-bold text-lg tracking-tight">Dashboard</h2>
                  <p className="text-slate-400 text-xs">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-3 space-y-1">
            {menuItems.map(({ path, label, icon: Icon }) => {
              const isActive = activeItem === path;
              return (
                <NavigationMenuItem key={path}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={path}
                      className={`group flex items-center py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${isActive ? 'bg-blue-500/10 text-white border border-blue-500/30 shadow-lg' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}
                        ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'}
                        backdrop-blur-sm
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          size={20}
                          className={`transition-colors duration-200 ${
                            isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                          }`}
                        />
                        {!isCollapsed && <span>{label}</span>}
                      </div>
                      {!isCollapsed && isActive && (
                        <ChevronRight size={16} className="text-blue-400 opacity-70" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </div>

          {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 mt-auto">
  {!isCollapsed ? (
<div className="flex flex-col justify-between p-3 rounded-xl bg-slate-800/50 gap-4 backdrop-blur-sm h-full">
  {/* User Details - Top */}
  <div className="flex items-center space-x-3 mb-3">
    <div className="size-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
      <span className="text-white text-xl font-bold">{getInitials(user?.name ?? '')}</span>
    </div>
    <div className="flex flex-col">
      <p className="text-white text-sm mb-2 font-medium">{user?.name}</p>
      <p className="text-emerald-300 text-xs font-semibold bg-emerald-800/30 rounded px-2 py-0.5 inline-block">
        {user?.role}
      </p>
    </div>
  </div>

  {/* Logout Button - Bottom */}
  <button
    onClick={logout}
    className=" flex justify-center px-4 py-2 text-[16px] font-bold text-white w-40 bg-red-600 hover:bg-red-700 rounded shadow-sm  items-center"
  >
    Logout
  </button>
</div>


  ) : (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">{getInitials(user?.name ?? '')}</span>
      </div>
      <button
        onClick={logout}
        className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded shadow-sm transition"
      >
        <LogIn size={14} />
      </button>
    </div>
  )}
</div>


        </NavigationMenuList>
      </NavigationMenu>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-8 -right-3 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
      >
        <ChevronRight
          size={12}
          className={`text-slate-300 transition-transform duration-200 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>
    </div>
  );
}
