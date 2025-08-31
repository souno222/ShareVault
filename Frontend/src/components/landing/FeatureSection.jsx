import {Wallet, ArrowUpCircle, Shield, CreditCard, Share2, FileText, Clock} from "lucide-react";
const FeatureSection = ({ features }) => {
    const renderIcon=(iconName,iconColour)=>{
        const iconProps ={size:25,className:iconColour}
        switch(iconName){
            case "ArrowUpCircle":
                return <ArrowUpCircle {...iconProps}/>;
            case "Shield":
                return <Shield {...iconProps}/>;
            case "CreditCard":
                return <CreditCard {...iconProps}/>; 
            case "Share2":
                return <Share2 {...iconProps}/>;
            case "FileText":
                return <FileText {...iconProps}/>;
            case "Clock":
                return <Clock {...iconProps}/>;
            default:
                return <FileText {...iconProps}/>; 
            }
    }
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Everything You Need for File Sharing
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        CloudShare provides all the features you need to manage, share, and secure your files effortlessly.
                    </p>
                </div>
                <div className="mt-16">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index)=> (
                            <div key={index} className="pt-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="mt-6">
                                        <div className="inline-flex items-center justify-center p-3 rounded-md bg-white shadow-lg">
                                           {renderIcon  (feature.iconName, feature.iconColor)}
                                        </div>
                                        <h3 className=" mt-5 text-lg font-medium text-gray-900 tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            {feature.description}
                                        </p>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;