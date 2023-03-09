<template>
  <Editor
      v-if="isEditor"
      :value="modelValue"
      :plugins="plugins"
      :sanitize="sanitize"
      :locale="getLocale('bytemd')"
      :uploadImages="uploadImages"
      @change="$emit('update:modelValue', $event)"
  />
  <Viewer
      v-else
      :value="modelValue"
      :plugins="plugins"
      :sanitize="sanitize"
  />
</template>

<script setup lang="ts">
import {BytemdPlugin} from "bytemd";
import {Schema} from "hast-util-sanitize";
import {Editor, Viewer} from "@bytemd/vue-next";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";

// constants
const {locale} = useI18n();

// methods
function sanitize(schema: Schema) {
  schema.protocols?.src.push("data");
  return schema;
}

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function uploadImages(files: File[]) {
  let result = [];
  for (let file of files) {
    result.push({
      url: await toBase64(file),
      alt: file.name,
    });
  }
  return result;
}

// props and emits
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  isEditor: {
    type: Boolean,
    default: false,
  },
  aTagBlankTarget: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["update:modelValue"]);

// locale
type pluginType = "bytemd" | "gfm" | "math" | "mermaid";
const localeDict: Record<string, Record<pluginType, object>> = {
  "en-US": {
    bytemd: await import("bytemd/locales/en.json"),
    gfm: await import("@bytemd/plugin-gfm/locales/en.json"),
    math: await import("@bytemd/plugin-math/locales/en.json"),
    mermaid: await import("@bytemd/plugin-mermaid/locales/en.json"),
  },
  "zh-CN": {
    bytemd: await import("bytemd/locales/zh_Hans.json"),
    gfm: await import("@bytemd/plugin-gfm/locales/zh_Hans.json"),
    math: await import("@bytemd/plugin-math/locales/zh_Hans.json"),
    mermaid: await import("@bytemd/plugin-mermaid/locales/zh_Hans.json"),
  },
};
const getLocale = (type: pluginType) => localeDict[locale.value][type];

// plugins
const aTagBlankTargetPlugin: BytemdPlugin = {
  viewerEffect({markdownBody}) {
    markdownBody.querySelectorAll("a").forEach(value => value.setAttribute("target", "_blank"));
  }
}
const plugins = computed<BytemdPlugin[]>(() => {
  let temp = [
    gemoji(),
    gfm({locale: getLocale("gfm")}),
    highlight(),
    math({locale: getLocale("math")}),
    mediumZoom(),
    mermaid({locale: getLocale("mermaid")}),
  ]
  if (props.aTagBlankTarget) {
    temp.push(aTagBlankTargetPlugin);
  }
  return temp;
});

// remove buttons
onMounted(() => {
  if (props.isEditor) {
    let toolbarRightElements = document.getElementsByClassName("bytemd-toolbar-right")[0].children;
    toolbarRightElements[toolbarRightElements.length - 1].remove();
    toolbarRightElements[toolbarRightElements.length - 1].remove();
  }
});
</script>

<style scoped>
</style>
