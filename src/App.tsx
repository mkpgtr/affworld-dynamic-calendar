import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import SchedulerContainer from './components/SchedulerContainer'
import { SchedulerProvider } from './contexts/SchedulerContext'
import { Toaster } from './components/ui/toaster'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SchedulerProvider>
      <Toaster  />
    
    
     <Navbar />
     <SchedulerContainer />
    </SchedulerProvider>
    </>
  )
}

export default App
