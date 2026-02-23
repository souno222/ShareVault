const FooterSection = () => {
    return (
        <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-2xl font-bold text-white mb-2">CloudShare</h3>
                            <p className="text-gray-400 text-sm">Secure file sharing made simple</p>
                        </div>
                        <p className="text-base text-gray-400">
                            &copy; 2025 CloudShare. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterSection;
