import React,{useState} from "react"
import FileUpload from "./components/FileUpload"
import ChatBox from "./components/ChatBox"

function App(){

  const [file,setFile] = useState(null)

  return(

    <div className="min-h-screen bg-slate-900 p-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-white text-3xl font-bold text-center">
          Document AI Assistant
        </h1>

        <div className="mt-6">

          <FileUpload setFile={setFile}/>

          <ChatBox file={file}/>

        </div>

      </div>

    </div>

  )

}

export default App