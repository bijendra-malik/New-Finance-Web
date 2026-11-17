import { defineConfig, loadEnv } from 'vite'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleEmailOtpSend, handleEmailOtpVerify } from './server/emailOtp.ts'
import { handleCareerApplication } from './server/careersApply.ts'

const readJsonBody = (req: Connect.IncomingMessage): Promise<unknown> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })

const emailOtpEndpoints = (): Plugin => ({
  name: 'email-otp-endpoints',
  apply: 'serve',
  configureServer(server) {
    const route = (path: string, handle: (body: unknown) => Promise<{ status: number; body: unknown }>) => {
      server.middlewares.use(path, async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ success: false, message: 'Method not allowed' }))
          return
        }
        const result = await handle(await readJsonBody(req))
        res.statusCode = result.status
        res.end(JSON.stringify(result.body))
      })
    }

    route('/api/email-otp/send', handleEmailOtpSend)
    route('/api/email-otp/verify', handleEmailOtpVerify)
    route('/api/careers/apply', handleCareerApplication)
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (!(key in process.env)) process.env[key] = value
  }

  return {
    plugins: [react(), tailwindcss(), emailOtpEndpoints()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router') || /node_modules\/react(\/|-dom)/.test(id)) return 'vendor-react';
              if (id.includes('axios')) return 'vendor-api';
            }
          },
        },
      },
    },
  }
})
