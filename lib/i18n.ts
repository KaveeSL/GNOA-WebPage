export type LanguageCode = "en" | "si" | "ta";

type Translations = {
  [K in LanguageCode]: {
    navbar: {
      home: string;
      about: string;
      leadership: string;
      inAction: string;
      videos: string;
      joinUs: string;
    };
    hero: {
      badge: string;
      titleShort: string;
      titleMain: string;
      titleCountry: string;
      subtitle: string;
      ctaLearnMore: string;
      ctaLeadership: string;
    };
    membership: {
      title: string;
      subtitle: string;
      card1Title: string;
      card1Text: string;
      card2Title: string;
      card2Text: string;
      card3Title: string;
      card3Text: string;
      ready: string;
      startApplication: string;
    };
    footer: {
      description: string;
      connectWithUs: string;
      facebook: string;
      youtube: string;
      whatsapp: string;
    };
    testimonial: {
      title: string;
      subtitle: string;
      loading: string;
      empty: string;
      fbFull: string;
      fbShort: string;
    };
    videos: {
      title: string;
      subtitle: string;
      loading: string;
      empty: string;
      ytFull: string;
      ytShort: string;
    };
    faq: {
      title: string;
      subtitle: string;
      helpText: string;
      contact: string;
      whatsappAria: string;
    };
    whatsappFloat: {
      hintTitle: string;
      hintBody: string;
      chatAria: string;
    };
    features: {
      title: string;
      subtitle: string;
      highlight: string;
      highlightCta: string;
      cards: {
        title: string;
        description: string;
      }[];
    };
    team: {
      title: string;
      subtitle: string;
    };
    banner: {
      dismiss: string;
    };
    stats: {
      members: string;
      years: string;
      coverage: string;
      districts: string;
    };
  };
};

export const translations: Translations = {
  en: {
    navbar: {
      home: "Home",
      about: "About",
      leadership: "Leadership",
      inAction: "In Action",
      videos: "Videos",
      joinUs: "Join Us",
    },
    hero: {
      badge: "GNOA Since 1980",
      titleShort: "GNOA",
      titleMain: "Government Nursing Officers' Association",
      titleCountry: "Sri Lanka",
      subtitle:
        "Representing over 31,000 nursing officers across Sri Lanka's public healthcare system. Advocating for rights, welfare, and professional development of government nurses.",
      ctaLearnMore: "Learn More",
      ctaLeadership: "Meet Our Leadership",
    },
    membership: {
      title: "Join the GNOA Community",
      subtitle:
        "Become a member of the Government Nursing Officers' Association and be part of a professional community dedicated to excellence in healthcare.",
      card1Title: "Professional Support",
      card1Text: "Access resources and support to advance your nursing career.",
      card2Title: "Community Network",
      card2Text: "Connect with fellow nursing professionals across Sri Lanka.",
      card3Title: "Easy Application",
      card3Text: "Simple and secure online application process.",
      ready: "Ready to take the next step in your professional journey?",
      startApplication: "Start Your Application Now",
    },
    footer: {
      description:
        "Government Nursing Officers' Association Sri Lanka. For further assistance or inquiries, please contact us.",
      connectWithUs: "Connect With Us",
      facebook: "Facebook",
      youtube: "YouTube",
      whatsapp: "WhatsApp",
    },
    testimonial: {
      title: "GNOA in Action",
      subtitle:
        "Explore our activities, programs, and initiatives that support nursing officers across Sri Lanka.",
      loading: "Loading...",
      empty: "No photo cards available.",
      fbFull: "Follow Us on Facebook",
      fbShort: "Facebook",
    },
    videos: {
      title: "Watch Our Videos",
      subtitle:
        "Explore GNOA's activities, events, and advocacy work through our video content.",
      loading: "Loading...",
      empty: "No videos available.",
      ytFull: "Subscribe on YouTube",
      ytShort: "YouTube",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle:
        "Everything you need to know about GNOA, membership, and how we support nursing officers across Sri Lanka.",
      helpText: "Still have questions? Our team is here to help you.",
      contact: "Contact Us",
      whatsappAria: "Chat with us on WhatsApp",
    },
    whatsappFloat: {
      hintTitle: "Need help?",
      hintBody: "Tap the button to message us on WhatsApp — we are here for you.",
      chatAria: "Open WhatsApp chat with GNOA",
    },
    // FAQ items (questions & answers)
    // Indexed to match entries in data/faqs.ts
    // If you change faq count there, update these arrays too.
    // English duplicates base content for consistency.
    // Sinhala/Tamil provide localized versions.
    // If an index is missing, component falls back to English from data/faqs.
    // @ts-expect-error - extra field not in base type, accessed via any in component
    faqItems: [
      {
        question: "What is GNOA?",
        answer:
          "The Government Nursing Officers' Association (GNOA) is a professional trade union representing approximately 31,000 nursing officers employed in Sri Lanka's public healthcare system. We advocate for the rights, welfare, and professional development of government nurses.",
      },
      {
        question: "Who can join GNOA?",
        answer:
          "All nursing officers working in the public healthcare sector in Sri Lanka are eligible to become members of GNOA. Membership provides access to advocacy support, professional development programs, and collective representation.",
      },
      {
        question: "What services does GNOA provide?",
        answer:
          "GNOA provides advocacy support, collective bargaining, legal assistance, professional development programs, training workshops, welfare support, and representation in policy discussions with government officials.",
      },
      {
        question: "How does GNOA advocate for nursing officers?",
        answer:
          "GNOA actively engages with government officials, participates in policy discussions, negotiates on behalf of members, organizes collective actions when necessary, and provides legal support to protect nursing officers' rights and interests.",
      },
      {
        question: "What are GNOA's recent achievements?",
        answer:
          "GNOA has been actively involved in addressing concerns about overtime allowances, public holiday compensation, promotion periods, and working conditions. We regularly meet with Prime Ministers, Health Ministers, and other government officials to discuss healthcare worker concerns.",
      },
    ],
    features: {
      title: "Our Mission & Services",
      subtitle:
        "Dedicated to protecting the rights, welfare, and professional development of government nursing officers across Sri Lanka's public healthcare system.",
      highlight:
        "Representing 31,000+ nursing officers in policy discussions, negotiations, and advocacy efforts.",
      highlightCta: "Meet Our Leadership",
      cards: [
        {
          title: "Advocacy & Representation",
          description:
            "Active representation in policy discussions and negotiations with government officials to protect nursing officers' rights and interests.",
        },
        {
          title: "Collective Bargaining",
          description:
            "Strong collective bargaining power ensuring fair compensation, working conditions, and career advancement opportunities for all members.",
        },
        {
          title: "Professional Development",
          description:
            "Continuous education programs, training workshops, and certification support to enhance skills and career growth.",
        },
        {
          title: "Legal Support & Protection",
          description:
            "Comprehensive legal support and rights protection services for nursing officers facing workplace challenges or disputes.",
        },
        {
          title: "Welfare & Support",
          description:
            "Dedicated welfare programs providing financial assistance, healthcare support, and community resources for members and their families.",
        },
        {
          title: "Policy Engagement",
          description:
            "Active engagement in healthcare policy development, ensuring nursing officers' voices are heard at the highest levels of government.",
        },
      ],
    },
    team: {
      title: "Executive Committee",
      subtitle:
        "Dedicated leaders representing 31,000+ nursing officers across Sri Lanka's public healthcare system.",
    },
    banner: {
      dismiss: "Dismiss",
    },
    stats: {
      members: "Registered Members",
      years: "Years of Service",
      coverage: "Public Sector Coverage",
      districts: "Districts Represented",
    },
  },
  si: {
    navbar: {
      home: "මුල් පිටුව",
      about: "අප ගැන",
      leadership: "නායකත්වය",
      inAction: "ක්‍රියාකාරීත්වය",
      videos: "වීඩියෝ",
      joinUs: "අප සමඟ එක්වන්න",
    },
    hero: {
      badge: "1980 සිට GNOA",
      titleShort: "GNOA",
      titleMain: "රජයේ හෙද නිලධාරීන්ගේ සංගමය",
      titleCountry: "ශ්‍රී ලංකා",
      subtitle:
        "ශ්‍රී ලංකාවේ රජයේ සෞඛ්‍ය පද්ධතියේ හෙද නිලධාරින් 31,000කට අධික සංඛ්‍යාවක් නියෝජනය කරමින් ඔවුන්ගේ අයිතිවාසිකම්, සුභසාධන හා වෘත්තීය සංවර්ධනය වෙනුවෙන් කටයුතු කරන සංගමයකි.",
      ctaLearnMore: "තවදුරටත් දැනගන්න",
      ctaLeadership: "අපගේ නායකත්වය හමුවන්න",
    },
    membership: {
      title: "GNOA සමූහයට එක්වන්න",
      subtitle:
        "රජයේ හෙද නිලධාරීන්ගේ සංගමයේ සාමාජිකයෙකු වී, සෞඛ්‍ය ආරක්ෂක සේවයේ විශිෂ්ටත්වයට කැප වූ වෘත්තීය සමූහයකි.",
      card1Title: "වෘත්තීය සහය",
      card1Text: "ඔබගේ හෙද වෘත්තිය දියුණු කිරීමට අවශ්‍ය සම්පත් සහ උදව් ලබාගන්න.",
      card2Title: "සමූහ ජාලයක්",
      card2Text: "ශ්‍රී ලංකා පුරා හෙද වෘත්තියේ සහෝදරීන් හා සම්බන්ධ වන්න.",
      card3Title: "යෙදීම සරලයි",
      card3Text: "සරල හා ආරක්ෂිත මාර්ගයෙන් අන්තර්ජාලය හරහා අයදුම් කරන්න.",
      ready: "ඔබගේ වෘත්තීය ගමනේ නැවත ඉදිරියට යාමට සූදානම් ද?",
      startApplication: "ඔබගේ අයදුම දැන් ආරම්භ කරන්න",
    },
    footer: {
      description:
        "රජයේ හෙද නිලධාරීන්ගේ සංගමය – ශ්‍රී ලංකා. වැඩිදුර තොරතුරු හෝ විමසීම් සඳහා අප අමතන්න.",
      connectWithUs: "අප හා සම්බන්ධ වන්න",
      facebook: "ෆේස්බුක්",
      youtube: "යූ ටියුබ්",
      whatsapp: "වට්ස්ඇප්",
    },
    testimonial: {
      title: "GNOA ක්‍රියාකාරීත්වය",
      subtitle:
        "ශ්‍රී ලංකා පුරා හෙද නිලධාරීන් සඳහා අප සිදු කරන වැඩසටහන්, ක්‍රියාදාම හා ව්‍යාපෘති අත්විඳින්න.",
      loading: "පිටුව පූරණය වෙමින්...",
      empty: "පෙන්වීම සඳහා රූප පුවරු නොමැත.",
      fbFull: "ෆේස්බුක් මගින් අප හා එක් වන්න",
      fbShort: "ෆේස්බුක්",
    },
    videos: {
      title: "අපගේ වීඩියෝ බලන්න",
      subtitle:
        "GNOA සම්බන්ධ අවස්ථා, වැඩසටහන් හා හඬකාමතා කටයුතු පිළිබඳ වීඩියෝ මෙතැනින් බලන්න.",
      loading: "පිටුව පූරණය වෙමින්...",
      empty: "වීඩියෝ දත්ත නොමැත.",
      ytFull: "යූ ටියුබ් නාලිකාවට දායක වන්න",
      ytShort: "යූ ටියුබ්",
    },
    faq: {
      title: "නිතර අසන ප්‍රශ්න",
      subtitle:
        "GNOA, සාමාජිකත්වය, සහ රජයේ හෙද නිලධාරීන් සඳහා අප සැපයෙන සහය ගැන දැනගත හැක්කේ මෙතැනින්ය.",
      helpText:
        "තවමත් ඔබට ප්‍රශ්න තිබේද? අපගේ කණ්ඩායම ඔබට ඉදිරියෙන්ම උදව් කිරීමට සූදානම්.",
      contact: "අප අමතන්න",
      whatsappAria: "වට්ස්ඇප් මගින් අප හා සංවාදයකට එක්වන්න",
    },
    whatsappFloat: {
      hintTitle: "උදව් අවශ්‍යද?",
      hintBody: "වට්ස්ඇප් මගින් අපට පණිවිඩයක් යැවීමට බොත්තම තට්ටු කරන්න — අපි ඔබ වෙනුවෙන් සිටිමු.",
      chatAria: "GNOA සමඟ වට්ස්ඇප් සංවාදය විවෘත කරන්න",
    },
    // @ts-expect-error - extra field, used via any
    faqItems: [
      {
        question: "GNOA යනු කුමක්ද?",
        answer:
          "රජයේ හෙද නිලධාරීන්ගේ සංගමය (GNOA) යනු ශ්‍රී ලංකාවේ රජයේ සෞඛ්‍ය පද්ධතියේ සේවය කරන හෙද නිලධාරින් සම්බන්ධීකරණය කරන, සාමාජිකයන් 31,000කට ආසන්න වෘත්තීය වෘත්තියමය සංගමයකි. රජයේ හෙද නිලධාරීන්ගේ අයිතිවාසිකම්, සුභසාධන හා වෘත්තීය සංවර්ධනය වෙනුවෙන් අප ක්‍රියා කරයි.",
      },
      {
        question: "GNOA සාමාජිකත්වය ලබාගත හැක්කේ කෙනුත් ද?",
        answer:
          "ශ්‍රී ලංකාවේ රජයේ සෞඛ්‍ය අංශයේ සේවය කරන සෑම හෙද නිලධාරියෙකුටම GNOA සංගමයේ සාමාජිකත්වය ලබා ගැනීම සඳහා සුදුසුකම් ඇත. සාමාජිකත්වය මගින් ව්‍යාපාරික සහය, වෘත්තීය සංවර්ධන වැඩසටහන් සහ සමූහ නියෝජිතභාවය ලබාගත හැක.",
      },
      {
        question: "GNOA සංගමයෙන් ලබාදෙන සේවාවන් මොනවාද?",
        answer:
          "GNOA මගින් අයිතිවාසිකම් සඳහා ව්‍යාපාරික සහය, සමූහ සාකච්ඡා, නීතිමය උදව්, වෘත්තීය සංවර්ධන වැඩසටහන්, පුහුණු වැඩමුළු, සුභසාධන සහය සහ රජයේ නියෝජිතයින් සමඟ ප්‍රතිපත්ති සාකච්ඡා සඳහා නියෝජිතභාවය ලබාදෙයි.",
      },
      {
        question: "GNOA හෙද නිලධාරීන් වෙනුවෙන් කෙසේ ව්‍යාපාරිකව ක්‍රියා කරයිද?",
        answer:
          "GNOA රජයේ නිලධාරින් සමඟ සාකච්ඡාවල සෘජුවම සහභාගී වී, ප්‍රතිපත්ති කමිටු වෙත අදහස් ඉදිරිපත් කරයි, සාමාජිකයින් වෙනුවෙන් සාකච්ඡා කරයි, අවශ්‍ය අවස්ථාවල සමූහ ක්‍රියාමාර්ග සංවිධානය කරයි, සහ හෙද නිලධාරීන්ගේ අයිතිවාසිකම් ආරක්ෂා කිරීම සඳහා නීතිමය උදව් සපයයි.",
      },
      {
        question: "GNOA හි අලුත්ම ජයග්‍රහණ මොනවාද?",
        answer:
          "අයවැය වැඩපොළ අතිකාල ගෙවීම්, රාජ්‍ය නිවාඩු දින සහන, උසස් වීමේ කාල සීමා සහ සේවා කොන්දේසි පිළිබඳ ගැටළු විසඳීමට GNOA සක්‍රීයව කටයුතු කර ඇත. අපි නිරන්තරයෙන්ම අගමැතිවරුන්, සෞඛ්‍ය අමාත්‍යවරු සහ අනෙකුත් රජයේ නිලධාරින් සමඟ හමුවී සෞඛ්‍ය සේවකයින්ගේ අවධානම් කාරණා සාකච්ඡා කරයි.",
      },
    ],
    features: {
      title: "අපගේ දේශන සහ සේවාවන්",
      subtitle:
        "ශ්‍රී ලංකා රජයේ සෞඛ්‍ය පද්ධතියේ හෙද නිලධාරීන්ගේ අයිතිවාසිකම්, සුභසාධන හා වෘත්තීය සංවර්ධනය ආරක්ෂා කිරීමට කැපවුණු සංගමයකි.",
      highlight:
        "31,000ට වැඩි හෙද නිලධාරීන් නියෝජනය කරමින් පිරිසිදු ප්‍රතිපත්ති සමුළුවල, සංවාද හා සාකච්ඡාවල සහභාගි වේ.",
      highlightCta: "අපගේ නායකත්වය හමුවන්න",
      cards: [
        {
          title: "වකාශ හා නියෝජිතභාවය",
          description:
            "හෙද නිලධාරීන්ගේ අයිතිවාසිකම් හා කල්පනා ආරක්ෂා කිරීම සඳහා රජයේ නිලධාරින් සමඟ ප්‍රතිපත්ති සංවාද සහ සාකච්ඡා වල සෘජු නියෝජිතභාවය.",
        },
        {
          title: "සමූඛ සාකච්ඡා",
          description:
            "සෑම සාමාජිකයෙකුටම සාධාරණ වැටුප්, සේවා කොන්දේසි සහ රුධිර මාර්ග සංවර්ධන අවස්ථා සහතික කරන ශක්තිමත් සමූහ සාකච්ඡා බලය.",
        },
        {
          title: "වෘත්තීය සංවර්ධනය",
          description:
            "ඔබගේ දක්ෂතා හා වෘත්තීය වර්ධනය සඳහා අඛණ්ඩ අධ්‍යාපන වැඩසටහන්, පුහුණු වැඩමුළු සහ සහතික සහය.",
        },
        {
          title: "නීතිමය සහය හා ආරක්ෂාව",
          description:
            "සේවා ස්ථානයේදී මුහුණ දෙන අභියෝග හෝ ගැටළු සඳහා හෙද නිලධාරීන්ට සම්පූර්ණ නීතිමය සහාය හා අයිතිවාසිකම් ආරක්ෂාව.",
        },
        {
          title: "සුභසාධන සහ සහය",
          description:
            "සාමාජිකයන් සහ ඔවුන්ගේ පවුල් සඳහා ආර්ථික සහය, සෞඛ්‍ය සහය සහ සමාජ සම්පත් ලබාදෙන විශේෂ සුභසාධන වැඩසටහන්.",
        },
        {
          title: "ප්‍රතිපත්ති සම්බන්ධ කටයුතු",
          description:
            "සෞඛ්‍ය ප්‍රතිපත්ති සංවර්ධනයේ සෘජු සහභාගීවීම, හෙද නිලධාරීන්ගේ හඬ වැඩිම පාලන මට්ටමේදීත් ඇසීමට සහය.",
        },
      ],
    },
    team: {
      title: "නිර්වාහක කමිටුව",
      subtitle:
        "ශ්‍රී ලංකාවේ රජයේ සෞඛ්‍ය පද්ධතිය පුරා හෙද නිලධාරින් 31,000කට අධික සංඛ්‍යාවක් නියෝජනය කරන කැපවුණු නායකත්වය.",
    },
    banner: {
      dismiss: "අවලංගු කරන්න",
    },
    stats: {
      members: "ලියාපදිංචි සාමාජිකයින්",
      years: "සේවා වසර",
      coverage: "රජයේ සෞඛ්‍ය කොටස් ආවරණය",
      districts: "ප්‍රදේශ නියෝජනය කරයි",
    },
  },
  ta: {
    navbar: {
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      leadership: "தலைமைத்துவம்",
      inAction: "செயலில்",
      videos: "வீடியோக்கள்",
      joinUs: "எங்களுடன் சேரவும்",
    },
    hero: {
      badge: "1980 முதல் GNOA",
      titleShort: "GNOA",
      titleMain: "அரசு தாதி அலுவலர்கள் சங்கம்",
      titleCountry: "இலங்கை",
      subtitle:
        "இலங்கையின் அரசு சுகாதார அமைப்பில் பணிபுரியும் 31,000-க்கும் மேற்பட்ட தாதி அலுவலர்களை பிரதிநிதித்துவப்படுத்தி, அவர்களின் உரிமைகள், நலன் மற்றும் தொழில்முறை முன்னேற்றத்திற்காக பாடுபடும் அமைப்பாகும்.",
      ctaLearnMore: "மேலும் அறிய",
      ctaLeadership: "எங்கள் தலைமைத்துவத்தை அறிய",
    },
    membership: {
      title: "GNOA சமூகத்தில் இணையுங்கள்",
      subtitle:
        "அரசு தாதி அலுவலர்கள் சங்கத்தின் உறுப்பினராகி, சுகாதார சிறப்பிற்காக அர்ப்பணிக்கப்பட்ட ஒரு தொழில்முறை சமூகத்தில் பங்கேற்கவும்.",
      card1Title: "தொழில்முறை ஆதரவு",
      card1Text: "உங்கள் தாதி தொழிலை மேம்படுத்த உதவும் வளங்கள் மற்றும் ஆதரவைப் பெறுங்கள்.",
      card2Title: "சமூக வலையமைப்பு",
      card2Text: "இலங்கை முழுவதும் உள்ள தாதி தொழில்முறை நிபுணர்களுடன் இணைந்திருக்கவும்.",
      card3Title: "எளிய விண்ணப்பம்",
      card3Text: "எளிதான மற்றும் பாதுகாப்பான ஆன்லைன் விண்ணப்ப செயல்முறை.",
      ready: "உங்கள் தொழில்முறை பயணத்தில் அடுத்த படிக்குச் செல்ல தயார் தானா?",
      startApplication: "உங்கள் விண்ணப்பத்தை இப்போது தொடங்குங்கள்",
    },
    footer: {
      description:
        "அரசு தாதி அலுவலர்கள் சங்கம் – இலங்கை. மேலதிக உதவி அல்லது கேள்விகளுக்கு எங்களை தொடர்பு கொள்ளவும்.",
      connectWithUs: "எங்களுடன் தொடர்பில் இருங்கள்",
      facebook: "பேஸ்புக்",
      youtube: "யூடியூப்",
      whatsapp: "வாட்ஸ்அப்",
    },
    testimonial: {
      title: "செயலில் GNOA",
      subtitle:
        "இலங்கை முழுவதும் தாதி அலுவலர்களை ஆதரிக்கும் எங்கள் செயல்கள், திட்டங்கள் மற்றும் முனைப்புகளை இங்கு பாருங்கள்.",
      loading: "தகவல் ஏற்றப்படுகிறது...",
      empty: "காண்பிக்க புகைப்பட அட்டைகள் இல்லை.",
      fbFull: "பேஸ்புக்கில் எங்களை பின்தொடருங்கள்",
      fbShort: "பேஸ்புக்",
    },
    videos: {
      title: "எங்கள் வீடியோக்களை பார்க்க",
      subtitle:
        "GNOA-வின் நிகழ்வுகள், செயல்பாடுகள் மற்றும் வலியுறுத்தல் பணிகளை வீடியோக்கள் மூலம் அறிக.",
      loading: "தகவல் ஏற்றப்படுகிறது...",
      empty: "வீடியோக்கள் கிடைக்கவில்லை.",
      ytFull: "YouTube-இல் எங்கள் சேனலுக்கு சந்தாதாரராகுங்கள்",
      ytShort: "யூடியூப்",
    },
    faq: {
      title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      subtitle:
        "GNOA, உறுப்பினர் சேர்க்கை, மற்றும் தாதி அலுவலர்களுக்கு நாம் வழங்கும் ஆதரவுகள் பற்றிய அனைத்தையும் இங்கு அறிந்து கொள்ளுங்கள்.",
      helpText:
        "இன்னும் கேள்விகள் உள்ளனவா? எங்கள் குழு உங்களுக்கு உதவ தயாராக உள்ளது.",
      contact: "எங்களை தொடர்பு கொள்ளவும்",
      whatsappAria: "வாட்ஸ்அப்பில் எங்களுடன் உரையாடுங்கள்",
    },
    whatsappFloat: {
      hintTitle: "உதவி வேண்டுமா?",
      hintBody: "வாட்ஸ்அப்பில் செய்தி அனுப்ப பொத்தானைத் தட்டுங்கள் — நாங்கள் உங்களுக்காக இருக்கிறோம்.",
      chatAria: "GNOA உடன் வாட்ஸ்அப் உரையாடலைத் திறக்கவும்",
    },
    // @ts-expect-error - extra field, used via any
    faqItems: [
      {
        question: "GNOA என்பது 무엇?",
        answer:
          "அரசு தாதி அலுவலர்கள் சங்கம் (GNOA) என்பது இலங்கையின் அரசு சுகாதார அமைப்பில் பணிபுரியும் சுமார் 31,000 தாதி அலுவலர்களை பிரதிநிதித்துவப்படுத்தும் தொழில்முறை தொழிற்சங்கமாகும். அரசு தாதி அலுவலர்களின் உரிமைகள், நலன் மற்றும் தொழில்முறை முன்னேற்றத்திற்காக நாம் செயல்படுகிறோம்.",
      },
      {
        question: "யார் GNOA-வில் சேர முடியும்?",
        answer:
          "இலங்கையின் அரசு சுகாதார துறையில் பணிபுரியும் அனைத்து தாதி அலுவலர்களும் GNOA உறுப்பினர்களாக சேர தகுதியானவர்கள். உறுப்பினர் ஆனதன் மூலம் வலியுறுத்தல் ஆதரவு, தொழில்முறை மேம்பாட்டு திட்டங்கள் மற்றும் கூட்டு பிரதிநிதித்துவம் போன்ற நன்மைகள் கிடைக்கும்.",
      },
      {
        question: "GNOA என்ன சேவைகளை வழங்குகிறது?",
        answer:
          "GNOA வலியுறுத்தல் ஆதரவு, கூட்டு பேச்சுவார்த்தை, சட்ட உதவி, தொழில்முறை மேம்பாட்டு திட்டங்கள், பயிற்சி பட்டறைகள், நலத்திட்டங்கள் மற்றும் அரசு அதிகாரிகளுடன் நடைபெறும் கொள்கை விவாதங்களில் உறுப்பினர்களுக்கான பிரதிநிதித்துவத்தை வழங்குகிறது.",
      },
      {
        question: "GNOA தாதி அலுவலர்களுக்காக எவ்வாறு வலியுறுத்துகிறது?",
        answer:
          "GNOA அரசு அதிகாரிகளுடன் தொடர்ந்து தொடர்பில் இருந்து கொள்கை விவாதங்களில் பங்கேற்கிறது, உறுப்பினர்களின் சார்பில் பேச்சுவார்த்தை நடத்துகிறது, தேவையானபோது கூட்டு நடவடிக்கைகளை ஏற்பாடு செய்கிறது, மற்றும் தாதி அலுவலர்களின் உரிமைகளை பாதுகாக்க சட்ட ஆதரவை வழங்குகிறது.",
      },
      {
        question: "GNOA-வின் சமீபத்திய சாதனைகள் என்ன?",
        answer:
          "அதிகால ஊதியம், பொதுவிடுமுறை ஈடுசெய்தல், பதவி உயர்வு காலவரம்புகள் மற்றும் பணிமூல சூழல் தொடர்பான பிரச்சினைகளை தீர்க்க GNOA செயலில் ஈடுபட்டு வருகிறது. பிரதமர்கள், சுகாதார அமைச்சர்கள் மற்றும் பிற அரசு அதிகாரிகளுடன் தவறாமல் சந்தித்து சுகாதார ஊழியர்களின் கவலைகளை விவாதிக்கிறோம்.",
      },
    ],
    features: {
      title: "எங்கள் நோக்கமும் சேவைகளும்",
      subtitle:
        "இலங்கையின் அரசு சுகாதார அமைப்பில் பணிபுரியும் தாதி அலுவலர்களின் உரிமைகள், நலன் மற்றும் தொழில்முறை முன்னேற்றத்தைப் பாதுகாக்க அர்ப்பணிக்கப்பட்ட அமைப்பு.",
      highlight:
        "31,000-க்கும் மேற்பட்ட தாதி அலுவலர்களை பிரதிநிதித்துவப்படுத்தி கொள்கை விவாதங்கள், பேச்சுவார்த்தைகள் மற்றும் வலியுறுத்தல் முயற்சிகளில் பங்கெடுக்கிறோம்.",
      highlightCta: "எங்கள் தலைமைத்துவத்தை அறிய",
      cards: [
        {
          title: "வலியுறுத்தலும் பிரதிநிதித்துவமும்",
          description:
            "தாதி அலுவலர்களின் உரிமைகள் மற்றும் நலன்களைப் பாதுகாக்க அரசு அதிகாரிகளுடன் நடைபெறும் கொள்கை விவாதங்கள் மற்றும் பேச்சுவார்த்தைகளில் செயலில் பிரதிநிதித்துவம்.",
        },
        {
          title: "கூட்டு பேச்சுவார்த்தை",
          description:
            "அனைத்து உறுப்பினர்களுக்கும் நியாயமான ஊதியம், பணிமூல சூழல் மற்றும் பதவி உயர்வு வாய்ப்புகளை உறுதி செய்ய வலுவான கூட்டு பேச்சுவார்த்தை சக்தி.",
        },
        {
          title: "தொழில்முறை மேம்பாடு",
          description:
            "திறன் மற்றும் தொழில் முன்னேற்றத்தை மேம்படுத்த தொடர் கல்வி திட்டங்கள், பயிற்சி பட்டறைகள் மற்றும் சான்றிதழ் ஆதரவு.",
        },
        {
          title: "சட்ட ஆதரவும் பாதுகாப்பும்",
          description:
            "பணியிடத்தில் ஏற்படும் சவால்கள் அல்லது தகராறுகளுக்கு முகம் கொடுக்கும் தாதி அலுவலர்களுக்கு விரிவான சட்ட ஆதரவும் உரிமை பாதுகாப்பு சேவைகளும்.",
        },
        {
          title: "நலத்திட்டங்கள் மற்றும் ஆதரவு",
          description:
            "உறுப்பினர்கள் மற்றும் அவர்களின் குடும்பங்களுக்கான நிதி உதவி, சுகாதார ஆதரவு மற்றும் சமூக வளங்களை வழங்கும் சிறப்பு நலத்திட்டங்கள்.",
        },
        {
          title: "கொள்கை ஈடுபாடு",
          description:
            "சுகாதார கொள்கை உருவாக்கத்தில் செயலில் ஈடுபட்டு, தாதி அலுவலர்களின் குரல் அரசு மட்டத்தின் உயர்ந்த நிலைகளிலும் கேட்கப்படும் வகையில் உறுதி செய்தல்.",
        },
      ],
    },
    team: {
      title: "நிர்வாகக் குழு",
      subtitle:
        "இலங்கை அரசு சுகாதார அமைப்பில் பணிபுரியும் 31,000-க்கும் மேற்பட்ட தாதி அலுவலர்களை பிரதிநிதித்துவப்படுத்தும் அர்ப்பணிப்பான தலைமைத்துவம்.",
    },
    banner: {
      dismiss: "மூடு",
    },
    stats: {
      members: "பதிந்த உறுப்பினர்கள்",
      years: "சேவை ஆண்டுகள்",
      coverage: "அரசுத் துறை வரம்பளவு",
      districts: "மாவட்டங்கள் பிரதிநிதித்துவம் செய்யப்படுகின்றன",
    },
  },
};

export const defaultLanguage: LanguageCode = "en";

