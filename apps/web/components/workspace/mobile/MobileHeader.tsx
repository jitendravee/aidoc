import Text from "../../ui/Text";
import { Sparkles } from "lucide-react";

export default function MobileHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <Text as="div" size="lg" weight="bold" family="heading">
        Flow<Text as="span" size="lg" weight="bold" family="heading" color="primary">PDF</Text>
      </Text>
      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
        <Sparkles className="size-3 text-primary" />
        <Text size="2xs" weight="medium" color="primary">AI PDF Editor</Text>
      </div>
    </div>
  );
}