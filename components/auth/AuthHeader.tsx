"use client"

import Image from "next/image"

export function AuthHeader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src="/assets/common/logo.png"
        alt="GetnPay Logo"
        width={96}
        height={96}
        className="h-24 w-24 object-contain"
      />
    </div>
  )
}

