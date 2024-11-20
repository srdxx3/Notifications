import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CRON_JOBS_FILE = path.join(process.cwd(), 'cron-jobs.json')

function readCronJobs() {
  if (!fs.existsSync(CRON_JOBS_FILE)) {
    fs.writeFileSync(CRON_JOBS_FILE, JSON.stringify([]))
    return []
  }
  const data = fs.readFileSync(CRON_JOBS_FILE, 'utf-8')
  return JSON.parse(data)
}

function writeCronJobs(jobs: any[]) {
  fs.writeFileSync(CRON_JOBS_FILE, JSON.stringify(jobs, null, 2))
}

export async function GET() {
  const jobs = readCronJobs()
  return NextResponse.json(jobs)
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
  const jobs = readCronJobs()
  const filteredJobs = jobs.filter(job => job.uid !== uid || job.email !== email)
  writeCronJobs(filteredJobs)
  return NextResponse.json({ success: true })
}
