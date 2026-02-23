import { LucideStar } from "lucide-react";

const Testimonial = ({ testimonials }) => {
    return (
        <div className="py-20 bg-slate-50 overflow-hidden">
           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                Trusted by Professionals Worldwide
                        </h2>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
                            See what our users have to say about CloudShare.
                        </p>
                    </div>
                    <div className="mt-20 grid gap-8 lg:grid-cols-3">
                        {testimonials.map((testimonial,index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2">
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        {[...Array(5)].map((_,i)=>(
                                            <LucideStar
                                              key={i}
                                              size={20}
                                              className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                                              fill={i < testimonial.rating ? "currentColor" : "none"}
                                              stroke={i < testimonial.rating ? "none" : "currentColor"}
                                            />
                                        ))}
                                    </div>
                                    <blockquote className="mb-6">
                                        <p className="text-lg text-gray-700 leading-relaxed">
                                            "{testimonial.feedback}"
                                        </p>
                                    </blockquote>
                                    <div className="flex items-center pt-6 border-t border-gray-100">
                                            <div className="flex-shrink-0 h-14 w-14">
                                                    <img src={testimonial.image} alt={testimonial.name} className="h-14 w-14 rounded-full border-2 border-purple-200" />
                                            </div>
                                            <div className="ml-4">
                                                    <h4 className="text-lg font-bold text-gray-900">
                                                        {testimonial.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {testimonial.designation}
                                                    </p>
                                            </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default Testimonial;
