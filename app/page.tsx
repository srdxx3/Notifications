'use client'

import { useState, useEffect } from 'react'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CRON_JOBS_FILE = path.join(process.cwd(), 'cron-jobs.json')

function readCronJobs() {
  if (!fs.existsSync(CRON_JOBS_FILE)) return []
  return JSON.parse(fs.readFileSync(CRON_JOBS_FILE, 'utf-8'))
}

function writeCronJobs(jobs) {
  fs.writeFileSync(CRON_JOBS_FILE, JSON.stringify(jobs, null, 2))
}

export async function GET() {
  return NextResponse.json(readCronJobs())
}

export async function POST(req: Request) {
  const { uid, email } = await req.json()
  const jobs = readCronJobs()
  jobs.push({ uid, email })
  writeCronJobs(jobs)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { uid, email } = await req.json()
  const jobs = readCronJobs().filter(job => job.uid !== uid || job.email !== email)
  writeCronJobs(jobs)
  return NextResponse.json({ success: true })
}

export default function CronJobManager() {
  const [cronJobs, setCronJobs] = useState([])
  const [newUid, setNewUid] = useState('')
  const [newEmail, setNewEmail] = useState('')

  useEffect(() => { fetchCronJobs() }, [])

  const fetchCronJobs = async () => {
    try {
      const response = await fetch('/api/cron-jobs')
      if (response.ok) setCronJobs(await response.json())
      else console.error('Failed to fetch cron jobs')
    } catch (error) {
      console.error('Error fetching cron jobs', error)
    }
  }

  const addCronJob = async () => {
    if (!newUid || !newEmail) return alert('Both UID and Email are required')
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
      } else {
        alert('Failed to add cron job')
      }
    } catch (error) {
      console.error('Error adding cron job', error)
    }
  }

  const removeCronJob = async (uid, email) => {
    try {
      const response = await fetch('/api/cron-jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email }),
      })
      if (response.ok) fetchCronJobs()
      else alert('Failed to remove cron job')
    } catch (error) {
      console.error('Error removing cron job', error)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cron Job Manager</h1>
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="UID"
          value={newUid}
          onChange={(e) => setNewUid(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button onClick={addCronJob} className="bg-blue-500 text-white p-2 rounded">
          Add Cron Job
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">UID</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {cronJobs.map((job) => (
            <tr key={`${job.uid}-${job.email}`}>
              <td className="border p-2">{job.uid}</td>
              <td className="border p-2">{job.email}</td>
              <td className="border p-2">
                <button
                  onClick={() => removeCronJob(job.uid, job.email)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
