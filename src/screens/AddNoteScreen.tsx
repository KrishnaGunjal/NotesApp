import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../api/supabase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

type Note = {
  id: string;
  title: string;
  content: string | null;
};

export default function AddNoteScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const auth = useContext(AuthContext);
  const session = auth?.session;
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotes();
  }, [session]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={logout}
          style={{ marginRight: 12 }}
        >
          <MaterialIcons name="logout" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

    const fetchNotes = async () => {
    const { data, error } = await supabase
        .from('notess')
        .select('*')
        .order('created_at', { ascending: false });

    if (!error && data) {
        setNotes(data);
    }
    };

  const saveNote = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    if (editingId) {
      await supabase
        .from('notess')
        .update({ title, content })
        .eq('id', editingId);
    } else {
      await supabase.from('notess').insert({
        title,
        content,
        user_id: user.id,
      });
    }

    setTitle('');
    setContent('');
    setEditingId(null);
    fetchNotes();
  };

  const editNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content ?? '');
    setEditingId(note.id);
  };

  const deleteNote = async (id: string) => {
    await supabase.from('notess').delete().eq('id', id);
    fetchNotes();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 8 }}>My Notes</Text>
      <TextInput
        placeholder="Search notes by title..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          borderWidth: 1,
          marginBottom: 12,
          padding: 8,
          borderRadius: 4,
        }}
      />

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      <Button
        title={editingId ? 'Update Note' : 'Add Note'}
        onPress={saveNote}
      />

      <FlatList
        data={filteredNotes ?? notes}
        keyExtractor={item => item.id}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.content}</Text>

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity onPress={() => editNote(item)}>
                <Text style={{ marginRight: 16, color: 'blue' }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
