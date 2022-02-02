import * as React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
import { Headline, Button, TextInput } from 'react-native-paper';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, [])

  async function handleSignup (){
    try {
      const createdUser =  await createUserWithEmailAndPassword(auth, email, password)
      // Signed in
      const user = createdUser.user;
      navigation.navigate("Home")
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  }

  async function handleLogin (){
    try {
      const loggedInUser =  await signInWithEmailAndPassword(auth, email, password)
      // Signed in
      const user = loggedInUser.user;
      navigation.navigate("Home")
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ERROR", errorMessage)
    }
  }

  return (
    <KeyboardAvoidingView enabled={Platform.OS === "ios"}
      style={styles.container} behavior="padding">
        <Headline style={styles.heading}>Leashed</Headline>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <Button style={styles.input} mode="contained" onPress={() => handleSignup()}>
          sign up
        </Button>
        <Button style={styles.input} mode="outlined" onPress={() => handleLogin()}>
          Log in
        </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
  },
  heading: {
    alignSelf: 'center',
  },
});