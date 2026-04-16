#!/usr/bin/env node
// 카카오 OAuth 2.0 초기 토큰 발급 스크립트
// 사용법: node kakao-auth.js
// .claude-env에서 KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET을 읽어 토큰을 발급받습니다.

const fs = require("fs")
const http = require("http")
const https = require("https")
const path = require("path")
const { URL } = require("url")

const REDIRECT_URI = "http://localhost:9999/callback"
const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize"
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"

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
  } catch (err) {
    console.error("❌ .claude-env 파일을 읽을 수 없습니다:", err.message)
    process.exit(1)
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
  } catch (err) {
    console.error("❌ 환경변수 저장 실패:", err.message)
    process.exit(1)
  }
}

// 카카오 로그인 URL 생성
function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "talk_message",
  })
  return `${KAKAO_AUTH_URL}?${params.toString()}`
}

// 인가 코드로 토큰 발급
async function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
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
              resolve(json)
            } else {
              reject(
                new Error(
                  `토큰 발급 실패 (${res.statusCode}): ${json.error_description || json.error}`,
                ),
              )
            }
          } catch (err) {
            reject(new Error(`응답 파싱 실패: ${data}`))
          }
        })
      },
    )

    req.on("error", reject)
    req.write(body)
    req.end()
  })
}

// 로컬 콜백 서버 시작
function startCallbackServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const code = url.searchParams.get("code")
      const error = url.searchParams.get("error")

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" })
        res.end(
          `<html><body><h1>❌ 오류 발생</h1><p>${error}</p></body></html>`,
        )
        server.close()
        reject(new Error(`카카오 로그인 오류: ${error}`))
        return
      }

      if (code) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(
          "<html><body><h1>✅ 인증 완료!</h1><p>이 창을 닫아도 됩니다.</p></body></html>",
        )
        server.close()
        resolve(code)
        return
      }

      res.writeHead(400)
      res.end("인가 코드가 없습니다.")
      server.close()
      reject(new Error("인가 코드 수신 실패"))
    })

    server.listen(9999, () => {
      console.log("🌐 로컬 콜백 서버 시작: http://localhost:9999/callback")
    })

    server.on("error", reject)
  })
}

// 메인 함수
async function main() {
  console.log("🔐 카카오 OAuth 초기 토큰 발급 시작\n")

  // 환경변수 로드
  loadEnv()

  // API 키 확인
  if (!process.env.KAKAO_REST_API_KEY) {
    console.error("❌ KAKAO_REST_API_KEY가 .claude-env에 설정되지 않았습니다.")
    console.error(
      "   https://developers.kakao.com 에서 REST API 키를 복사하여 설정하세요.",
    )
    process.exit(1)
  }

  console.log("1️⃣  브라우저에서 아래 URL을 열어 카카오 로그인을 진행하세요:\n")
  const authUrl = getAuthUrl()
  console.log(`   ${authUrl}\n`)
  console.log("2️⃣  로그인 및 동의 완료 후 이 창으로 돌아오세요...\n")

  try {
    // 콜백 서버 시작하고 인가 코드 수신
    const code = await startCallbackServer()
    console.log("✅ 인가 코드 수신 완료\n")

    // 토큰 발급
    console.log("3️⃣  토큰 발급 중...")
    const tokenResponse = await getAccessToken(code)

    // 토큰 만료 시간 계산 (현재 시간 + expires_in)
    const expiresAt = Date.now() + tokenResponse.expires_in * 1000

    // .claude-env에 저장
    console.log("4️⃣  토큰 정보 저장 중...")
    saveEnv({
      KAKAO_ACCESS_TOKEN: tokenResponse.access_token,
      KAKAO_REFRESH_TOKEN: tokenResponse.refresh_token,
      KAKAO_TOKEN_EXPIRES_AT: expiresAt.toString(),
    })

    console.log("\n✅ 토큰 발급 완료!\n")
    console.log("📋 발급된 토큰 정보:")
    console.log(
      `   - Access Token: ${tokenResponse.access_token.slice(0, 20)}...`,
    )
    console.log(
      `   - Refresh Token: ${tokenResponse.refresh_token.slice(0, 20)}...`,
    )
    console.log(`   - 유효기간: ${new Date(expiresAt).toLocaleString("ko-KR")}`)
    console.log(
      "\n이제 Claude Code 훅이 카카오톡 알림을 보낼 준비가 되었습니다!\n",
    )
  } catch (err) {
    console.error(`\n❌ 오류 발생: ${err.message}\n`)
    process.exit(1)
  }
}

main()
