import dayjs from 'dayjs'
import Calendar from './components/Calendar/Calendar'

function App() {

  return (
    <>
      <Calendar date={dayjs('2026/1/2')}/>
    </>
  )
}

export default App
