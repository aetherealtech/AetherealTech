<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import type {AboutViewModel} from "applogic";

defineProps<{
  viewModel: AboutViewModel;
}>()
</script>

<template>
  <div>
    About
  </div>
</template>