<template>
  <div class="drawing-canvas-container">
    <div class="hand-drawn-border bg-white p-2">
      <canvas
        ref="canvas"
        :width="width"
        :height="height"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing"
        class="drawing-canvas"
      ></canvas>
    </div>

    <div class="flex gap-2 mt-2">
      <button
        type="button"
        @click="clearCanvas"
        class="hand-drawn-border bg-red-100 hover:bg-red-200 px-3 py-1 font-hand text-sm transition-colors"
      >
        Clear
      </button>
      <button
        type="button"
        @click="saveDrawing"
        class="hand-drawn-border bg-green-100 hover:bg-green-200 px-3 py-1 font-hand text-sm transition-colors"
      >
        Save Drawing
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['save'])

const canvas = ref(null)
const ctx = ref(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    ctx.value.lineWidth = 3
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
    ctx.value.strokeStyle = '#000000'

    // Fill with white background
    ctx.value.fillStyle = '#ffffff'
    ctx.value.fillRect(0, 0, props.width, props.height)
  }
})

function getCoordinates(e) {
  const rect = canvas.value.getBoundingClientRect()

  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    }
  }

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function startDrawing(e) {
  isDrawing.value = true
  const coords = getCoordinates(e)
  lastX.value = coords.x
  lastY.value = coords.y
}

function draw(e) {
  if (!isDrawing.value) return

  const coords = getCoordinates(e)

  ctx.value.beginPath()
  ctx.value.moveTo(lastX.value, lastY.value)
  ctx.value.lineTo(coords.x, coords.y)
  ctx.value.stroke()

  lastX.value = coords.x
  lastY.value = coords.y
}

function stopDrawing() {
  isDrawing.value = false
}

function clearCanvas() {
  ctx.value.fillStyle = '#ffffff'
  ctx.value.fillRect(0, 0, props.width, props.height)
}

function saveDrawing() {
  const dataUrl = canvas.value.toDataURL('image/png')
  emit('save', dataUrl)
}
</script>

<style scoped>
.drawing-canvas {
  cursor: crosshair;
  display: block;
  touch-action: none;
}
</style>
