import React, { Component } from 'react';
import { View, Text, TextInput, Image, Platform, TouchableWithoutFeedback, FlatList, StyleSheet,  TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MonoText } from '../components/StyledText';
import api from '../api';
import Colors from '../constants/Colors';

import { getTopStocks, getStockInfo, getStockPrice } from '../redux/actions';

import Spinner from 'react-native-loading-spinner-overlay'


import SearchIcon from 'react-native-vector-icons/EvilIcons';
import ArrowIcon from 'react-native-vector-icons/Ionicons';
import { AlarmMethod } from 'expo/build/Calendar';


@connect(state => ({ 
    stocks: state.stocks 
}), { getTopStocks, getStockInfo, getStockPrice })
export default class HomeScreen extends Component {
    constructor(props){
        super(props)
        this.state = { text: '',  }
    }
    async componentDidMount(){
        const { navigation, stocks: { results }, getTopStocks } = this.props
        await getTopStocks()
    }
    render(){
        return (
            <View style={styles.container} >
                <this.searchBox/>
                <this.results/>
                <Spinner visible={this.state.loading} />
            </View>
        )
    }
    searchBox = () => {
        const { text } = this.state
        return (
            <TouchableWithoutFeedback onPress={this.focusTextInput}>
                <View style={styles.textInputContainer}>
                    <SearchIcon name="search" size={30} style={{ paddingLeft: 15 }} color={Colors.outlineGray} />
                    <TextInput
                    style={{ width: '90%', paddingLeft: 5, fontSize: 18, paddingVertical: 15 }}
                    value={text}
                    ref={ref => this.textInput = ref}
                    onChangeText={this.handleText}
                    placeholder='Search stocks'
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    />
                </View>
            </TouchableWithoutFeedback >
        )
    }
    focusTextInput = () => this.textInput.focus()
    handleText = (text) => {
        const { navigation, getStockPrice } = this.props
        this.setState({ text, })
        // this is so we don't send a request on every keystroke
        this.searchTimeout = setTimeout(async () => {
            const { price, hasError } = await getStockPrice({ stock: this.state.text, getWhat: 'price' })
            this.setState({ price, hasError })
        }, 500)
    }

    results = () => {
        const { price, hasError, text } = this.state, { stocks: { results } } = this.props
        if (text.length > 0) return  !hasError ? <this.renderItem item={{ symbol: text, companyName: '', latestPrice: price, index: -1 }} /> 
        : <Text style={{ alignSelf: 'center' }} >
            We couldn't find any results for {text}
        </Text>
        return (
            <FlatList
            data={results}
            extraData={this.props}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            />
        )
    }
    keyExtractor = (item, index) => item.symbol
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.listItem} onPress={this.handleItemPress(item, index)} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View style={{ flexDirection: 'column',  }} >
                        <Text style={styles.itemSymbol} >
                            {item.symbol}
                        </Text>
                        <Text style={styles.itemName} >
                            {getName(item.companyName)} 
                        </Text>
                    </View>
                    <Text style={styles.itemPrice} >
                        ${item.latestPrice}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    handleItemPress = (item, index) => () => {
        const { navigation } = this.props
        navigation.navigate('BalanceSheetScreen', { item, index })
    }
}

const getName = (string) => string.length > 25 ? `${string.slice(0, 25)}...` : string

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textInputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        alignSelf: 'center',
        // width: '90%',
        borderColor: Colors.outlineGray, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        // borderRadius: 25,
        // marginVertical: 10,
    },
    listItem: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    itemSymbol: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    itemName: {
        fontSize: 18,
    },
    itemPrice: {
        fontSize: 18,
        // fontWeight: 'bold'
    },
});
