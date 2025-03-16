"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../lib/firebase";

import { Button } from "../components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState({
        activities: false
    });
    const [upcomingEvent, setUpcomingEvent] = useState(null);

    // Detect scroll to apply background blur
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 60) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        async function fetchUpcomingEvent() {
            try {
                const upcomingRef = collection(db, 'upcomingAlerts');
                // If we want to prioritize events with dates, still order by date
                const q = query(upcomingRef, orderBy('createdAt', 'desc'), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();

                    // Accept any alert, whether it has a date or not
                    setUpcomingEvent({
                        id: querySnapshot.docs[0].id,
                        ...data
                    });
                }
            } catch (error) {
                console.error("Error fetching upcoming event:", error);
            }
        }

        fetchUpcomingEvent();
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    const toggleMobileSubMenu = (menu) => {
        setMobileSubMenuOpen(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Animation variants for mobile menu
    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2,
                ease: "easeIn",
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    const subMenuVariants = {
        hidden: {
            height: 0,
            opacity: 0,
        },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                height: {
                    duration: 0.3,
                },
                opacity: {
                    duration: 0.25,
                    delay: 0.05
                }
            }
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: {
                height: {
                    duration: 0.2,
                },
                opacity: {
                    duration: 0.15,
                }
            }
        }
    };

    useEffect(() => {
        const handleRouteChange = () => closeMobileMenu();
        const handleResize = () => {
            if (window.innerWidth >= 768 && mobileMenuOpen) {
                closeMobileMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [mobileMenuOpen, closeMobileMenu]);


    return (
        <div className={`w-full mt-2 sticky top-0 z-[100] transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-white/50 dark:bg-slate-900/20 shadow-sm" : "bg-transparent"
            }`}>
            <div className="mx-4 md:mx-10 flex h-16 items-center justify-between">
                {/* Logo - left side */}
                <div className="flex items-center z-10">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="relative w-9 h-9 mt-1.5">
                            <img
                                src="/mathsoclogowhite.png"
                                alt="MathSoc Logo"
                                width={36}
                                height={36}
                                className="hidden dark:block w-full h-full object-contain"
                            />
                            <img
                                src="/mathsoclogoblack.png"
                                alt="MathSoc Logo"
                                width={36}
                                height={36}
                                className="block dark:hidden w-full h-full object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            MathSoc
                        </span>
                    </Link>

                    {/* Upcoming event - immediately next to logo */}
                    {upcomingEvent && (
                        <div className="hidden md:flex items-center ml-4">
                            <Link
                                href={upcomingEvent.link || "/events"}
                                className="flex items-center px-3 py-1.5 rounded-full bg-green-100/70 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 group hover:shadow-sm hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
                            >
                                {/* Pulsing dot */}
                                <span className="relative mr-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>

                                <span className="text-xs font-medium text-green-800 dark:text-green-300 whitespace-nowrap mr-1.5">
                                    {upcomingEvent.title}
                                </span>

                                {upcomingEvent.date ? (
                                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                        <span className="whitespace-nowrap">
                                            {new Date(upcomingEvent.date.seconds * 1000).toLocaleString([], {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs italic text-slate-600 dark:text-slate-400">
                                        Coming soon
                                    </span>
                                )}

                                {upcomingEvent.location && (
                                    <div className="hidden lg:flex items-center ml-2 text-xs text-slate-600 dark:text-slate-400">
                                        <span className="ml-0.5 mr-2 text-slate-400 dark:text-slate-600">•</span>
                                        <span className="truncate max-w-[100px] xl:max-w-[180px]">
                                            {upcomingEvent.location}
                                        </span>
                                    </div>
                                )}

                                {upcomingEvent.prizepool && (
                                    <div className="hidden md:flex items-center ml-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                        <span className="ml-0.5 mr-2 text-slate-400 dark:text-slate-600">•</span>
                                        <span className="whitespace-nowrap">₹{upcomingEvent.prizepool}</span>
                                    </div>
                                )}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right side section with navigation and controls */}
                <div className="flex items-center space-x-2 z-10">
                    {/* Navigation Links - now on right side before theme toggle */}
                    <div className="hidden md:block mr-4">
                        <NavigationMenu>
                            <NavigationMenuList className="bg-transparent">
                                <NavigationMenuItem>
                                    <Link href="/events" legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-all duration-300`}>
                                            Events
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-all duration-300">
                                        Activities
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className={`bg-blue-50 dark:bg-slate-950`}>
                                        <ul className="w-[180px] p-2 bg-transparent dark:bg-transparent rounded-md transition-all duration-300">
                                            <li>
                                                <Link href="/activities/subject-groups" legacyBehavior passHref>
                                                    <NavigationMenuLink className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200">
                                                        Subject Groups
                                                    </NavigationMenuLink>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/activities/community-service" legacyBehavior passHref>
                                                    <NavigationMenuLink className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200">
                                                        Community Service
                                                    </NavigationMenuLink>
                                                </Link>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/gallery" legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-all duration-300`}>
                                            Gallery
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/about" legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-all duration-300`}>
                                            About
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Dark Mode Toggle with animation */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all duration-300"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                    </motion.div>

                    {/* Mobile menu toggle with animation */}
                    <motion.div
                        className="md:hidden"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMobileMenu}
                            className="bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all duration-300"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-white dark:bg-slate-950/98 z-[99999]"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw' }}
                    >
                        {/* Floating close button */}
                        <motion.button
                            className="fixed top-6 right-6 p-2 rounded-full bg-slate-50 dark:bg-slate-800 shadow-md dark:shadow-slate-900/40 text-slate-600 dark:text-slate-400 z-[999999]" onClick={closeMobileMenu}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15
                                }
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </motion.button>

                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="h-full flex flex-col pt-24 px-6 overflow-y-auto z-[9999]"
                        >
                            {/* Logo in mobile menu */}
                            <motion.div variants={itemVariants} className="mb-10">
                                <Link
                                    href="/"
                                    onClick={closeMobileMenu}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="relative w-16 h-16">
                                        <img
                                            src="/mathsoclogowhite.png"
                                            alt="MathSoc Logo"
                                            width={64}
                                            height={64}
                                            className="hidden dark:block w-full h-full object-contain"
                                        />
                                        <img
                                            src="/mathsoclogoblack.png"
                                            alt="MathSoc Logo"
                                            width={64}
                                            height={64}
                                            className="block dark:hidden w-full h-full object-contain"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            {upcomingEvent && (
                                <motion.div variants={itemVariants} className="mb-6">
                                    <Link
                                        href={upcomingEvent.link || "/events"}
                                        className="block rounded-lg overflow-hidden bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-4 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center mb-2">
                                            <span className="relative mr-2 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </span>
                                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                                Upcoming Event
                                            </span>
                                            {upcomingEvent.prizepool && (
                                                <span className="ml-auto text-sm font-medium text-amber-600 dark:text-amber-400">
                                                    ₹{upcomingEvent.prizepool}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-base font-medium text-slate-800 dark:text-white mb-1">
                                            {upcomingEvent.title}
                                        </h4>
                                        {upcomingEvent.date ? (
                                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                                {new Date(upcomingEvent.date.seconds * 1000).toLocaleString([], {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-sm italic text-slate-600 dark:text-slate-300">
                                                Coming soon
                                            </div>
                                        )}
                                        {upcomingEvent.location && (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                {upcomingEvent.location}
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            )}

                            <motion.nav variants={itemVariants} className="space-y-2">
                                <Link
                                    href="/events"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between p-4 text-xl font-medium border-b border-slate-200 dark:border-slate-800"
                                >
                                    <span>Events</span>
                                    <ChevronRight size={20} />
                                </Link>

                                <div className="border-b border-slate-200 dark:border-slate-800">
                                    <div
                                        onClick={() => toggleMobileSubMenu('activities')}
                                        className="flex items-center justify-between p-4 text-xl font-medium cursor-pointer"
                                    >
                                        <span>Activities</span>
                                        <ChevronDown
                                            size={20}
                                            className={`transition-transform duration-300 ${mobileSubMenuOpen.activities ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {mobileSubMenuOpen.activities && (
                                            <motion.div
                                                variants={subMenuVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-6 pb-3 space-y-2">
                                                    <Link
                                                        href="/activities/subject-groups"
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center p-3 text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                    >
                                                        Subject Groups
                                                    </Link>
                                                    <Link
                                                        href="/activities/community-service"
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center p-3 text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                    >
                                                        Community Service
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/gallery"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between p-4 text-xl font-medium border-b border-slate-200 dark:border-slate-800"
                                >
                                    <span>Gallery</span>
                                    <ChevronRight size={20} />
                                </Link>

                                <Link
                                    href="/about"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between p-4 text-xl font-medium border-b border-slate-200 dark:border-slate-800"
                                >
                                    <span>About</span>
                                    <ChevronRight size={20} />
                                </Link>
                            </motion.nav>

                            {/* Theme toggle in mobile menu */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-auto mb-8 pt-6 text-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        variant="outline"
                                        className="rounded-full px-6"
                                    >
                                        <span className="mr-2">
                                            {theme === "dark" ? "Light" : "Dark"} Mode
                                        </span>
                                        {theme === "dark" ? (
                                            <Sun size={18} />
                                        ) : (
                                            <Moon size={18} />
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}