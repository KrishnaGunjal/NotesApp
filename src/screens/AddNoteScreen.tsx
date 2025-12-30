import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../auth/AuthContext';
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
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="logout" size={24} color="#000000" />
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
    <View style={styles.container}>

      <TextInput
        placeholder="Search notes by title..."
        placeholderTextColor="#666666"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      <TextInput
        placeholder="Title"
        placeholderTextColor="#666666"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Content"
        placeholderTextColor="#666666"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={saveNote}>
        <Text style={styles.primaryButtonText}>
          {editingId ? 'Update Note' : 'Add Note'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editNote(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: '#000000',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    paddingBottom: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 14,
    color: '#333333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  edit: {
    marginRight: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  delete: {
    color: '#DC2626',
    fontWeight: '600',
  },
  logoutButton: {
    marginRight: 12,
  },
});
