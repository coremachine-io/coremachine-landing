"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function CtaButton() {
  const searchParams = useSearchParams()
  const shouldAssess = searchParams?.get("assess")

  useEffect(() => {
    if (shouldAssess === "true") {
      // Dispatch custom event to trigger AI generator modal
      window.dispatchEvent(new CustomEvent("open-ai-generator"))
    }
  }, [shouldAssess])

  return (
    <a
      href="/?assess=true"
      className="inline-block bg-accent text-black font-semibold px-6 py-3 rounded-md hover:bg-[#00b3cc] transition"
    >
      立即申請免費測試
    </a>
  )
}
