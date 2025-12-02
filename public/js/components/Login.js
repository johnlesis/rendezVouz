const Login = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div class="bg-white p-10 sm:p-12 md:p-16 rounded-3xl shadow-2xl w-full max-w-2xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 bg-blue-500 rounded-full mb-8">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-800">Καλώς Ήρθατε</h2>
          <p class="text-xl sm:text-2xl text-gray-600 mt-4">Συνδεθείτε στον λογαριασμό σας</p>
        </div>

        <form @submit.prevent="login" class="space-y-8">
          <div>
            <label class="block text-gray-700 mb-3 text-xl font-medium">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="email@example.com"
              class="w-full px-6 py-5 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-3 text-xl font-medium">Κωδικός</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-6 py-5 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-5 px-6 text-xl font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Σύνδεση
          </button>
        </form>

        <div class="mt-10 pt-10 border-t-2 border-gray-200">
          <p class="text-center text-lg text-gray-600">
            Δεν έχετε λογαριασμό;
            <button
              @click="$router.push('/register')"
              class="text-blue-500 hover:text-blue-600 font-semibold hover:underline ml-1 transition-colors text-xl"
            >
              Εγγραφή τώρα
            </button>
          </p>
        </div>

        <p v-if="error" class="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-red-500 bg-red-50 py-2 px-3 rounded-lg">
          {{ error }}
        </p>
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
        .catch(err => { this.error = err.response?.data?.message || 'Αποτυχία σύνδεσης' })
    }
  }
}

window.Login = Login

