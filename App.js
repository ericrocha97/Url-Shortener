import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Clipboard, Keyboard, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [urlShort, setUrlShort] = useState('');
  var alertTitle;
  var alertMsg;

  const createTwoButtonAlert = () =>
  Alert.alert(
    alertTitle,
    alertMsg,
    [
      { text: "OK", onPress: () => {} }
    ],
    { cancelable: true }
  );


  const short = async () => {
    Keyboard.dismiss();
    if(url.includes('https://') || url.includes('http://')){
      await fetch(`https://cutt.ly/api/api.php?key=ac158ee6b0c6b70ed7178677698f302665286&short=${url}&name=${name}`)
      .then( async response => {
        const data = await response.json();
        if(data.url.status === 3){
          alertTitle = 'Aviso';
          alertMsg ="Esse nome já esta em uso!";
          createTwoButtonAlert();
          setUrlShort('');
          return;
        }
        if(data.url.status === 2){
          alertTitle = 'Aviso';
          alertMsg ="Url é inválida!";
          createTwoButtonAlert();
          setUrlShort('');
          return;
        }
        setUrlShort(data.url.shortLink);
        clearInputs();
      })
    }else{
      alertTitle = 'Aviso';
      alertMsg ="Url é inválida!";
      createTwoButtonAlert();
      setUrlShort('');
    }
  };

  function copyUrl(){
    Clipboard.setString(urlShort);
    alertTitle = 'Sucesso';
    alertMsg ="Url copiada com sucesso!";
    createTwoButtonAlert();
  }

  function clearInputs(){
    setUrl('');
    setName('');
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.inner}>
          <Text style={styles.title}>Url 
            <Text style={styles.titleDecoration}> Shortener</Text>
          </Text>

          <TextInput 
            style={styles.formInputs} 
            onChangeText={(text) => {setUrl(text)}}
            value={url} 
            placeholder="Digite a url..." />
          
          <TextInput 
            style={styles.formInputs} 
            onChangeText={(text) => {setName(text)}} 
            value={name}  
            placeholder="Digite o nome personalizado ..."/>
          
          <TouchableOpacity
            onPress={() => short() }
            style={styles.formBtn}
          >
            <Text style={styles.formBtnText}>Encurtar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ urlShort ? copyUrl : () => {}}
          >
            <Text style={styles.urlShort}>{urlShort}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#32b372',
    fontWeight: 'bold',
    fontSize:40,
    marginBottom: 20,
  },
  titleDecoration: {
    color: '#32b3b3'
  },
  formInputs: {
    height:50,
    width:'80%',
    borderColor: '#c5c5c5',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    fontSize: 20,
  },
  formBtn: {
    backgroundColor: '#32b372',
    borderRadius: 20,
    height:40,
    width:'80%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  formBtnText: {
    color: '#fff',
    fontSize: 20,
    
  },
  urlShort: {
    height:40,
    width:'80%',
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center'
  }
});
