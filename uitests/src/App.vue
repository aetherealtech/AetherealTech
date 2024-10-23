<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import {Root} from 'app'
import {type RootViewModelStub} from "./viewmodels/RootViewModel";

const viewModel: RootViewModelStub = window.rootViewModel
</script>

<template>
  <Root :view-model="viewModel"/>
</template>
