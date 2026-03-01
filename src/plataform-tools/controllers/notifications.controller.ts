import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('tools')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get(':id/notifications')
  async getNotifications(@Param('id') id: string) {
    return await this.notificationService.getNotifications(id);
  }

  @Patch(':id/notifications/atualizar/:notifId')
  async updateNotification(
    @Param('id') id: string,
    @Param('notifId') notifId: string,
  ) {
    return await this.notificationService.markOneNotificationAsRead(
      id,
      notifId,
    );
  }

  @Patch(':id/notifications/atualizar')
  async markAllNotificationsAsRead(
    @Param('id') id: string,
    @Body() body: string[],
  ) {
    return await this.notificationService.markAllNotificationsAsRead(id, body);
  }
}
