import { Button } from "antd"
import TestChild1 from "./components/TestChild"
import { useEffect, useState } from "react"

export interface User {
    age?: number
    name?: string,
    message?: User
}

/** 放在组件外 —— 引用永远不变，子组件 memo 浅比较 list 时判断为相同 */

export default function Test() {
    const [sum, setValue] = useState(0)
    const [list, setList] = useState<number[]>([])
    const [count, setCount] = useState(0)
    const [userInfo, setUserInfo] = useState<User | null>({ age: 1, name: 'zzc', message: { age: Math.random(), name: '2123' }})
    const add = () => {
        setValue(sum + 1)
        setCount(count + 1)
        // const newDate = { ...userInfo }
        // if (newDate && newDate.message) {
        //     newDate.message.age =  Math.random()
        //     setUserInfo(newDate)
        // }
    }
    useEffect(()=>{
        console.log('渲染父组件')
    })
    useEffect(()=>{
        console.log('渲染父组件111')
        setList([5,2,1,6])
    },[])
    return (
        <div>
            <h2>测试页面</h2>
            <div>
                <Button onClick={add}>+</Button>{sum}{count}
            </div>
            <TestChild1 sum={sum} userInfo={userInfo} list={list}></TestChild1>
        </div>
    )
}