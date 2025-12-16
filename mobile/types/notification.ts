export type AppNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
  articleId?: string;
};
