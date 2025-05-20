import { useState } from "react"

export function useLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  }
}