import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as AC from "@bacons/apple-colors";
import { RssItem } from "@/components/rss-item";

interface FeedItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

const RSS_URL = "https://expo.dev/changelog/rss.xml";

function parseRss(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const title = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";

    const description =
      itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";

    const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";

    const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";

    items.push({
      title: title.trim(),
      description: stripHtml(description.trim()),
      pubDate: pubDate.trim(),
      link: link.trim(),
    });
  }

  return items;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default function IndexRoute() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRss = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(RSS_URL);
      const xml = await response.text();
      const parsedItems = parseRss(xml);
      setItems(parsedItems);
    } catch (err) {
      setError("Failed to load RSS feed");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRss();
  }, [fetchRss]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRss();
  }, [fetchRss]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemGroupedBackground,
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemGroupedBackground,
          padding: 20,
        }}
      >
        <Text
          selectable
          style={{
            color: AC.systemRed,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
        backgroundColor: AC.systemGroupedBackground,
      }}
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {items.map((item, index) => (
        <RssItem
          key={`${item.link}-${index}`}
          title={item.title}
          description={item.description}
          pubDate={item.pubDate}
          link={item.link}
        />
      ))}
    </ScrollView>
  );
}
