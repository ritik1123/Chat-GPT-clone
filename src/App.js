import {getMessage} from "@testing-library/jest-dom/dist/utils";
import {useState, useEffect} from "react"

const App = () => {
  const[value,setValue] = useState(null)
  const [message,setMessage] = useState(null)
  const[previousChats, setPreviousChats] = useState([])
  const [currentTittle, setcurrentTittle] = useState(null)
  const createNewChat = () =>{
    setMessage(null)
    setValue("")
    setcurrentTittle(null)
  }
  const handleClick = (uniqueTittle) => {
    setcurrentTittle(uniqueTittle)
    setMessage(null)
    setValue("")

  }
  const getMessages = async () =>{
    const option = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers:{
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completion',option)
      const data = await response.json()

      setMessage(data.choices[0].message)
    }catch (error){
      console.error(error)
    }
  }
  useEffect(() =>{
    console.log(currentTittle,value,message)
    if(!currentTittle && value && message){
      setcurrentTittle(value)
    }
    if(currentTittle && value && message){
      setPreviousChats(prevchats =>(
          [...prevchats,
            {
              title: currentTittle,
              role: "user",
              content: value
            },
            {
              title: currentTittle,
              role: message.role,
              content: message.content
            }
            ]
      ))
    }

  },[message,currentTittle])
  console.log(previousChats)
  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTittle)
  const uniqueTittles = Array.from (new Set(previousChats.map(previousChats => previousChats.title)))
  console.log(uniqueTittles)
  return (
    <div className="app">
    <section className= "side-bar">
      <button onClick={createNewChat}>+ New Chat</button>
      <ul className= "history">

        {uniqueTittles?.map((uniqueTittle, index) => <li key = {index} onClick={() =>handleClick(uniqueTittle)}>{uniqueTittle}</li>)}
      </ul>
      <nav>
        <p>Made By Ritik</p>
      </nav>
    </section>
      < section className= "main">
        {!currentTittle && <h1>RitikGPT</h1>}
        <ul className= "feed">
          {currentChat?.map((chatMessage,index) => <li key={index}>
            <p className= "role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}

        </ul>
        <div className= "bottom-section">
          <div className= "input-container">
          <input value = {value} onChange={(e) => setValue(e.target.value)}/>
          <div id= "submit" onClick={getMessages}>➢</div>

        </div>
        <p className= "info">
          Chat GPT Apr 22 Version. Free Research Preview.
          Our Goal is to make AI Systems more natural and safe to interact with.
          Your feedback will help us improve.
        </p>
        </div>
      </section>
    </div>
  );
}

export default App;
