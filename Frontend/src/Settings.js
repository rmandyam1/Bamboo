import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import ChangePass from './ChangePass';
import * as Constants from './Constants';
import {useNavigation} from '@react-navigation/native';
import URL from './url';
import NotifService from './NotifService';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      dailyInput: '',
      goalStreak: '',
      buttonValue: 'Edit',
    };
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  componentDidMount(): void {
    // console.log('\n\n\nhere\n\n\n');
    // const {route} = this.props;
    // console.log(route.params);
    // const {userId} = route.params;
    const userId = '';
    this.setState({userId: userId});
    fetch(
      Platform.OS === 'android'
        ? `${URL.android}/User/getUser?userId=${userId}`
        : `${URL.ios}/User/getUser?userId=${userId}`,
    )
      .then(res => res.json())
      .then(data => {
        this.setState({
          dailyInput: data.dailyInputReminder,
          goalStreak: data.goalStreakNotif,
        });
      });
  }

  onRegister(token) {
    Alert.alert('Registered !', JSON.stringify(token));
    console.log(token);
    this.setState({registerToken: token.token, gcmRegistered: true});
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

  toggleDailyInputSwitch = value => {
    this.setState({dailyInput: value});
    this.onSave();
  };

  toggleGoalStreakSwitch = value => {
    this.setState({goalStreak: value});
    this.onSave();
  };

  onSave = () => {
    fetch(
      Platform.OS === 'android'
        ? `${URL.android}/User/addNotifSettings?userId=${
            this.state.userId
          }&dailyInput=${this.state.dailyInput}&goalStreak=${
            this.state.goalStreak
          }`
        : `${URL.ios}/User/addNotifSettings?userId=${
            this.state.userId
          }&dailyInput=${this.state.dailyInput}&goalStreak=${
            this.state.goalStreak
          }`,
    )
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          //throwing error when getUser fails (invalid userId)
          if (data.message === 'There was an error locating your account') {
            Alert.alert(
              'Error',
              'There was an error locating your account, please try changing settings another time',
              [{text: 'OK'}],
            );
          }
        } else {
          this.notif.scheduleNotifications(this.state.userId);
        }
      });
  };

  delAccountConfirm = () => {
    Alert.alert(
      'Confirm Delete',
      'All data associated with your account will be deleted. You will not be able to recover any of the saved data. Are you sure you want to delete your account?',
      [{text: 'Yes', onPress: this.delAccount}, {text: 'No'}],
    );
  };

  delAccount = () => {
    console.log('here');
    const {route} = this.props;
    const {userId} = route.params;
    console.log(userId);
    fetch(
      Platform.OS === 'android'
        ? `${Constants.URL.android}/User/delAccount?userId=${userId}`
        : `${Constants.URL.ios}/User/delAccount?userId=${userId}`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (!data) {
          Alert.alert(
            'Error',
            'Something went wrong, please try again later.',
            [{text: 'OK'}],
          );
        } else {
          //going to home screen
          this.props.navigation.replace('Login');
        }
      });
  };

  render() {
    const userId = this.props.userId;
    const email = this.props.email;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Account</Text>
        <TouchableOpacity
          style={[
            styles.selectBox,
            {
              borderBottomWidth: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
          disabled={true}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Email</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.text, {color: 'rgba(0, 0, 0, 0.5)'}]}>
              {email}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            // goes back to Home screen instead of Settings
            this.props.navigation.navigate('Root', {
              screen: 'ChangePass',
              params: {
                userId: userId,
              },
            })
          }
          style={[
            styles.selectBox,
            {
              marginBottom: 20,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          ]}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Change password</Text>
          </View>
          <View style={styles.rightContainer}>
            <Image
              source={require('./img/forward-arrow.png')}
              style={{
                width: 16,
                height: 16,
                opacity: 0.5,
                resizeMode: 'contain',
              }}
            />
          </View>
        </TouchableOpacity>
        {/*<ChangePass />*/}
        <Text style={styles.heading}>Units</Text>
        <TouchableOpacity
          disabled={true}
          style={[styles.selectBox, {marginBottom: 20}]}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>TODO</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              // onValueChange={this.toggleSwitch}
              value={true}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Notifications</Text>
        <TouchableOpacity
          disabled={true}
          style={[
            styles.selectBox,
            {
              borderBottomWidth: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Daily input reminder</Text>
          </View>
          <View style={styles.rightContainer}>
            {/*<Switch*/}
            {/*  // onValueChange={this.toggleSwitch}*/}
            {/*  value={true}*/}
            {/*/>*/}
            <Switch
              style={styles.switch}
              onValueChange={this.toggleDailyInputSwitch}
              value={this.state.dailyInput}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          style={[
            styles.selectBox,
            {
              borderBottomWidth: 0,
              borderRadius: 0,
            },
          ]}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Goal streaks</Text>
          </View>
          <View style={styles.rightContainer}>
            {/*<Switch*/}
            {/*  // onValueChange={this.toggleSwitch}*/}
            {/*  value={true}*/}
            {/*/>*/}
            <Switch
              style={styles.switch}
              onValueChange={this.toggleGoalStreakSwitch}
              value={this.state.goalStreak}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={true}
          style={[
            styles.selectBox,
            {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              marginBottom: 20,
            },
          ]}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>TODO</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              // onValueChange={this.toggleSwitch}
              value={true}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Danger Zone</Text>
        <TouchableOpacity
          onPress={this.delAccountConfirm}
          style={[styles.selectBox, {marginBottom: 20}]}>
          <View style={styles.leftContainer}>
            <Text style={[styles.text, {color: '#F32013'}]}>
              Delete account
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Image
              source={require('./img/forward-arrow.png')}
              style={{
                width: 16,
                height: 16,
                opacity: 0.5,
                resizeMode: 'contain',
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={{margin: 10}} />
      </ScrollView>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();
  return <Settings {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Constants.DIMENSIONS.screenWidth,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Constants.COLORS.background,
    padding: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    // margin: 10,
  },
  selectBox: {
    fontSize: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: Constants.COLORS.gray,
    backgroundColor: '#fff',
    padding: 10,
    // marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});