import { LucideIcon } from "lucide-react";

export interface ILink {
    name: string;
    href: string;
};

export interface ICustomIcon {
    icon: LucideIcon;
    dir?: 'left' | 'right';
};

export interface ISectionTitle {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    dir?: 'left' | 'center';
};

export interface IFeature {
    icon: LucideIcon;
    title: string;
    description: string;
    cardBg?: string;
    iconBg?: string;
};

export interface IFaq {
    question: string;
    answer: string;
};

export interface ITeamMember {
    name: string;
    image: string;
    role: string;
};

export type CommitteeRoleKey =
    | "president"
    | "secretary"
    | "treasurer"
    | "nationalOrganizer"
    | "vicePresident"
    | "viceSecretary"
    | "viceTreasurer"
    | "coOrganizer"
    | "legalAdvisor"
    | "internationalCoordinator"
    | "member"
    | "provincialOrganizer"
    | "organizer";

export type ProvinceKey =
    | "central"
    | "southern"
    | "uva"
    | "eastern"
    | "northern"
    | "northWestern"
    | "sabaragamuwa"
    | "northCentral"
    | "western";

export interface ICommitteeMember {
    name: string;
    nameSi?: string;
    roleKey: CommitteeRoleKey;
    roleNumber?: number;
    image?: string;
    acting?: boolean;
}

export interface IProvinceCommittee {
    provinceKey: ProvinceKey;
    members: ICommitteeMember[];
}

export interface IPricingPlan {
    icon: LucideIcon;
    name: string;
    type?: 'enterprise' | 'popular';
    description: string;
    price: number;
    linkText: string;
    linkUrl: string;
    features: string[];
};

export interface ITestimonial {
    quote: string;
    name: string;
    handle: string;
    image: string;
    rating: 5 | 4 | 3 | 2 | 1;
};

export interface IPhotoCard {
    image: string;
    title: string;
    description: string;
    category?: string;
};

export interface IGalleryPhoto {
    id: number;
    gallery_id: number;
    image: string;
    display_order: number;
}

export interface IPhotoGallery {
    id: number;
    title: string;
    description: string | null;
    display_order: number;
    photos: IGalleryPhoto[];
}

export interface INewsImage {
    id: number;
    news_id: number;
    image: string;
    display_order: number;
}

export interface INewsItem {
    id: number;
    title: string;
    summary: string | null;
    content: string;
    is_published: boolean | number;
    display_order: number;
    published_at: string | null;
    created_at?: string;
    updated_at?: string;
    images: INewsImage[];
}