import {
    ICommitteeMember,
    IProvinceCommittee,
} from "@/types";
import type { LanguageCode } from "@/lib/i18n";

export function displayName(member: ICommitteeMember, language: LanguageCode) {
    return language === "si" && member.nameSi ? member.nameSi : member.name;
}

export const officeBearers: ICommitteeMember[] = [
    {
        name: "Saman Rathnapriya",
        nameSi: "සමන් රත්නප්‍රිය",
        roleKey: "president",
        image: "/assets/1.jpeg",
    },
    {
        name: "R.S. Ajith Rathnayake",
        nameSi: "ආර්.එස්. අජිත් රත්නායක",
        roleKey: "secretary",
        image: "/assets/2.jpeg",
    },
    {
        name: "E.A. Jayasinghe",
        nameSi: "ඊ.ඒ. ජයසිංහ",
        roleKey: "treasurer",
        image: "/assets/3.jpeg",
    },
];

export const nationalOrganizers: ICommitteeMember[] = [
    {
        name: "Sudath Jayasiri",
        nameSi: "සුදත් ජයසිරි",
        roleKey: "nationalOrganizer",
    },
];

export const vicePresidents: ICommitteeMember[] = [
    { name: "P.B. Shivayoham", nameSi: "පී.බී. ශිවයෝහම්", roleKey: "vicePresident" },
    { name: "P.M. Nasrudheen", nameSi: "පී.එම්. නස්රුදීන්", roleKey: "vicePresident" },
    { name: "Nalaka Hettiarachchi", nameSi: "නාලක හෙට්ටිආරච්චි", roleKey: "vicePresident" },
];

export const viceSecretaries: ICommitteeMember[] = [
    { name: "H.M. Wimalawathi", nameSi: "එච්.එම්. විමලාවතී", roleKey: "viceSecretary" },
    { name: "K.C.S. Pathirana", nameSi: "කේ.සී.එස්. පතිරණ", roleKey: "viceSecretary" },
];

export const viceTreasurers: ICommitteeMember[] = [
    { name: "Udana Buddhika Kulathilaka", nameSi: "උදාන බුද්ධික කුලතිලක", roleKey: "viceTreasurer" },
];

export const coOrganizers: ICommitteeMember[] = [
    { name: "Priyantha Gallage", nameSi: "ප්‍රියන්ත ගාල්ලගේ", roleKey: "coOrganizer", roleNumber: 1 },
    { name: "A.S.W. Ranasinghe", nameSi: "ඒ.එස්.ඩබ්ලිව්. රණසිංහ", roleKey: "coOrganizer", roleNumber: 2 },
    { name: "G.C. Burny De Silva", nameSi: "ජී.සී. බර්නි ද සිල්වා", roleKey: "coOrganizer", roleNumber: 3 },
    { name: "Jayantha Jayasena", nameSi: "ජයන්ත ජයසේන", roleKey: "coOrganizer", roleNumber: 4 },
    { name: "K. Jeganeethan", nameSi: "කේ. ජෙගනීතන්", roleKey: "coOrganizer", roleNumber: 5 },
];

export const legalAdvisors: ICommitteeMember[] = [
    { name: "Attorney P.B. Ekanayake", nameSi: "නීතිඥ පී.බී. ඒකනායක", roleKey: "legalAdvisor" },
    { name: "Attorney Iroshi Kulathilaka", nameSi: "නීතිඥ ඉරෝෂි කුලතිලක", roleKey: "legalAdvisor" },
];

export const internationalCoordinators: ICommitteeMember[] = [
    { name: "D.I.I. Amarasinghe", nameSi: "ඩී.අයි.අයි. අමරසිංහ", roleKey: "internationalCoordinator" },
];

export const committeeMembers: ICommitteeMember[] = [
    { name: "I.D. Chathuranga Withanage", nameSi: "අයි.ඩී. චතුරංග විතානගේ", roleKey: "member" },
    { name: "Samudie Tharangika", nameSi: "සමුදි තරංගිකා", roleKey: "member" },
    { name: "S.P. Rambukwella", nameSi: "එස්.පී. රඹුක්වැල්ල", roleKey: "member" },
    { name: "A.L.M. Mendis", nameSi: "ඒ.එල්.එම්. මෙන්ඩිස්", roleKey: "member" },
    { name: "R.M.R.S.C. Manike", nameSi: "ආර්.එම්.ආර්.එස්.සී. මැනිකේ", roleKey: "member" },
    { name: "Kapila Nilantha Almeda", nameSi: "කපිල නිලන්ත අල්මේදා", roleKey: "member" },
    { name: "W. Sumithra Kalyani", nameSi: "ඩබ්ලිව්. සුමිත්‍රා කල්‍යාණී", roleKey: "member" },
    { name: "D.M. Himali Wijayamala", nameSi: "ඩී.එම්. හිමාලි විජයමාලා", roleKey: "member" },
    { name: "Aruna Shantha", nameSi: "අරුණ ශාන්ත", roleKey: "member" },
    { name: "Vikuma Priyantha Kulathunga", nameSi: "විකුම ප්‍රියන්ත කුලතුංග", roleKey: "member" },
    { name: "C.P. Jayanetti", nameSi: "සී.පී. ජයනෙත්ති", roleKey: "member" },
    { name: "P.L. Manoja Dharmawardana", nameSi: "පී.එල්. මනෝජා ධර්මවර්ධන", roleKey: "member" },
    { name: "Anwer Assam", nameSi: "අන්වර් අසාම්", roleKey: "member" },
    { name: "P.B. Ekanayake", nameSi: "පී.බී. ඒකනායක", roleKey: "member" },
    { name: "Asanka Balasooriya", nameSi: "අසංක බාලසූරිය", roleKey: "member" },
    { name: "Eesha Kapparage", nameSi: "ඊශා කප්පරගේ", roleKey: "member" },
    { name: "Dimuthu Kumara", nameSi: "දිමුතු කුමාර", roleKey: "member" },
    { name: "H.R. Wijayanthi", nameSi: "එච්.ආර්. විජයන්ති", roleKey: "member" },
    { name: "Renu Jayasinghe", nameSi: "රේනු ජයසිංහ", roleKey: "member" },
    { name: "Prasad Pelegama", nameSi: "ප්‍රසාද් පැලේගම", roleKey: "member" },
    { name: "Duminda Senarath", nameSi: "දුමින්ද සේනාරත්", roleKey: "member" },
    { name: "A.N. Shantha", nameSi: "ඒ.එන්. ශාන්ත", roleKey: "member" },
    { name: "N.V.P. Chandrakumara", nameSi: "එන්.වී.පී. චන්ද්‍රකුමාර", roleKey: "member" },
    { name: "O.K.K. Sandhya Kumari", nameSi: "ඕ.කේ.කේ. සන්ධ්‍යා කුමාරී", roleKey: "member" },
    { name: "Sudath Pathirana", nameSi: "සුදත් පතිරණ", roleKey: "member" },
    { name: "Kehan Wickramage", nameSi: "කේහාන් වික්‍රමගේ", roleKey: "member" },
    { name: "Renuka Lokuge", nameSi: "රේනුකා ලෝකුගේ", roleKey: "member" },
    { name: "A.H.M.M.A. Manike", nameSi: "ඒ.එච්.එම්.එම්.ඒ. මැනිකේ", roleKey: "member" },
    { name: "Asanka Dharmarathna", nameSi: "අසංක ධර්මරත්න", roleKey: "member" },
    { name: "T. Banu Mahendra", nameSi: "ටී. බානු මහේන්ද්‍ර", roleKey: "member" },
    { name: "Aruna Rathnayake", nameSi: "අරුණ රත්නායක", roleKey: "member" },
    { name: "Ajith Priyankara", nameSi: "අජිත් ප්‍රියංකර", roleKey: "member" },
    { name: "Palitha Jayawardena", nameSi: "පාලිත ජයවර්ධන", roleKey: "member" },
];

export const provincialBoards: IProvinceCommittee[] = [
    {
        provinceKey: "central",
        members: [
            { name: "Ajith Priyankara", nameSi: "අජිත් ප්‍රියංකර", roleKey: "president" },
            { name: "Senarath Rambukwella", nameSi: "සේනාරත් රඹුක්වැල්ල", roleKey: "secretary" },
            { name: "Asanka Dharmarathna", nameSi: "අසංක ධර්මරත්න", roleKey: "provincialOrganizer" },
        ],
    },
    {
        provinceKey: "southern",
        members: [
            { name: "Dimuthu Kumara", nameSi: "දිමුතු කුමාර", roleKey: "president", acting: true },
            { name: "Sudath Chandrasiri", nameSi: "සුදත් චන්ද්‍රසිරි", roleKey: "secretary" },
        ],
    },
    {
        provinceKey: "uva",
        members: [
            { name: "Aruna Rathnayake", nameSi: "අරුණ රත්නායක", roleKey: "president" },
            { name: "Anuruddha Indunil", nameSi: "අනුරුද්ධ ඉඳුනිල්", roleKey: "secretary" },
            { name: "Tilak Rathnayake", nameSi: "තිලක් රත්නායක", roleKey: "provincialOrganizer" },
        ],
    },
    {
        provinceKey: "eastern",
        members: [
            { name: "Hussein Faizath", nameSi: "හුසේන් ෆයිසාත්", roleKey: "president" },
            { name: "Kapila Senarathne", nameSi: "කපිල සේනාරත්න", roleKey: "secretary" },
            { name: "P.M. Nasrudheen", nameSi: "පී.එම්. නස්රුදීන්", roleKey: "provincialOrganizer" },
        ],
    },
    {
        provinceKey: "northern",
        members: [
            { name: "Nirosh Soysa", nameSi: "නිරෝෂ් සොයිසා", roleKey: "president" },
            { name: "K. Janarthan", nameSi: "කේ. ජනාර්තන්", roleKey: "secretary" },
            { name: "A.M. Marasinghe", nameSi: "ඒ.එම්. මාරසිංහ", roleKey: "organizer" },
        ],
    },
    {
        provinceKey: "northWestern",
        members: [
            { name: "A.M. Rishmi", nameSi: "ඒ.එම්. රිෂ්මි", roleKey: "president" },
            { name: "Shirantha Kumara", nameSi: "ශිරන්ත කුමාර", roleKey: "secretary" },
            { name: "A.H.M.M.A. Manike", nameSi: "ඒ.එච්.එම්.එම්.ඒ. මැනිකේ", roleKey: "provincialOrganizer" },
        ],
    },
    {
        provinceKey: "sabaragamuwa",
        members: [
            { name: "Susantha Karunaratne", nameSi: "සුසන්ත කරුණාරත්න", roleKey: "president" },
            { name: "Duminda Kumara", nameSi: "දුමින්ද කුමාර", roleKey: "secretary" },
        ],
    },
    {
        provinceKey: "northCentral",
        members: [
            { name: "Suminda Ruwan Abeysekara", nameSi: "සුමින්ද රුවන් අබේසේකර", roleKey: "president" },
            { name: "Kithsiri Bandara", nameSi: "කිත්සිරි බණ්ඩාර", roleKey: "secretary" },
        ],
    },
    {
        provinceKey: "western",
        members: [
            { name: "Palitha Jayawardena", nameSi: "පාලිත ජයවර්ධන", roleKey: "president" },
            { name: "Burny De Silva", nameSi: "බර්නි ද සිල්වා", roleKey: "secretary" },
            { name: "C.P. Jayanetti", nameSi: "සී.පී. ජයනෙත්ති", roleKey: "provincialOrganizer" },
        ],
    },
];

export const womensForum: ICommitteeMember[] = [
    { name: "Saman Rathnapriya", nameSi: "සමන් රත්නප්‍රිය", roleKey: "president" },
    { name: "H.M. Wimalawathi", nameSi: "එච්.එම්. විමලාවතී", roleKey: "secretary" },
    { name: "Samudie Tharangika", nameSi: "සමුදි තරංගිකා", roleKey: "treasurer" },
    { name: "Burny De Silva", nameSi: "බර්නි ද සිල්වා", roleKey: "organizer" },
];

export const youthCommittee: ICommitteeMember[] = [
    { name: "Saman Rathnapriya", nameSi: "සමන් රත්නප්‍රිය", roleKey: "president" },
    { name: "Sanka Jayasinghe", nameSi: "සංඛ ජයසිංහ", roleKey: "secretary" },
    { name: "Akila Weerasinghe", nameSi: "අකිල වීරසිංහ", roleKey: "treasurer" },
    { name: "Ruwan Jasingha Kandage", nameSi: "රුවන් ජාසිංහ කන්දගේ", roleKey: "organizer" },
];

export const sportsCommittee: ICommitteeMember[] = [
    { name: "Saman Rathnapriya", nameSi: "සමන් රත්නප්‍රිය", roleKey: "president" },
    { name: "Asanka Dharmarathna", nameSi: "අසංක ධර්මරත්න", roleKey: "secretary" },
    { name: "H.R. Wijayanthi", nameSi: "එච්.ආර්. විජයන්ති", roleKey: "treasurer" },
    { name: "K.D.K. Malinga", nameSi: "කේ.ඩී.කේ. මාලිංග", roleKey: "organizer" },
    { name: "Milinda Dilan Suraveera", nameSi: "මිලින්ද දිලාන් සුරවීර", roleKey: "organizer" },
    { name: "H.M. Wimala Herath", nameSi: "එච්.එම්. විමලා හේරත්", roleKey: "organizer" },
];
