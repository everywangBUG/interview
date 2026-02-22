import { IconAdd } from "./components/Icon/IconAdd"
import { IconEmail } from "./components/Icon/IconEmail"
// import dayjs from 'dayjs'
// import Calendar from './components/Calendar/Calendar'

function App() {

  return (
    <>
      {/* <Calendar
        // date={dayjs(new Date())}
        defaultValue={dayjs('2026/1/2')}
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
        locale='zh-CN'
        onChange={(date) => {
          alert(date.format('YYYY-MM-DD'))
        }}
      /> */}
      <IconAdd size={['100px', '100px']} spin={true} />
      <IconEmail size={['100px', '100px']} />
    </>
  )
}

export default App
