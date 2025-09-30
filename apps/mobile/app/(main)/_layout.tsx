import { Stack } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Sidebar from "../../components/Sidebar";
import Svg, { Path, G } from "react-native-svg";
import regions from "./georgia-region";
import { useState } from "react";

export default function MainLayout() {
  const [selectedRegion, setSelectedRegion] = useState("");

  return (
    <View style={styles.container}>
      {/* Content Area with Georgia Map Shape */}
      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <Svg viewBox="0 0 800 600" width="100%" height="100%">
            {regions.map((r) => (
              <Path
                key={r.id}
                d={r.path}
                fill={selectedRegion === r.id ? "orange" : "#808080"}
                stroke="#fff"
                strokeWidth={0.5}
                onPress={() => {
                  setSelectedRegion(r.id);
                  console.log("Clicked menu item:", r.name); // აქ არის მენიუს სახელწოდება
                  // აქ შეგიძლია ნავიგაცია: navigation.navigate(r.id) ან popup
                }}
              />
            ))}
          </Svg>
        </View>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* Right Sidebar with Dots */}
      {/* <Sidebar style={styles.sidebarRight} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4a4a4a",
  },
  sidebarLeft: {
    width: 50,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  sidebarRight: {
    width: 50,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    width: "150%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "55deg" }],
  },
});
