import { Check } from "lucide-react";
import {useClerk} from "@clerk/clerk-react";

const PricingSection = ({pricingPlans, openSignUp}) => {
    return (
        <div className="py-20 bg-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
                        Choose the plan that fits your needs. No hidden fees, no surprises.
                    </p>
                </div>
                <div className="mt-20 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                    {pricingPlans.map((plan,index) => (
                        <div key={index} className={`flex flex-col rounded-2xl overflow-hidden border-2 transition-all duration-300 ${plan.highlighted ? 'border-purple-600 shadow-2xl transform scale-105' : 'border-gray-200 shadow-lg hover:shadow-xl hover:border-purple-300'}`}>
                            <div className={`px-8 py-8 ${plan.highlighted ? 'bg-purple-600' : 'bg-white'}`}>
                                <div className="flex justify-between items-center">
                                   <h3 className={`text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                    {plan.name}
                                    </h3>
                                    {plan.highlighted && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-600">
                                            POPULAR
                                        </span>    
                                    )}
                                </div>
                                <p className={`mt-4 text-sm ${plan.highlighted ? 'text-purple-100' : 'text-gray-600'}`}>
                                    {plan.description}
                                </p>
                                <div className="mt-8">
                                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                        ₹{plan.price}
                                    </span>
                                    <span className={`text-lg ${plan.highlighted ? 'text-purple-100' : 'text-gray-600'}`}>/month</span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between px-8 py-8 bg-white">
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature,featureIndex)=>(
                                            <li key={featureIndex} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                        <Check className="h-6 w-6 text-purple-600"/>
                                                </div>
                                                <p className="ml-3 text-base text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={openSignUp}
                                        className={`w-full px-6 py-4 text-base font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-1 ${plan.highlighted ? 'text-purple-600 bg-white hover:bg-gray-100 shadow-md hover:shadow-lg' : 'text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}`}>
                                        {plan.cta}
                                    </button>
                            </div>
                        </div>
                    ))}
                       
                </div>
            </div>
        </div>
    );
}

export default PricingSection;
