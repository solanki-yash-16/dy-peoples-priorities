import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { SubmissionsScreen } from "../screens/main/SubmissionsScreen";
import { ThemesScreen } from "../screens/main/ThemesScreen";
import { HotspotsScreen } from "../screens/main/HotspotsScreen";
import { RankingsScreen } from "../screens/main/RankingsScreen";
import { InsightsScreen } from "../screens/main/InsightsScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { CreateSubmissionScreen } from "../screens/submission/CreateSubmissionScreen";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth";
import { storage } from "../utils/storage";
import { View, ActivityIndicator } from "react-native";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  CreateSubmission: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Themes: undefined;
  Submissions: undefined;
  Hotspots: undefined;
  Rankings: undefined;
  Insights: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const TabStack = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <TabStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <TabStack.Screen name="Home" component={HomeScreen} />
      <TabStack.Screen name="Themes" component={ThemesScreen} />
      <TabStack.Screen name="Submissions" component={SubmissionsScreen} />
      <TabStack.Screen name="Hotspots" component={HotspotsScreen} />
      <TabStack.Screen name="Rankings" component={RankingsScreen} />
      <TabStack.Screen name="Insights" component={InsightsScreen} />
      <TabStack.Screen name="Profile" component={ProfileScreen} />
    </TabStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isInitializing, setUser, setInitializing } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          const user = await authApi.me();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth init error:", error);
        setUser(null);
        await storage.removeToken();
      } finally {
        setInitializing(false);
      }
    };
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen
              name="CreateSubmission"
              component={CreateSubmissionScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
