<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nefeloma</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<div id="app">
  <router-view></router-view>
</div>

<!-- Include Components -->
<script src="/js/components/Login.js"></script>
<script src="/js/components/Register.js"></script>
<script src="/js/components/Dashboard.js"></script>
<script src="/js/components/AdminPanel.js"></script>

<script>
  // Axios default token
  const token = localStorage.getItem('token')
  if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  // Router
  const routes = [
    { path: '/', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
    { path: '/admin', component: AdminPanel }
  ]

  const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
  })

  // Navigation guard
  router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/register']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = !!localStorage.getItem('token')

    if(authRequired && !loggedIn) {
      return next('/')
    }

    // Check if admin trying to access dashboard or vice versa
    if (loggedIn && (to.path === '/admin' || to.path === '/dashboard')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      // Redirect admin to admin panel if trying to access dashboard
      if (to.path === '/dashboard' && user.is_admin) {
        return next('/admin')
      }

      // Redirect regular user to dashboard if trying to access admin
      if (to.path === '/admin' && !user.is_admin) {
        return next('/dashboard')
      }
    }

    next()
  })

  const app = Vue.createApp({})
  app.use(router)
  app.mount('#app')
</script>
</body>
</html>
