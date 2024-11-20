'use client'

import { useState, useEffect } from 'react'

interface CronJob {
  uid: string
  email: string
}

export default function NotificationsPage() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([])
  const [newUid, setNewUid] = useState('')
  const [newEmail, setNewEmail] = useState('')

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

  const addCronJob = async () => {
    if (!newUid || !newEmail) {
      alert('Both UID and Email are required')
      return
    }

    try {
      const response = await fetch('/api/cron-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: newUid, email: newEmail }),
      })

      if (response.ok) {
        setNewUid('')
        setNewEmail('')
        fetchCronJobs()
      }
    } catch (error) {
      console.error('Error adding cron job:', error)
    }
  }

  const removeCronJob = async (uid: string, email: string) => {
    try {
      const response = await fetch('/api/cron-jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email }),
      })

      if (response.ok) {
        fetchCronJobs()
      }
    } catch (error) {
      console.error('Error removing cron job:', error)
    }
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications Manager</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="UID"
          value={newUid}
          onChange={(e) => setNewUid(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button 
          onClick={addCronJob}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="space-y-4">
        {cronJobs.map((job, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">UID: {job.uid}</p>
                <p className="text-gray-600">Email: {job.email}</p>
              </div>
              <button 
                onClick={() => removeCronJob(job.uid, job.email)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
