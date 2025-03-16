'use client'
import Image from "next/image";
import { DM_Serif_Display, Source_Serif_4 } from "next/font/google";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import Link from "next/link";

function BlackjackGame() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gamePhase, setGamePhase] = useState('initial'); // 'initial', 'playerTurn', 'dealerTurn', 'gameOver'
  const [result, setResult] = useState('');
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [message, setMessage] = useState('Start a new game');

  // Game constants
  const suits = ["♦", "♥", "♠", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const colors = {
    "♦": "text-red-500",
    "♥": "text-red-500",
    "♠": "text-slate-900 dark:text-white",
    "♣": "text-slate-900 dark:text-white"
  };

  // Initialize a fresh deck of cards
  const initializeDeck = () => {
    const newDeck = [];
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({ suit, value, hidden: false });
      });
    });

    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  };

  // Calculate hand value
  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.hidden) return;

      if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    });

    // Adjust for aces if needed
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  // Draw a single card from the deck
  const drawCard = (hidden = false) => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    if (card) card.hidden = hidden;
    setDeck(newDeck);
    return card;
  };

  // Start a new game
  const startNewGame = () => {
    const newDeck = initializeDeck();
    setDeck(newDeck);

    // Deal initial cards
    const pCard1 = newDeck.pop();
    const dCard1 = newDeck.pop();
    const pCard2 = newDeck.pop();
    const dCard2 = { ...newDeck.pop(), hidden: true };

    const pHand = [pCard1, pCard2];
    const dHand = [dCard1, dCard2];

    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDeck(newDeck);

    const pScore = calculateHandValue(pHand);
    setPlayerScore(pScore);
    setDealerScore(calculateHandValue([dCard1])); // Only show value of visible card

    setGamePhase('playerTurn');
    setMessage("Your move: Hit or Stand?");

    // Check for natural blackjack
    if (pScore === 21) {
      handleDealerTurn(pHand, dHand, newDeck);
    }
  };

  // Player hits (draws another card)
  const handleHit = () => {
    if (gamePhase !== 'playerTurn') return;

    const card = drawCard();
    if (!card) return;

    const newPlayerHand = [...playerHand, card];
    setPlayerHand(newPlayerHand);

    const newScore = calculateHandValue(newPlayerHand);
    setPlayerScore(newScore);

    // Check for bust
    if (newScore > 21) {
      setGamePhase('gameOver');
      setResult('Player Bust!');
      setMessage("You went over 21. Dealer wins.");
      setTotalLosses(prev => prev + 1);
      // Reveal dealer's hidden card
      const updatedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }));
      setDealerHand(updatedDealerHand);
      setDealerScore(calculateHandValue(updatedDealerHand));
    } else if (newScore === 21) {
      handleDealerTurn(newPlayerHand, dealerHand, deck);
    }
  };

  // Player stands (ends turn)
  const handleStand = () => {
    if (gamePhase !== 'playerTurn') return;
    handleDealerTurn(playerHand, dealerHand, deck);
  };

  // Dealer's turn
  const handleDealerTurn = (pHand, dHand, currentDeck) => {
    setGamePhase('dealerTurn');

    // Reveal dealer's hidden card
    let updatedDealerHand = dHand.map(card => ({ ...card, hidden: false }));
    let dealerTotal = calculateHandValue(updatedDealerHand);
    let newDeck = [...currentDeck];

    // Dealer draws until 17 or higher
    while (dealerTotal < 17) {
      const card = newDeck.pop();
      if (!card) break;

      updatedDealerHand = [...updatedDealerHand, card];
      dealerTotal = calculateHandValue(updatedDealerHand);
    }

    setDealerHand(updatedDealerHand);
    setDealerScore(dealerTotal);
    setDeck(newDeck);

    // Determine winner
    const playerTotal = calculateHandValue(pHand);

    setTimeout(() => {
      setGamePhase('gameOver');

      if (dealerTotal > 21) {
        setResult('Dealer Bust!');
        setMessage("Dealer went over 21. You win!");
        setTotalWins(prev => prev + 1);
      } else if (playerTotal > dealerTotal) {
        setResult('Player Wins!');
        setMessage(`Your ${playerTotal} beats dealer's ${dealerTotal}!`);
        setTotalWins(prev => prev + 1);
      } else if (dealerTotal > playerTotal) {
        setResult('Dealer Wins!');
        setMessage(`Dealer's ${dealerTotal} beats your ${playerTotal}.`);
        setTotalLosses(prev => prev + 1);
      } else {
        setResult('Push!');
        setMessage(`It's a tie at ${playerTotal}.`);
      }
    }, 1000);
  };

  // Initialize the game on component mount
  useEffect(() => {
    const savedWins = localStorage.getItem('blackjack-wins');
    const savedLosses = localStorage.getItem('blackjack-losses');

    if (savedWins) setTotalWins(parseInt(savedWins));
    if (savedLosses) setTotalLosses(parseInt(savedLosses));
  }, []);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem('blackjack-wins', totalWins);
    localStorage.setItem('blackjack-losses', totalLosses);
  }, [totalWins, totalLosses]);

  return (
    <div className="relative w-full mx-auto perspective-1000">
      {/* Game stats - Using light blue accent in dark mode */}
      {/* <div className="absolute top-2 left-0 w-full flex justify-between items-center px-4 py-1 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30 rounded px-2 py-0.5 backdrop-blur-sm">
            Wins: {totalWins}
          </span>
          <span className="text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-900/30 rounded px-2 py-0.5 backdrop-blur-sm">
            Losses: {totalLosses}
          </span>
        </div>
      </div> */}

      {/* Game container with subtle blue accents */}
      <div className="p-6 pt-15 rounded-xl min-h-[280px] flex flex-col justify-between">

        {/* Game message - Blue themed */}
        <div className={`text-center mx-auto max-w-md py-2 px-4 mb-4 rounded-lg backdrop-blur-sm ${gamePhase === 'gameOver'
          ? (result === 'Player Wins!' || result === 'Dealer Bust!')
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            : result === 'Push!'
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
          : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
          }`}>
          <p className="font-medium">{message}</p>
          {gamePhase === 'gameOver' && (
            <p className="text-xs mt-1 opacity-80">Press &quot;New Game&quot; to continue</p>
          )}
        </div>

        {/* Card layout with blue accents */}
        <div className="flex flex-row justify-between items-start gap-6 my-5">
          {/* Dealer's cards and score */}
          <div className="w-1/2 text-center flex flex-col items-center">
            <p className="text-blue-800/80 dark:text-blue-200/80 mb-3 text-sm uppercase tracking-wide font-medium">Dealer</p>
            <div className="relative h-40 w-40 mb-3 perspective-1000">
              {dealerHand.length > 0 ? (
                // Show actual cards when game is in progress
                dealerHand.map((card, i) => (
                  <div
                    key={i}
                    className={`absolute left-1/2 perspective-1000 transform -translate-x-1/2 transition-all duration-500`}
                    style={{
                      zIndex: i + 1,
                      transformStyle: 'preserve-3d',
                      transitionDelay: `${i * 100}ms`,
                      transform: `translateX(${i * 18 - playerHand.length * 9}px) translateY(${i % 2 === 0 ? -4 : 4}px) rotateZ(${i % 2 === 0 ? -10 : 10}deg)`
                    }}
                  >
                    <div
                      className={`w-24 h-32 rounded-lg shadow-lg transform transition-transform duration-300 ${gamePhase !== 'initial' ? 'hover:scale-105 hover:-translate-y-2' : ''
                        } cursor-default`}
                    >
                      {/* Front face - Better differentiated in light/dark mode */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex flex-col items-center justify-center border-2 border-white/80 dark:border-blue-900/40 backface-hidden">
                        <span className={`absolute top-2 left-2 text-base font-bold ${colors[card.suit]}`}>{card.value}</span>
                        <span className={`text-4xl ${colors[card.suit]}`}>{card.suit}</span>
                        <span className={`absolute bottom-2 right-2 text-base font-bold ${colors[card.suit]} rotate-180`}>{card.value}</span>
                      </div>

                      {/* Back face - Blue themed */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-lg flex items-center justify-center backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <div className="w-14 h-18 border-2 border-white/40 dark:border-blue-300/40 rounded-lg flex items-center justify-center">
                          <span className="text-white/80 dark:text-blue-100/80 text-3xl">?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Placeholder card when game hasn't started
                <>
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 rotate-[-5deg]"
                    style={{ zIndex: 1 }}
                  >
                    <div className="w-24 h-32 rounded-lg shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80 dark:from-blue-700/80 dark:to-indigo-800/80 rounded-lg flex items-center justify-center border-2 border-white/30 dark:border-blue-300/20">
                        <div className="w-14 h-18 border-2 border-white/30 dark:border-blue-300/30 rounded-lg flex items-center justify-center">
                          <span className="text-white/70 dark:text-blue-100/70 text-3xl">?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 rotate-[5deg]"
                    style={{ zIndex: 2 }}
                  >
                    <div className="w-24 h-32 rounded-lg shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80 dark:from-blue-700/80 dark:to-indigo-800/80 rounded-lg flex items-center justify-center border-2 border-white/30 dark:border-blue-300/20">
                        <div className="w-14 h-18 border-2 border-white/30 dark:border-blue-300/30 rounded-lg flex items-center justify-center">
                          <span className="text-white/70 dark:text-blue-100/70 text-3xl">?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div>
              <span className="inline-block bg-blue-600/20 dark:bg-blue-800/40 backdrop-blur-sm border border-blue-500/30 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-bold">
                {dealerScore || '0'}
              </span>
            </div>
          </div>

          {/* Player's cards and score */}
          <div className="w-1/2 text-center flex flex-col items-center">
            <p className="text-blue-800/80 dark:text-blue-200/80 mb-3 text-sm uppercase tracking-wide font-medium">Your Hand</p>
            <div className="relative h-40 w-40 mb-3 perspective-1000">
              {playerHand.length > 0 ? (
                // Show actual cards when game is in progress
                playerHand.map((card, i) => (
                  <div
                    key={i}
                    className={`absolute left-1/2 perspective-1000 transform -translate-x-1/2 transition-all duration-500 hover:z-20`}
                    style={{
                      zIndex: i + 1,
                      transformStyle: 'preserve-3d',
                      transitionDelay: `${i * 100}ms`,
                      transform: `translateX(${i * 18 - playerHand.length * 9}px) translateY(${i % 2 === 0 ? -4 : 4}px) rotateZ(${i % 2 === 0 ? -10 : 10}deg)`
                    }}
                  >
                    <div
                      className={`w-24 h-32 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110 hover:-translate-y-2 cursor-default`}
                    >
                      {/* Card front - Better differentiated in light/dark mode */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex flex-col items-center justify-center border-2 border-white/80 dark:border-blue-900/40">
                        <span className={`absolute top-2 left-2 text-base font-bold ${colors[card.suit]}`}>{card.value}</span>
                        <span className={`text-4xl ${colors[card.suit]}`}>{card.suit}</span>
                        <span className={`absolute bottom-2 right-2 text-base font-bold ${colors[card.suit]} rotate-180`}>{card.value}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Placeholder cards when game hasn't started
                <>
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 rotate-[-5deg]"
                    style={{ zIndex: 1 }}
                  >
                    <div className="w-24 h-32 rounded-lg shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80 dark:from-blue-700/80 dark:to-indigo-800/80 rounded-lg flex items-center justify-center border-2 border-white/30 dark:border-blue-300/20">
                        <div className="w-14 h-18 border-2 border-white/30 dark:border-blue-300/30 rounded-lg flex items-center justify-center">
                          <span className="text-white/70 dark:text-blue-100/70 text-3xl">?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 rotate-[5deg]"
                    style={{ zIndex: 2 }}
                  >
                    <div className="w-24 h-32 rounded-lg shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80 dark:from-blue-700/80 dark:to-indigo-800/80 rounded-lg flex items-center justify-center border-2 border-white/30 dark:border-blue-300/20">
                        <div className="w-14 h-18 border-2 border-white/30 dark:border-blue-300/30 rounded-lg flex items-center justify-center">
                          <span className="text-white/70 dark:text-blue-100/70 text-3xl">?</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div>
              <span className="inline-block bg-blue-600/20 dark:bg-blue-800/40 backdrop-blur-sm border border-blue-500/30 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-md text-sm font-bold">
                {playerScore || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Game controls - Blue-themed buttons with better light/dark mode support */}
        <div className="flex justify-around gap-4 mt-5">
          {gamePhase === 'initial' ? (
            <button
              onClick={startNewGame}
              className="px-7 py-2.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 rounded-full text-white font-semibold text-sm shadow-lg shadow-blue-900/20 dark:shadow-blue-900/40 transition-all hover:-translate-y-0.5"
            >
              Deal Cards
            </button>
          ) : gamePhase === 'playerTurn' ? (
            <>
              <button
                onClick={handleHit}
                className="px-7 py-2.5 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 hover:from-blue-700/90 hover:to-cyan-600/90 rounded-full text-white font-semibold text-sm shadow-lg shadow-blue-900/20 dark:shadow-blue-900/40 transition-all hover:-translate-y-0.5"
              >
                Hit Me
              </button>
              <button
                onClick={handleStand}
                className="px-7 py-2.5 bg-gradient-to-r from-indigo-600/90 to-blue-500/90 hover:from-indigo-700/90 hover:to-blue-600/90 rounded-full text-white font-semibold text-sm shadow-lg shadow-blue-900/20 dark:shadow-blue-900/40 transition-all hover:-translate-y-0.5"
              >
                Stand
              </button>
            </>
          ) : gamePhase === 'dealerTurn' ? (
            <button
              disabled
              className="px-7 py-2.5 bg-gradient-to-r from-slate-600/90 to-slate-500/90 rounded-full text-white font-semibold text-sm opacity-70 cursor-not-allowed"
            >
              Dealer&apos;s Turn...
            </button>
          ) : (
            <button
              onClick={startNewGame}
              className="px-7 py-2.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 rounded-full text-white font-semibold text-sm shadow-lg shadow-blue-900/20 dark:shadow-blue-900/40 transition-all hover:-translate-y-0.5"
            >
              New Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Import the fonts
const dmSerifDisplay = DM_Serif_Display({
  weight: "400", // DM Serif Display only has 400 weight
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Full height with vertical centering */}
      <section className="h-[110vh] md:h-[85vh] flex flex-col items-center justify-start md:justify-around px-6 relative">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Title shifted to left on desktop */}
          <div className="md:max-w-2xl mb-20 md:mb-0">
            <h1 className={`${dmSerifDisplay.className} text-6xl md:text-7xl lg:text-8xl mt-20 md:mt-0 font-normal tracking-tight leading-none mb-6`}>
              <span className="block text-black dark:text-white">The</span>
              <span className="block text-blue-600 dark:text-blue-400">Mathematics</span>
              <span className="block text-black dark:text-white">Society</span>
            </h1>
            <p className={`${sourceSerif.className} text-xl md:text-2xl text-slate-600 dark:text-slate-400 mt-6 font-light`}>
              @ Mahindra University
            </p>
          </div>
          {/* Game Board */}
          <div className="max-w-[90%] sm:max-w-md md:max-w-lg mx-auto overflow-hidden transform scale-[0.85] sm:scale-90 md:scale-100">
            <BlackjackGame />
          </div>
        </div>
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="py-24 px-6 relative">
        {/* Enhanced blurred backdrop with better opacity and blur */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/10 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className={`${dmSerifDisplay.className} text-3xl md:text-4xl font-normal mb-12 text-left`}>Who Are We</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Description - text alignment fixed to left */}
            <div className="space-y-6">
              <p className={`${sourceSerif.className} text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 text-left`}>
                The Mathematics Society at Mahindra University is a community of passionate individuals united by their love for mathematical sciences. Founded with the vision to foster mathematical curiosity and excellence, we provide a platform for students to explore the beauty and power of mathematics beyond the classroom.
              </p>
              <div className="pt-4">
                <a
                  href="/about"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Learn more about us
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Image Carousel - reduced size, fixed arrows */}
            <div className="w-full md:max-w-md mx-auto">
              <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <CarouselItem key={index}>
                      <div className="p-1 h-full">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden aspect-[16/10] relative shadow-md">
                          <Image
                            src={`/images/gallery/mathsoc-${index}.jpg`}
                            alt={`Mathematics Society image ${index}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                            priority={index === 1}
                          />
                        </div>
                        <p className={`${sourceSerif.className} text-sm text-center mt-2 text-slate-600 dark:text-slate-400`}>
                          {["Euler's Quest", "Number Nostalgia", "Number Nostalgia", "Proof by Deceit", "Subject Group Primer"][index - 1]}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Fixed carousel navigation buttons for better visibility on all devices */}
                <CarouselPrevious className="left-5 lg:left-5 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700" />
                <CarouselNext className="right-5 lg:right-5 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>
      {/* What We Do Section */}
      <section className="py-24 px-6 relative pb-50">
        {/* Alternating backdrop style */}
        <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-900/0 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className={`${dmSerifDisplay.className} text-3xl md:text-4xl font-normal mb-12 text-left`}>What We Do</h2>

          {/* Cards Grid - Enhanced visual appeal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1: Events - Enhanced */}
            <div className="group bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-800/90 dark:to-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100/30 dark:border-blue-900/30">
              <div className="h-52 bg-blue-50 dark:bg-blue-900/20 relative overflow-hidden group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center text-blue-500 dark:text-blue-400 transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-100/80 dark:from-blue-900/50 to-transparent h-24 flex items-end p-6">
                  <h3 className={`${dmSerifDisplay.className} text-2xl font-normal text-blue-700 dark:text-blue-300`}>
                    Events
                  </h3>
                </div>
              </div>
              <div className="p-7">
                <p className={`${sourceSerif.className} text-slate-700 dark:text-slate-300 mb-5 leading-relaxed`}>
                  We organize regular workshops, competitions, and guest lectures that bring mathematics to life outside the classroom.
                </p>
                <Link href="/events" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium group-hover:font-semibold transition-all">
                  Explore our events
                  <svg className="ml-2 w-4 h-4 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 2: Subject Groups - Enhanced */}
            <div className="group bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-800/90 dark:to-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-indigo-100/30 dark:border-indigo-900/30">
              <div className="h-52 bg-indigo-50 dark:bg-indigo-900/20 relative overflow-hidden group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center text-indigo-500 dark:text-indigo-400 transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-indigo-100/80 dark:from-indigo-900/50 to-transparent h-24 flex items-end p-6">
                  <h3 className={`${dmSerifDisplay.className} text-2xl font-normal text-indigo-700 dark:text-indigo-300`}>
                    Subject Groups
                  </h3>
                </div>
              </div>
              <div className="p-7">
                <p className={`${sourceSerif.className} text-slate-700 dark:text-slate-300 mb-5 leading-relaxed`}>
                  Our specialized interest groups focus on different areas of mathematics, from pure theory to applied problem-solving.
                </p>
                <Link href="/activities/subject-groups" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline font-medium group-hover:font-semibold transition-all">
                  Join a group
                  <svg className="ml-2 w-4 h-4 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 3: Changed from Activities to Community Service */}
            <div className="group bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-800/90 dark:to-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-violet-100/30 dark:border-violet-900/30">
              <div className="h-52 bg-violet-50 dark:bg-violet-900/20 relative overflow-hidden group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center text-violet-500 dark:text-violet-400 transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-violet-100/80 dark:from-violet-900/50 to-transparent h-24 flex items-end p-6">
                  <h3 className={`${dmSerifDisplay.className} text-2xl font-normal text-violet-700 dark:text-violet-300`}>
                    Community Service
                  </h3>
                </div>
              </div>
              <div className="p-7">
                <p className={`${sourceSerif.className} text-slate-700 dark:text-slate-300 mb-5 leading-relaxed`}>
                  We use mathematics to make a positive impact in our community through tutoring, outreach programs, and educational initiatives.
                </p>
                <Link href="/activities/community-service" className="inline-flex items-center text-violet-600 dark:text-violet-400 hover:underline font-medium group-hover:font-semibold transition-all">
                  See our impact
                  <svg className="ml-2 w-4 h-4 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}