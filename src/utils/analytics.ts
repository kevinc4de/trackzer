// Analytics and monitoring utilities

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    this.track('session_start', 'system', 'session_initialized');
  }

  // Track user events
  track(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    userId?: string
  ) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for persistence
    this.persistEvents();
    
    // Log for development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }
  }

  // Track page views
  trackPageView(page: string, userId?: string) {
    this.track('page_view', 'navigation', 'view_page', page, undefined, userId);
  }

  // Track search events
  trackSearch(query: string, resultsCount: number, userId?: string) {
    this.track('search', 'user_action', 'search_phone', query, resultsCount, userId);
  }

  // Track phone reports
  trackPhoneReport(status: 'lost' | 'stolen', brand: string, userId?: string) {
    this.track('phone_report', 'user_action', 'report_phone', `${status}_${brand}`, undefined, userId);
  }

  // Track geolocation usage
  trackGeolocation(source: 'gps' | 'network' | 'database', accuracy: string, userId?: string) {
    this.track('geolocation', 'system', 'location_detected', `${source}_${accuracy}`, undefined, userId);
  }

  // Track errors
  trackError(error: string, context: string, userId?: string) {
    this.track('error', 'system', 'error_occurred', `${context}: ${error}`, undefined, userId);
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const totalEvents = this.events.length;
    const uniqueCategories = [...new Set(this.events.map(e => e.category))];
    const sessionDuration = this.getSessionDuration();
    
    const eventsByCategory = uniqueCategories.reduce((acc, category) => {
      acc[category] = this.events.filter(e => e.category === category).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      sessionId: this.sessionId,
      totalEvents,
      uniqueCategories: uniqueCategories.length,
      sessionDuration,
      eventsByCategory,
      lastActivity: this.events[this.events.length - 1]?.timestamp
    };
  }

  private getSessionDuration(): number {
    if (this.events.length === 0) return 0;
    
    const firstEvent = new Date(this.events[0].timestamp);
    const lastEvent = new Date(this.events[this.events.length - 1].timestamp);
    
    return Math.round((lastEvent.getTime() - firstEvent.getTime()) / 1000); // seconds
  }

  private persistEvents() {
    try {
      localStorage.setItem('trackzer_analytics', JSON.stringify({
        sessionId: this.sessionId,
        events: this.events.slice(-100) // Keep only last 100 events
      }));
    } catch (error) {
      console.warn('Failed to persist analytics events:', error);
    }
  }

  // Load persisted events
  loadPersistedEvents() {
    try {
      const stored = localStorage.getItem('trackzer_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.sessionId === this.sessionId) {
          this.events = data.events || [];
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted analytics events:', error);
    }
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Clear all events
  clearEvents() {
    this.events = [];
    localStorage.removeItem('trackzer_analytics');
  }
}

export const analytics = new AnalyticsService();