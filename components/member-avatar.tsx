"use client";

import { UserRound } from "lucide-react";
import { ICommitteeMember } from "@/types";

const sizeClass = {
    sm: "h-10 w-10",
    md: "h-12 w-12 sm:h-14 sm:w-14",
    lg: "h-16 w-16",
} as const;

export default function MemberAvatar({
    name,
    image,
    size = "md",
    className = "",
}: {
    name: string;
    image?: string;
    size?: keyof typeof sizeClass;
    className?: string;
}) {
    const box = sizeClass[size];

    if (image) {
        return (
            <img
                src={image}
                alt={name}
                className={`${box} rounded-full object-cover ring-1 ring-[#762727]/15 ${className}`}
            />
        );
    }

    return (
        <div
            className={`${box} flex-shrink-0 overflow-hidden rounded-full bg-[#f7eeee] ring-1 ring-[#762727]/12 ${className}`}
            aria-hidden="true"
        >
            <img
                src="/assets/user-avatar.png"
                alt=""
                className="h-full w-full scale-[1.45] object-cover"
            />
        </div>
    );
}

export function PortraitPlaceholder({
    name,
    image,
}: {
    name: string;
    image?: string;
}) {
    return (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#f7eeee] ring-1 ring-[#762727]/10">
            {image ? (
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f3e6e6]">
                    <UserRound
                        className="h-[46%] w-[46%] text-[#762727]"
                        strokeWidth={1.35}
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>
    );
}

export function roleLabel(
    member: ICommitteeMember,
    roles: Record<ICommitteeMember["roleKey"], string>,
    acting: string
) {
    const base = roles[member.roleKey];
    const numbered =
        member.roleNumber != null ? `${base} ${member.roleNumber}` : base;
    return member.acting ? `${numbered} (${acting})` : numbered;
}
