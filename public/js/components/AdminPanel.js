const AdminPanel = {
  template: `
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
      <div class="container mx-auto max-w-7xl">

        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold">Admin Panel</h2>
            <p class="text-gray-600 text-sm mt-1">Welcome, {{ userName }}</p>
          </div>
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2.5 text-base rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="flex border-b overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-base font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Dashboard Tab -->
        <div v-show="activeTab === 'dashboard'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Appointments</p>
                  <p class="text-3xl font-bold mt-2">{{ stats.totalAppointments }}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded-full">
                  <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Technicians</p>
                  <p class="text-3xl font-bold mt-2">{{ stats.totalTechnicians }}</p>
                </div>
                <div class="bg-green-100 p-3 rounded-full">
                  <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Active Services</p>
                  <p class="text-3xl font-bold mt-2">{{ stats.totalServices }}</p>
                </div>
                <div class="bg-purple-100 p-3 rounded-full">
                  <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Appointments -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">Recent Appointments</h3>

            <div v-if="loadingAppointments" class="text-center py-8">
              <p class="text-gray-500 text-base">Loading appointments...</p>
            </div>

            <div v-else-if="appointments.length === 0" class="text-center py-8">
              <p class="text-gray-500 text-base">No appointments found.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appointment in appointments.slice(0, 10)" :key="appointment.id" class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm">{{ appointment.user?.name || 'N/A' }}</td>
                    <td class="py-3 px-4 text-sm">{{ appointment.service?.name || 'N/A' }}</td>
                    <td class="py-3 px-4 text-sm">{{ formatDate(appointment.scheduled_at) }}</td>
                    <td class="py-3 px-4">
                      <span :class="getStatusClass(appointment.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                        {{ appointment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Technicians Tab -->
        <div v-show="activeTab === 'technicians'" class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Manage Technicians</h3>
            <button
              @click="showAddTechnicianForm = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Add Technician
            </button>
          </div>

          <!-- Add Technician Form -->
          <div v-if="showAddTechnicianForm" class="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 class="font-semibold mb-4">Add New Technician</h4>
            <form @submit.prevent="addTechnician" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="newTechnician.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input v-model="newTechnician.specialization" type="text" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea v-model="newTechnician.bio" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Save Technician
                </button>
                <button type="button" @click="cancelAddTechnician" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
            <p v-if="technicianError" class="mt-2 text-red-500 text-sm">{{ technicianError }}</p>
            <p v-if="technicianSuccess" class="mt-2 text-green-500 text-sm">{{ technicianSuccess }}</p>
          </div>

          <!-- Technicians List -->
          <div v-if="loadingTechnicians" class="text-center py-8">
            <p class="text-gray-500">Loading technicians...</p>
          </div>

          <div v-else-if="technicians.length === 0" class="text-center py-8">
            <p class="text-gray-500">No technicians found.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Specialization</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tech in technicians" :key="tech.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">{{ tech.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ tech.name }}</td>
                  <td class="py-3 px-4 text-sm">{{ tech.specialization || 'N/A' }}</td>
                  <td class="py-3 px-4">
                    <span :class="tech.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ tech.is_available ? 'Available' : 'Unavailable' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button @click="deleteTechnician(tech.id)" class="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Services Tab -->
        <div v-show="activeTab === 'services'" class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Manage Services</h3>
            <button
              @click="showAddServiceForm = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Add Service
            </button>
          </div>

          <!-- Add Service Form -->
          <div v-if="showAddServiceForm" class="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 class="font-semibold mb-4">Add New Service</h4>
            <form @submit.prevent="addService" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="newService.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input v-model="newService.price" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input v-model="newService.duration" type="number" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="newService.is_active" class="w-full px-3 py-2 border rounded-md">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="newService.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Save Service
                </button>
                <button type="button" @click="cancelAddService" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
            <p v-if="serviceError" class="mt-2 text-red-500 text-sm">{{ serviceError }}</p>
            <p v-if="serviceSuccess" class="mt-2 text-green-500 text-sm">{{ serviceSuccess }}</p>
          </div>

          <!-- Edit Service Form -->
          <div v-if="editingService" class="mb-6 p-4 border rounded-lg bg-blue-50">
            <h4 class="font-semibold mb-4">Edit Service</h4>
            <form @submit.prevent="updateService" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="editService.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input v-model="editService.price" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input v-model="editService.duration" type="number" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="editService.is_active" class="w-full px-3 py-2 border rounded-md">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="editService.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Update Service
                </button>
                <button type="button" @click="cancelEditService" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
            <p v-if="serviceError" class="mt-2 text-red-500 text-sm">{{ serviceError }}</p>
            <p v-if="serviceSuccess" class="mt-2 text-green-500 text-sm">{{ serviceSuccess }}</p>
          </div>

          <!-- Services List -->
          <div v-if="loadingServices" class="text-center py-8">
            <p class="text-gray-500">Loading services...</p>
          </div>

          <div v-else-if="services.length === 0" class="text-center py-8">
            <p class="text-gray-500">No services found.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services" :key="service.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">{{ service.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ service.name }}</td>
                  <td class="py-3 px-4 text-sm">\${{ service.price }}</td>
                  <td class="py-3 px-4 text-sm">{{ service.duration }} min</td>
                  <td class="py-3 px-4">
                    <span :class="service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ service.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button @click="startEditService(service)" class="text-blue-500 hover:text-blue-700 text-sm font-medium mr-3">
                      Edit
                    </button>
                    <button @click="deleteService(service.id)" class="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Calendar Tab -->
        <div v-show="activeTab === 'calendar'" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-6">Appointments Calendar</h3>

          <!-- Calendar Header -->
          <div class="flex justify-between items-center mb-4">
            <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h4 class="text-lg font-semibold">{{ currentMonthYear }}</h4>
            <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Calendar Grid -->
          <div class="border rounded-lg overflow-hidden">
            <!-- Day Headers -->
            <div class="grid grid-cols-7 bg-gray-100">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-center py-2 text-sm font-semibold text-gray-700 border-r last:border-r-0">
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                :class="[
                  'min-h-24 p-2 border-r border-b last:border-r-0',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'bg-blue-50' : ''
                ]"
              >
                <div :class="[
                  'text-sm font-medium mb-1',
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                ]">
                  {{ day.day }}
                </div>
                <div class="space-y-1">
                  <div
                    v-for="apt in getAppointmentsForDate(day.date)"
                    :key="apt.id"
                    class="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200"
                    :title="apt.service?.name + ' - ' + apt.user?.name"
                  >
                    {{ formatTime(apt.scheduled_at) }} - {{ apt.service?.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  data() {
    return {
      userName: '',
      activeTab: 'dashboard',
      tabs: [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'technicians', name: 'Technicians' },
        { id: 'services', name: 'Services' },
        { id: 'calendar', name: 'Calendar' }
      ],
      stats: {
        totalAppointments: 0,
        totalTechnicians: 0,
        totalServices: 0
      },
      appointments: [],
      loadingAppointments: false,
      technicians: [],
      loadingTechnicians: false,
      services: [],
      loadingServices: false,
      showAddTechnicianForm: false,
      showAddServiceForm: false,
      newTechnician: {
        name: '',
        specialization: '',
        bio: '',
        is_available: true
      },
      newService: {
        name: '',
        description: '',
        price: '',
        duration: '',
        is_active: true
      },
      editingService: null,
      editService: {
        id: null,
        name: '',
        description: '',
        price: '',
        duration: '',
        is_active: true
      },
      technicianError: '',
      technicianSuccess: '',
      serviceError: '',
      serviceSuccess: '',
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear()
    }
  },
  computed: {
    currentMonthYear() {
      const date = new Date(this.currentYear, this.currentMonth);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);

      const firstDayOfWeek = firstDay.getDay();
      const lastDate = lastDay.getDate();
      const prevLastDate = prevLastDay.getDate();

      const days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Previous month days
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevLastDate - i;
        const date = new Date(this.currentYear, this.currentMonth - 1, day);
        days.push({
          day,
          date: date.toISOString().split('T')[0],
          isCurrentMonth: false,
          isToday: false
        });
      }

      // Current month days
      for (let day = 1; day <= lastDate; day++) {
        const date = new Date(this.currentYear, this.currentMonth, day);
        const dateString = date.toISOString().split('T')[0];
        const isToday = date.getTime() === today.getTime();

        days.push({
          day,
          date: dateString,
          isCurrentMonth: true,
          isToday
        });
      }

      // Next month days to fill the grid
      const remainingDays = 42 - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, day);
        days.push({
          day,
          date: date.toISOString().split('T')[0],
          isCurrentMonth: false,
          isToday: false
        });
      }

      return days;
    }
  },
  mounted() {
    this.loadUserInfo();
    this.fetchStats();
    this.fetchAppointments();
    this.fetchTechnicians();
    this.fetchServices();
  },
  methods: {
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user.name || 'Admin';
    },
    fetchStats() {
      axios.get('/api/appointments')
        .then(res => {
          this.stats.totalAppointments = res.data.length;
        })
        .catch(err => console.error('Failed to fetch appointments:', err));

      axios.get('/api/technicians')
        .then(res => {
          this.stats.totalTechnicians = res.data.length;
        })
        .catch(err => console.error('Failed to fetch technicians:', err));

      axios.get('/api/services')
        .then(res => {
          this.stats.totalServices = res.data.length;
        })
        .catch(err => console.error('Failed to fetch services:', err));
    },
    fetchAppointments() {
      this.loadingAppointments = true;
      axios.get('/api/appointments')
        .then(res => {
          this.appointments = res.data;
          this.loadingAppointments = false;
        })
        .catch(err => {
          console.error('Failed to fetch appointments:', err);
          this.loadingAppointments = false;
        });
    },
    fetchTechnicians() {
      this.loadingTechnicians = true;
      axios.get('/api/technicians')
        .then(res => {
          this.technicians = res.data;
          this.loadingTechnicians = false;
        })
        .catch(err => {
          console.error('Failed to fetch technicians:', err);
          this.loadingTechnicians = false;
        });
    },
    fetchServices() {
      this.loadingServices = true;
      axios.get('/api/services')
        .then(res => {
          this.services = res.data;
          this.loadingServices = false;
        })
        .catch(err => {
          console.error('Failed to fetch services:', err);
          this.loadingServices = false;
        });
    },
    addTechnician() {
      this.technicianError = '';
      this.technicianSuccess = '';

      axios.post('/api/technicians', this.newTechnician)
        .then(() => {
          this.technicianSuccess = 'Technician added successfully!';
          this.fetchTechnicians();
          this.fetchStats();
          this.newTechnician = { name: '', specialization: '', bio: '', is_available: true };
          setTimeout(() => {
            this.showAddTechnicianForm = false;
            this.technicianSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.technicianError = err.response?.data?.message || 'Failed to add technician';
        });
    },
    deleteTechnician(id) {
      if (!confirm('Are you sure you want to delete this technician?')) return;

      axios.delete(`/api/technicians/${id}`)
        .then(() => {
          this.fetchTechnicians();
          this.fetchStats();
        })
        .catch(err => {
          alert(err.response?.data?.message || 'Failed to delete technician');
        });
    },
    cancelAddTechnician() {
      this.showAddTechnicianForm = false;
      this.newTechnician = { name: '', specialization: '', bio: '', is_available: true };
      this.technicianError = '';
      this.technicianSuccess = '';
    },
    addService() {
      this.serviceError = '';
      this.serviceSuccess = '';

      axios.post('/api/services', this.newService)
        .then(() => {
          this.serviceSuccess = 'Service added successfully!';
          this.fetchServices();
          this.fetchStats();
          this.newService = { name: '', description: '', price: '', duration: '', is_active: true };
          setTimeout(() => {
            this.showAddServiceForm = false;
            this.serviceSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.serviceError = err.response?.data?.message || 'Failed to add service';
        });
    },
    deleteService(id) {
      if (!confirm('Are you sure you want to delete this service?')) return;

      axios.delete(`/api/services/${id}`)
        .then(() => {
          this.fetchServices();
          this.fetchStats();
        })
        .catch(err => {
          alert(err.response?.data?.message || 'Failed to delete service');
        });
    },
    cancelAddService() {
      this.showAddServiceForm = false;
      this.newService = { name: '', description: '', price: '', duration: '', is_active: true };
      this.serviceError = '';
      this.serviceSuccess = '';
    },
    startEditService(service) {
      this.editingService = service.id;
      this.editService = {
        id: service.id,
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration: service.duration,
        is_active: service.is_active
      };
      this.showAddServiceForm = false;
      this.serviceError = '';
      this.serviceSuccess = '';
    },
    updateService() {
      this.serviceError = '';
      this.serviceSuccess = '';

      axios.put(`/api/services/${this.editService.id}`, this.editService)
        .then(() => {
          this.serviceSuccess = 'Service updated successfully!';
          this.fetchServices();
          this.fetchStats();
          setTimeout(() => {
            this.editingService = null;
            this.editService = { id: null, name: '', description: '', price: '', duration: '', is_active: true };
            this.serviceSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.serviceError = err.response?.data?.message || 'Failed to update service';
        });
    },
    cancelEditService() {
      this.editingService = null;
      this.editService = { id: null, name: '', description: '', price: '', duration: '', is_active: true };
      this.serviceError = '';
      this.serviceSuccess = '';
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    getAppointmentsForDate(date) {
      return this.appointments.filter(apt => {
        const aptDate = new Date(apt.scheduled_at).toISOString().split('T')[0];
        return aptDate === date;
      });
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getStatusClass(status) {
      const statusClasses = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    }
  }
};
