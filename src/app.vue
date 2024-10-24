<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import {Root} from 'app'
import {RootViewModelProd} from 'applogic'

const route = useRequestURL();

const viewModel = new RootViewModelProd(
    route.pathname
)
</script>

<template>
  <Root :view-model="viewModel"/>
</template>
