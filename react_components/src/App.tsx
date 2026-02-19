import dayjs from 'dayjs'
import Calendar from './components/Calendar/Calendar'

function App() {

  return (
    <>
      <Calendar
        date={dayjs(new Date())}
        // dateRanger={(value) => {
        //   return <div>
        //     <p style={{backgroundColor: 'yellow', height: '50px'}}>{value.format('YYYY-MM-DD')}</p>
        //   </div>
        // }}
        // dateInnerContent={(value) => {
        //     return <div>
        //       <p style={{backgroundColor: 'red', height: '25px'}}>{value.year()}</p>
        //     </div>
        // }}
        locale='en-US'
        onChange={(date) => {
          alert(date.format('YYYY-MM-DD'))
        }}
      />
    </>
  )
}

export default App
