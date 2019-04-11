import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';

import BalanceSheetScreen from '../screens/BalanceSheet/BalanceSheetScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
    BalanceSheetScreen: BalanceSheetScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'} />
    ),
};

export default createBottomTabNavigator({
    HomeStack,
})
