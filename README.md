# 🤖 Bot de Ataque Anti-Fingerprinting

Bot automatizado para probar la robustez de sistemas de rate limiting basados en fingerprinting digital. Simula ataques sofisticados con múltiples técnicas de evasión.

## 🎯 Objetivo

Evaluar la efectividad de sistemas de detección de abuso que utilizan **FingerprintJS** u otras técnicas de fingerprinting del navegador para identificar usuarios únicos.

## 🛠️ Características del Bot

### 🔧 Técnicas de Evasión Implementadas

#### 1. **Rotación de User Agents**

- 7 diferentes combinaciones de OS/navegador
- Versiones aleatorias de Chrome (90-120)
- Patrones realistas para Windows, macOS y Linux

#### 2. **Randomización de Headers HTTP**

- 12 idiomas diferentes (`Accept-Language`)
- Rotación automática entre locales comunes

#### 3. **Variación de Zonas Horarias**

- 12 zonas horarias globales
- Desde América hasta Asia-Pacífico

#### 4. **Propiedades del Navegador**

- `navigator.platform` dinámico
- `navigator.hardwareConcurrency` (2-24 cores)
- `navigator.deviceMemory` (2-32 GB)
- `screen.colorDepth` y `pixelDepth` variables

#### 5. **Viewport Dinámico**

- Resoluciones entre 1024x768 y 1920x1080
- `deviceScaleFactor` aleatorio (1, 1.5, 2)
- Orientación landscape/portrait variable

#### 6. **Comportamiento Humano**

- Delays aleatorios entre acciones (50-100ms)
- Tiempos de espera variables entre requests
- Simulación de typing natural

## 📊 Métricas de Evaluación

El bot mide la efectividad del fingerprinting con:

- **🎯 Éxito Defensivo**: Todos los requests tienen el mismo `visitorId`
- **⚠️ Vulnerabilidad Parcial**: Múltiples `visitorId` generados
- **🎉 Éxito Total de Evasión**: Cada request genera un `visitorId` único

## 🚀 Uso

```bash
# Instalar dependencias
npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer-extra-plugin-anonymize-ua

# Ejecutar ataque
node attack.js
```

## 📋 Configuración

```javascript
const TARGET_URL = 'http://localhost:3001/phone'  // URL objetivo
const NUM_REQUESTS = 10                           // Número de requests
```

## 📈 Salida del Bot

```
🚀 Iniciando ataque simulado...

[#1] visitorId=a19e5a74a32ee27b → 1124719404 → No pudimos procesar tu solicitud
[#2] visitorId=b96742ef0e8db414 → 1162359558 → Error de validación
[#3] visitorId=c45821df3a21bc89 → 1198765432 → Límite excedido

=============================================================
📊 ANÁLISIS DE FINGERPRINTING
=============================================================
🎉🎯 ¡ÉXITO TOTAL DE EVASIÓN! Fingerprinting superado.
🛡️  Cada request generó un visitorId único.
💯 Tasa de evasión: 100.0%
📋 Requests enviados: 10
🆔 Unique visitorIds: 10
=============================================================
```

## 🛡️ Contramedidas Recomendadas

### Para Defensores

1. **Rate Limiting por IP** como respaldo
2. **Análisis de patrones de comportamiento**
3. **Detección de automatización** (velocidad, patrones)
4. **Fingerprinting del lado servidor** (TLS, timing)
5. **Machine Learning** para detectar bots sofisticados

### Técnicas Avanzadas

- **Canvas fingerprinting** más robusto
- **Audio context fingerprinting**
- **WebGL fingerprinting**
- **Análisis de eventos del mouse/teclado**

## ⚠️ Uso Ético

Este bot está diseñado para:

- ✅ Pruebas de penetración autorizadas
- ✅ Evaluación de sistemas propios
- ✅ Investigación de seguridad

**NO debe usarse para**:

- ❌ Ataques no autorizados
- ❌ Evasión maliciosa de rate limits
- ❌ Actividades ilegales

## 🔍 Plugins Utilizados

- **`puppeteer-extra-plugin-stealth`**: Evasión de detección de automatización
- **`puppeteer-extra-plugin-anonymize-ua`**: Randomización adicional de UA

## 📚 Casos de Uso

1. **Auditorías de Seguridad**: Evaluar robustez de rate limiting
2. **Red Team Exercises**: Simular ataques sofisticados
3. **Desarrollo**: Probar contramedidas anti-bot
4. **Investigación**: Estudiar técnicas de fingerprinting
