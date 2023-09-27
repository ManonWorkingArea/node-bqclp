import fetch from 'node-fetch';

export default function analyticsMiddleware(router) {
  router.beforeEach(async (to, from, next) => {
    const url = 'https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/analytics/';
    const sessionId = getCookie('sessionId');
    const isNewSession = !sessionId;
    const sessionStart = isNewSession ? new Date().toISOString() : null;
    const userId = getCookie('userId') || generateUserId();
    const requestData = {
      data: {
        clientData: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezoneOffset: new Date().getTimezoneOffset(),
          hostname: window.location.hostname,
          userId
        },
        routerData: {
          path: to.path,
          name: to.name,
          params: to.params,
          query: to.query
        },
        sessionId,
        sessionStart
      }
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    if (response.ok) {
      const responseData = await response.json();
      setCookie('sessionId', responseData.sessionId);
      if (isNewSession) setCookie('sessionStart', sessionStart);
    } else console.error('Error:', response.status);
    next();
  });

  window.addEventListener('beforeunload', async () => {
    const exitPage = window.location.href;
    const sessionStart = getCookie('sessionStart');
    const returnClient = sessionStart ? (new Date().toISOString() - new Date(sessionStart)) / 1000 : null;
    const url = 'https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/analytics/';
    const sessionId = getCookie('sessionId');
    const userId = getCookie('userId') || generateUserId();
    const requestData = {
      data: {
        clientData: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezoneOffset: new Date().getTimezoneOffset(),
          hostname: window.location.hostname,
          userId
        },
        routerData: {
          path: window.location.pathname,
          query: window.location.search
        },
        sessionId,
        sessionStart,
        exitPage,
        returnClient
      }
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
  });

  function getCookie(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop();
  }

  function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  function generateUserId() {
    const userId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    setCookie('userId', userId);
    return userId;
  }
}
