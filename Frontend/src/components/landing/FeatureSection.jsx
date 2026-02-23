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
        <div className="py-20 bg-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Everything You Need for File Sharing
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
                        CloudShare provides all the features you need to manage, share, and secure your files effortlessly.
                    </p>
                </div>
                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index)=> (
                            <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="inline-flex items-center justify-center p-4 rounded-xl bg-purple-100">
                                    {renderIcon(feature.iconName, feature.iconColor)}
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;