<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import {Root, RootViewModelProd} from 'app'

const route = useRequestURL();

const viewModel = new RootViewModelProd(
    route.pathname
)
</script>

<template>
  <Root :view-model="viewModel"/>
</template>
