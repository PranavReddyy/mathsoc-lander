'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DM_Serif_Display, Source_Serif_4 } from "next/font/google";
import { Instagram, Linkedin, Mail, ExternalLink, ChevronDown, ChevronRight, Users } from "lucide-react";

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

// Team member data for 2024
const team2024 = [
    {
        category: "Faculty Mentors",
        description: "Our dedicated faculty guides who provide invaluable support.",
        members: [
            {
                name: "Biswarup Biswas",
                role: "Club Mentor",
                image: "/team/2024/biswarupbiswas.png",
                linkedin: "https://www.linkedin.com/in/biswarup-biswas-428a60230/",
                email: "biswarup.biswas@mahindrauniversity.edu.in"
            },
            {
                name: "Meraj Alam",
                role: "Club Mentor",
                image: "/team/2024/merajalam.png",
                linkedin: "https://www.linkedin.com/in/meraj-alam-96711b223/",
                email: "meraj.alam@mahindrauniversity.edu.in"
            }
        ]
    },
    {
        category: "Core Leads",
        description: "Main student leads who guide and make key decisions",
        members: [
            {
                name: "Utkarsh Mangal",
                role: "President",
                image: "/team/2024/utkarshmangal.png",
                instagram: "https://www.instagram.com/_utkarsh_mangal/",
                linkedin: "https://www.linkedin.com/in/utkarsh-mangal2/",
                email: "se22ucam015@mahindrauniversity.edu.in"
            },
            {
                name: "Saiankit Shankar",
                role: "Vice President",
                image: "/team/2024/ankitreddy.png",
                instagram: "https://www.instagram.com/ankit.reddy_/",
                linkedin: "https://www.linkedin.com/in/saiankit-shankar/",
                email: "se23ucse160@mahindrauniversity.edu.in"
            },
            {
                name: "Shourya Thakur",
                role: "Head of Subject Groups",
                image: "/team/2024/shourya.png",
                instagram: "https://www.instagram.com/shouryaa_thakurrr/",
                linkedin: "https://www.linkedin.com/in/shourya-singh-197043289/",
                email: "se22uece015@mahindrauniversity.edu.in"
            },
            {
                name: "Venkat Vinesh Kumar Reddy",
                role: "Logistics Head",
                image: "/team/2024/venkat.png",
                instagram: "https://www.instagram.com/vinvortex007/",
                linkedin: "https://www.linkedin.com/in/venkat-vinesh-515ba52b5/",
                email: "se23ucse001@mahindrauniversity.edu.in"
            },
            {
                name: "Seerat Chatha",
                role: "Social Media Head",
                image: "/team/2024/seerat.jpeg",
                instagram: "https://www.instagram.com/seeer4ttt/",
                linkedin: "https://www.linkedin.com/in/seerat-chatha-249058322/",
                email: "seeratchatha06@gmail.com"
            },
            {
                name: "Pranav Reddy Mitta",
                role: "Design Head",
                image: "/team/2024/pranav.png",
                instagram: "https://www.instagram.com/pranavreddy.m/",
                linkedin: "https://www.linkedin.com/in/pranavreddymitta/",
                email: "se23ucse111@mahindrauniversity.edu.in"
            },
            {
                name: "Dev Bhandiya",
                role: "Finance Head",
                image: "/team/2024/dev.png",
                instagram: "anika.patel",
                linkedin: "https://www.linkedin.com/in/dev-m-bandhiya-2b25842a9/",
                email: "anika.p@student.mahindra.edu"
            }
        ]
    },
    {
        category: "Subject Group Leads",
        description: "Leads in charge of specific areas or topics within the math club",
        members: [
            {
                name: "Amithi Shangari",
                role: "Data Science and AI/ML Group Lead",
                image: "/team/2024/amithi.jpeg",
                instagram: "https://www.instagram.com/amithii_s",
                linkedin: "https://www.linkedin.com/in/amithishangari",
                email: "shangari.amithi@gmail.com"
            },
            {
                name: "Poojan Patel",
                role: "Cryptography Group Lead",
                image: "/team/2024/poojan.png",
                instagram: "https://www.instagram.com/_literally_poojan_",
                email: "poojanpatel236@gmail.com"
            },
            {
                name: "Nihaal Patnaik",
                role: "Financial Math Group Lead",
                image: "/team/2024/nihaal.jpg",
                instagram: "https://www.instagram.com/nihaal4312",
                linkedin: "https://www.linkedin.com/in/nihaal-patnaik-378010250/",
                email: "se22ucse050@mahindrauniversity.edu.in"
            }
        ]
    },
    {
        category: "Executive Team",
        description: "Volunteers who support the math club's activities and assist in organizing events or projects.",
        members: [
            {
                name: "Aashna Reddy",
                role: "Executive Team",
                image: "/team/2024/aashna.jpeg",
                instagram: "https://www.instagram.com/aashnaaa_reddy",
                email: "aashnapilla07@gmail.com"
            },
            {
                name: "Abhinav Jata",
                role: "Executive Team",
                image: "/team/2024/aj.png",
                instagram: "https://www.instagram.com/abhinav.jata/",
                linkedin: "https://www.linkedin.com/in/abhinav-jata",
                email: "abhinav.jata.986@gmail.com"
            },
            {
                name: "Geetika Pachauri",
                role: "Content Team",
                image: "/team/2024/geethika.jpg",
                email: "geetikapachauri12345@gmail.com"
            },
            {
                name: "Hinduja",
                role: "Design Team",
                image: "/team/2024/hinduja2.jpg",
                instagram: "https://www.instagram.com/hiinduja_",
                linkedin: "https://www.linkedin.com/in/hinduja-reddy-b87b8932b",
                email: "hiinduja.13@gmail.com"
            },
            {
                name: "Nitin Sailapathi",
                role: "Executive Team",
                image: "/team/2024/nitin.jpeg",
                instagram: "https://www.instagram.com/nitin.___.06",
                linkedin: "https://www.linkedin.com/in/nitin-sailapathi-652009331",
                email: "nitin06sailapathi@gmail.com"
            },
            {
                name: "Mohan Pritam K",
                role: "Executive Team",
                image: "/team/2024/mohan.jpg",
                instagram: "https://www.instagram.com/mohanpritamk",
                linkedin: "https://www.linkedin.com/in/mohan-pritam-k-318a26328",
                email: "mohanpritamk@gmail.com"
            },
            {
                name: "Pearl Mendapara",
                role: "Executive Team",
                image: "/team/2024/pearl.jpg",
                instagram: "https://www.instagram.com/_pearl.mendapara_",
                linkedin: "https://www.linkedin.com/in/pearl-mendapara-3495a0356",
                email: "se24ucam043@mahindrauniversity.edu.in"
            },
            {
                name: "Suhas Vadlapatla",
                role: "Social Media Team",
                image: "/team/2024/suhas.jpg",
                email: "se23ucse211@mahindrauniversity.edu.in"
            },
            {
                name: "Shriyans Bachu",
                role: "Finance Team",
                image: "/team/2024/bachu.jpg",
                instagram: "https://www.instagram.com/shriii_05/",
                email: "bachushriyans205@gmail.com"
            },
            {
                name: "Ucchishth Singh",
                role: "Executive Team",
                image: "/team/2024/ucchishth.png",
                instagram: "https://www.instagram.com/ucchishthsingh",
                email: "ucchishthsingh432@gmail.com"
            },
            {
                name: "Uddish",
                role: "Executive Team",
                image: "/team/2024/uddish.png",
                instagram: "https://www.instagram.com/uddish_03",
                linkedin: "https://www.linkedin.com/in/uddish-maini-3b9563356",
                email: "mainiuddish@gmail.com"
            },
        ]
    },
    {
        category: "Honorary Members",
        description: "Always been around to help us out.",
        members: [
            {
                name: "Bobba Dilip Reddy",
                role: "Math Wizard",
                image: "/team/2024/dilip.jpg",
                instagram: "https://www.instagram.com/bobbadilipreddy/",
                linkedin: "https://www.linkedin.com/in/dilip-reddy-bobba-459543333/",
                email: "se23ucse038@mahindrauniversity.edu.in"
            },
            {
                name: "Madhav Basur",
                role: "Maddy",
                image: "/team/2023/madhav.png",
                email: "se23ucam009@mahindrauniversity.edu.in"
            }
        ]
    }
];

const team2023 = [
    {
        category: "Faculty Mentors",
        description: "Our dedicated faculty guides who provide invaluable support.",
        members: [
            {
                name: "Biswarup Biswas",
                role: "Club Mentor",
                image: "/team/2024/biswarupbiswas.png",
                linkedin: "https://www.linkedin.com/in/biswarup-biswas-428a60230/",
                email: "biswarup.biswas@mahindrauniversity.edu.in"
            },
            {
                name: "Meraj Alam",
                role: "Club Mentor",
                image: "/team/2024/merajalam.png",
                linkedin: "https://www.linkedin.com/in/meraj-alam-96711b223/",
                email: "meraj.alam@mahindrauniversity.edu.in"
            }
        ]
    },
    {
        category: "Core Leads",
        description: "Main student leads who guide and make key decisions",
        members: [
            {
                name: "Nethra Naveen",
                role: "President",
                image: "/team/2023/nethra.png",
                instagram: "https://www.instagram.com/nethrabean/",
                linkedin: "https://www.linkedin.com/in/nethra-naveen-391317240/",
                email: "se22ucam015@mahindrauniversity.edu.in"
            },
            {
                name: "Abhirath",
                role: "Vice President",
                image: "/team/2023/abhirath.png",
                instagram: "https://www.instagram.com/ankit.reddy_/",
                linkedin: "https://www.linkedin.com/in/saiankit-shankar/",
                email: "se21ucam013@mahindrauniversity.edu.in"
            },
            {
                name: "Tamish Jain",
                role: "Head of Subject Groups",
                image: "/team/2023/tamish.png",
                instagram: "https://www.instagram.com/tamish.j/",
                email: "se21uari166@mahindrauniversity.edu.in"
            },
            {
                name: "Vrishiketu Singhania",
                role: "Logistics & Finance Head",
                image: "/team/2023/vrish.png",
                instagram: "https://www.instagram.com/vrishketu_singhania/",
                email: "se22ucam012@mahindrauniversity.edu.in"
            },
            {
                name: "Utkarsh Mangal",
                role: "Social Media & Content Head",
                image: "/team/2023/utkarsh.png",
                instagram: "https://www.instagram.com/_utkarsh_mangal/",
                linkedin: "https://www.linkedin.com/in/utkarsh-mangal2/",
                email: "se22ucam015@mahindrauniversity.edu.in"
            },
            {
                name: "Spoorthi Vattem",
                role: "Design Head",
                image: "/team/2023/spoorthi.png",
                instagram: "https://www.instagram.com/spoorthi_vattem/",
                email: "se22uari165@mahindrauniversity.edu.in"
            }
        ]
    },
    {
        category: "Subject Group Leads",
        description: "Leads in charge of specific areas or topics within the math club",
        members: [
            {
                name: "Sumedha Pandravada",
                role: "AI/ML Group Lead",
                image: "/team/2023/sumedha.png",
                instagram: "https://www.instagram.com/_sumedhaaaa_/",
                email: "se21ucse222@mahindrauniversity.edu.in"
            },
            {
                name: "B.N. Varun",
                role: "Data Science Lead",
                image: "/team/2023/varun.png",
                instagram: "https://www.instagram.com/_varun_278/",
                email: "se22ucse042@mahindrauniversity.edu.in"
            },
            {
                name: "Srivathsan",
                role: "Number Theory & Cryptography Group Lead",
                image: "/team/2023/srivat.png",
                email: "se21uari161@mahindrauniversity.edu.in"
            }
        ]
    },
    {
        category: "Executive Team",
        description: "Volunteers who support the math club's activities and assist in organizing events or projects.",
        members: [
            {
                name: "Sai Ankit Shankar",
                role: "Executive Team",
                image: "/team/2023/ankit.png",
                instagram: "https://www.instagram.com/ankit.reddy_/",
                linkedin: "https://www.linkedin.com/in/saiankit-shankar/",
                email: "se23ucse160@mahindrauniversity.edu.in"
            },
            {
                name: "Bobba Dilip Reddy",
                role: "Executive Team",
                image: "/team/2023/dilip.png",
                instagram: "https://www.instagram.com/bobbadilipreddy/",
                linkedin: "https://www.linkedin.com/in/dilip-reddy-bobba-459543333/",
                email: "se23ucse038@mahindrauniversity.edu.in"
            },
            {
                name: "Tanishka Wagh",
                role: "Executive Team",
                image: "/team/2023/wagh.png",
                instagram: "https://www.instagram.com/tanishka_wagh_2305/",
                linkedin: "https://www.linkedin.com/in/tanishkawagh/",
                email: "se23ucam024@mahindrauniversity.edu.in"
            },
            {
                name: "Madhav Basur",
                role: "Executive Team",
                image: "/team/2023/madhav.png",
                email: "se23ucam009@mahindrauniversity.edu.in"
            },
            {
                name: "Shrivatsh K Subramaniam",
                role: "Executive Team",
                image: "/team/2023/shrivat.png",
                instagram: "https://www.instagram.com/darkrizer_2705/",
                email: " se23uari115@mahindrauniversity.edu.in"
            },
            {
                name: "Chirag Goyal",
                role: "Executive Team",
                image: "/team/2023/chirag.png",
                instagram: "https://www.instagram.com/chirag.18._2004/",
                email: "se23ucse050@mahindrauniversity.edu.in"
            }
        ]
    }
];

// Available team years
const teamYears = [
    { year: 2024, data: team2024 },
    { year: 2023, data: team2023 }
];

// Team Member Card Component
function TeamMemberCard({ member }) {
    return (
        <div className="bg-white dark:bg-slate-800/70 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
            <div className="flex flex-row h-full">
                {/* Image container - now on the left side for wider screens */}
                <div className="w-1/3 relative">
                    <div className="aspect-[4/5] md:h-full relative">
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    </div>
                </div>

                {/* Content container - now on the right side */}
                <div className="p-5 w-2/3 flex flex-col justify-between">
                    <div>
                        <h3 className={`${dmSerifDisplay.className} text-xl font-normal text-blue-800 dark:text-blue-300 mb-1`}>
                            {member.name}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {member.role}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4">
                        {member.instagram && (
                            <a
                                href={`${member.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400 transition-colors"
                                aria-label={`${member.name}'s Instagram`}
                            >
                                <Instagram size={18} />
                            </a>
                        )}
                        {member.linkedin && (
                            <a
                                href={`${member.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                aria-label={`${member.name}'s LinkedIn`}
                            >
                                <Linkedin size={18} />
                            </a>
                        )}
                        {member.email && (
                            <a
                                href={`mailto:${member.email}`}
                                className="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
                                aria-label={`Email ${member.name}`}
                            >
                                <Mail size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Category Section Component
function TeamCategorySection({ category, expanded, toggleExpand }) {
    return (
        <section className="mb-16">
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={toggleExpand}
            >
                <h2 className={`${dmSerifDisplay.className} text-2xl md:text-3xl font-normal text-blue-800 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                    {category.category}
                </h2>
                <button
                    className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transform transition-transform"
                    aria-label={expanded ? "Collapse section" : "Expand section"}
                >
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>

            <p className={`${sourceSerif.className} text-slate-600 dark:text-slate-400 mt-2 mb-8 max-w-3xl`}>
                {category.description}
            </p>

            {expanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.members.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function AboutPage() {
    // State to track which categories are expanded
    const [expandedCategories, setExpandedCategories] = useState({
        "Faculty Mentors": true,
        "Core Leads": true,
        "Subject Group Leads": true,
        "Executive Team": true,
        "Honorary Members": true
    });

    // State for currently selected team year
    const [selectedTeamYear, setSelectedTeamYear] = useState(2024);

    // State for dropdown visibility
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Get the current team data based on selected year
    const currentTeamData = teamYears.find(team => team.year === selectedTeamYear)?.data || team2024;

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(prev => !prev);
    };

    // Handle team year selection
    const selectTeamYear = (year) => {
        setSelectedTeamYear(year);
        setDropdownVisible(false);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={`${dmSerifDisplay.className} text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-blue-800 dark:text-blue-300`}>
                        About Us
                    </h1>
                    <p className={`${sourceSerif.className} text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed`}>
                        The Mathematics Society at Mahindra University brings together minds passionate about mathematics.
                        We are students, researchers, and enthusiasts united by our love for mathematical exploration and discovery.
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-baseline mb-12">
                        <h2 className={`${dmSerifDisplay.className} text-3xl md:text-4xl font-normal text-blue-800 dark:text-blue-300`}>
                            Our Team {selectedTeamYear}
                        </h2>
                        <div className="relative inline-block">
                            <button
                                className="flex items-center text-blue-600 dark:text-blue-400 hover:underline px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={toggleDropdown}
                                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                            >
                                <Users size={18} className="mr-1.5" />
                                <span className="mr-1">Team Years</span>
                                <ChevronDown size={15} className={`transform transition-transform duration-300 ${dropdownVisible ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`
                                    absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-hidden 
                                    border border-slate-100 dark:border-slate-700 z-10 transform transition-all duration-200 origin-top-right
                                    ${dropdownVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                                `}
                            >
                                {teamYears.map((team, index) => (
                                    <button
                                        key={index}
                                        onClick={() => selectTeamYear(team.year)}
                                        className={`block w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 
                                            hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
                                            ${selectedTeamYear === team.year ? 'bg-blue-50 dark:bg-blue-900/20 font-medium' : ''}
                                        `}
                                    >
                                        {team.year} Team
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team categories */}
                    {currentTeamData.map((category, index) => (
                        <TeamCategorySection
                            key={`${selectedTeamYear}-${category.category}`}
                            category={category}
                            expanded={expandedCategories[category.category]}
                            toggleExpand={() => toggleCategory(category.category)}
                        />
                    ))}
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="py-16 px-6 bg-gradient-to-b from-white/0 to-blue-100 dark:from-slate-900/0 dark:to-blue-950/30">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className={`${dmSerifDisplay.className} text-3xl font-normal mb-6 text-blue-800 dark:text-blue-300`}>
                        Join Our Community
                    </h2>
                    <p className={`${sourceSerif.className} text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto`}>
                        Interested in mathematics, problem-solving, or just looking for a community of like-minded thinkers?
                        The Mathematics Society welcomes everyone, regardless of major or experience level.
                    </p>
                </div>
            </section>
        </div>
    );
}