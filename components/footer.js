import Link from "next/link";

export function PageFooter() {
    return (
        <footer className="bg-slate-50/50 dark:bg-neutral-950/20 border-t">
            {/* Main Footer Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left section - About */}
                    <div className="flex flex-col gap-2 md:max-w-xs">
                        <div className="flex items-center gap-3">
                            {/* Logo with dark/light mode switching */}
                            <div className="relative w-8 h-8">
                                <img
                                    src="/mathsoclogowhite.png"
                                    alt="MathSoc Logo"
                                    width={32}
                                    height={32}
                                    className="hidden dark:block"
                                />
                                <img
                                    src="/mathsoclogoblack.png"
                                    alt="MathSoc Logo"
                                    width={32}
                                    height={32}
                                    className="block dark:hidden"
                                />
                            </div>
                            <h3 className="font-bold text-xl pb-1.5">MathSoc</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The Mathematics Society of Mahindra University
                        </p>
                    </div>

                    {/* Middle section - Pages */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium text-lg">Navigation</h3>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-200">Home</Link>
                            <Link href="/events" className="text-sm text-muted-foreground hover:text-blue-400 transition-all duration-200">Events</Link>
                            <Link href="/activities/subject-groups" className="text-sm text-muted-foreground hover:text-blue-400 transition-all duration-200">Subject Groups</Link>
                            <Link href="/activities/community-service" className="text-sm text-muted-foreground hover:text-blue-400 transition-all duration-200">Community Service</Link>
                            <Link href="/gallery" className="text-sm text-muted-foreground hover:text-blue-400 transition-all duration-200">Gallery</Link>
                            <Link href="/about" className="text-sm text-muted-foreground hover:text-blue-400 transition-all duration-200">About</Link>
                        </nav>
                    </div>

                    {/* Right section - Connect */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium text-lg">Connect</h3>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://www.instagram.com/mathsoc.mu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-200"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.linkedin.com/company/mathematics-club-mu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-200"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                    {/* Right section - Connect */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium text-lg">Community</h3>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-200"
                            >
                                Whatsapp
                            </a>
                            <a
                                href="https://discord.gg/XAZKKrBQCC"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-200"
                            >
                                Discord
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className="border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                        <p className="text-xs text-muted-foreground">
                            © 2025 MathSoc, Mahindra University. All rights reserved.
                        </p>
                        <a
                            href="https://github.com/RogueArt/mathsoc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                        >
                            View Source
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                        {`Made with <3 by the MathSoc`}
                    </p>
                </div>
            </div>
        </footer>
    );
}