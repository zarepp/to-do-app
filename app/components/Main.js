import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator } from 'react-native';
import Note from './Note';

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      noteArray: [],
      noteText: '',
      data: null,
    }
  }

  componentDidMount() {
    return fetch('https://to-do-app-api.firebaseapp.com/api/notes')
      .then((res) => res.json())
      .then((results) => {
        this.setState({
          isLoading: false,
          data: results,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  } 

  render() {
    let notes = this.state.noteArray.map((val, key) => {
      return <Note
                key={key}
                keyval={key}
                val={val}
                deleteMethod={() => this.deleteNote(key)} 
              />
    })

    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    } else {
      let dataNotes = this.state.data.map((val, key) => {
        return  <Note
        key={key}
        keyval={key}
        val={val}
        deleteMethod={() => this.deleteNote(key)} 
      />
      })

      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>To-Do-List</Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {dataNotes}
          </ScrollView>
          <View>
            <KeyboardAvoidingView behavior="padding" enabled>
              <TextInput
                style={styles.textInput}
                onChangeText={(noteText) => this.setState({noteText})}
                value={this.state.noteText}
                placeholder='Write here ..'
                placeholderTextColor='white'
                underlineColorAndroid='transparent'>
              </TextInput>
            </KeyboardAvoidingView>
          </View>
          <TouchableOpacity 
            onPress={this.addNote.bind(this)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }


  }

  addNote() {
    if (this.state.noteText) {
      var d = new Date();
      // this.state.noteArray.push({
      //   'date': d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(),
      //   'note': this.state.noteText,
      // });
      var newNote = {
        'date': d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(),
        'text': this.state.noteText,
      }

      // post to api
      fetch('https://to-do-app-api.firebaseapp.com/api/notes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status === "201") {
            this.componentDidMount();
          } else {
            throw err;
          }
        })

      this.setState({ noteArray: this.state.noteArray })
      this.setState({ noteText: '' });
    }
  }

  deleteNote(key) {
    this.state.noteArray.splice(key, 1);
    alert(key);
    // this.setState({ noteArray: this.state.noteArray });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  header: {
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 10,
    padding: 26,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textInput: {
    alignSelf: 'stretch',
    color: '#fff',
    padding: 20,
    backgroundColor: '#252525',
    borderTopWidth: 2,
    borderTopColor: '#ededed'
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: '#E91E63',
    width: 65,
    height: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  }
});
