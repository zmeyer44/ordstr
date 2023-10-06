"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxPlus } from "react-icons/rx";
import { cn } from "@/lib/utils";
import {
  RiHomeFill,
  RiHomeLine,
  RiUser4Line,
  RiUser4Fill,
  RiSearch2Line,
  RiSearch2Fill,
  RiFireLine,
  RiFireFill,
  RiNotification3Line,
  RiNotification3Fill,
  RiLoginCircleLine,
  RiLoginCircleFill,
} from "react-icons/ri";
import { useModal } from "@/app/_providers/modalContext/provider";
import CreateEventModal from "@/components/modals/CreateEvent";
export default function BottomNav() {
  const pathname = usePathname();
  const modal = useModal();
  const newContentBtnRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomTabsRef = useRef<HTMLDivElement>(null);
  const notifications: string[] = [];

  const currentUser = null;
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", (event: any) => {
        if (
          (bottomTabsRef.current &&
            bottomTabsRef.current.contains(event?.target)) ||
          (newContentBtnRef.current &&
            newContentBtnRef.current.contains(event?.target))
        ) {
        } else {
          setMenuOpen(false);
        }
      });
    }
    return () => {
      document.removeEventListener("mousedown", () => {});
    };
  }, [menuOpen]);

  const bottomNavigation = [
    {
      path: "/home",
      icon: RiHomeLine,
      activeIcon: RiHomeFill,
      current: pathname === "/home",
    },
    {
      path: "/search",
      icon: RiSearch2Line,
      activeIcon: RiSearch2Fill,
      current: pathname === "/search",
    },
    {
      path: "/notifications",
      icon: RiNotification3Line,
      activeIcon: RiNotification3Fill,
      alerts: notifications?.length,
      current: pathname === "/notifications",
    },
    {
      path: `/${currentUser}`,
      icon: RiUser4Line,
      activeIcon: RiUser4Fill,
      current: pathname === "/profile",
    },
  ];
  const bottomNavigationNoAuth = [
    {
      path: "/",
      icon: RiHomeLine,
      activeIcon: RiHomeFill,
      current: pathname === "/",
    },
    {
      path: "/",
      icon: RiFireLine,
      activeIcon: RiFireFill,
      current: pathname === "/hot",
    },
    {
      path: "/",
      icon: RiSearch2Line,
      activeIcon: RiSearch2Fill,
      current: pathname === "/search",
    },
    {
      path: "/",
      icon: RiLoginCircleLine,
      activeIcon: RiLoginCircleFill,
      current: pathname === "/signin",
    },
  ];

  return (
    <nav className="fixed sm:hidden bottom-0 left-0 right-0 z-header-">
      <div className="flex justify-end pb-6 px-10">
        <div
          className={cn(
            `relative h-12 bg-background-gray border-2 flex flex-row-reverse items-center rounded-full transition-all cursor-pointer`,
            menuOpen ? "w-full" : "w-12 center"
          )}
        >
          <div
            ref={newContentBtnRef}
            onClick={() => {
              modal?.show(<CreateEventModal />);
              setMenuOpen(false);
            }}
            className={cn(
              "absolute center bg-accent-foreground text-black rounded-full -z-10 transition-all shadow-md cursor-pointer",
              menuOpen
                ? "bottom-16 right-0 w-12 h-12"
                : "bottom-4 right-3 w-4 h-4"
            )}
          >
            <RxPlus
              className={cn(
                "w-7 h-7 transition-transform pointer-events-none",
                menuOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
          {/* {!currentUser ? (
            <>
              <div
                ref={newContentBtnRef}
                onClick={() => setNewContentModalOpen(true)}
                className={cn(
                  "absolute center bg-accent-foreground text-black rounded-full -z-10 transition-all shadow-md cursor-pointer",
                  menuOpen
                    ? "bottom-16 right-0 w-12 h-12"
                    : "bottom-4 right-3 w-4 h-4"
                )}
              >
                <RxPlus
                  className={cn(
                    "w-7 h-7 transition-transform pointer-events-none",
                    menuOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </div>
              {bottomNavigation.some((t) => t.alerts) && (
                <div
                  className={cn(
                    "absolute top-0 right-0 w-2.5 h-2.5 bg-theme-600 rounded-full",
                    menuOpen ? "hidden" : "block"
                  )}
                ></div>
              )}
            </>
          ) : (
            <>
              <div
                className={cn(
                  menuOpen
                    ? "bottom-16 right-0 w-12 h-12"
                    : "bottom-4 right-3 w-4 h-4",
                  "absolute  center bg-[#DB4437] rounded-full -z-10 transition-all shadow-md cursor-pointer"
                )}
              >
                <RiGoogleLine
                  className={cn(
                    menuOpen ? "rotate-270" : "rotate-0",
                    " text-white w-7 h-7 transition-transform pointer-events-none "
                  )}
                />
              </div>
              <div
                className={cn(
                  menuOpen
                    ? "bottom-[125px] right-0 w-12 h-12"
                    : "bottom-4 right-3 w-4 h-4",
                  "absolute  center bg-[#0A66C2] rounded-full -z-10 transition-all shadow-md cursor-pointer"
                )}
              >
                <RiLinkedinLine
                  className={cn(
                    menuOpen ? "rotate-270" : "rotate-0",
                    " text-white w-7 h-7 transition-transform pointer-events-none "
                  )}
                />
              </div>
              <div
                className={cn(
                  menuOpen
                    ? "bottom-[186px] right-0 w-12 h-12"
                    : "bottom-4 right-3 w-4 h-4",
                  "absolute  center bg-[#333333] rounded-full -z-10 transition-all shadow-md cursor-pointer"
                )}
              >
                <RiGithubLine
                  className={cn(
                    menuOpen ? "rotate-270" : "rotate-0",
                    " text-[#fafafa] w-7 h-7 transition-transform pointer-events-none "
                  )}
                />
              </div>
            </>
          )} */}

          <div
            className={cn(menuOpen ? "hidden" : "absolute inset-0")}
            onClick={() => setMenuOpen(true)}
          />
          <RxPlus
            className={cn(
              "absolute text-primary-foreground w-6 h-6 transition-transform pointer-events-none",
              menuOpen ? "rotate-0 hidden" : "rotate-180"
            )}
          />

          <div
            ref={bottomTabsRef}
            className={cn(
              menuOpen
                ? "opacity-100 delay-200 h-full"
                : "w-0 h-0 opacity-0 overflow-hidden",
              "w-full flex transition-opacity divide-x-2 divide-primary-foreground"
            )}
          >
            {currentUser
              ? bottomNavigation.map((tab, index) => (
                  <Link
                    href={tab.path}
                    key={index}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center hover:bg-primary/40"
                    )}
                  >
                    <button>
                      {tab.current ? (
                        <div className="text-[24px] text-primary-foreground">
                          <tab.activeIcon />
                        </div>
                      ) : (
                        <div className="text-[24px] text-accent">
                          <tab.icon />
                        </div>
                      )}
                      {tab.alerts ? (
                        <div className="absolute -top-1 ml-5 min-w-[22px] min-h-[22px] p-1 bg-accent-foreground center rounded-full text-xs text-white">
                          <span className="leading-tight">{tab.alerts}</span>
                        </div>
                      ) : null}
                    </button>
                  </Link>
                ))
              : bottomNavigationNoAuth.map((tab, index) => (
                  <Link
                    key={index}
                    href={tab.path}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center hover:bg-primary/40"
                    )}
                  >
                    <div>
                      {tab.current ? (
                        <div className="text-[24px] text-accent-foreground">
                          <tab.activeIcon />
                        </div>
                      ) : (
                        <div className="text-[24px] text-primary-foreground">
                          <tab.icon />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
