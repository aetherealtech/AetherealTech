<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import type {ContactViewModel} from "contactlogic";

defineProps<{
  viewModel: ContactViewModel;
}>()
</script>

<template>
  <div>
    Contact
  </div>
</template>