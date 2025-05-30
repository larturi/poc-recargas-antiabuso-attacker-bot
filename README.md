# FingerprintJS Rate Limit Bypass – Attack PoC

Este script es una prueba de concepto de ataque (PoC) contra un sistema de rate limiting basado en visitorId generado con FingerprintJS desde el frontend.

## 🚀 ¿Qué hace este script?

- Lanza múltiples navegadores headless simulando usuarios reales con Puppeteer.

- Utiliza plugins de evasión avanzada (puppeteer-extra-plugin-stealth y anonymize-ua) para eludir técnicas comunes de fingerprinting.

- Rota propiedades clave del navegador (User-Agent, idioma, zona horaria, resolución de pantalla, etc.) en cada ejecución.

- Permite que el frontend genere el visitorId naturalmente usando FingerprintJS.

- Intercepta los requests salientes al backend (/api/validar-linea) y extrae los visitorId enviados.

- Registra en consola los visitorId generados y los números de línea enviados, permitiendo detectar si se está evadiendo el rate limit.

## 📦 Requisitos

- Node.js 16+

## Correr el script

```bash
npm install

node attack.js
```

## 🧠 Resultado esperado

Si el ataque es exitoso, verás múltiples visitorId distintos en consola:

```bash
[#1] visitorId=a9b8c7... → 1134567890
[#2] visitorId=4e5f6d... → 1176543210
...
```

Esto confirma que el sistema de rate limiting por visitorId puede ser evadido, y que el fingerprint no es confiable por sí solo como identificador antifraude.
