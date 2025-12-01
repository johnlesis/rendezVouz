const Register = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
        
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Name</label>
            <input 
              v-model="name" 
              type="text" 
              placeholder="Enter your name" 
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
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

          <div>
          <label class="block text-gray-700 mb-1">Confirm Password</label>
          <input 
            v-model="password_confirmation" 
            type="password" 
            placeholder="Confirm your password" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">
          Already have an account? 
          <button 
            @click="$router.push('/')" 
            class="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>

        <p v-if="error" class="mt-3 text-center text-red-500">{{ error }}</p>
      </div>
    </div>
  `,
  data() {
    return { name: '', email: '', password: '', error: '' }
  },
  methods: {
    register() {
      axios.post('/api/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      })
      .then(res => {
        this.$router.push('/Dashboard')
      })
      .catch(err => { 
        this.error = err.response?.data?.message || 'Registration failed'
      })
    }
  }
}
window.Register = Register
