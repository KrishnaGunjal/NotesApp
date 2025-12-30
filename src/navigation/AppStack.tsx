import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddNoteScreen from '../screens/AddNoteScreen'

const Stack = createNativeStackNavigator()
console.log('APP STACK MOUNTED')

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddNotes"
        component={AddNoteScreen}
        options={{ title: 'Notes' }}
      />
    </Stack.Navigator>
  )
}
