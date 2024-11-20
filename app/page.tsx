'use client'

import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'

const CRON_JOBS_FILE = path.join(process.cwd(), 'cron-jobs.json')

export default function NotificationsPage() {
  const [cronJobs, setCronJobs] = useState([])

  useEffect(() => {
    fetchCronJobs()
  }, [])

  const fetchCronJobs = async () => {
    try {
      const response = await fetch('/api/cron-jobs')
      if (response.ok) {
        const jobs = await response.json()
        setCronJobs(jobs)
      }
    } catch (error) {
      console.error('Error fetching cron jobs:', error)
    }
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications Manager</h1>
      <div className="space-y-4">
        {cronJobs.map((job, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">UID: {job.uid}</p>
                <p className="text-gray-600">Email: {job.email}</p>
              </div>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {/* Add remove handler */}}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
