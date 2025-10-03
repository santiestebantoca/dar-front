<template>
  <app-layout>
    <app-header class="py-md-1 bg-light">
      <div class="container-fluid hstack">
        <span class="navbar-brand mx-auto">DAR</span>
      </div>
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-page-container>
      <app-page class="px-3">
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>
