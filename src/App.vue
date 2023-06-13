<template>
  <div><Editor v-model="state"></Editor></div>
</template>

<script setup>
import { provide, ref } from "vue";
import data from "./components/data.json";
import Editor from "./packages/editor";
import { registerConfig as config } from "./utils/editor-config";
const state = ref(data);
console.log(state);

provide("config", config);
</script>

<style scoped></style>