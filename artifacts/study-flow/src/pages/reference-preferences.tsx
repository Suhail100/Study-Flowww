import { Bell, Bot, ChevronRight, CircleHelp, Clock3, Info, LogOut, ShieldCheck, Sun } from 'lucide-react';
import { useLocation } from 'wouter';
import { Frame, Header } from '../components/app-shell';
import { CenteredHeader } from './reference-common';
import notificationsEmptyArt from '../assets/reference/notifications-empty.png';
import { useStudyFlow } from '../lib/study-flow-store';

const preferenceItems = [
  { icon: Bell, title: 'Notification', detail: 'Manage your alert and reminders', route: '/notifications' },
  { icon: Clock3, title: 'Study Reminders', detail: 'Set daily study goals', route: '/settings/study-reminders' },
  { icon: Sun, title: 'Appearance', detail: 'Light appearance', route: '/settings/appearance' },
  { icon: Bot, title: 'AI Preferences', detail: 'Gemini is not connected', route: '/settings/ai' },
  { icon: CircleHelp, title: 'Help & Support', detail: 'Help information', route: '/settings/help' },
  { icon: Info, title: 'About Study Flow', detail: 'About this app', route: '/settings/about' },
  { icon: ShieldCheck, title: 'Privacy Policy', detail: 'Local data and storage', route: '/settings/privacy' },
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
                onClick={() => go(route === '/notifications' ? '/notifications?from=/settings' : route)}
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
        </div>
      </section>
    </Frame>
  );
}

export function EmptyNotifications() {
  const back = notificationReturnPath();
  return (
    <Frame>
      <section className="notifications-empty-reference" data-testid="screen-notifications-empty">
        <CenteredHeader title="Notification" back={back} />
        <img src={notificationsEmptyArt} alt="" />
        <h2>No notifications yet</h2>
        <p>Updates will appear here when you<br />add subjects or record study activity.</p>
      </section>
    </Frame>
  );
}

export function NotificationsList() {
  const { data, markNotificationRead } = useStudyFlow();
  const [, go] = useLocation();
  const back = notificationReturnPath();
  if (!data.notifications.length) return <EmptyNotifications />;
  const items = [...data.notifications].sort((a, b) => b.createdAt - a.createdAt);
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const date = new Date(item.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const label = date.toDateString() === today.toDateString()
      ? 'Today'
      : date.toDateString() === yesterday.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString();
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }
  return (
    <Frame>
      <section className="notifications-list-reference" data-testid="screen-notifications">
        <CenteredHeader title="Notification" back={back} />
        <div className="notification-groups">
          {Array.from(groups, ([group, groupItems]) => (
            <section className={`notification-group ${group.toLowerCase()}`} key={group}>
              <h2>{group}</h2>
              {groupItems.map((item, index) => (
                <article className={`notification-card ${item.read ? 'read' : 'today'}`} key={item.id} data-testid={`notification-${group.toLowerCase()}-${index}`} role="button" tabIndex={0} onClick={() => { markNotificationRead(item.id); if(item.href)go(item.href); }} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();markNotificationRead(item.id);if(item.href)go(item.href);}}}>
                  <span className="notification-dot"><i /></span>
                  <p><b>{item.title}</b><br />{item.message}</p>
                  <small>{new Date(item.createdAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</small>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>
    </Frame>
  );
}

function notificationReturnPath() {
  if (typeof window === 'undefined') return '/dashboard';
  const from = new URLSearchParams(window.location.search).get('from');
  return from?.startsWith('/') && !from.startsWith('//') ? from : '/dashboard';
}

const info = {
  'study-reminders': { title: 'Study reminders', text: 'Daily study time is saved as a planning preference. Timed push reminders are not configured yet.' },
  appearance: { title: 'Appearance', text: 'This version currently uses the light appearance.' },
  ai: { title: 'AI preferences', text: 'Gemini is not connected. Subject chat, AI quiz generation, and AI recommendations are unavailable.' },
  help: { title: 'Help & support', text: 'Study Flow data is stored in this browser. For this prototype, no support inbox is connected.' },
  about: { title: 'About Study Flow', text: 'Study Flow is a frontend prototype. Cloud accounts and AI services are not connected.' },
  privacy: { title: 'Privacy', text: 'Profile, subjects, quizzes, study plans, and resource links are stored locally in this browser. Files and profile photos are not uploaded.' },
} as const;

export function SettingsInfoPage() {
  const [path, go] = useLocation();
  const slug = path.split('/').filter(Boolean).pop() as keyof typeof info;
  const page = info[slug] ?? info.about;
  const { data, updatePreferences } = useStudyFlow();
  const [, setLocation] = useLocation();
  return (
    <Frame nav>
      <section className="settings-reference" data-testid={`screen-settings-${slug}`}>
        <Header title={page.title} back="/settings" />
        <p className="settings-info-copy">{page.text}</p>
        {slug === 'study-reminders' && (
          <label className="settings-info-field">Daily study time
            <select className="input" value={data.preferences.dailyHours} onChange={event => updatePreferences({ dailyHours: event.target.value })}>
              <option value="">Not set</option>
              {['1hr', '2hrs', '3hrs', '4 - 5 hours', '6+ hours'].map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        )}
        {slug === 'ai' && <button className="button-outline" onClick={() => setLocation('/assistant/error')}>AI connection status</button>}
        <button className="button-outline" onClick={() => go('/settings')}>Back to settings</button>
      </section>
    </Frame>
  );
}
