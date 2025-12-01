const Dashboard = {
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="container mx-auto max-w-6xl">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Πίνακας Ελέγχου</h2>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
            Αποσύνδεση
          </button>
        </div>

        <!-- Book Appointment Section -->
        <div class="bg-white p-6 md:p-8 rounded-lg shadow-md mb-6">
          <h3 class="text-2xl font-bold mb-6">Κλείστε Ραντεβού</h3>

          <!-- Step 1: Service -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2 font-medium">1. Επιλέξτε Υπηρεσία</label>
            <select v-model="appointment.service_id" @change="resetSelection" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option disabled value="">-- Επιλέξτε μια υπηρεσία --</option>
              <option v-for="service in services" :key="service.id" :value="service.id">
                {{ service.name }} - {{ service.price }} - {{ service.duration }} λεπτά
              </option>
            </select>
          </div>

          <!-- Step 2: Technician -->
          <div class="mb-4" v-if="appointment.service_id">
            <label class="block text-gray-700 mb-2 font-medium">2. Επιλέξτε Τεχνικό</label>
            <select v-model="appointment.technician_id" @change="resetDayAndTime" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option disabled value="">-- Επιλέξτε έναν τεχνικό --</option>
              <option v-for="technician in technicians" :key="technician.id" :value="technician.id">
                {{ technician.name }}
              </option>
            </select>
          </div>

          <!-- Step 3: Date -->
          <div class="mb-4" v-if="appointment.technician_id">
            <label class="block text-gray-700 mb-2 font-medium">3. Επιλέξτε Ημερομηνία</label>
            <div class="border rounded-lg p-4 bg-gray-50">
              <div class="flex justify-between items-center mb-4">
                <button @click="previousMonth" class="p-2 hover:bg-gray-200 rounded-full transition-colors">&lt;</button>
                <h4 class="text-lg font-semibold">{{ currentMonthYear }}</h4>
                <button @click="nextMonth" class="p-2 hover:bg-gray-200 rounded-full transition-colors">&gt;</button>
              </div>

              <div class="grid grid-cols-7 gap-1 text-center">
                <div v-for="day in ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα']" :key="day" class="text-xs font-semibold text-gray-600 py-2">{{ day }}</div>
                <div v-for="day in calendarDays" :key="day.date" @click="selectDate(day)"
                  :class="[
                    'py-2 rounded cursor-pointer transition-colors',
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300',
                    day.isToday ? 'bg-blue-100 font-bold' : '',
                    day.isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200',
                    !day.isCurrentMonth ? 'cursor-not-allowed' : ''
                  ]">
                  {{ day.day }}
                </div>
              </div>
            </div>
            <div v-if="appointment.date" class="mt-2 text-sm text-gray-600">
              Επιλέχθηκε: <span class="font-semibold">{{ formatSelectedDate }}</span>
            </div>
          </div>

          <!-- Step 4: Available Hours -->
          <div v-if="appointment.date" class="mb-4">
            <label class="block text-gray-700 mb-2 font-medium">4. Επιλέξτε Ώρα</label>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            <button
              v-for="slot in generateSlotGrid()"
              :key="slot.time"
              @click="selectSlot(slot)"
              :disabled="slot.isBooked"
              :class="[
                'px-3 py-2 border rounded-md text-sm transition-colors',
                appointment.time === slot.time ? 'bg-green-500 text-white border-green-500' : 'bg-white hover:bg-green-50 hover:border-green-400',
                slot.isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : ''
              ]">
              {{ slot.time }}
            </button>
            </div>
          </div>


          <!-- Booking Summary -->
          <div v-if="canBook" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-900 mb-2">Σύνοψη Κράτησης</h4>
            <div class="text-sm text-blue-800 space-y-1">
              <p><span class="font-medium">Υπηρεσία:</span> {{ getServiceName(appointment.service_id) }}</p>
              <p><span class="font-medium">Τεχνικός:</span> {{ getTechnicianName(appointment.technician_id) }}</p>
              <p><span class="font-medium">Ημερομηνία:</span> {{ formatSelectedDate }}</p>
              <p><span class="font-medium">Ώρα:</span> {{ appointment.time }}</p>
            </div>
          </div>

          <button @click="bookAppointment"
            :class="['w-full px-4 py-2 rounded-md transition-colors', canBook ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
            :disabled="!canBook">
            Κλείστε Ραντεβού
          </button>

          <p v-if="appointmentError" class="mt-2 text-red-500 text-sm">{{ appointmentError }}</p>
          <p v-if="appointmentSuccess" class="mt-2 text-green-500 text-sm">{{ appointmentSuccess }}</p>
        </div>

        <!-- My Appointments -->
        <div class="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold mb-6">Τα Ραντεβού μου</h3>

          <div v-if="loadingAppointments" class="text-center py-8">
            <p class="text-gray-500">Φόρτωση ραντεβού...</p>
          </div>

          <div v-else-if="appointments.length === 0" class="text-center py-8">
            <p class="text-gray-500">Δεν βρέθηκαν ραντεβού.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="apt in appointments" :key="apt.id" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div class="flex-1">
                  <p class="font-semibold text-lg">{{ apt.service }}</p>
                  <p class="text-gray-600 text-sm mt-1">{{ apt.start_time }}</p>
                  <p class="text-sm text-gray-500 mt-1">Κατάσταση: <span class="font-medium">{{ apt.status }}</span></p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold self-start" :class="getStatusClass(apt.status)">
                  {{ apt.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      services: [],
      technicians: [],
      appointments: [],
      allBookedSlots: [],
      loadingAppointments: false,
      appointment: { service_id: '', technician_id: '', date: '', time: '' },
      availableHours: [],
      loadingHours: false,
      appointmentError: '',
      appointmentSuccess: '',
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      technicianSchedule: null,
    };
  },
  computed: {
    canBook() {
      return this.appointment.service_id && this.appointment.technician_id && this.appointment.date && this.appointment.time;
    },
    currentMonthYear() {
      return new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
      const days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Previous month days
      for (let i = firstDay.getDay() - 1; i >= 0; i--) {
        const day = prevLastDay.getDate() - i;
        const date = new Date(this.currentYear, this.currentMonth - 1, day);
        days.push({ day, date: date.toISOString().split('T')[0], isCurrentMonth: false, isToday: false, isSelected: false });
      }

      // Current month days
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(this.currentYear, this.currentMonth, d);
        const dateString = date.toISOString().split('T')[0];
        const isToday = date.getTime() === today.getTime();
        const isSelected = this.appointment.date === dateString;
        days.push({ day: d, date: dateString, isCurrentMonth: true, isToday, isSelected });
      }

      // Next month days to fill calendar
      const remaining = 42 - days.length;
      for (let d = 1; d <= remaining; d++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, d);
        days.push({ day: d, date: date.toISOString().split('T')[0], isCurrentMonth: false, isToday: false, isSelected: false });
      }

      return days;
    },
    formatSelectedDate() {
      if (!this.appointment.date) return '';
      return new Date(this.appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchServices();
    this.fetchTechnicians();
    this.fetchAppointments();
  },
  methods: {

  timeStringToMinutes(str) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  },
  // Convert minutes to "HH:MM"
  minutesToTimeString(mins) {
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  },
  // Generate the slot grid respecting booked appointments
  generateSlotGrid() {
    if (!this.appointment.service_id || !this.appointment.technician_id || !this.appointment.date) return [];

    const service = this.services.find(s => s.id == this.appointment.service_id);
    if (!service) return [];

    // Use technician schedule or fallback to default
    const workingStart = this.technicianSchedule?.start_time?.substring(0, 5) || "09:00";
    const workingEnd = this.technicianSchedule?.end_time?.substring(0, 5) || "17:00";

    // Check if technician is available
    if (this.technicianSchedule && !this.technicianSchedule.is_available) {
      return [];
    }

    const duration = service.duration; // in minutes
    const slots = [];
    let currentTime = this.timeStringToMinutes(workingStart);
    const endTime = this.timeStringToMinutes(workingEnd);

    // Use allBookedSlots instead of appointments to check all booked times
    const booked = this.allBookedSlots
      .map(a => ({
        start: this.timeStringToMinutes(a.start_time),
        end: this.timeStringToMinutes(a.end_time)
      }))
      .sort((a, b) => a.start - b.start);

    while (currentTime + duration <= endTime) {
      const slotEnd = currentTime + duration;

      // Check if this slot overlaps any booked appointment
      const overlappingAppointment = booked.find(b => currentTime < b.end && slotEnd > b.start);

      if (overlappingAppointment) {
        // This slot is booked - add it as unavailable
        slots.push({
          time: this.minutesToTimeString(currentTime),
          isBooked: true
        });
        // Jump to the end of this appointment and continue from there
        currentTime = overlappingAppointment.end;
      } else {
        // This slot is available
        slots.push({
          time: this.minutesToTimeString(currentTime),
          isBooked: false
        });
        // Move forward by the service duration
        currentTime += duration;
      }
    }

    return slots;
  },
  selectSlot(slot) {
    if (!slot.isBooked) this.appointment.time = slot.time;
  },
    previousMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } 
      else this.currentMonth--;
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } 
      else this.currentMonth++;
    },
    selectDate(day) {
      if (!day.isCurrentMonth) return;
      this.appointment.date = day.date;
      this.appointment.time = '';
      this.fetchTechnicianSchedule();
      this.fetchAllBookedSlots();
    },
    resetSelection() {
      this.appointment.technician_id = '';
      this.appointment.date = '';
      this.appointment.time = '';
      this.technicianSchedule = null;
      this.allBookedSlots = [];
      const today = new Date();
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
    },
    resetDayAndTime() {
      this.appointment.date = '';
      this.appointment.time = '';
      this.technicianSchedule = null;
      this.allBookedSlots = [];
    },
    fetchServices() {
      axios.get('/api/services')
        .then(res => { this.services = res.data; })
        .catch(() => { this.appointmentError = 'Αποτυχία φόρτωσης υπηρεσιών'; });
    },
    fetchTechnicians() {
      axios.get('/api/technicians')
        .then(res => { this.technicians = res.data; })
        .catch(() => { this.appointmentError = 'Αποτυχία φόρτωσης τεχνικών'; });
    },
    fetchAppointments() {
      this.loadingAppointments = true;
      axios.get('/api/appointments')
        .then(res => { this.appointments = res.data; this.loadingAppointments = false; })
        .catch(() => { this.loadingAppointments = false; });
    },
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/');
    },
    fetchTechnicianSchedule() {
      if (!this.appointment.technician_id || !this.appointment.date) return;
      this.appointmentError = '';
      axios.get('/api/technician-schedule', { params: { technician_id: this.appointment.technician_id, date: this.appointment.date } })
        .then(res => { this.technicianSchedule = res.data; })
        .catch(err => { this.appointmentError = err.response?.data?.message || 'Αποτυχία λήψης προγράμματος'; });
    },
    fetchAllBookedSlots() {
      if (!this.appointment.technician_id || !this.appointment.date) return;
      axios.get('/api/appointments', { params: { technician_id: this.appointment.technician_id, date: this.appointment.date } })
        .then(res => { this.allBookedSlots = res.data; })
        .catch(() => { this.allBookedSlots = []; });
    },
    bookAppointment() {
      if (!this.canBook) { this.appointmentError = 'Παρακαλώ συμπληρώστε όλα τα πεδία'; return; }
      axios.post('/api/appointments', this.appointment)
        .then(() => {
          this.appointmentSuccess = 'Το ραντεβού κλείστηκε με επιτυχία!';
          this.appointmentError = '';
          this.appointment = { service_id: '', technician_id: '', date: '', time: '' };
          this.technicianSchedule = null;
          const today = new Date();
          this.currentMonth = today.getMonth();
          this.currentYear = today.getFullYear();
          this.fetchAppointments();
        })
        .catch(err => { this.appointmentError = err.response?.data?.message || 'Αποτυχία κλεισίματος ραντεβού'; this.appointmentSuccess = ''; });
    },
    getServiceName(id) { return this.services.find(s => s.id == id)?.name || 'Άγνωστη Υπηρεσία'; },
    getTechnicianName(id) { return this.technicians.find(t => t.id === id)?.name || 'Άγνωστος Τεχνικός'; },
    getStatusClass(status) {
      return { 'pending': 'bg-yellow-100 text-yellow-800', 'confirmed': 'bg-green-100 text-green-800', 'completed': 'bg-blue-100 text-blue-800', 'cancelled': 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800';
    }
  }
};
