import { useState, useEffect } from 'react';
import {
    BarChart3,
    Mountain,
    Zap,
    Leaf,
    Smartphone,
    Bell,
    Droplets,
    Menu,
    X,

} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        districts: 0,
        monitors: 0,
        uptime: 0,
        citizens: 0
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const statsSection = document.getElementById('stats');
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => observer.disconnect();
    }, []);

    const animateStats = () => {
        const targets = { districts: 20, monitors: 500, uptime: 99.7, citizens: 750 };
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setAnimatedStats({
                districts: Math.floor(targets.districts * progress),
                monitors: Math.floor(targets.monitors * progress),
                uptime: Math.min(targets.uptime * progress, 99.7),
                citizens: Math.floor(targets.citizens * progress)
            });

            if (step >= steps) {
                clearInterval(timer);
                setAnimatedStats(targets);
            }
        }, stepTime);
    };

    const features = [
        {
            icon: BarChart3,
            title: "Real-time Monitoring",
            description: "Track water levels, quality, and flow rates across rivers, reservoirs, and distribution networks throughout Bhutan's unique terrain."
        },
        {
            icon: Mountain,
            title: "Himalayan Water Sources",
            description: "Monitor glacial melt, seasonal variations, and high-altitude water sources critical to Bhutan's water security."
        },
        {
            icon: Zap,
            title: "Hydropower Integration",
            description: "Optimize water allocation for both community needs and hydroelectric power generation, balancing development with conservation."
        },
        {
            icon: Leaf,
            title: "Sustainable Practices",
            description: "Align water management with Bhutan's Gross National Happiness philosophy and carbon-neutral commitments."
        },
        {
            icon: Smartphone,
            title: "Community Access",
            description: "Provide dzongkhag and gewog administrators with tools to manage local water resources effectively."
        },
        {
            icon: Bell,
            title: "Early Warning System",
            description: "Prevent water shortages and flooding with predictive analytics and automated alerts for extreme weather events."
        }
    ];

    const FloatingElements = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute w-5 h-5 bg-white/10 rounded-full animate-bounce`}
                    style={{
                        left: `${10 + i * 20}%`,
                        animationDelay: `${i}s`,
                        animationDuration: '6s'
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">

                        {/* Logo */}
                        <div className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                            <Droplets className="w-6 h-6" />
                            <span>DrukWater</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8 mr-16">
                            <Link
                                to="/login"
                                className="border px-4 py-2 rounded-full bg-amber-500 font-bold hover:text-blue-600 text-white transition-colors duration-200"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                aria-label="Toggle Menu"
                                aria-expanded={isMobileMenuOpen}
                                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6 transition-transform duration-300" />
                                ) : (
                                    <Menu className="w-6 h-6 transition-transform duration-300" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    <div
                        className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="flex flex-col space-y-2 pb-4">
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-2 py-1"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>



            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800" />

                {/* Animated Wave Background */}
                <div className="absolute inset-0">
                    <svg
                        className="absolute bottom-0 w-full h-32 animate-pulse"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,85.3C672,96,768,96,864,90.7C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                            fill="rgba(255,255,255,0.1)"
                        />
                    </svg>
                </div>

                <FloatingElements />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                        Smart Water Management for Bhutan
                    </h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                        Protecting our precious water resources through innovative technology and sustainable practices.
                        Monitor, analyze, and optimize water usage across the Kingdom of Bhutan.
                    </p>
                    <Link
                        to="/dashboard"
                        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"


                    >
                        Access Dashboard
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Comprehensive Water Management
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Water Resources at a Glance
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold">
                                {animatedStats.districts}+
                            </h3>
                            <p className="text-lg opacity-90">Districts Connected</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold">
                                {animatedStats.monitors}+
                            </h3>
                            <p className="text-lg opacity-90">Monitoring Points</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold">
                                {animatedStats.uptime.toFixed(1)}%
                            </h3>
                            <p className="text-lg opacity-90">System Uptime</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold">
                                {animatedStats.citizens}K+
                            </h3>
                            <p className="text-lg opacity-90">Citizens Served</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-20 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Intuitive Dashboard Interface
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Access comprehensive water data, generate reports, and make informed decisions
                            with our user-friendly dashboard designed for Bhutan's water management needs.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
                        <div className="flex space-x-2 mb-6">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>

                        <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex flex-col items-center justify-center text-center">
                            <BarChart3 className="w-16 h-16 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold text-blue-800 mb-2">
                                Interactive Water Management Dashboard
                            </h3>
                            <p className="text-blue-600/70">
                                Real-time data visualization and controls
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-lg mb-4">
                        © 2025 Bhutan Water Management System. Committed to preserving Bhutan's water heritage for future generations.
                    </p>
                    <p className="text-gray-400">
                        🏰 Serving the Land of the Thunder Dragon 🐉
                    </p>
                </div>
            </footer>


        </div>
    );
}