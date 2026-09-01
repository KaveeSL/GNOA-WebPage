"use client";

import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import PageTopSpacer, { usePageTopOffset } from "@/components/page-top-spacer";
import AnimatedContent from "@/components/animated-content";
import MemberAvatar, {
    PortraitPlaceholder,
    roleLabel,
} from "@/components/member-avatar";
import {
    displayName,
    officeBearers,
    nationalOrganizers,
    vicePresidents,
    viceSecretaries,
    viceTreasurers,
    coOrganizers,
    legalAdvisors,
    internationalCoordinators,
    committeeMembers,
    provincialBoards,
    womensForum,
    youthCommittee,
    sportsCommittee,
} from "@/data/committee";
import type { ICommitteeMember } from "@/types";

function SectionHeading({
    id,
    kicker,
    title,
}: {
    id: string;
    kicker: string;
    title: string;
}) {
    return (
        <div id={id} className="scroll-mt-52 sm:scroll-mt-48 mb-5 sm:mb-7">
            <p
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#762727" }}
            >
                {kicker}
            </p>
            <h2 className="font-urbanist text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                {title}
            </h2>
        </div>
    );
}

function SubHeading({ children }: { children: string }) {
    return (
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#762727]/80 mb-3 sm:mb-4">
            {children}
        </h3>
    );
}

function PersonCard({
    name,
    member,
    role,
    featured = false,
}: {
    name: string;
    member: ICommitteeMember;
    role: string;
    featured?: boolean;
}) {
    if (featured) {
        return (
            <div className="group flex flex-col min-w-0">
                <PortraitPlaceholder name={name} image={member.image} />
                <h3
                    className="text-[13px] sm:text-base md:text-lg font-medium mt-2 leading-snug break-words"
                    style={{ color: "#762727" }}
                >
                    {name}
                </h3>
                <p className="text-zinc-500 font-medium text-xs sm:text-sm leading-snug">
                    {role}
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-3.5 min-w-0">
            <MemberAvatar name={name} image={member.image} size="md" />
            <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base leading-snug break-words">
                    {name}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-snug">
                    {role}
                </p>
            </div>
        </div>
    );
}

export default function ExecutiveCommitteeView() {
    const { language } = useLanguage();
    const t = translations[language].committee;
    const stickyTop = usePageTopOffset(0);

    const nav = [
        { id: "office-bearers", label: t.jumpNav.office },
        { id: "deputy-leadership", label: t.jumpNav.deputies },
        { id: "co-organizers", label: t.jumpNav.coOrganizers },
        { id: "advisors", label: t.jumpNav.advisors },
        { id: "members", label: t.jumpNav.members },
        { id: "provinces", label: t.jumpNav.provinces },
        { id: "special-committees", label: t.jumpNav.forums },
    ];

    const labelOf = (member: ICommitteeMember) =>
        roleLabel(member, t.roles, t.acting);
    const nameOf = (member: ICommitteeMember) => displayName(member, language);

    const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;
        const banner = document.querySelector('[data-banner="true"]') as HTMLElement | null;
        const navbar = document.getElementById("navbar-container");
        const offset = (navbar?.offsetHeight || 80) + (banner?.offsetHeight || 0) + 72;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            <PageTopSpacer className="!pb-4 sm:!pb-6">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/#team"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#762727] transition-colors mb-6 sm:mb-8"
                    >
                        <ArrowLeftIcon size={16} />
                        {t.backHome}
                    </Link>

                    <div>
                        <p
                            className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "#762727" }}
                        >
                            GNOA
                        </p>
                        <h1 className="font-urbanist text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 break-words">
                            {t.title}
                        </h1>
                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-zinc-500 max-w-2xl">
                            {t.subtitle}
                        </p>
                    </div>
                </div>
            </PageTopSpacer>

            <div
                className="sticky z-[40] border-y border-gray-200 bg-white/95 backdrop-blur-md"
                style={{ top: stickyTop }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32">
                    <nav
                        className="flex gap-2 overflow-x-auto py-2.5 sm:py-3 -mx-4 px-4 md:mx-0 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-label={t.title}
                    >
                        {nav.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => handleJump(e, item.id)}
                                className="flex-shrink-0 rounded-full border border-[#762727]/20 bg-white px-3 py-1.5 text-[11px] sm:text-xs font-bold text-[#762727] transition-colors hover:bg-[#762727] hover:text-white whitespace-nowrap"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-16 sm:pb-24">
                <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 pt-8 sm:pt-12">
                    <section>
                        <SectionHeading
                            id="office-bearers"
                            kicker="GNOA"
                            title={t.officeBearers}
                        />
                        <div className="grid grid-cols-3 gap-3 sm:gap-5 md:gap-6 max-w-4xl mx-auto">
                            {officeBearers.map((member, i) => (
                                <AnimatedContent
                                    key={member.name}
                                    delay={i * 0.04}
                                    distance={12}
                                >
                                    <PersonCard
                                        name={nameOf(member)}
                                        member={member}
                                        role={labelOf(member)}
                                        featured
                                    />
                                </AnimatedContent>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="national-organizer"
                            kicker="GNOA"
                            title={t.roles.nationalOrganizer}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                            {nationalOrganizers.map((member) => (
                                <PersonCard
                                    key={member.name}
                                    name={nameOf(member)}
                                    member={member}
                                    role={labelOf(member)}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="deputy-leadership"
                            kicker="GNOA"
                            title={t.deputyLeadership}
                        />
                        <div className="space-y-6 sm:space-y-8">
                            <div>
                                <SubHeading>{t.vicePresidents}</SubHeading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                                    {vicePresidents.map((member) => (
                                        <PersonCard
                                            key={member.name}
                                            name={nameOf(member)}
                                            member={member}
                                            role={labelOf(member)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <SubHeading>{t.viceSecretaries}</SubHeading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                                    {viceSecretaries.map((member) => (
                                        <PersonCard
                                            key={member.name}
                                            name={nameOf(member)}
                                            member={member}
                                            role={labelOf(member)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <SubHeading>{t.viceTreasurer}</SubHeading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                                    {viceTreasurers.map((member) => (
                                        <PersonCard
                                            key={member.name}
                                            name={nameOf(member)}
                                            member={member}
                                            role={labelOf(member)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="co-organizers"
                            kicker="GNOA"
                            title={t.coOrganizers}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5 sm:gap-3">
                            {coOrganizers.map((member) => (
                                <PersonCard
                                    key={member.name}
                                    name={nameOf(member)}
                                    member={member}
                                    role={labelOf(member)}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="advisors"
                            kicker="GNOA"
                            title={t.advisors}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                            {legalAdvisors.map((member) => (
                                <PersonCard
                                    key={member.name}
                                    name={nameOf(member)}
                                    member={member}
                                    role={labelOf(member)}
                                />
                            ))}
                            {internationalCoordinators.map((member) => (
                                <PersonCard
                                    key={member.name}
                                    name={nameOf(member)}
                                    member={member}
                                    role={labelOf(member)}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="members"
                            kicker="GNOA"
                            title={t.members}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                            {committeeMembers.map((member, index) => (
                                <div
                                    key={`${member.name}-${index}`}
                                    className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-3.5 min-w-0"
                                >
                                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#762727] text-[10px] sm:text-[11px] font-bold text-white">
                                        {index + 1}
                                    </span>
                                    <MemberAvatar name={nameOf(member)} size="sm" />
                                    <p className="min-w-0 flex-1 font-medium text-gray-900 text-sm sm:text-base leading-snug break-words">
                                        {nameOf(member)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="provinces"
                            kicker="GNOA"
                            title={t.provincialBoard}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                            {provincialBoards.map((board) => (
                                <div
                                    key={board.provinceKey}
                                    className="rounded-2xl border border-gray-200 bg-[#fffaf8] p-4 sm:p-5 min-w-0"
                                >
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#762727] text-white">
                                            <MapPinIcon size={16} />
                                        </span>
                                        <h3 className="font-urbanist font-bold text-gray-900 text-sm sm:text-base break-words">
                                            {t.provinces[board.provinceKey]}
                                        </h3>
                                    </div>
                                    <div className="space-y-2 sm:space-y-2.5">
                                        {board.members.map((member) => (
                                            <div
                                                key={`${board.provinceKey}-${member.roleKey}-${member.name}`}
                                                className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white border border-gray-200 p-2.5 min-w-0"
                                            >
                                                <MemberAvatar
                                                    name={nameOf(member)}
                                                    size="sm"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 text-sm leading-snug break-words">
                                                        {nameOf(member)}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 font-medium">
                                                        {labelOf(member)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            id="special-committees"
                            kicker="GNOA"
                            title={t.specialCommittees}
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { title: t.womensForum, members: womensForum },
                                { title: t.youthCommittee, members: youthCommittee },
                                { title: t.sportsCommittee, members: sportsCommittee },
                            ].map((group) => (
                                <div
                                    key={group.title}
                                    className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 min-w-0"
                                >
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#762727] text-white">
                                            <UsersIcon size={16} />
                                        </span>
                                        <h3 className="font-urbanist font-bold text-gray-900 text-sm sm:text-base break-words">
                                            {group.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-2 sm:space-y-2.5">
                                        {group.members.map((member, i) => (
                                            <div
                                                key={`${group.title}-${member.name}-${i}`}
                                                className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-gray-200 bg-[#fffaf8] p-2.5 min-w-0"
                                            >
                                                <MemberAvatar
                                                    name={nameOf(member)}
                                                    size="sm"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 text-sm leading-snug break-words">
                                                        {nameOf(member)}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 font-medium">
                                                        {labelOf(member)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
