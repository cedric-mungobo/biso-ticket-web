import { useRouter } from "vue-router";


import noUiSlider from "nouislider";
import "datatables.net";
import "dropzone/dist/dropzone-min.js";
import * as VanillaCalendarPro from "vanilla-calendar-pro";




// Preline UI
import("preline/dist");

export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.afterEach(async () => {
    setTimeout(() => window.HSStaticMethods.autoInit());
  });
});