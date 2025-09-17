<template>
  <div>
   <!-- ========== FOOTER ========== -->
   <footer class="mt-auto border-t md:border-t-0 border-gray-200 dark:border-neutral-700">
    <div class="w-full max-w-7xl py-10 md:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
        <div class="text-center md:text-start">
          <!-- Logo -->
          <NuxtImg src="/logo.png" alt="Biso Ticket" class="w-24 object-contain" />
          <!-- End Logo -->
        </div>
        <!-- End Col -->

        <ul class="text-center">
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-neutral-700 dark:before:text-neutral-300">
            <NuxtLink class="inline-flex gap-x-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50" to="/evenements">Événements</NuxtLink>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-neutral-700 dark:before:text-neutral-300">
            <NuxtLink class="inline-flex gap-x-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50" to="/contact">Contact</NuxtLink>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-neutral-700 dark:before:text-neutral-300">
            <NuxtLink class="inline-flex gap-x-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50" to="/organisateur">Espace organisateur</NuxtLink>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-neutral-700 dark:before:text-neutral-300">
            <NuxtLink class="inline-flex gap-x-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50" to="/confidentialite">Confidentialité</NuxtLink>
          </li>
          <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-neutral-700 dark:before:text-neutral-300">
            <NuxtLink class="inline-flex gap-x-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-50" to="/conditions">Conditions</NuxtLink>
          </li>
        </ul>
        <!-- End Col -->

        <!-- Social Brands -->
        <div class="text-center md:text-end space-x-2">
          <a class="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-neutral-700 hover:text-neutral-900 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-200 dark:hover:text-neutral-50" href="https://wa.me/243899267530" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <UIcon name="i-simple-icons-whatsapp" class="shrink-0 size-4" aria-hidden="true" />
          </a>
          <a class="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-neutral-700 hover:text-neutral-900 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-200 dark:hover:text-neutral-50" href="https://www.facebook.com/profile.php?id=61573688042341" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <UIcon name="i-simple-icons-facebook" class="shrink-0 size-4" aria-hidden="true" />
          </a>
          <a class="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-neutral-700 hover:text-neutral-900 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-200 dark:hover:text-neutral-50" href="https://www.instagram.com/biso_ticket/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <UIcon name="i-simple-icons-instagram" class="shrink-0 size-4" aria-hidden="true" />
          </a>
        </div>
        <!-- End Social Brands -->
      </div>
      <!-- End Grid -->
      <div class="mt-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {{ new Date().getFullYear() }} Biso Ticket. Tous droits réservés.
      </div>
    </div>
  </footer>
  <!-- ========== END FOOTER ========== -->
  </div>
</template>



<style>

</style>