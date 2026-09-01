import type { Metadata } from "next";
import ExecutiveCommitteeView from "./committee-view";

export const metadata: Metadata = {
    title: "Executive Committee Members",
    description:
        "National office bearers, provincial organization boards, and special committees of the Government Nursing Officers' Association Sri Lanka.",
};

export default function ExecutiveCommitteePage() {
    return <ExecutiveCommitteeView />;
}
