const Login = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Email</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required
            />
          </div>
          
          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter your password" 
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">
          Don't have an account? 
          <button 
            @click="$router.push('/register')" 
            class="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>

        <p v-if="error" class="mt-3 text-center text-red-500">{{ error }}</p>
      </div>
    </div>
  `,
  data() {
    return { email: '', password: '', error: '' }
  },
  methods: {
    login() {
      axios.post('/api/login', { email: this.email, password: this.password })
        .then(res => {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

          // Redirect based on user role
          if (res.data.user.is_admin) {
            this.$router.push('/admin')
          } else {
            this.$router.push('/dashboard')
          }
        })
        .catch(err => { this.error = err.response?.data?.message || 'Login failed' })
    }
  }
}
