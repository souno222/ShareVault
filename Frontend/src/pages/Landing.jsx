import LandingNav from "../components/landing/LandingNav";
import CTASection from "../components/landing/CTASection";
import HeroSection from "../components/landing/HeroSection";
import TestimonialSection from "../components/landing/TestimonialSection";
import FeatureSection from "../components/landing/FeatureSection";
import PricingSection from "../components/landing/PricingSection";
import FooterSection from "../components/landing/FooterSection";
import { features, pricingPlans, testimonials } from "../assets/data.js";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    return (
        <div style={{ background: "var(--color-paper-white)", minHeight: "100vh" }}>
            {/* Navigation */}
            <LandingNav
                isSignedIn={isSignedIn}
                navigate={navigate}
            />

            {/* Main content */}
            <main>
                {/* Hero */}
                <HeroSection
                    isSignedIn={isSignedIn}
                    navigate={navigate}
                />

                {/* Features */}
                <FeatureSection features={features} />

                {/* Pricing */}
                <PricingSection pricingPlans={pricingPlans} navigate={navigate} />

                {/* Testimonials */}
                <TestimonialSection testimonials={testimonials} />

                {/* CTA */}
                <CTASection
                    isSignedIn={isSignedIn}
                    navigate={navigate}
                />
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
};

export default Landing;
