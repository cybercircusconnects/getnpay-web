"use client"

interface AuthSwitchLinkProps {
  question: string
  linkText: string
  onClick: () => void
}

export function AuthSwitchLink({ question, linkText, onClick }: AuthSwitchLinkProps) {
  return (
    <div className="flex justify-center gap-1">
      <span className="text-sm text-gray-500">{question} </span>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-sm font-semibold text-green-600 hover:underline"
      >
        {linkText}
      </button>
    </div>
  )
}

