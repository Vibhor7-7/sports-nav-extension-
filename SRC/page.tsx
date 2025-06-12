"use client"

import Popup from "../popup"
import { SettingsProvider } from "../context/settings-context"

export default function Page() {
  return (
    <SettingsProvider>
      <main>
        <Popup />
      </main>
    </SettingsProvider>
  )
}