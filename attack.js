const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AnonymizeUA = require('puppeteer-extra-plugin-anonymize-ua')

// Activamos plugins
puppeteer.use(StealthPlugin())
puppeteer.use(AnonymizeUA())

const TARGET_URL = 'http://localhost:3001/phone'
const NUM_REQUESTS = 10

// Array para trackear los visitorIds
const visitorIds = new Set()

function randomLang() {
  return Math.random() > 0.5 ? 'en-US,en;q=0.9' : 'es-AR,es;q=0.9'
}

function randomUA() {
  const base = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (X11; Linux x86_64)'
  ]
  const rand = Math.floor(Math.random() * base.length)
  const version = Math.floor(Math.random() * 30 + 60)
  return `${base[rand]} AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`
}

async function simulateAttack() {
  console.log('🚀 Iniciando ataque simulado...\n')

  for (let i = 0; i < NUM_REQUESTS; i++) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    // Rotamos fingerprinting real
    await page.setUserAgent(randomUA())
    await page.setExtraHTTPHeaders({ 'Accept-Language': randomLang() })

    await page.emulateTimezone(
      Math.random() > 0.5 ? 'America/New_York' : 'Europe/Berlin'
    )
    await page.setViewport({
      width: 1024 + Math.floor(Math.random() * 200),
      height: 768 + Math.floor(Math.random() * 200),
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: Math.random() > 0.5
    })

    // Capturar request al backend
    page.on('request', async (req) => {
      if (req.url().includes('/api/validar-linea') && req.method() === 'POST') {
        const postData = req.postData()
        try {
          const parsed = JSON.parse(postData)
          visitorIds.add(parsed.visitorId)
          console.log(
            `[#${i + 1}] visitorId=${parsed.visitorId} → ${parsed.numeroLinea}`
          )
        } catch (e) {
          console.log(`[#${i + 1}] Error al parsear POST`)
        }
      }
    })

    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 2000))

    const numeroLinea = `11${Math.floor(10000000 + Math.random() * 89999999)}`
    await page.type('input[type=text]', numeroLinea)

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/validar-linea'), {
        timeout: 6000
      }),
      page.click('button[type=submit]')
    ])

    await browser.close()
  }

  // Análisis final del fingerprinting
  console.log('\n' + '='.repeat(60))
  console.log('📊 ANÁLISIS DE FINGERPRINTING')
  console.log('='.repeat(60))

  const uniqueVisitorIds = visitorIds.size
  const totalRequests = NUM_REQUESTS

  if (uniqueVisitorIds === 1) {
    console.log('🎯 ¡ÉXITO DEFENSIVO! El fingerprinting es robusto')
    console.log('🛡️  Todas las requests tienen el mismo visitorId')
    console.log('⚠️  Los atacantes NO pueden adulterar su huella digital')
    console.log(`📋 Requests enviados: ${totalRequests}`)
    console.log(`🔒 Unique visitorIds: ${uniqueVisitorIds}`)
  } else {
    console.log('⚠️  VULNERABILIDAD DETECTADA!')
    console.log('🔓 El atacante logró generar múltiples fingerprints')
    console.log('💥 El sistema puede ser bypasseado con rotación de user agents')
    console.log(`📋 Requests enviados: ${totalRequests}`)
    console.log(`🆔 Unique visitorIds: ${uniqueVisitorIds}`)
    console.log(
      `📈 Tasa de evasión: ${(
        (uniqueVisitorIds / totalRequests) *
        100
      ).toFixed(1)}%`
    )
  }

  console.log('='.repeat(60) + '\n')
}

simulateAttack().catch(console.error)
