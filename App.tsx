import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { supabase } from './src/api/supabase'
import AuthStack from './src/navigation/AuthStack'
import AppStack from './src/navigation/AppStack'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <NavigationContainer>
      {session ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
