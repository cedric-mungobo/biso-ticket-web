<template>
  <div ref="qrCode" class="qr-code-container"></div>
</template>

<script setup lang="ts">
interface Props {
  data: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200
})

const { $qrCodeStyling } = useNuxtApp()
const qrCode = ref<HTMLElement | null>(null)

const options = {
  width: props.size,
  height: props.size,
  type: 'svg' as const,
  data: props.data,
  dotsOptions: {
    color: '#000000',
    type: 'rounded' as const,
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous' as const,
    margin: 10,
  },
}

const qrCodeStyling = $qrCodeStyling(options)

onMounted(() => {
  if (qrCode.value) {
    qrCodeStyling.append(qrCode.value)
  }
})

watch(
  () => props.data,
  (newValue) => {
    options.data = newValue
    qrCodeStyling.update(options)
  }
)
</script>

<style scoped>
.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code-container svg {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
