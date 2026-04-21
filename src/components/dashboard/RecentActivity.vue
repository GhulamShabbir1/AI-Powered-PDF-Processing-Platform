<template>
  <v-container fluid class="pa-0">
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <h3 class="text-h5 font-weight-bold">Recent Processing</h3>
      <a href="#" class="text-primary text-caption font-medium text-decoration-underline">View All History</a>
    </div>
    <v-list density="compact" class="pa-0 space-y-4">
      <!-- Activity 1 -->
      <v-list-item
        class="surface-container-low pa-6 rounded-xl hover:bg-surface-container-high transition-colors"
        rounded="xl"
        lines="three"
      >
        <template #prepend>
          <v-avatar class="mr-6" rounded="xl" size="64" height="80">
            <v-img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiE35BTjvpoj5kIyFgkO3fjgPCjV1NCJV_kr3JX514bhlKuWrkNrO-ZhQgO1gDOH0TkxIvPfHTKCRpzsB8pGNV9zMcLJ6F07QP-0Y-xB0FGH833TEnazsFXn0cVs0sn0sPDl0J-vYSYjLOTAVrZ6NU5GX1kRqUWp35dxFlCJHLZ5ImdwxMpRxzsYH_6Z6kGzF8Ue04IoaonBUIvJR3QBqYhy8sFHC5F1oXzJ9MYqCjXC0fUp4ztgzMXrwwIGRFMuX8euwxzTz8BA"
              alt="PDF preview"
            />
            <v-overlay class="d-flex align-center justify-center">
              <v-icon icon="mdi:file-pdf-box" color="white" size="large" />
            </v-overlay>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-bold mb-1">Q4 Financial_Manifest_2023.pdf</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              label
              color="secondary"
              size="small"
              class="font-weight-bold text-uppercase tracking-widest text-caption mb-2"
            >
              OCR Complete
            </v-chip>
            <span class="text-caption text-slate-500 font-medium">12.4 MB • 4 mins ago</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <template #append>
          <v-btn icon size="small" class="mr-2" variant="text">
            <v-icon icon="mdi:download" />
          </v-btn>
          <v-btn icon size="small" variant="text">
            <v-icon icon="mdi:dots-vertical" />
          </v-btn>
        </template>
      </v-list-item>

      <!-- Activity 2 -->
      <v-list-item
        class="surface-container-low pa-6 rounded-xl hover:bg-surface-container-high transition-colors"
        rounded="xl"
        lines="three"
      >
        <template #prepend>
          <v-avatar class="mr-6" rounded="xl" size="64" height="80">
            <v-img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUYLeWiSyzam1PfmRd2W3Qc2RIElsZAgygQZNX_pdBlE9r5baRbmCpAnap-GLr7v_lkOvySNKX4zPFRgmR7BITpIB5X4s7Y0ULev8OkCfuZKLqjeUhWaT-Y0rS12MXVHXV08xODUrT0AXYmurmg6Yb_nElqoY3QrOFD7Cqx-l8baMMYl4MXb9XW7jQ52gD1Bv3syF4CQ6ZmX3ezuL_sxMf9DLCWZOFb-8erkXkP1-q3e6MzIri8nTGnGvJ11Y1eLZZwgUYLeJFhw"
              alt="PDF preview"
            />
            <v-overlay class="d-flex align-center justify-center">
              <v-icon icon="mdi:file-pdf-box" color="white" size="large" />
            </v-overlay>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-bold mb-1">Internal_Compliance_Protocol.pdf</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              label
              color="tertiary"
              size="small"
              class="font-weight-bold text-uppercase tracking-widest text-caption mb-2"
            >
              Summarizing...
            </v-chip>
            <span class="text-caption text-slate-500 font-medium">1.8 MB • Processing</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <template #append>
          <div class="d-flex align-center gap-3">
            <div class="w-3 h-3 bg-secondary rounded-full animate-pulse" />
            <v-btn icon size="small" variant="text">
              <v-icon icon="mdi:stop-circle" />
            </v-btn>
          </div>
        </template>
      </v-list-item>

      <!-- Activity 3 -->
      <v-list-item
        class="surface-container-low pa-6 rounded-xl hover:bg-surface-container-high transition-colors"
        rounded="xl"
        lines="three"
      >
        <template #prepend>
          <v-avatar class="mr-6" rounded="xl" size="64" height="80">
            <v-img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0RP1DksQWDxG8omUb21Q3bKnuCCalZ9B_POs29LZ2OOzReGFSpRdvpXlYFYiHgKhK8qq_VJ4c68kQHWvinxUnXPD_OvxOX8mlqzKB-wofoTcRBjTdHZv0H6dFgNkAN6hxymZvtMVcH2JpDwE71U6Fv9zhIKzrXaQAtct2UDYlk3xHXJIf4FXi8kh294JBfQU73RmFwLtcSqDyM-kcTgtS_XAuDyirGznybYTlfDeKoDBTAOf21RJGLLUPPZbN4Xx7WUmBIA3BPA"
              alt="PDF preview"
            />
            <v-overlay class="d-flex align-center justify-center">
              <v-icon icon="mdi:file-pdf-box" color="white" size="large" />
            </v-overlay>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-bold mb-1">Global_Expansion_Plan_Draft.pdf</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              label
              color="surface-variant"
              size="small"
              class="font-weight-bold text-uppercase tracking-widest text-caption mb-2"
            >
              Vaulted
            </v-chip>
            <span class="text-caption text-slate-500 font-medium">4.2 MB • 2 hours ago</span>
          </v-list-item-subtitle>
        </v-list-item-content>
        <template #append>
          <v-btn icon size="small" class="mr-2" variant="text">
            <v-icon icon="mdi:share-variant" />
          </v-btn>
          <v-btn icon size="small" variant="text">
            <v-icon icon="mdi:dots-vertical" />
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
// Recent Activity List
</script>

