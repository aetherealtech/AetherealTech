<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import type {BlogViewModel} from "applogic";

defineProps<{
  viewModel: BlogViewModel;
}>()
</script>

<template>
  <div>
    Blog
  </div>
</template>