<script lang="ts">
import 'primevue/resources/themes/aura-light-green/theme.css'
</script>

<script setup lang="ts">
import type {MenuItem} from "primevue/menuitem";
import type {PageContent, RootViewModel} from "applogic";
import {type Component, computed, type Ref} from 'vue'

import { Home } from "home";
import { About } from "about";
import { Contact } from "contact";
import { Blog } from "blog";

import NotFound from './components/NotFound.vue'

import {useObservable} from "@vueuse/rxjs";

const props = defineProps<{
  viewModel: RootViewModel;
}>()

const viewModel = props.viewModel;

const items: MenuItem[] = viewModel.pages
    .map((page) => {
      return {
        label: page.label,
        command: (_) => page.select()
      }
    });

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const pageContent: Ref<PageContent | null> = useObservable(viewModel.content)

const contentViewModel: Ref<PageContent['content'] | undefined> = computed(() => pageContent.value?.content)

const content: Ref<Component> = computed(() => {
  const currentPageContent = pageContent.value

  if(currentPageContent == null)
    return NotFound;

  switch (currentPageContent.type) {
    case 'home': return Home;
    case 'about': return About;
    case 'contact': return Contact;
    case 'blog': return Blog;
    default:
      return assertNever(currentPageContent)
  }
})

</script>

<template>
  <div>
    <Menubar :model="items">
      <template #start>
        <svg width="80" height="40" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
          <path d="m1152 732c0-132-24-252-108-360-126.32-172.26-362.52-245.5-550.88-156.82 119.84-95.051 275.28-83.039 406.88-35.184-296.9-153.57-558.84 59.734-674.07 326.9 0.23828-6.7578 0.67188-13.535 1.5469-20.363 0 0 7.9805-57.961 37.309-141.2 119.22-261.34 491.22-321.34 721.77-169.04 104.09 83.676 122.55 84.301 122.55 84.301l-169.7-169.72s-5.2188 1.1172-26.148-2.0898c-49.258-4.7852-97.258-40.785-145.26-40.785-96-12-192 0-276 36-210.02 80.004-353.18 318.36-304.8 534.49-2.6016 9.8281-5.0156 19.668-7.1992 29.508-48-48-36-120-40.836-181.39 10.895-85.824 28.883-144.59 28.883-144.59-157.12 315.89 97.047 575.43 387.62 652.34-65.219 5.0156-130.45-16.621-195.67-38.363-324-132-360-588-123.86-812.22 18.695-24.227 24.457-32.902 24.457-32.902s-44.258 43.895-88.117 88.477c-43.871 44.566-81.59 81.238-81.59 81.238s-2.4102 11.113-13.477 46.859c-29.41 100.55-41.41 196.55-29.41 304.55 42.203 274.31 344.1 474.28 604.97 381.04 10.355 1.2266 20.711 2.2227 31.031 2.9648-96 60-216 72-324 48 297 108.9 528.64-117.07 600.62-381.42-0.32422 15.109-0.625 30.254-0.625 45.422 0 72-36 144-72 204-180 252-540 264-761.06 54.816-26.566-20.82-36.047-27.406-36.047-27.406s47.438 48.395 88.441 88.715c41.004 40.32 81.266 81 81.266 81s10.477 1.9062 43.703 11.102c79.699 19.773 163.7 43.773 259.7 31.773 48-12 84-24 132-36 228.8-93.613 376.31-358.45 286.62-583.66 0.88672-13.488 1.3789-26.941 1.3789-40.344 72 120 96 264 36 384 96-180 36-396-108-528-82.141-65.711-175.52-103.29-276.3-120.47 64.094 2.375 128.2 10.824 192.3 36.469 60 36 108 72 156 120 192 204 132 516-33.504 702.21-10.633 18.023-11.074 22.906-11.074 22.906l169.7-169.71s-1.3555-4.8711 1.6094-25.922c5.2656-61.484 41.266-121.48 41.266-181.48zm-324-132.01c0 125.91-102.09 228-228 228-125.93 0-228-102.09-228-228 0-125.93 102.07-228 228-228 125.91 0 228 102.07 228 228z"/>
        </svg>
      </template>
    </Menubar>
    <component :is="content" :view-model="contentViewModel"></component>
  </div>
</template>
