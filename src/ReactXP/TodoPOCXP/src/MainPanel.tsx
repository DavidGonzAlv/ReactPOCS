/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');
import ListView = require('./components/ListView');
import { RSA_NO_PADDING } from 'constants';
//import { TouchableOpacity, TextInput, ImageBackground, Platform, StyleSheet, Text, View, Alert } from 'react-native';

interface MainPanelProps {
    onNavigateBack: () => void;
    onShowTodoPanel: () => void;
}

var md5 = require('md5');
const PublicKey = "658848b5571b8b3f2d87ecd5721614a4";
const PrivateKey = "8c73cf4ebbdb26ef8d885a58e478d78a43d1d884";
const LIMIT = 25;


let ts = Date.now();
let hash = md5(ts + PrivateKey + PublicKey);
let REQUEST_URL = 'https://gateway.marvel.com/v1/public/characters?ts=' + ts + '&apikey=' + PublicKey + '&hash=' + hash + '&limit=' + LIMIT + '&offset=0';

class MainPanel extends RX.Component<MainPanelProps, null> {
    private _translationValue: RX.Animated.Value;
    private _animatedStyle: RX.Types.AnimatedTextStyleRuleSet;

    constructor(props: MainPanelProps) {
        super(props);
       
        this.state = { canLogin: false, SUPERHERO: '', image: '' }
      
        this._translationValue = RX.Animated.createValue(-100);
        this._animatedStyle = RX.Styles.createAnimatedTextStyle({
            transform: [
                {
                    translateY: this._translationValue
                }
            ]
        });
    }

    searchForHero(hero) {
        fetch('https://gateway.marvel.com/v1/public/characters?name=' + hero + '&ts=' + ts + '&apikey=' + PublicKey + '&hash=' + hash + '&limit=' + LIMIT + '&offset=0')
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);
                if (responseJson.data.results.length == 0) {
                    // Alert.alert(
                    //     'BUUUUUUUUU!!!',
                    //     this.state.SUPERHERO + ' is not a Marvel SUPERHERO!',
                    //     [
                    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
                    //     ],
                    //     { cancelable: false }
                    //)
                } else {
                    this.setState({ image: responseJson.data.results[0].thumbnail.path + '.' + responseJson.data.results[0].thumbnail.extension })
                    this._characters.unshift(this.state.image);
                    this.props.navigation.navigate('Main', this._characters);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        let animation = RX.Animated.timing(this._translationValue, {
            toValue: 0,
            easing: RX.Animated.Easing.CubicBezier(0.2, 0.5, 0.1, 1),
            duration: 1000
        }
        );

        animation.start();
    }

    render() {
        return (
            <RX.View style={styles.marvelBackgroundImage}>

                <RX.View style={styles.marvelTextBorder}>
                    <RX.Text style={styles.marvelText}> MARVEL</RX.Text>
                </RX.View>

                <RX.View style={styles.inputView}>
                    <RX.Text style={styles.placeholderText}>Enter your Marvel Hero</RX.Text>

                    <RX.TextInput placeholder={'Superhero?...'} style={styles.textInput}
                        onChangeText={(text: string) => { this.setState({ SUPERHERO: text }); }} />

                    <RX.Button title="LOGIN" style={[styles.styleButton, !this.state.SUPERHERO && this.state.canLogin === false && styles.buttonDisabled]}
                    disabled={!this.state.SUPERHERO && this.state.canLogin === false} onPress={() => { this.searchForHero(this.state.SUPERHERO); this.setState({ canLogin: false }); }} >
                        <RX.Text style={styles.loginText} >LOGIN </RX.Text>
                    </RX.Button>
                 
                </RX.View>

            </RX.View>
        );
    }

   
}

const styles = {
    title: RX.Styles.createTextStyle({
        fontSize: 16,
        marginTop: 20,
        color: 'black',
        textAlign: 'center',
    }),
    listContainer: RX.Styles.createViewStyle({
        flex: 0,
        justifyContent: 'center',
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignItems: 'stretch',
    }),
    addButtonView: RX.Styles.createViewStyle({
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: 'gray',
        alignContent: 'center',
        marginTop: 10
    }),
    addButton: RX.Styles.createButtonStyle({
        margin: 8,
    }),
    addButtonText: RX.Styles.createTextStyle({
        color: 'white'

    }),
    marvelBackgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: 'rgba(255,0,0,.1)',
    },
    marvelTextBorder: {
        padding: 8,
        borderColor: 'white',
        borderWidth: 3,
        marginTop: 100,
        alignSelf: 'center'
    },

    marvelText: {
        fontSize: 60,
        backgroundColor: 'rgba(255,0,0,.4)',
        color: 'white',
        fontWeight: '100',
    },
    inputView: {
        flex: 1.5,
        paddingTop: 100,

    },
    placeholderText: {
        fontWeight: '100',
        marginLeft: 30,
    },
    textInput: {
        borderRadius: 3,
        borderColor: 'rgba(120,120,120,.7)',
        borderWidth: 1,
        marginTop: 5,
        height: 30,
        marginLeft: 30,
        marginRight: 30,
    },
    styleButton: {
        backgroundColor: 'rgba(255,0,0,.7)',
        marginRight: 40,
        marginLeft: 40,
        marginTop: 50,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 4,

    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    buttonDisabled: {
        opacity: 0.2,
    }
};


export = MainPanel;
