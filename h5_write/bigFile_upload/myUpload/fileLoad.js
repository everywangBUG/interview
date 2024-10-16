const inpEl = document.querySelector('input')
inpEl.onchange = async (e) => {
  const file = inpEl.files[0]
  if (!file) {
    return
  }
  // console.log(file)
  //对这个file对象进行切片，slcie表示从第start个字节取到第end个字节(不包含end)
  // file.slice(0, 100)
  const piece = file.slice(0, 100)
  //Blo表示文件数据
  // console.log(piece)
  const chunks = createChunks(file, 10 * 1024 * 1024) //10M 
  //拿到分片结果，其中file和blob对象中，只保存了文件的基本信息，没有保存文件的数据
  console.log(chunks)
  //调用hash函数计算整个文件的hash
  //拿到hash的计算结果
  const result = await hash(chunks)
  console.log(result)
}

/**
 * @description:计算文件的hash
 * @param: file对象
 * @return 整个文件计算出的hash值
 */
function hash(chunks) {
  //封装异步函数
  return new Promise(resolve => {
    //创建spark实例
    const spark = new SparkMD5()
    //先读完一个分块，再读下一个分块
    function _read(i) {
      //如果i大于等于分块的数量，则读取完成
      if (i >= chunks.length) {
        //获取整个文件计算出的hash值
        // spark.end
        resolve(spark.end())
        return //读取完成
      }

      //拿到分块，通过fileReader去读文件
      const blob = chunks[i]
      const reader = new FileReader()

      //读取字节数，读取过程异步，onload是文件读取成功时，执行load事件
      reader.onload = e => {
        const bytes = e.target.result //读取到的字节数组
        //使用spark-md5增量hash进行计算，把一组字节加入到spark中完成增量元素
        spark.append(bytes)
        //调用read函数自身，完成下一个分片
        _read(i + 1)
      }
      //readAsArrayBuffer用于启动或读取指定的blob或file内容
      reader.readAsArrayBuffer(blob)
    }
    _read(0)
  })
}

/**
 * @param1: file对象
 * @param2: 切片大小(byte) 
 * @return 每一个切片结果
 */
function createChunks(file, chunkSize) {
  //创建一个数组，获取每一个切片
  const res = []
  for (let i = 0; i < file.size; i += chunkSize) {
    //每一次循环调用file.slice函数，将切片好的数据放入res中
    res.push(file.slice(i, i + chunkSize))
  }
  return res
}