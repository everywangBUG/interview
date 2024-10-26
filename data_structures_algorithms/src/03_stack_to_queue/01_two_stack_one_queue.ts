/**
 *
 * @description 两个栈 -> 一个队列
 * @return arr
 */
export class Queue {
    private stack1: number[] = []
    private stack2: number[] = []

    /**
     * 
     * @param n
     * time: O(1)
     */
    add(n: number) {
        this.stack1.push(n)
    }

    /**
     * 
     * @returns res
     * time: O(n)
     */
    delete(): number | undefined {
        let res

        //将stack1中所有元素移动到stack2中
        while (this.stack1.length) {
            let temp = this.stack1.pop()
            if (temp != null) {
                this.stack2.push(temp)
            }
        }

        //stack2.pop()
        res = this.stack2.pop()

        while (this.stack2.length) {
            let temp = this.stack2.pop()
            if (temp != null) {
                this.stack1.push(temp)
            }
        }

        return res
    }

    get length(): number {
        return this.stack1.length
    }
}

//功能测试
const q = new Queue()
q.add(1)
q.add(2)
q.add(3)
q.delete()
q.add(4)
q.add(5)
q.add(6)
q.delete()
q.length
console.log(q)
console.log(q.length)