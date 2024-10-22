<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import Root from "./components/root.vue";
import {RootViewModelProd} from "./components/root-viewmodel";

const viewModel = new RootViewModelProd()
</script>

<template>
  <Root :view-model="viewModel"/>
</template>
