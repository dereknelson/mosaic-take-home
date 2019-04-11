import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions, StyleSheet, Platform, Animated, ScrollView } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation' 
import Colors from '../../constants/Colors';
import { getStockInfo } from '../../redux/actions';


const { height, width } = Dimensions.get('window')
const ios = Platform.OS == 'ios'

import ArrowIcon from 'react-native-vector-icons/Ionicons';

@connect(state => ({
    stocks: state.stocks,
}), { getStockInfo } )
export default class BalanceSheetScreen extends Component {
    constructor(props){
        super(props)
        const { navigation: { getParam }, getStockInfo } = this.props, item = getParam('item'), index = getParam('index')
        this.state = { item, index, isExpanded: { }, fetchedCompanyInfo: false, fetchedReports: false }
    }
    async componentDidMount(){
        const { navigation: { getParam }, getStockInfo } = this.props, item = getParam('item')
        await getStockInfo({ getWhat: 'company', stock: item.symbol })
        this.setState({ fetchedCompanyInfo: true })
        const { item: newItem, index } = await getStockInfo({ getWhat: 'balance-sheet/5', stock: item.symbol })
        this.setState({ fetchedReports: true, item: newItem, index })
    }
    render(){
        const { index, item: theItem } = this.state, { stocks: { results } } = this.props, item = index >= 0 ? results[index] : theItem
        return (
            <View style={{ flex: 1 }} >
                <this.header item={item} />
                <Text style={{ alignSelf: 'center', fontSize: 24, marginVertical: 5, }} > Reports </Text>
                <this.details item={item} />
            </View>
        )
    }
    header = ({ item }) => {
        return (
            <View style={styles.headerContainer} >
                <View style={{ flexDirection: 'column',  }} >
                    <Text style={styles.itemName} >
                        {item.companyName} ({item.symbol})
                    </Text>
                </View>
                <Text style={styles.itemPrice} >
                    ${item.latestPrice}
                </Text>
                {this.state.fetchedCompanyInfo ? <this.companyInfo item={item} />
                    : <View style={{ height: 100, width: '100%', justifyContent: 'center', alignItems: 'center',  }} > 
                        <ActivityIndicator size="large" />
                    </View>
                }
            </View>
        )
    }
    companyInfo = ({ item }) => {
        return (
            <View style={{ flexDirection: 'column' }} > 
                <Text style={[styles.infoText, { color: 'blue' }]} onPress={() => WebBrowser.openBrowserAsync(item.website)} >
                    {item.website}
                </Text>
                <Text style={styles.infoText} >
                    Industry {item.industry}
                </Text>
                <Text style={styles.infoText} >
                    Employees {item.employees}
                </Text>
            </View>  
        )
    }
    details = ({ item }) => {
        return (
            <FlatList 
            data={item.balancesheet}
            listEmptyComponent={this.listEmpty}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.reportDate}
            />
        )
    }

    renderItem = ({ item, index }) => (
        <View style={{ flexDirection: 'column' }} >
            <TouchableOpacity style={styles.listItem} onPress={() => this.setState(state => { 
                state.isExpanded[index] = !state.isExpanded[index]
                return state
            })} >
                <Text style={styles.reportDate} >
                    {item.reportDate}
                </Text>
                <ArrowIcon name={`ios-arrow-${this.state.isExpanded[index] ? 'down' : 'forward'}`} size={35} style={{ color: Colors.outlineGray }} />
            </TouchableOpacity>
            {this.state.isExpanded[index] ? Object.keys(item).map(key => this.individualDetail({ key, value: item[key]  }) ) : null}
        </View>
    )
    // if the value is null, don't render that key
    individualDetail = ({ key, value }) => !value ? null : (
        <View key={key} style={styles.individualDetail} >
            <Text style={{ fontSize: 18 }} >
                {key}
            </Text>
            <Text style={{ fontSize: 17, color: typeof value != "number" ? 'black' : 
                value > 0 ? 'green' : 'red' }} >
                {value}
            </Text>
        </View>
    )

    listEmpty = () => (
        <View style={{ flex: 1 }} >
            <ActivityIndicator />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'flex-start', 
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: Colors.outlineGray,
        borderWidth: StyleSheet.hairlineWidth
    },
    listItem: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reportDate: {
        fontSize: 20,
    },
    itemName: {
        fontSize: 24,
        maxWidth: '60%'
    },
    itemPrice: {
        fontSize: 16,
        // fontWeight: 'bold'
    },
    infoText: {
        fontSize: 16
    }, 

    individualDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
});