"use client"

import Image from "next/image"

export function AuthHeader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src="/assets/common/logo.png"
        alt="GetnPay Logo"
        width={200}
        height={200}
        className="h-44 w-44 object-contain"
      />
    </div>
  )
}
