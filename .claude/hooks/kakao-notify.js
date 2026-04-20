#!/usr/bin/env node
// Claude Code Hooks → 카카오톡 알림 스크립트 (토큰 자동 갱신 포함)
// 사용법: node kakao-notify.js <Notification|Stop>
// stdin으로 JSON 데이터 수신

const fs = require("fs")
const https = require("https")
const path = require("path")
const { URL } = require("url")

const KAKAO_MESSAGE_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send"
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000 // 5분 버퍼

// .claude-env 파일 파싱
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".claude-env")
  try {
    const lines = fs.readFileSync(envPath, "utf8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const idx = trimmed.indexOf("=")
      if (idx < 0) continue
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      process.env[key] = val
    }
  } catch (_) {
    // 파일 없으면 환경변수에서 직접 시도
  }
}

// .claude-env 파일에 환경변수 저장
function saveEnv(updates) {
  const envPath = path.join(__dirname, "..", ".claude-env")
  try {
    let content = fs.readFileSync(envPath, "utf8")

    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, "m")
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`)
      } else {
        content += `\n${key}=${value}`
      }
    }

    fs.writeFileSync(envPath, content, "utf8")
  } catch (_) {
    // 저장 실패해도 계속 진행
  }
}

// 토큰 만료 여부 확인
function isTokenExpired() {
  const expiresAt = parseInt(process.env.KAKAO_TOKEN_EXPIRES_AT || "0", 10)
  const now = Date.now()
  return now + TOKEN_REFRESH_BUFFER >= expiresAt
}

// Refresh Token으로 Access Token 갱신
async function refreshAccessToken() {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.KAKAO_REST_API_KEY,
      refresh_token: process.env.KAKAO_REFRESH_TOKEN,
      client_secret: process.env.KAKAO_CLIENT_SECRET || "",
    })

    const body = params.toString()
    const url = new URL(KAKAO_TOKEN_URL)

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          try {
            const json = JSON.parse(data)
            if (res.statusCode === 200) {
              const expiresAt = Date.now() + json.expires_in * 1000
              const updates = {
                KAKAO_ACCESS_TOKEN: json.access_token,
                KAKAO_TOKEN_EXPIRES_AT: expiresAt.toString(),
              }
              // Refresh Token도 새로 받으면 업데이트
              if (json.refresh_token) {
                updates.KAKAO_REFRESH_TOKEN = json.refresh_token
              }
              saveEnv(updates)
              process.env.KAKAO_ACCESS_TOKEN = json.access_token
              process.env.KAKAO_TOKEN_EXPIRES_AT = expiresAt.toString()
              resolve(true)
            } else {
              resolve(false)
            }
          } catch (_) {
            resolve(false)
          }
        })
      },
    )

    req.on("error", () => resolve(false))
    req.setTimeout(5000, () => {
      req.destroy()
      resolve(false)
    })

    req.write(body)
    req.end()
  })
}

// 카카오톡 메시지 생성
function buildTemplate(hookType, data) {
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })

  let text = ""

  if (hookType === "Notification") {
    // 권한 요청 알림
    text = `🔔 [Claude Code 알림]\n프로젝트: ui-component-guide\n시간: ${now}\n내용: ${data.message ?? "권한 요청 또는 주의 필요"}`
  } else if (hookType === "Stop") {
    // 작업 완료 알림
    text = `✅ [Claude Code 작업 완료]\n프로젝트: ui-component-guide\n완료 시간: ${now}\n이벤트: ${data.hook_event_name || "작업 완료"}`
  }

  return {
    object_type: "text",
    text: text,
    link: {
      web_url: "https://github.com",
      mobile_web_url: "https://github.com",
    },
  }
}

// 카카오 메시지 API로 POST
async function sendKakaoMessage(accessToken, template) {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      template_object: JSON.stringify(template),
    })

    const body = params.toString()
    const url = new URL(KAKAO_MESSAGE_URL)

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        res.resume() // 응답 바디 소비
        resolve(res.statusCode)
      },
    )

    req.on("error", () => resolve(null)) // 실패해도 블록 안 됨
    req.setTimeout(5000, () => {
      req.destroy()
      resolve(null)
    }) // 5초 타임아웃

    req.write(body)
    req.end()
  })
}

// 메인 함수
async function main() {
  loadEnv()

  const hookType = process.argv[2]
  const accessToken = process.env.KAKAO_ACCESS_TOKEN

  // Access Token 없으면 조용히 종료 (초기화 안 됨)
  if (!accessToken) {
    process.exit(0)
  }

  // stdin에서 JSON 데이터 수신
  let rawData = ""
  process.stdin.setEncoding("utf8")

  for await (const chunk of process.stdin) {
    rawData += chunk
  }

  // JSON 파싱
  let data = {}
  try {
    data = JSON.parse(rawData || "{}")
  } catch (_) {
    process.exit(0) // JSON 파싱 실패해도 계속 진행
  }

  // 토큰 만료 확인 후 필요시 갱신
  if (isTokenExpired()) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      // 갱신 실패해도 계속 진행 (기존 토큰으로 시도)
    }
  }

  // 메시지 생성
  const template = buildTemplate(hookType, data)

  // 카카오 메시지 전송
  try {
    await sendKakaoMessage(process.env.KAKAO_ACCESS_TOKEN, template)
  } catch (_) {
    // 전송 실패해도 Claude Code는 블록 안 됨
  }

  // 항상 exit 0 (중요!)
  process.exit(0)
}

main().catch(() => process.exit(0))
