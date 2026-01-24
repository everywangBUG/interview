import { useState } from 'react';
import './App.css';

const OBJECT_MAP = {
  '数学': 'math',
  '英语': 'english',
  '语文': 'chinese',
  '物理': 'physics',
  '化学': 'chemistry',
  '生物': 'biology',
  '历史': 'history',
  '政治': 'politics',
  '地理': 'geography'
}

const CLASS_CONFIG = [
  { name: '张三', math: 78, english: 88, chinese: 98, physics: 68, chemistry: 49, biology: 90, history: 60, politics: 89, geography: 77 },
  { name: '李四', math: 78, english: 88, chinese: 98, physics: 68, chemistry: 49, biology: 90, history: 60, politics: 89, geography: 77 },
  { name: '王五', math: 78, english: 88, chinese: 98, physics: 68, chemistry: 49, biology: 90, history: 60, politics: 89, geography: 77 },
  { name: '赵六', math: 78, english: 88, chinese: 98, physics: 68, chemistry: 49, biology: 90, history: 60, politics: 89, geography: 100 }
]

function App() {
  const [classConfig, setClassConfig] = useState(CLASS_CONFIG);

  const [editCell, setEditCell] = useState({ rowIndex: -1, columnIndex: -1 });

  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (rowIndex, columnIndex) => {
    setEditCell({ rowIndex, columnIndex });
  }
    
  const handleBlur = (e) => {
    setEditCell({ rowIndex: -1, columnIndex: -1});
    setEditValue(e.target.value);
    finishEdit();
    setEditValue('');
  }

  const finishEdit = () => {
    const { rowIndex, columnIndex } = editCell;

    if (rowIndex == -1 || columnIndex == -1) return;

    setClassConfig(preData => {
      const newDate = preData && [...preData];
      const columns = Object.keys(newDate[rowIndex]);
      const field = columns[columnIndex + 1];
      newDate[rowIndex] = {
        ...newDate[rowIndex],
        [field]: editValue
      };
      return newDate;
    });

    setEditCell({ rowIndex: -1, column: -1 });
    setEditValue('');
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')   {
      finishEdit();
    } else if (e.key === 'Escape') {
      setClassConfig(CLASS_CONFIG);
      setEditValue('');
      setEditCell({ rowIndex: -1, column: -1 });
    }
  }

  return (
      <table className='table'>
        <thead className='tableHead'>
          <tr>
            <th></th>
            {
              Object.keys(OBJECT_MAP).map((item, index) => {
                return <th key={index}>{item}</th>
              })
            }
          </tr>
        </thead>
        <tbody className='tableBody'>
            {
              classConfig?.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    <th>{row.name}</th>
                    {
                      Object.keys(row).slice(1).map((column, columnIndex) => {
                        return (
                            <td
                              key={columnIndex}
                              onDoubleClick={() => handleDoubleClick(rowIndex, columnIndex)}
                            >
                              {
                                editCell.rowIndex === rowIndex && editCell.columnIndex === columnIndex
                                ? <input
                                    name='editor'
                                    type='text'
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                  />
                                : 
                                <>{row[column]}</>
                              }
                            </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
        </tbody>
      </table>
  )
}

export default App
