<script setup>
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from './firebase'

const functions = getFunctions(app)
const callAPI = httpsCallable(functions, 'callExternalAPI')

async function fetchData() {
  try {
    const result = await callAPI({ params: { query: 'test' } })
    console.log(result.data)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>