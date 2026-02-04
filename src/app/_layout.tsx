import { ThemeProvider } from "@/components/theme-provider";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const isIOS = process.env.EXPO_OS === "ios";

function getAppleStackPreset(): NativeStackNavigationOptions {
  if (!isIOS) {
    return {};
  }

  try {
    const { isLiquidGlassAvailable } = require("expo-glass-effect");
    if (isLiquidGlassAvailable()) {
      return {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          color: AC.label as any,
        },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      };
    }
  } catch {
    // expo-glass-effect not available
  }

  return {
    headerTransparent: true,
    headerShadowVisible: true,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: {
      backgroundColor: "transparent",
    },
    headerBlurEffect: "systemChromeMaterial",
    headerBackButtonDisplayMode: "default",
  };
}

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={getAppleStackPreset()}>
        <Stack.Screen
          name="index"
          options={{
            title: "Expo Changelog",
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
