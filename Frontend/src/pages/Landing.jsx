import CTASection from "../components/landing/CTASection";
import HeroSection from "../components/landing/HeroSection";
import TestimonialSection from "../components/landing/TestimonialSection";
import FeatureSection from "../components/landing/FeatureSection";
import PricingSection from "../components/landing/PricingSection"; 
import FooterSection from "../components/landing/FooterSection"; 
import { features,pricingPlans,testimonials } from "../assets/data.js";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const {openSignIn,openSignUp} = useClerk();
    const {isSignedIn} = useUser();
    const navigate= useNavigate();
    
    return(
        <div className="landing-page bg-white">
            {/*Hero Section*/}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} isSignedIn={isSignedIn} navigate={navigate}/>
            {/*Feature*/}
            <FeatureSection features={features}/>
            {/*Pricing*/}
            <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
            {/*Testimonials*/}
            <TestimonialSection testimonials={testimonials}/>
            {/*Call to Action*/}
            <CTASection isSignedIn={isSignedIn} navigate={navigate}/>
            {/*Footer*/}
            <FooterSection/>
        </div>
    )
}

export default Landing;
