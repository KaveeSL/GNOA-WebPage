import { ICustomIcon } from "@/types";

export default function CustomIcon({ icon: Icon, dir = 'left' }: ICustomIcon) {
    return (
        <div className={`shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] p-2 aspect-square rounded-lg text-white transition-transform duration-200 hover:scale-110 ${dir === 'left' ? '-rotate-15' : 'rotate-15'}`} style={{ backgroundColor: '#762727' }}>
            <Icon size={24} />
        </div>
    )
}