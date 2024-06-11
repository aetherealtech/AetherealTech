<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import type {Ref} from "vue";

const count: Ref<number> = ref(0)

function increment(): void {
  count.value++
}
</script>

<template>
  <div>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>
