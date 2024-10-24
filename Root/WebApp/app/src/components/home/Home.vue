<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import { type Ref, ref } from "vue";
import type {HomeViewModel} from "applogic";

defineProps<{
  viewModel: HomeViewModel;
}>()

const count: Ref<number> = ref(0)

function increment(): void {
  count.value++
}
</script>

<template>
  <div>
    Home
    <Button @click="increment">Count: {{ count }}</Button>
  </div>
</template>