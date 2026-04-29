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
    const permission = await this.getPermission()
    return permission === 'granted'
  }

  /**
   * Show progress notification (upload/download/processing)
   */
  async showProgress(
    title: string,
    progress: number,
    options: ClientNotificationOptions = {}
  ): Promise<string> {
    const canShow = await this.canShowNotifications()
    if (!canShow) {
      this.showToastFallback(title, `${Math.round(progress)}% complete`)
      return ''
    }

    const id = options.tag || `progress-${Date.now()}`
    const notification = new Notification(title, {
      body: `Progress: ${Math.round(progress)}%`,
      tag: id,
      icon: options.icon || '/favicon.svg',
      requireInteraction: options.requireInteraction ?? false,
      silent: false,
      ...options,
    })

    this.notifications.set(id, notification)
    
    // Note: Notification.body is read-only after creation
    notification.onclose = () => {
      this.notifications.delete(id)
    }

    return id
  }

  /**
   * Update existing progress notification
   */
  async updateProgress(id: string, progress: number): Promise<void> {
    const notification = this.notifications.get(id)
    if (notification) {
      const baseTitle = notification.title.replace(/ - \d+%$/, '')
      const newNotification = new Notification(`${baseTitle} - ${Math.round(progress)}%`, {
        body: `Progress: ${Math.round(progress)}%`,
        tag: id,
        icon: notification.icon,
        silent: true
      })
      this.notifications.set(id, newNotification)
    }
  }

  /**
   * Complete progress → show success notification
   */
  async completeProgress(
    id: string,
    title: string = 'Complete!',
    body: string = 'Operation finished successfully'
  ): Promise<void> {
    this.notifications.delete(id)
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
    if (!canShow) {
      this.showToastFallback(title, body)
      return
    }

    const notification = new Notification(title, {
      body,
      icon: '/icons-success.svg' || options.icon,
      badge: '/favicon.svg',
      ...options,
    })

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
    if (!canShow) {
      this.showToastFallback(title, body, 'error')
      return
    }

    new Notification(title, {
      body,
      icon: '/icons-error.svg' || options.icon,
      badge: '/favicon.svg',
      requireInteraction: true,
      ...options,
    })

    // Persist until user dismisses
  }

  /**
   * Status update notification (processing steps)
   */
  async showStatus(
    title: string,
    status: string,
    options: ClientNotificationOptions = {}
  ): Promise<void> {
    const canShow = await this.canShowNotifications()
    if (!canShow) {
      this.showToastFallback(title, status)
      return
    }

    const notification = new Notification(title, {
      body: status,
      tag: 'status-update',
      icon: options.icon || '/favicon.svg',
      ...options,
    })

    setTimeout(() => notification.close(), 4000)
  }

  private showToastFallback(title: string, body: string, type: 'info' | 'success' | 'error' = 'info') {
    const toast = this.getToast()
    if (toast) {
      toast[type](`${title}: ${body}`, {
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
    return permission === 'granted'
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

