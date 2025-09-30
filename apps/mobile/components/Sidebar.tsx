import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";

function RippleButton({ onPress, children }) {
  const ripple = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    ripple.setValue(0);
    Animated.timing(ripple, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onPress());
  };

  const rippleStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.2)",
    transform: [
      { translateX: Animated.multiply(ripple, -40) },
      { translateY: Animated.multiply(ripple, -20) },
      {
        scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
      },
    ],
    opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
  };

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      {children}
      <Animated.View style={rippleStyle} />
    </Pressable>
  );
}

export default function Sidebar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <RippleButton onPress={() => router.push("/(main)/dashboard")}>
        <Text style={styles.item}>🏠</Text>
      </RippleButton>

      <RippleButton onPress={() => router.push("/(main)/Category1")}>
        <Text style={styles.item}>📚</Text>
      </RippleButton>

      <RippleButton onPress={() => router.push("/(main)/Category2")}>
        <Text style={styles.item}>📊</Text>
      </RippleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  pressable: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  item: {
    fontSize: 16,
  },
});
