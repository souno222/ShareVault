import TextType from '../TextType';
const HeroSection = ({ openSignIn, openSignUp, isSignedIn, navigate }) => {
    return (
        <div className="landing-page-content bg-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
                    <div className="text-center">
                        <div className="inline-block mb-4">
                            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                Secure File Sharing Platform
                            </span>
                        </div>
                        <h1 className="text-5xl tracking-tight font-bold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
                            <TextType 
                                  text={["Share Files Securely with"]}
                                  typingSpeed={50}
                                  pauseDuration={1500}
                                  showCursor={true}
                                  cursorCharacter=""
                            />
                            <span className="block text-purple-600 mt-2"> ShareVault</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 md:text-2xl leading-relaxed">
                            Upload, manage, and share your files with ease and security. Experience seamless file sharing with CloudShare.
                        </p>
                        <div className="mt-12 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <button 
                                onClick={()=> openSignUp()}
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                    Get Started
                                </button>
                                {isSignedIn ? (
                                    <button 
                                    onClick={()=> navigate('/dashboard')} 
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-gray-800 hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                        Dashboard
                                    </button>
                                    ):(
                                    <button 
                                    onClick={()=> openSignIn()} 
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 mb-40 text-center pb-12">
                    <p className="text-4xl text-gray-600 font-medium">
                        All your files in one place. Access them anytime, anywhere.
                    </p>
                </div>
                <div className="flex flex-wrap relative mt-16 mb-48 grid-cols-1">
                    <div className=" mb-25 ml-30 -rotate-x-45 -rotate-y-30 scale-110 flex-none rounded-2xl scale-40 overflow-hidden border-r-8 border-b-8 border-blue-200 ">
                        <img src="/MobileView.png" alt="Mobile View" className="object-contain w-auto h-auto"/>
                    </div>
                    <div className="rotate-x-45 rotate-z-30 flex-shrink rounded-2xl  overflow-hidden border-t-2 border-r-8 border-b-8 border-blue-200 -mt-25 transition-transform duration-600 ease-in-out shadow-lg shadow-purple-200">
                        <img src="/Dashboard.png" alt="Dashboard" className="object-cover w-full h-full"/>
                    </div>
                </div>

                <div className="mt-16 text-center pb-12">
                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600">10K+</div>
                            <div className="text-sm text-gray-600 mt-2">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600">500K+</div>
                            <div className="text-sm text-gray-600 mt-2">Files Shared</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600">99.9%</div>
                            <div className="text-sm text-gray-600 mt-2">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
