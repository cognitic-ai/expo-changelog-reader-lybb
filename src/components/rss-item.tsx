import { Pressable, Text, View } from "react-native";
import * as AC from "@bacons/apple-colors";
import * as WebBrowser from "expo-web-browser";

interface RssItemProps {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

export function RssItem({ title, description, pubDate, link }: RssItemProps) {
  const formattedDate = new Date(pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handlePress = () => {
    WebBrowser.openBrowserAsync(link);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? AC.systemGray5
          : AC.secondarySystemGroupedBackground,
        padding: 16,
        borderRadius: 12,
        borderCurve: "continuous",
        gap: 8,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        selectable
        style={{
          fontSize: 17,
          fontWeight: "600",
          color: AC.label,
        }}
        numberOfLines={2}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: AC.secondaryLabel,
        }}
        numberOfLines={3}
      >
        {description}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: AC.tertiaryLabel,
        }}
      >
        {formattedDate}
      </Text>
    </Pressable>
  );
}
