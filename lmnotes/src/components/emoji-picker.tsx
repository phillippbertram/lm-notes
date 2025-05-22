import { Button } from "@/components/ui/button";

export const EMOJI_SUGGESTIONS = [
  "📝",
  "📚",
  "📖",
  "📓",
  "📔",
  "📒",
  "📑",
  "🔖",
  "📌",
  "📍",
  "📎",
  "📐",
  "✏️",
  "📏",
  "🖊️",
  "🖋️",
  "✒️",
  "🖌️",
  "🖍️",
  "📝",
  "✏️",
  "🔍",
  "🔎",
  "💡",
  "💭",
  "💬",
  "🗣️",
  "👥",
  "👤",
  "🧠",
  "🎯",
  "🎨",
];

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({
  selectedEmoji,
  onEmojiSelect,
}: EmojiPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Emoji</label>
      <div className="grid grid-cols-8 gap-2 p-2 border rounded-md">
        {EMOJI_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onEmojiSelect(suggestion)}
            className={`p-2 text-xl rounded-md hover:bg-accent ${
              selectedEmoji === suggestion ? "bg-accent" : ""
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
