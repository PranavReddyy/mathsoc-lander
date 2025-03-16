'use client';

import { useState } from 'react';
import { DM_Serif_Display, Source_Serif_4 } from "next/font/google";
import { ChevronDown, Mail, User, FileText, Calendar } from "lucide-react";

// Import the fonts
const dmSerifDisplay = DM_Serif_Display({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm-serif",
});

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-source-serif",
});

// Subject group data
const subjectGroups = [
    {
        id: 'data-science',
        title: 'Data Science',
        description: 'Our Data Science group focuses on statistical methods, data visualization, and extracting meaningful insights from complex datasets. Members work on real-world applications using R, Python, and various data analysis tools.',
        lead: 'Amithi Shangari',
        email: 'shangari.amithi@gmail.com',
        meetingTime: 'Will be decided soon',
        link: 'https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun',
        color: 'blue'
    },
    {
        id: 'cryptography',
        title: 'Cryptography',
        description: 'The Cryptography group explores the mathematical foundations of modern security systems. Members study number theory, encryption methods, blockchain technology, and how mathematics secures our digital communications.',
        lead: 'Poojan Patel',
        email: 'poojanpatel236@gmail.com',
        meetingTime: 'Will be decided soon',
        link: 'https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun',
        color: 'blue'
    },
    {
        id: 'ai-ml',
        title: 'AI/ML',
        description: 'Our Artificial Intelligence and Machine Learning group investigates the mathematical principles behind AI systems. Topics include linear algebra for neural networks, optimization algorithms, and the statistical foundations of machine learning.',
        lead: 'Amithi Shangari',
        email: 'shangari.amithi@gmail.com',
        meetingTime: 'Will be decided soon',
        link: 'https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun',
        color: 'blue'
    },
    {
        id: 'financial-math',
        title: 'Financial Math',
        description: 'The Financial Mathematics group studies stochastic processes, risk assessment models, option pricing, and the quantitative methods that drive modern financial markets. Members often work on simulating market behaviors and developing trading strategies.',
        lead: 'Nihaal Patnaik',
        email: 'se22ucse050@mahindrauniversity.edu.in',
        meetingTime: 'Will be decided soon',
        link: 'https://chat.whatsapp.com/BLmgzpyLnvs3iXC8LYHxun',
        color: 'blue'
    }
];

// Accordion component
function AccordionItem({ group, isOpen, onClick }) {
    const colorMap = {
        blue: {
            light: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                hover: 'hover:bg-blue-100',
                text: 'text-blue-700',
                icon: 'text-blue-500'
            },
            dark: {
                bg: 'dark:bg-blue-900/20',
                border: 'dark:border-blue-800/50',
                hover: 'dark:hover:bg-blue-900/30',
                text: 'dark:text-blue-300',
                icon: 'dark:text-blue-400'
            }
        }
    };

    const color = colorMap[group.color];

    return (
        <div className="mb-6">
            <button
                onClick={onClick}
                className={`w-full p-6 flex justify-between items-center rounded-xl border ${color.light.border} ${color.dark.border} ${color.light.bg} ${color.dark.bg} ${color.light.hover} ${color.dark.hover} transition-all duration-300`}
                aria-expanded={isOpen}
            >
                <h3 className={`${dmSerifDisplay.className} text-2xl font-normal ${color.light.text} ${color.dark.text}`}>
                    {group.title}
                </h3>
                <ChevronDown
                    className={`h-5 w-5 ${color.light.icon} ${color.dark.icon} transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className={`p-6 border-x border-b rounded-b-xl ${color.light.border} ${color.dark.border} border-t-0 ${color.light.bg} ${color.dark.bg}`}>
                    <div className={`${sourceSerif.className} text-slate-700 dark:text-slate-200 leading-relaxed mb-6`}>
                        {group.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`flex items-center text-sm ${color.light.text} ${color.dark.text}`}>
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">Group Lead:</span>
                            <span className="ml-2">{group.lead}</span>
                        </div>

                        <div className={`flex items-center text-sm ${color.light.text} ${color.dark.text}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="font-medium">Contact:</span>
                            <a href={`mailto:${group.email}`} className="ml-2 hover:underline">{group.email}</a>
                        </div>

                        <div className={`flex items-center text-sm ${color.light.text} ${color.dark.text}`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="font-medium">Meetings:</span>
                            <span className="ml-2">{group.meetingTime}</span>
                        </div>

                        {/* <div className={`flex items-center text-sm ${color.light.text} ${color.dark.text}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="font-medium">Resources:</span>
                            <a href={group.materials} className="ml-2 hover:underline">View Materials</a>
                        </div> */}
                    </div>

                    <div className="mt-6">
                        <a
                            href={`${group.link}`}
                            className={`inline-flex items-center px-4 py-2 rounded-full font-medium text-sm ${color.light.text} ${color.dark.text} ${color.light.border} ${color.dark.border} border hover:bg-white dark:hover:bg-slate-800 transition-colors`}
                        >
                            Join This Group
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GroupsPage() {
    const [openGroup, setOpenGroup] = useState(null);

    const toggleGroup = (groupId) => {
        setOpenGroup(openGroup === groupId ? null : groupId);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 sm:py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={`${dmSerifDisplay.className} text-4xl sm:text-5xl md:text-6xl font-normal mb-6`}>
                        Subject Groups
                    </h1>
                    <p className={`${sourceSerif.className} text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto`}>
                        Join one of our specialized mathematics interest groups to explore specific fields in depth, collaborate with like-minded peers, and apply mathematical concepts to real-world problems.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h2 className={`${dmSerifDisplay.className} text-2xl font-normal mb-4 text-slate-800 dark:text-slate-200`}>
                            Our Specialized Groups
                        </h2>
                        <p className={`${sourceSerif.className} text-slate-600 dark:text-slate-300`}>
                            Click on each group to learn more about their focus, meeting times, and how to get involved.
                        </p>
                    </div>

                    {/* Accordions */}
                    <div className="space-y-6">
                        {subjectGroups.map((group) => (
                            <AccordionItem
                                key={group.id}
                                group={group}
                                isOpen={openGroup === group.id}
                                onClick={() => toggleGroup(group.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Join CTA */}
            <section className="py-16 px-6 bg-gradient-to-b from-white/0 to-blue-100 dark:from-slate-800/0 dark:to-slate-900">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className={`${dmSerifDisplay.className} text-3xl text-blue-800 dark:text-blue-300 font-normal mb-6`}>
                        Start Your Mathematical Journey
                    </h2>
                    <p className={`${sourceSerif.className} text-lg text-slate-600 dark:text-slate-300 mb-8`}>
                        Can't decide which group to join? Attend our next general meeting to learn more about each group's activities and find your perfect fit.
                    </p>
                </div>
            </section>
        </div>
    );
}