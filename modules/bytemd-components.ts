import {addComponent, defineNuxtModule} from "@nuxt/kit";

export default defineNuxtModule({
  setup() {
    addComponent({
      name: "BytemdEditor",
      export: "Editor",
      filePath: "@bytemd/vue-next",
    });
    addComponent({
      name: "BytemdViewer",
      export: "Viewer",
      filePath: "@bytemd/vue-next",
    });
  },
});
