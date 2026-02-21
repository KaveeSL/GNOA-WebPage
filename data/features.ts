import { ShieldCheckIcon, UsersIcon, GraduationCapIcon, ScaleIcon, HeartHandshakeIcon, FileTextIcon } from "lucide-react";
import { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "Advocacy & Representation",
        description:
            "Active representation in policy discussions and negotiations with government officials to protect nursing officers' rights and interests.",
        icon: ScaleIcon,
        cardBg: "bg-red-50",
        iconBg: "bg-[#762727]"
    },
    {
        title: "Collective Bargaining",
        description:
            "Strong collective bargaining power ensuring fair compensation, working conditions, and career advancement opportunities for all members.",
        icon: UsersIcon,
        cardBg: "bg-green-100",
        iconBg: "bg-green-500"
    },
    {
        title: "Professional Development",
        description:
            "Continuous education programs, training workshops, and certification support to enhance skills and career growth.",
        icon: GraduationCapIcon,
        cardBg: "bg-indigo-100",
        iconBg: "bg-indigo-500"
    },
    {
        title: "Legal Support & Protection",
        description:
            "Comprehensive legal support and rights protection services for nursing officers facing workplace challenges or disputes.",
        icon: ShieldCheckIcon,
        cardBg: "bg-pink-100",
        iconBg: "bg-pink-500"
    },
    {
        title: "Welfare & Support",
        description:
            "Dedicated welfare programs providing financial assistance, healthcare support, and community resources for members and their families.",
        icon: HeartHandshakeIcon,
        cardBg: "bg-lime-100",
        iconBg: "bg-lime-500"
    },
    {
        title: "Policy Engagement",
        description:
            "Active engagement in healthcare policy development, ensuring nursing officers' voices are heard at the highest levels of government.",
        icon: FileTextIcon,
        cardBg: "bg-gray-50",
        iconBg: "bg-[#762727]",
    },
]