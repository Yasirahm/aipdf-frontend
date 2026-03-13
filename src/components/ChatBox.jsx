import React, { useState } from "react"
import axios from "axios"
import Loader from "./Loader"

function ChatBox({ file }) {

  const [studyMaterial, setStudyMaterial] = useState("")
  const [loading, setLoading] = useState(false)

  // -------- GENERATE STUDY MATERIAL --------

  const generateStudyMaterial = async () => {

    if (!file) {
      alert("Please upload a PDF first")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {

      setLoading(true)

      const res = await axios.post(
        "https://ai-pdf-ut3g.onrender.com/api/ai/generate",
        formData
      )

      const clean = res.data.reply
        .replace(/[0-9️⃣]/g, "")
        .replace(/\*/g, "")

      setStudyMaterial(clean)

    } catch (err) {

      setStudyMaterial("AI failed to generate study material.")

    } finally {

      setLoading(false)

    }

  }

  // -------- FORMAT RESPONSE INTO SECTIONS --------

  const getSections = (text) => {

    if (!text) return {}

    const sections = {
      summary: "",
      points: "",
      topics: "",
      memory: "",
      exam: "",
      mcq: "",
      guidance: "",
      insights: ""
    }

    const lines = text.split("\n")

    let current = ""

    lines.forEach(line => {

      const lower = line.toLowerCase()

      if (lower.includes("document summary")) current = "summary"
      else if (lower.includes("key points")) current = "points"
      else if (lower.includes("important topics")) current = "topics"
      else if (lower.includes("memory tips")) current = "memory"
      else if (lower.includes("exam questions")) current = "exam"
      else if (lower.includes("mcq")) current = "mcq"
      else if (lower.includes("study guidance")) current = "guidance"
      else if (lower.includes("extra insights")) current = "insights"

      if (current) sections[current] += line + "\n"

    })

    return sections
  }

  const sections = getSections(studyMaterial)

const Card = ({ title, content }) => {

  if (!content) return null

  const lines = content
    .split("\n")
    .map(l => l.trim())
    .filter(l => l !== "")

  return (

    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl">

      <h3 className="text-white text-lg font-bold mb-4">
        {title}
      </h3>

      <ul className="space-y-2">

        {lines.map((line,index)=>(
          <li
            key={index}
            className="text-gray-200 leading-relaxed flex gap-2"
          >
            <span className="text-blue-400">•</span>
            <span>{line}</span>
          </li>
        ))}

      </ul>

    </div>

  )

}

  return (

    <div className="mt-8 w-full">

      {/* HEADER CARD */}

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">

        <h2 className="text-white text-xl font-bold mb-4">
          AI PDF Study Assistant
        </h2>

        <button
          onClick={generateStudyMaterial}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
        >
          {loading ? "Generating..." : "Generate Study Material"}
        </button>

      </div>

 {loading && (

  <div className="flex flex-col items-center justify-center mt-12 gap-4">

    <Loader />

    <p className="text-blue-400 text-lg font-semibold animate-pulse">
      AI is analyzing the document...
    </p>

  </div>

)}

      {/* STUDY MATERIAL */}

      {!loading && studyMaterial && (

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <Card title=" DOCUMENT SUMMARY" content={sections.summary} />

          <Card title=" KEY POINTS" content={sections.points} />

          <Card title="IMPORTANT TOPICS" content={sections.topics} />

          <Card title="MEMORY TIPS" content={sections.memory} />
          <Card title=" EXAM QUESTIONS" content={sections.exam} />

         

          <Card title="STUDY GUIDANCE" content={sections.guidance} />

          <Card title="EXTRA INSIGHTS" content={sections.insights} />

        </div>

      )}

    </div>

  )

}

export default ChatBox