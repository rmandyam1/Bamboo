import * as React from 'react';
import {Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import DoneButton from 'react-native-keyboard-done-button';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }

  signUp = () => {
    const {name, email, password, confirmPassword} = this.state;
    if (!name) {
      Alert.alert('Name Empty', 'Please enter a name.', [{text: 'OK'}]);
      return;
    }
    if (!email) {
      Alert.alert('Email Empty', 'Please enter an email address.', [
        {text: 'OK'},
      ]);
      return;
    }
    if (!password) {
      Alert.alert('Password Empty', 'Please enter a password.', [{text: 'OK'}]);
      return;
    }
    if (!confirmPassword) {
      Alert.alert(
        'Confirm Password Empty',
        'Please enter confirm your password.',
        [{text: 'OK'}],
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please enter the same password.', [
        {text: 'OK'},
      ]);
      return;
    }
    //sending request to retrieve the corresponding user object for login
    fetch(
      `http://localhost:8080/User/signup?name=${name}&email=${email}&password=${password}`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          //throwing error when signup fails - email already registered / invalid password
          if (
            data.message ===
            'This email is already registered. Try the login page instead'
          ) {
            Alert.alert('Already registered', data.message, [{text: 'OK'}]);
          } else if (
            data.message === 'Your password is not valid! Make sure it ___'
          ) {
            Alert.alert('Invalid password', data.message, [{text: 'OK'}]);
          }
        } else {
          //going to enter characteristics screen
          this.props.navigation.navigate('EnterCharacteristics', {
            name: name,
            email: email,
            password: password,
          });
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bamboo</Text>
        <Text style={styles.paragraph}>Create a Bamboo account</Text>
        <TextInput
          style={{
            height: 20,
            marginBottom: 15,
            marginTop: 15,
            marginLeft: 30,
            marginRight: 30,
            borderColor: 'gray',
            borderBottomWidth: 1,
          }}
          autoCorrect={false}
          placeholder="name"
          autoCompleteType="name"
          returnKeyLabel="Done"
          autoCapitalize="words"
          onChangeText={name => this.setState({name})}
        />
        <TextInput
          style={{
            height: 20,
            marginBottom: 15,
            marginTop: 15,
            marginLeft: 30,
            marginRight: 30,
            borderColor: 'gray',
            borderBottomWidth: 1,
          }}
          autoCorrect={false}
          placeholder="email@example.com"
          autoCompleteType="email"
          returnKeyLabel="Done"
          autoCapitalize="none"
          onChangeText={email => this.setState({email})}
        />
        <TextInput
          style={{
            height: 20,
            marginBottom: 15,
            marginTop: 15,
            marginLeft: 30,
            marginRight: 30,
            borderColor: 'gray',
            borderBottomWidth: 1,
          }}
          autoCorrect={false}
          placeholder="password"
          returnKeyLabel="Done"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={password => this.setState({password})}
        />
        <TextInput
          style={{
            height: 20,
            marginBottom: 25,
            marginTop: 15,
            marginLeft: 30,
            marginRight: 30,
            borderColor: 'gray',
            borderBottomWidth: 1,
          }}
          autoCorrect={false}
          placeholder="confirm password"
          returnKeyLabel="Done"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={confirmPassword => this.setState({confirmPassword})}
        />
        <DoneButton
          title="Done" //not required, default value = `Done`
          style={{backgroundColor: 'lightgrey'}} //not required
          doneStyle={{color: '#147efb'}} //not required
        />
        <Button
          onPress={() => {
            this.signUp();
          }}
          title="Sign Up"
          color="black"
          backgroundColor="green"
        />
        <Text style={styles.paragraph}>Already have an account?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    margin: 12,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationColor: 'gray',
  },
});
