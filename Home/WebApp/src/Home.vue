<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import {type Ref, onMounted} from "vue"
import {Card, HomeViewModel} from "homelogic"
import { useObservable } from "@vueuse/rxjs";

const props = defineProps<{
  viewModel: HomeViewModel
}>()

const viewModel = props.viewModel

type ComponentCard = {
  card: Card,
  alpha: Ref<number>
}

const cards: ComponentCard[] = viewModel.cards.map(card => ({
  card: card,
  alpha: useObservable(card.alpha)
}))

const cardElements: Map<Card, HTMLDivElement> = new Map()

onMounted(() => {
  for (const [card , element] of cardElements) {
    const rect = element.getBoundingClientRect();
    card.yFrame = { start: rect.y + window.scrollY, size: rect.height }
  }
})

</script>

<template>
  <div class="scroll-container">
    <div class="background-layer-1"/>
    <div class="main-title">
      Aethereal Technologies
    </div>
    <div class="sub-title">
      Excellence in Software Craftsmanship
    </div>
    <div class="card" v-for="card in cards" :style="{ opacity: `${card.alpha.value * 100}%` }" :ref="(el) => { cardElements.set(card.card, el as HTMLDivElement) }">
      <div class="card-content" style="white-space: pre-line">
        {{ card.card.title }}
      </div>
      <br>
      <div v-for="content in card.card.contents">
        <a class="card-link" :href="content.destination">
          {{ content.title }}
        </a>
      </div>
      <br>
      <button class="card-button" @click="card.card.cta.perform()">
        {{ card.card.cta.title }}
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.scroll-container {
  overflow-x: hidden;
}
.background-layer-1 {
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000011, #000022);
}
.main-title {
  position: relative;
  background: linear-gradient(22deg, #8888ff, white);
  background-clip: text;
  color: transparent;
  text-align: center;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 80px;
}
.sub-title {
  position: relative;
  background: linear-gradient(202deg, #8888ff, white);
  background-clip: text;
  color: transparent;
  text-align: center;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 40px;
}
.card {
  position: relative;
  background-color: #ccccff;
  border-radius: 25px;
  border: 1px solid #444488;
  margin: 64px 64px 64px 64px;
  padding: 16px 64px 16px 64px;
  transition: --start 0.25s, --end 0.25s, all 0.25s;
}
.card:hover {
  border-color: white;
}
.card-content {
  color: #000066;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
}
.card-link {
  color: #004488;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
}
@property --start {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}
@property --end {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}
.card-button {
  --start: #111144;
  --end: #222288;
  background: linear-gradient(0deg, var(--start), var(--end));
  border-radius: 8px;
  border: 1px solid #aaaaff;
  padding: 8px 16px 8px 16px;
  color: #ddddff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  transition: --start 0.25s, --end 0.25s, all 0.25s;
}
.card-button:hover {
  --start: #222288;
  --end: #4444ff;
  border-color: white;
  color: #ffffff;
}
</style>