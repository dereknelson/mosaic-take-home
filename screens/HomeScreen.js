import React, { Component } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

import { connect } from 'react-redux';
import { MonoText } from '../components/StyledText';

@connect(state => ({ whateverAPI: state.whateverAPI }))
export default class HomeScreen extends Component {
    render(){
        return (
            <View/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    
});
