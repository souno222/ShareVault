import CTASection from "../components/landing/CTASection";
import HeroSection from "../components/landing/HeroSection";
import TestimonialSection from "../components/landing/TestimonialSection";
import FeatureSection from "../components/landing/FeatureSection";
import PricingSection from "../components/landing/PricingSection"; 
import FooterSection from "../components/landing/FooterSection"; 
import { features,pricingPlans,testimonials } from "../assets/data.js";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Landing = () => {
    const {openSignIn,openSignUp} = useClerk();
    const {isSignedIn} = useUser();
    const navigate= useNavigate();
    useEffect(() => {
        if (isSignedIn) {
            navigate("/dashboard");
        }
    }, [isSignedIn, navigate]);
    return(
        <div className="landing-page bg-gradient-to-b from-gray-50 to gray-100">
            {/*Hero Section*/}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp}/>
            {/*Feature*/}
            <FeatureSection features={features}/>
            {/*Pricing*/}
            <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
            {/*Testimonials*/}
            <TestimonialSection testimonials={testimonials}/>
            {/*Call to Action*/}
            <CTASection openSignUp={openSignUp}/>
            {/*Footer*/}
            <FooterSection/>
        </div>
    )
}

export default Landing;
