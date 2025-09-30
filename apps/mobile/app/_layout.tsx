// app/_layout.tsx
import { Stack, Redirect } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* თუ ვიღაცა "/" გზაზე მივა → გადავამისამართოთ dashboard-ზე */}
      <Stack.Screen name="index" options={{ redirect: "/(main)/dashboard" }} />
    </Stack>
  );
}
