<template>
  <div class="relative w-full">
    <button
      @click="toggleCalendarMenu"
      class="w-full border border-primary-600 text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-50 transition-colors font-medium flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      Ajouter au calendrier
    </button>

    <!-- Menu des calendriers -->
    <div
      v-if="showCalendarMenu"
      class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-10"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-medium text-gray-900">Ajouter au calendrier</h4>
        <button
          @click="toggleCalendarMenu"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Options de calendrier -->
      <div class="space-y-2">
        <button
          @click="addToGoogleCalendar"
          class="w-full flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c1.054,0,1.909-0.855,1.909-1.909v-3.536 c0-1.054-0.855-1.909-1.909-1.909h-3.536c-1.054,0-1.909,0.855-1.909,1.909V12.151z M12.545,7.576L12.545,7.576 c0,1.054-0.855,1.909-1.909,1.909H7.1c-1.054,0-1.909-0.855-1.909-1.909V3.04c0-1.054,0.855-1.909,1.909-1.909h3.536 c1.054,0,1.909,0.855,1.909,1.909V7.576z M17.455,7.576L17.455,7.576c0,1.054,0.855,1.909,1.909,1.909h3.536 c1.054,0,1.909-0.855,1.909-1.909V3.04c0-1.054-0.855-1.909-1.909-1.909h-3.536c-1.054,0-1.909,0.855-1.909,1.909V7.576z M7.1,5.485L7.1,5.485c-0.604,0-1.095,0.49-1.095,1.095v3.536c0,0.604,0.49,1.095,1.095,1.095h3.536 c0.604,0,1.095-0.49,1.095-1.095V6.58c0-0.604-0.49-1.095-1.095-1.095H7.1z M17.455,15.424L17.455,15.424 c0,1.054,0.855,1.909,1.909,1.909h3.536c1.054,0,1.909-0.855,1.909-1.909v-3.536c0-1.054-0.855-1.909-1.909-1.909h-3.536 c-1.054,0-1.909,0.855-1.909,1.909V15.424z M12.545,15.424L12.545,15.424c0,1.054-0.855,1.909-1.909,1.909H7.1 c-1.054,0-1.909-0.855-1.909-1.909v-3.536c0-1.054,0.855-1.909,1.909-1.909h3.536c1.054,0,1.909,0.855,1.909,1.909V15.424z"/>
          </svg>
          Google Calendar
        </button>

        <button
          @click="addToOutlook"
          class="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Outlook
        </button>

        <button
          @click="downloadICal"
          class="w-full flex items-center justify-center gap-2 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Télécharger iCal
        </button>

        <button
          @click="addToAppleCalendar"
          class="w-full flex items-center justify-center gap-2 p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple Calendar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  eventTitle: string
  eventDescription: string
  eventDate: string
  eventLocation: string
  eventUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  eventUrl: ''
})

const showCalendarMenu = ref(false)

const toggleCalendarMenu = () => {
  showCalendarMenu.value = !showCalendarMenu.value
}

// Formatage de la date pour les calendriers
const formatDateForCalendar = (dateString: string) => {
  try {
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  } catch {
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
}

// Ajouter à Google Calendar
const addToGoogleCalendar = () => {
  const startDate = formatDateForCalendar(props.eventDate)
  const endDate = new Date(new Date(props.eventDate.replace(' ', 'T')).getTime() + 2 * 60 * 60 * 1000) // +2h par défaut
  const endDateFormatted = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(props.eventTitle)}&dates=${startDate}/${endDateFormatted}&details=${encodeURIComponent(props.eventDescription)}&location=${encodeURIComponent(props.eventLocation)}`
  
  window.open(url, '_blank')
}

// Ajouter à Outlook
const addToOutlook = () => {
  const startDate = new Date(props.eventDate.replace(' ', 'T'))
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2h par défaut
  
  const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(props.eventTitle)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(props.eventDescription + '\n\nLieu: ' + props.eventLocation)}&path=/calendar/action/compose&rru=addevent`
  
  window.open(url, '_blank')
}

// Télécharger fichier iCal
const downloadICal = () => {
  const startDate = formatDateForCalendar(props.eventDate)
  const endDate = new Date(new Date(props.eventDate.replace(' ', 'T')).getTime() + 2 * 60 * 60 * 1000)
  const endDateFormatted = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Biso Ticket//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@bisoticket.com`,
    `DTSTART:${startDate}`,
    `DTEND:${endDateFormatted}`,
    `SUMMARY:${props.eventTitle}`,
    `DESCRIPTION:${props.eventDescription.replace(/\n/g, '\\n')}`,
    `LOCATION:${props.eventLocation}`,
    `URL:${props.eventUrl}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${props.eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Ajouter à Apple Calendar (via iCal)
const addToAppleCalendar = () => {
  downloadICal()
}

// Fermer le menu si on clique à l'extérieur
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showCalendarMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
