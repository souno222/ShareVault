import {useClerk} from "@clerk/clerk-react";

const CTASection = ({ isSignedIn, navigate }) => {
    const {openSignUp} = useClerk();
    return (
        <div className="bg-purple-600">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        <span className="block mb-2">Ready to get started?</span>
                        <span className="block text-purple-100 text-3xl sm:text-4xl">Create your account today</span>
                </h2>
                <div className="mt-10 lg:mt-0 flex lg:flex-shrink-0">
                    <button 
                        onClick={() => isSignedIn ? navigate('/dashboard') : openSignUp()}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-purple-600 bg-white hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Sign up for free
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CTASection;
