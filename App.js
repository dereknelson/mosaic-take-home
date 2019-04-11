import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import createAppStore from './redux/store';
export const { persistor, store } = createAppStore()



export default class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoadingComplete: false,
        }
    }

    render() {
        const { isLoadingComplete } = this.state, { skipLoadingScreen } = this.props

        if (!isLoadingComplete && !skipLoadingScreen) return (
            <AppLoading startAsync={this.loadResources} onError={this.handleLoadingError} onFinish={this.handleFinishLoading} />
        )
        else return (
            <View style={styles.container}>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                        <AppNavigator />
                    </PersistGate>
                </Provider>
            </View>
        )
    }
    loadResources = async () => Promise.all([
        // Asset.loadAsync([
        //     require('./assets/images/robot-dev.png'),
        //     require('./assets/images/robot-prod.png'),
        // ]),
        Font.loadAsync({
            ...Icon.Ionicons.font,
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        }),
    ])

    handleLoadingError = error =>  console.warn(error)

    handleFinishLoading = () => this.setState({ isLoadingComplete: true })
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
