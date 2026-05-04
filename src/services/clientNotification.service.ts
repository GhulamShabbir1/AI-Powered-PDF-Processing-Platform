import { useToast } from 'vue-toastification'
import notificationService from './notification.service'

interface ClientNotificationOptions {
  tag?: string
  requireInteraction?: boolean
  icon?: string
  image?: string
  actions?: Array<{ action: string; title: string }>
}



export class ClientNotificationService {
  private toast: ReturnType<typeof useToast> | null = null
  private activeToastId: string | number | null = null
  private activeBrowserNotification: Notification | null = null
  private notifications = new Map<string, Notification>()

  private getToast() {
    if (!this.toast) {
      try {
        this.toast = useToast()
      } catch {
        return null
      }
    }
    return this.toast
  }

  private getPermission(): Promise<NotificationPermission> {
    return new Promise((resolve) => {
      if (!('Notification' in window)) {
        resolve('denied')
        return
      }
      resolve(Notification.permission as NotificationPermission)
    })
  }

  private async canShowNotifications(): Promise<boolean> {
    if (!notificationService.isEnabled()) {
      return false
    }

    const permission = await this.getPermission()
    return permission === 'granted'
  }

  private shouldUseSystemNotification(): boolean {
    if (typeof document === 'undefined') {
      return false
    }

    return document.visibilityState !== 'visible' || !document.hasFocus()
  }

  private closeTrackedNotification(id: string): void {
    const existing = this.notifications.get(id)
    if (existing) {
      existing.close()
      this.notifications.delete(id)
    }
  }

  private dismissActiveToast(): void {
    const toast = this.getToast()
    if (toast) {
      toast.dismiss()
    }
    if (this.activeToastId !== null) {
      this.activeToastId = null
    }
  }

  private replaceActiveBrowserNotification(notification: Notification): void {
    this.activeBrowserNotification?.close()
    this.activeBrowserNotification = notification
    notification.onclose = () => {
      if (this.activeBrowserNotification === notification) {
        this.activeBrowserNotification = null
      }
    }
  }

  /**
   * Show progress notification (upload/download/processing).
   * Progress updates stay in-app only to avoid noisy OS-level spam.
   */
  async showProgress(
    title: string,
    progress: number,
    options: ClientNotificationOptions = {}
  ): Promise<string> {
    const id = options.tag || `progress-${Date.now()}`
    this.showToastFallback(title, `${Math.round(progress)}% complete`)
    return id
  }

  /**
   * Update existing progress notification
   */
  async updateProgress(id: string, progress: number): Promise<void> {
    void progress
    if (!id) return
  }

  /**
   * Complete progress → show success notification
   */
  async completeProgress(
    id: string,
    title: string = 'Complete!',
    body: string = 'Operation finished successfully'
  ): Promise<void> {
    if (id) {
      this.closeTrackedNotification(id)
    }
    await this.showSuccess(title, body)
  }

  /**
   * Show success notification
   */
  async showSuccess(
    title: string,
    body: string = 'Operation completed successfully',
    options: ClientNotificationOptions = {}
  ): Promise<void> {
    const canShow = await this.canShowNotifications()
    if (!canShow || !this.shouldUseSystemNotification()) {
      this.showToastFallback(title, body)
      return
    }

    const notification = new Notification(title, {
      body,
      icon: options.icon || '/icons-success.svg',
      badge: '/favicon.svg',
      tag: options.tag || `success-${Date.now()}`,
      ...options,
    })
    this.replaceActiveBrowserNotification(notification)

    // Auto-close after 5s
    setTimeout(() => notification.close(), 5000)
  }

  /**
   * Show error notification
   */
  async showError(
    title: string,
    body: string = 'Something went wrong',
    options: ClientNotificationOptions = {}
  ): Promise<void> {
    const canShow = await this.canShowNotifications()
    if (!canShow || !this.shouldUseSystemNotification()) {
      this.showToastFallback(title, body, 'error')
      return
    }

    const tag = options.tag || `error-${Date.now()}`
    const notification = new Notification(title, {
      body,
      icon: options.icon || '/icons-error.svg',
      badge: '/favicon.svg',
      requireInteraction: true,
      tag,
      ...options,
    })

    this.replaceActiveBrowserNotification(notification)
    this.notifications.set(tag, notification)
    notification.onclose = () => {
      this.notifications.delete(tag)
    }
  }

  /**
   * Status update notification (processing steps)
   */
  async showStatus(
    title: string,
    status: string,
    options: ClientNotificationOptions = {}
  ): Promise<void> {
    void options
    this.showToastFallback(title, status)
  }

  private showToastFallback(title: string, body: string, type: 'info' | 'success' | 'error' = 'info') {
    if (!notificationService.isEnabled()) {
      return
    }

    const toast = this.getToast()
    if (toast) {
      this.dismissActiveToast()
      this.activeToastId = toast[type](`${title}: ${body}`, {
        timeout: 5000,
        closeOnClick: true,
      })
    }
  }

  /**
   * Check if notifications are enabled
   */
  async isEnabled(): Promise<boolean> {
    const permission = await this.getPermission()
    return notificationService.isEnabled() && permission === 'granted'
  }

  /**
   * Request permission (if needed)
   */
  async requestPermission(): Promise<boolean> {
    return await notificationService.requestPermission()
  }
}

export const clientNotificationService = new ClientNotificationService()
export default clientNotificationService
