import { useEffect } from "react"

export default () => {
  useEffect(() => {
    console.log(import.meta.env)
    return () => {
      
    } 
  })
  return <>
  <h1>hello components</h1>
  </>
}