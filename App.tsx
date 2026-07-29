import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { checkApiHealth } from "./src/api/client";

type ApiState = "idle" | "loading" | "online" | "offline";

export default function App() {
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [apiMessage, setApiMessage] = useState("API 연결을 확인해 주세요.");

  const refreshHealth = useCallback(async () => {
    setApiState("loading");

    try {
      const health = await checkApiHealth();
      setApiState("online");
      setApiMessage(health.message);
    } catch {
      setApiState("offline");
      setApiMessage("백엔드 서버에 연결할 수 없습니다.");
    }
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  const statusLabel =
    apiState === "online" ? "Online" : apiState === "offline" ? "Offline" : "Checking";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Re-Store</Text>
          <Text style={styles.title}>React Native 앱 준비 완료</Text>
          <Text style={styles.description}>
            프론트는 Expo 기반으로, 백엔드는 Node.js API와 연결되도록 시작점을 잡았습니다.
          </Text>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                apiState === "online" && styles.statusDotOnline,
                apiState === "offline" && styles.statusDotOffline
              ]}
            />
            <Text style={styles.statusLabel}>Backend {statusLabel}</Text>
            {apiState === "loading" ? <ActivityIndicator color="#38bdf8" /> : null}
          </View>
          <Text style={styles.statusMessage}>{apiMessage}</Text>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.82} onPress={refreshHealth}>
          <Text style={styles.buttonText}>API 다시 확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101820"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 24
  },
  header: {
    gap: 12
  },
  kicker: {
    color: "#38bdf8",
    fontSize: 15,
    fontWeight: "700"
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40
  },
  description: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24
  },
  statusPanel: {
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    backgroundColor: "#17212b",
    padding: 18
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#94a3b8"
  },
  statusDotOnline: {
    backgroundColor: "#22c55e"
  },
  statusDotOffline: {
    backgroundColor: "#ef4444"
  },
  statusLabel: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700"
  },
  statusMessage: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#38bdf8",
    paddingVertical: 15
  },
  buttonText: {
    color: "#082f49",
    fontSize: 16,
    fontWeight: "800"
  }
});
