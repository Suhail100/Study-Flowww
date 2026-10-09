import { Bell, Bot, ChevronRight, CircleHelp, Clock3, Info, LogOut, ShieldCheck, Sun } from 'lucide-react';
import { useLocation } from 'wouter';
import { Frame, Header } from '../components/app-shell';
import { CenteredHeader } from './reference-common';
import notificationsEmptyArt from '../assets/reference/notifications-empty.png';

const preferenceItems = [
  { icon: Bell, title: 'Notification', detail: 'Manage your alert and reminders', route: '/notifications' },
  { icon: Clock3, title: 'Study Reminders', detail: 'Set daily study Goals and reminders' },
  { icon: Sun, title: 'Appearance', detail: 'Light/Dark' },
  { icon: Bot, title: 'AI Preferences', detail: 'Personalize your AI assistant' },
  { icon: CircleHelp, title: 'Help & Support', detail: 'Get help or contact' },
  { icon: Info, title: 'About Study Flow', detail: 'Version 1.0.0' },
  { icon: ShieldCheck, title: 'Privacy Policy', detail: 'Your data and privacy' },
];

export function SettingsPage() {
  const [, go] = useLocation();

  return (
    <Frame nav>
      <section className="settings-reference" data-testid="screen-settings">
        <Header title="Settings" back="/profile" />
        <div className="settings-reference-list">
          {preferenceItems.map(({ icon: Icon, title, detail, route }) => {
            const content = (
              <>
                <Icon size={23} aria-hidden="true" />
                <span><b>{title}</b><small>{detail}</small></span>
                <ChevronRight size={21} aria-hidden="true" />
              </>
            );
            return route ? (
              <button
                type="button"
                className="settings-reference-row"
                key={title}
                onClick={() => go(route)}
                data-testid="button-settings-notifications"
              >
                {content}
              </button>
            ) : (
              <div className="settings-reference-row" key={title}>
                {content}
              </div>
            );
          })}
          <div className="settings-reference-row logout-reference">
            <LogOut size={23} aria-hidden="true" />
            <span><b>Log Out</b><small>Sign out from your account</small></span>
            <ChevronRight size={21} aria-hidden="true" />
          </div>
        </div>
      </section>
    </Frame>
  );
}

export function EmptyNotifications() {
  return (
    <Frame>
      <section className="notifications-empty-reference" data-testid="screen-notifications-empty">
        <CenteredHeader title="Notification" back="/settings" />
        <img src={notificationsEmptyArt} alt="" />
        <h2>No notifications yet</h2>
        <p>You’ll see your study reminders<br />quiz updates and important alerts<br />here.</p>
      </section>
    </Frame>
  );
}

const notificationItems = [
  { group: 'Today', tone: 'today', text: 'Study reminder Dbms study session starts in 30 minutes', age: '10m' },
  { group: 'Today', tone: 'today', text: 'Exam reminder computer network exam in 5 days', age: '1hr' },
  { group: 'Yesterday', tone: 'yesterday', text: 'Exam reminder computer network exam in 6 days', age: '1d' },
  { group: 'Yesterday', tone: 'yesterday', text: 'Study reminder Dbms study session starts in 30 minutes', age: '1d' },
];

export function NotificationsList() {
  return (
    <Frame>
      <section className="notifications-list-reference" data-testid="screen-notifications">
        <CenteredHeader title="Notification" back="/settings" />
        <div className="notification-groups">
          {(['Today', 'Yesterday'] as const).map(group => (
            <section className={`notification-group ${group.toLowerCase()}`} key={group}>
              <h2>{group}</h2>
              {notificationItems.filter(item => item.group === group).map((item, index) => (
                <article className={`notification-card ${item.tone}`} key={`${group}-${index}`} data-testid={`notification-${group.toLowerCase()}-${index}`}>
                  <span className="notification-dot"><i /></span>
                  <p>{item.text}</p>
                  <small>{item.age}</small>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>
    </Frame>
  );
}
