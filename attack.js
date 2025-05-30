const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AnonymizeUA = require('puppeteer-extra-plugin-anonymize-ua')

puppeteer.use(StealthPlugin())
puppeteer.use(AnonymizeUA()) // This plugin also helps in randomizing UA and related navigator properties

const TARGET_URL = 'http://localhost:3001/phone'
const NUM_REQUESTS = 10 // Keep at 10 to test for 100% unique IDs
const visitorIds = new Set()

// --- Existing Randomization Functions ---
function randomLang() {
  const languages = [
    'en-US,en;q=0.9',
    'es-AR,es;q=0.9',
    'pt-BR,pt;q=0.9',
    'fr-FR,fr;q=0.9',
    'de-DE,de;q=0.9',
    'it-IT,it;q=0.9',
    'ja-JP,ja;q=0.9',
    'zh-CN,zh;q=0.9',
    'ru-RU,ru;q=0.9',
    'ko-KR,ko;q=0.9',
    'en-GB,en;q=0.8',
    'es-ES,es;q=0.8'
  ]
  return languages[Math.floor(Math.random() * languages.length)]
}

function randomTimezone() {
  const timezones = [
    'America/New_York',
    'Europe/Berlin',
    'Asia/Tokyo',
    'America/Los_Angeles',
    'Europe/London',
    'Australia/Sydney',
    'America/Chicago',
    'Asia/Shanghai',
    'Europe/Paris',
    'America/Sao_Paulo',
    'Asia/Kolkata',
    'Europe/Moscow'
  ]
  return timezones[Math.floor(Math.random() * timezones.length)]
}

// --- Randomization Functions ---
function randomUADetails() {
  const bases = [
    {
      uaPattern:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'Win32',
      os: 'Windows'
    },
    {
      uaPattern:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      os: 'Mac'
    },
    {
      uaPattern:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'Linux x86_64',
      os: 'Linux'
    },
    {
      uaPattern:
        'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'Win32',
      os: 'Windows'
    }, // Windows 11
    {
      uaPattern:
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'Linux x86_64',
      os: 'Linux'
    },
    {
      uaPattern:
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'Win32',
      os: 'Windows'
    }, // Windows 8.1
    {
      uaPattern:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{version}.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      os: 'Mac'
    } // macOS Big Sur example
  ]
  const selectedBase = bases[Math.floor(Math.random() * bases.length)]
  // More recent Chrome versions, e.g., 90-120
  const version = Math.floor(Math.random() * 31 + 90)
  return {
    userAgent: selectedBase.uaPattern.replace('{version}', version),
    platform: selectedBase.platform
  }
}

function randomHardwareConcurrency() {
  const options = [2, 4, 8, 12, 16, 20, 24] // Common core counts
  return options[Math.floor(Math.random() * options.length)]
}

function randomDeviceMemory() {
  const options = [2, 4, 8, 16, 32] // Common RAM sizes in GB
  return options[Math.floor(Math.random() * options.length)]
}

function randomScreenDepths() {
  const depths = [
    { colorDepth: 24, pixelDepth: 24 },
    { colorDepth: 30, pixelDepth: 30 }, // For HDR displays
    { colorDepth: 32, pixelDepth: 32 }, // Less common, but possible
    { colorDepth: 24, pixelDepth: 32 }, // e.g. macOS with transparency effects
    { colorDepth: 32, pixelDepth: 24 } // Less plausible, but adds variance
  ]
  return depths[Math.floor(Math.random() * depths.length)]
}

async function simulateAttack() {
  console.log('🚀 Iniciando ataque simulado...\n')

  for (let i = 0; i < NUM_REQUESTS; i++) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    // Generate randomized properties for this request
    const { userAgent, platform } = randomUADetails()
    const language = randomLang()
    const timezone = randomTimezone()
    const hardwareConcurrency = randomHardwareConcurrency()
    const deviceMemory = randomDeviceMemory()
    const screenDepths = randomScreenDepths()
    const viewportWidth = 1024 + Math.floor(Math.random() * 896) // 1024 to 1920
    const viewportHeight = 768 + Math.floor(Math.random() * 312) // 768 to 1080

    // Apply randomized properties
    await page.setUserAgent(userAgent)
    await page.setExtraHTTPHeaders({ 'Accept-Language': language })
    await page.emulateTimezone(timezone)

    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor:
        Math.random() < 0.7 ? 1 : Math.random() < 0.5 ? 1.5 : 2, // Add some deviceScaleFactor variation
      isMobile: false,
      hasTouch: false,
      isLandscape: Math.random() > 0.5
    })

    // Override additional navigator properties before page content loads
    await page.evaluateOnNewDocument(
      (platformValue, hcValue, dmValue, sdValues) => {
        Object.defineProperty(navigator, 'platform', {
          get: () => platformValue
        })
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => hcValue
        })
        Object.defineProperty(navigator, 'deviceMemory', { get: () => dmValue })

        Object.defineProperty(screen, 'colorDepth', {
          get: () => sdValues.colorDepth
        })
        Object.defineProperty(screen, 'pixelDepth', {
          get: () => sdValues.pixelDepth
        })
      },
      platform,
      hardwareConcurrency,
      deviceMemory,
      screenDepths // Pass values to evaluateOnNewDocument
    )

    let currentVisitorId = null
    page.on('request', async (req) => {
      if (req.url().includes('/api/validar-linea') && req.method() === 'POST') {
        const postData = req.postData()
        try {
          const parsed = JSON.parse(postData)
          visitorIds.add(parsed.visitorId)
          currentVisitorId = parsed.visitorId
        } catch (e) {
          console.log(`[#${i + 1}] Error al parsear POST`)
        }
      }
    })

    try {
      await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 15000 }) // Increased timeout slightly
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000)) // Small random delay

      const numeroLinea = `11${Math.floor(10000000 + Math.random() * 89999999)}`
      await page.type('input[type=text]', numeroLinea, {
        delay: Math.random() * 50 + 50
      }) // Randomized typing delay

      await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes('/api/validar-linea'),
          {
            timeout: 10000 // Increased timeout
          }
        ),
        page.click('button[type=submit]')
      ])

      let mensaje = '(sin mensaje detectado)'
      try {
        await page.waitForSelector('#resultado', { timeout: 7000 }) // Increased timeout
        mensaje = await page.$eval('#resultado', (el) => el.innerText.trim())
      } catch (err) {
        // console.warn(`[#${i+1}] No se pudo encontrar #resultado: ${err.message}`);
        mensaje = '(no se detectó mensaje visible)'
      }

      console.log(
        `[#${i + 1}] visitorId=${
          currentVisitorId || '-'
        } → ${numeroLinea} → ${mensaje}`
      )
    } catch (error) {
      console.error(
        `[#${i + 1}] Error durante la navegación o interacción: ${
          error.message
        }`
      )
      if (currentVisitorId) {
        // Log even if page error occurred after ID was captured
        console.log(
          `[#${
            i + 1
          }] visitorId=${currentVisitorId} (capturado antes del error)`
        )
      }
    } finally {
      await browser.close()
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 ANÁLISIS DE FINGERPRINTING')
  console.log('='.repeat(60))

  const uniqueVisitorIds = visitorIds.size
  const totalRequests = NUM_REQUESTS

  if (uniqueVisitorIds === totalRequests) {
    console.log('🎉🎯 ¡ÉXITO TOTAL DE EVASIÓN! Fingerprinting superado.')
    console.log('🛡️  Cada request generó un visitorId único.')
    console.log(
      `💯 Tasa de evasión: ${((uniqueVisitorIds / totalRequests) * 100).toFixed(
        1
      )}%`
    )
  } else if (uniqueVisitorIds === 1) {
    console.log('🎯 ¡ÉXITO DEFENSIVO! El fingerprinting es robusto.')
    console.log('🛡️  Todas las requests tienen el mismo visitorId.')
  } else {
    console.log('⚠️  VULNERABILIDAD DETECTADA (PARCIALMENTE EVADIDO)!')
    console.log('🔓 El atacante logró generar múltiples fingerprints.')
    console.log(
      '💥 El sistema puede ser bypasseado con rotación de parámetros.'
    )
    console.log(
      `📈 Tasa de evasión: ${((uniqueVisitorIds / totalRequests) * 100).toFixed(
        1
      )}%`
    )
  }

  console.log(`📋 Requests enviados: ${totalRequests}`)
  console.log(`🆔 Unique visitorIds: ${uniqueVisitorIds}`)
  console.log('='.repeat(60) + '\n')
}

simulateAttack().catch(console.error)
