import { useEffect } from "react"

export default () => {
  useEffect(() => {
    console.log(import.meta.env.VITE_ION_TOKEN)
    return () => {
      
    } 
  })
  return <>
  <h1>hello components</h1>
  </>
}