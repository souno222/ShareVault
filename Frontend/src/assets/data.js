import { LayoutDashboard,UploadIcon,Files,Receipt,CreditCard,Bookmark} from "lucide-react";

export const features =[
    {
        iconName:"ArrowUpCircle",
        iconColor:"text-blue-500",
        title:"Upload Files",
        description:"Easily upload and manage your files with our intuitive interface.",
    },
    {
        iconName:"FolderOpen",
        iconColor:"text-green-500",
        title:"Organize Files",
        description:"Keep your files organized with folders and tags for easy access.",
    },
    {
        iconName:"Share2",
        iconColor:"text-yellow-500",
        title:"Share Files",
        description:"Share files securely with others using unique links.",
    },
    {
        iconName:"Lock",
        iconColor:"text-red-500",
        title:"Secure Storage",
        description:"Your files are stored securely with encryption and access controls.",
    },
    {
        iconName:"Money",
        iconColor:"text-purple-500",
        title:"Version History",
        description:"Track changes and restore previous versions of your files.",
    }
]
export const pricingPlans = [
    {
        name: "Free",
        price: "0/month",
        description: "Ideal for personal use with basic features.",
        highlighted: false,
        features: [
            "Basic file upload",
            "File organization",
            "Basic sharing options"
        ],
        cta: "Get Started"
    },
    {
        name: "Premium",
        price: "50/month",
        description: "Includes advanced features and priority support.",
        highlighted: true,
        features: [
            "Advanced file upload",
            "File organization",
            "Priority sharing options"
        ],
        cta: "Go Premium"
    },
    {
        name: "Ultimate",
        price: "120/month",
        description: "Custom solutions for businesses with dedicated support.",
        highlighted: false,
        features: [
            "Custom file upload",
            "Advanced organization",
            "Dedicated support"
        ],
        cta: "Go Ultimate"
    }
];

export const testimonials = [

    {
        id: 1,
        name: "John Doe",
        feedback: "This service has changed my life! Highly recommend.",
        designation: "CEO, Example Corp",
        rating: 4
    },
    {
        id: 2,
        name: "Jane Smith",
        feedback: "A fantastic experience from start to finish.",
        designation: "CTO, Another Example",
        rating: 4
    },
    {
        id: 3,
        name: "Alice Johnson",
        feedback: "I can't imagine going back to the old way of doing things.",
        designation: "Product Manager, Tech Co",
        rating: 5
    }
];

export const SIDE_MENU_DATA=[
    { 
        id: "01",
        label:"Dashboard",
        icon: LayoutDashboard,
        path:"/dashboard",
    },
    {
        id: "02",
        label:"Upload",
        icon: UploadIcon,
        path:"/upload",
    },
    {
        id: "03",
        label:"My Files",
        icon:Files,
        path:"/my-files",
    },
    {
        id: "04",
        label:"Saved Files",
        icon:Bookmark,
        path:"/saved-files",

    },
    {
        id: "05",
        label:"Subscription",
        icon: CreditCard,
        path:"/subscription",
    },
    { 
        id: "06",
        label:"Transactions",
        icon: Receipt,
        path:"/transactions"
    }
];