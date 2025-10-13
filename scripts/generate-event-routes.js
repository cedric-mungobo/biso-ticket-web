#!/usr/bin/env node

/**
 * Script de génération des routes d'événements pour le mode hybride SPA/Static
 * Ce script récupère les événements depuis l'API et génère les routes statiques
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const API_BASE_URL = 'https://api.bisoticket.com/api'

async function fetchEvents() {
  console.log('🔄 Récupération des événements depuis l\'API...')

  try {
    const response = await fetch(`${API_BASE_URL}/public/events?per_page=1000&status=active`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const events = data.data?.items || []

    console.log(`✅ ${events.length} événements récupérés`)
    return events
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error.message)
    return []
  }
}

function generateRouteConfig(events) {
  const routes = [
    '/',
    '/evenements',
    '/contact',
    '/connexion',
    '/inscription',
    ...events.map(event => `/evenements/${event.slug}`)
  ]

  // Supprimer les doublons et trier
  const uniqueRoutes = [...new Set(routes)].sort()

  console.log(`📝 Génération de ${uniqueRoutes.length} routes uniques`)

  return uniqueRoutes
}

function updateNuxtConfig(routes) {
  const configPath = join(__dirname, '../nuxt.config.ts')

  if (!existsSync(configPath)) {
    throw new Error('nuxt.config.ts non trouvé!')
  }

  let configContent = readFileSync(configPath, 'utf-8')

  // Trouver la section nitro.prerender.routes
  const routesRegex = /prerender:\s*\{[\s\S]*?routes:\s*\[([\s\S]*?)\]/
  const match = configContent.match(routesRegex)

  if (match) {
    // Générer le nouveau contenu des routes
    const newRoutesContent = routes
      .map(route => `        '${route}'`)
      .join(',\n')

    // Remplacer l'ancien contenu
    const newSection = match[0].replace(match[1], newRoutesContent)
    configContent = configContent.replace(match[0], newSection)

    writeFileSync(configPath, configContent)
    console.log('✅ nuxt.config.ts mis à jour avec les nouvelles routes')
  } else {
    console.warn('⚠️  Section prerender.routes non trouvée dans nuxt.config.ts')
  }
}

function generateRoutesFile(routes) {
  const routesFileContent = `// Fichier généré automatiquement - ne pas modifier manuellement
// Généré le: ${new Date().toISOString()}
// Nombre de routes: ${routes.length}

export const staticRoutes = ${JSON.stringify(routes, null, 2)}

export const eventRoutes = routes.filter(route => route.startsWith('/evenements/') && route !== '/evenements')
export const staticPageCount = routes.length
export const eventCount = eventRoutes.length
`

  const routesPath = join(__dirname, '../app/static-routes.ts')
  writeFileSync(routesPath, routesFileContent)
  console.log('✅ Fichier static-routes.ts généré')
}

function generateSitemapData(events) {
  const sitemapData = {
    staticPages: [
      {
        url: '/',
        changefreq: 'daily',
        priority: '1.0',
        lastmod: new Date().toISOString()
      },
      {
        url: '/evenements',
        changefreq: 'daily',
        priority: '0.9',
        lastmod: new Date().toISOString()
      },
      {
        url: '/contact',
        changefreq: 'monthly',
        priority: '0.5',
        lastmod: new Date().toISOString()
      }
    ],
    eventPages: events.map(event => ({
      url: `/evenements/${event.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: event.updatedAt || event.createdAt || new Date().toISOString(),
      title: event.title,
      description: event.description?.substring(0, 160) || '',
      image: event.imageUrl
    }))
  }

  const sitemapPath = join(__dirname, '../app/sitemap-data.ts')
  writeFileSync(sitemapPath, `// Fichier généré automatiquement - ne pas modifier manuellement\nexport const sitemapData = ${JSON.stringify(sitemapData, null, 2)}\n`)
  console.log('✅ Fichier sitemap-data.ts généré')
}

async function main() {
  console.log('🚀 Début de la génération des routes d\'événements...\n')

  try {
    // 1. Récupérer les événements
    const events = await fetchEvents()

    if (events.length === 0) {
      console.warn('⚠️  Aucun événement trouvé, utilisation des routes par défaut')
      // Routes par défaut si aucun événement
      events.push({ slug: 'sample-event' })
    }

    // 2. Générer les routes
    const routes = generateRouteConfig(events)

    // 3. Mettre à jour nuxt.config.ts
    updateNuxtConfig(routes)

    // 4. Générer le fichier de routes statiques
    generateRoutesFile(routes)

    // 5. Générer les données pour le sitemap
    generateSitemapData(events)

    console.log('\n🎉 Génération des routes terminée avec succès!')
    console.log(`📊 Statistiques:`)
    console.log(`   - Événements: ${events.length}`)
    console.log(`   - Routes totales: ${routes.length}`)
    console.log(`   - Pages statiques: ${routes.filter(r => !r.startsWith('/evenements/') || r === '/evenements').length}`)
    console.log(`   - Pages d'événements: ${routes.filter(r => r.startsWith('/evenements/') && r !== '/evenements').length}`)

  } catch (error) {
    console.error('\n❌ Erreur lors de la génération des routes:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
main()
