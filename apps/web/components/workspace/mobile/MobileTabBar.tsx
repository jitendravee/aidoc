import Text from "../../ui/Text";
import { MessageCircle, FileStack, Download, MoreHorizontal } from "lucide-react";

export type MobileTab = "chat" | "pages" | "download" | "more";

const tabs: { id: MobileTab; label: string; icon: typeof MessageCircle }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "pages", label: "Pages", icon: FileStack },
  { id: "download", label: "Download", icon: Download },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export default function MobileTabBar({ active, onChange }: { active: MobileTab; onChange: (tab: MobileTab) => void }) {
  return (
    <div className="flex items-center justify-around border-t border-border bg-surface px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} className="flex flex-col items-center gap-0.5 px-3 py-1">
            <Icon className={`size-5 ${isActive ? "text-primary" : "text-text-secondary"}`} />
            <Text size="3xs" weight={isActive ? "semibold" : "normal"} color={isActive ? "primary" : "text-secondary"}>
              {label}
            </Text>
          </button>
        );
      })}
    </div>
  );
}