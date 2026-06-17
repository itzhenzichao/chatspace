import { useEffect, memo, useMemo } from "react"
import type {User} from '../index'
interface TestChild1Props {
    sum: number,
    list: number[],
    userInfo: User | null              // 允许 null —— 初始尚未赋值
}

 const TestChild1 = memo((props: TestChild1Props)=> {
    const { sum, userInfo, list } = props

    useEffect(()=>{
        console.log('渲染子组件')
    })
    const findMaxNum = useMemo(()=>{
        return list.filter((item)=>{
            console.log('findMaxNum')
            return item>2
        })
    },[list])
    return (
        <div>
            子组件:sum{sum}
            <div>{findMaxNum}</div>
            <div>
                userInfo: {userInfo?.age}、{userInfo?.name}
            </div>
        </div>
    )
})
export default TestChild1;