import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { SubmissionsScreen } from "../screens/main/SubmissionsScreen";
import { ThemesScreen } from "../screens/main/ThemesScreen";
import { HotspotsScreen } from "../screens/main/HotspotsScreen";
import { RankingsScreen } from "../screens/main/RankingsScreen";
import { InsightsScreen } from "../screens/main/InsightsScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { CreateSubmissionScreen } from "../screens/submission/CreateSubmissionScreen";
import { CustomTabBar } from "./CustomTabBar";

type RootStackParamList = {
  Login: undefined;
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
  const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

  return (
    <TabStack.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
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
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen
          name="CreateSubmission"
          component={CreateSubmissionScreen}
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
