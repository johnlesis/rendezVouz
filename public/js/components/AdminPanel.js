const AdminPanel = {
  template: `
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
      <div class="container mx-auto max-w-7xl">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">Πίνακας Διαχείρισης</h2>
            <p class="text-gray-600 text-sm mt-1">Καλώς ήρθατε, {{ userName }}</p>
          </div>
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            Αποσύνδεση
          </button>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
          <div class="flex border-b overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap transition-colors flex-shrink-0',
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
                  <p class="text-gray-500 text-sm">Συνολικά Ραντεβού</p>
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
                  <p class="text-gray-500 text-sm">Συνολικοί Τεχνικοί</p>
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
                  <p class="text-gray-500 text-sm">Ενεργές Υπηρεσίες</p>
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
          <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 class="text-lg sm:text-xl font-bold mb-4">Πρόσφατα Ραντεβού</h3>

            <div v-if="loadingAppointments" class="text-center py-6 sm:py-8">
              <p class="text-gray-500 text-sm sm:text-base">Φόρτωση ραντεβού...</p>
            </div>

            <div v-else-if="appointments.length === 0" class="text-center py-6 sm:py-8">
              <p class="text-gray-500 text-sm sm:text-base">Δεν βρέθηκαν ραντεβού.</p>
            </div>

            <div v-else class="overflow-x-auto -mx-4 sm:mx-0">
              <table class="w-full min-w-full">
                <thead class="hidden sm:table-header-group">
                  <tr class="border-b">
                    <th class="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Πελάτης</th>
                    <th class="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Υπηρεσία</th>
                    <th class="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Ημερομηνία & Ώρα</th>
                    <th class="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Κατάσταση</th>
                    <th class="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appointment in appointments.slice(0, 10)" :key="appointment.id" class="border-b hover:bg-gray-50 flex flex-col sm:table-row py-3 sm:py-0">
                    <td class="py-1 sm:py-3 px-4 text-xs sm:text-sm">
                      <span class="sm:hidden font-semibold text-gray-600">Πελάτης: </span>
                      {{ appointment.user?.name || 'N/A' }}
                    </td>
                    <td class="py-1 sm:py-3 px-4 text-xs sm:text-sm">
                      <span class="sm:hidden font-semibold text-gray-600">Υπηρεσία: </span>
                      {{ appointment.service?.name || 'N/A' }}
                    </td>
                    <td class="py-1 sm:py-3 px-4 text-xs sm:text-sm">
                      <span class="sm:hidden font-semibold text-gray-600">Ημερομηνία & Ώρα: </span>
                      {{ formatDate(appointment.scheduled_at) }}
                    </td>
                    <td class="py-1 sm:py-3 px-4">
                      <span class="sm:hidden font-semibold text-gray-600">Κατάσταση: </span>
                      <span :class="getStatusClass(appointment.status)" class="px-2 py-1 rounded-full text-xs font-semibold inline-block">
                        {{ appointment.status }}
                      </span>
                    </td>
                    <td class="py-1 sm:py-3 px-4">
                      <button
                        @click="deleteAppointment(appointment.id)"
                        class="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors"
                      >
                        Διαγραφή
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Book Appointment Tab -->
        <div v-show="activeTab === 'book'" class="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
          <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Κλείσιμο Ραντεβού για Πελάτη</h3>

          <form @submit.prevent="bookAppointmentForClient" class="space-y-4 sm:space-y-6">
            <!-- Client Selection -->
            <div>
              <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">1. Επιλέξτε Πελάτη</label>
              <select v-model="bookingForm.user_id" @change="resetBookingSelection" class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option disabled value="">-- Επιλέξτε πελάτη --</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
            </div>

            <!-- Service Selection -->
            <div v-if="bookingForm.user_id">
              <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">2. Επιλέξτε Υπηρεσία</label>
              <select v-model="bookingForm.service_id" @change="resetTechnicianAndDateTime" class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option disabled value="">-- Επιλέξτε μια υπηρεσία --</option>
                <option v-for="service in services" :key="service.id" :value="service.id">
                  {{ service.name }} - {{ service.price }} - {{ service.duration }} λεπτά
                </option>
              </select>
            </div>

            <!-- Technician Selection -->
            <div v-if="bookingForm.service_id">
              <label class="block text-sm sm:text-base font-medium text-gray-700 mb-2">3. Επιλέξτε Τεχνικό</label>
              <select v-model="bookingForm.technician_id" @change="resetDateTime" class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required>
                <option disabled value="">-- Επιλέξτε έναν τεχνικό --</option>
                <option v-for="technician in technicians" :key="technician.id" :value="technician.id">
                  {{ technician.name }}
                </option>
              </select>
            </div>

            <!-- Date Selection with Calendar -->
            <div v-if="bookingForm.technician_id">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base font-medium">4. Επιλέξτε Ημερομηνία</label>
              <div class="border rounded-lg p-2 sm:p-4 bg-gray-50">
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                  <button @click="previousBookingMonth" type="button" class="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors text-lg sm:text-xl">&lt;</button>
                  <h4 class="text-sm sm:text-base md:text-lg font-semibold">{{ bookingMonthYear }}</h4>
                  <button @click="nextBookingMonth" type="button" class="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors text-lg sm:text-xl">&gt;</button>
                </div>

                <div class="grid grid-cols-7 gap-1 text-center">
                  <div v-for="day in ['Δε','Τρ','Τε','Πε','Πα','Σα','Κυ']" :key="day" class="text-xs font-semibold text-gray-600 py-2">{{ day }}</div>
                  <div v-for="day in bookingCalendarDays" :key="day.date" @click="selectBookingDate(day)" type="button"
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
              <div v-if="bookingForm.date" class="mt-2 text-sm text-gray-600">
                Επιλέχθηκε: <span class="font-semibold">{{ formatBookingSelectedDate }}</span>
              </div>
            </div>

            <!-- Time Slot Selection -->
            <div v-if="bookingForm.date">
              <label class="block text-gray-700 mb-2 text-sm sm:text-base font-medium">5. Επιλέξτε Ώρα</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <button
                  v-for="slot in generateBookingSlotGrid()"
                  :key="slot.time"
                  @click="selectBookingSlot(slot)"
                  type="button"
                  :disabled="slot.isBooked"
                  :class="[
                    'px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm transition-colors',
                    bookingForm.time === slot.time ? 'bg-green-500 text-white border-green-500' : 'bg-white hover:bg-green-50 hover:border-green-400',
                    slot.isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : ''
                  ]">
                  {{ slot.time }}
                </button>
              </div>
            </div>

            <!-- Booking Summary -->
            <div v-if="canBookForClient" class="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 class="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Σύνοψη Κράτησης</h4>
              <div class="text-xs sm:text-sm text-blue-800 space-y-1">
                <p><span class="font-medium">Πελάτης:</span> {{ getSelectedUserName() }}</p>
                <p><span class="font-medium">Υπηρεσία:</span> {{ getSelectedServiceName() }}</p>
                <p><span class="font-medium">Τεχνικός:</span> {{ getSelectedTechnicianName() }}</p>
                <p><span class="font-medium">Ημερομηνία:</span> {{ formatBookingSelectedDate }}</p>
                <p><span class="font-medium">Ώρα:</span> {{ bookingForm.time }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!canBookForClient"
              :class="['w-full px-4 py-3 text-sm sm:text-base rounded-md transition-colors font-medium', canBookForClient ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
            >
              Κλείσιμο Ραντεβού
            </button>

            <p v-if="bookingError" class="text-red-500 text-xs sm:text-sm">{{ bookingError }}</p>
            <p v-if="bookingSuccess" class="text-green-500 text-xs sm:text-sm">{{ bookingSuccess }}</p>
          </form>
        </div>

        <!-- Technicians Tab -->
        <div v-show="activeTab === 'technicians'" class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Διαχείριση Τεχνικών</h3>
            <button
              @click="showAddTechnicianForm = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Προσθήκη Τεχνικού
            </button>
          </div>

          <!-- Add Technician Form -->
          <div v-if="showAddTechnicianForm" class="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 class="font-semibold mb-4">Προσθήκη Νέου Τεχνικού</h4>
            <form @submit.prevent="addTechnician" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Όνομα</label>
                <input v-model="newTechnician.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ειδίκευση</label>
                <input v-model="newTechnician.specialization" type="text" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Βιογραφικό</label>
                <textarea v-model="newTechnician.bio" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Αποθήκευση Τεχνικού
                </button>
                <button type="button" @click="cancelAddTechnician" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Ακύρωση
                </button>
              </div>
            </form>
            <p v-if="technicianError" class="mt-2 text-red-500 text-sm">{{ technicianError }}</p>
            <p v-if="technicianSuccess" class="mt-2 text-green-500 text-sm">{{ technicianSuccess }}</p>
          </div>

          <!-- Technicians List -->
          <div v-if="loadingTechnicians" class="text-center py-8">
            <p class="text-gray-500">Φόρτωση τεχνικών...</p>
          </div>

          <div v-else-if="technicians.length === 0" class="text-center py-8">
            <p class="text-gray-500">Δεν βρέθηκαν τεχνικοί.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Όνομα</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ειδίκευση</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Κατάσταση</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tech in technicians" :key="tech.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">{{ tech.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ tech.name }}</td>
                  <td class="py-3 px-4 text-sm">{{ tech.specialization || 'N/A' }}</td>
                  <td class="py-3 px-4">
                    <span :class="tech.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ tech.is_available ? 'Διαθέσιμος' : 'Μη διαθέσιμος' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button @click="deleteTechnician(tech.id)" class="text-red-500 hover:text-red-700 text-sm font-medium">
                      Διαγραφή
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
            <h3 class="text-xl font-bold">Διαχείριση Υπηρεσιών</h3>
            <button
              @click="showAddServiceForm = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Προσθήκη Υπηρεσίας
            </button>
          </div>

          <!-- Add Service Form -->
          <div v-if="showAddServiceForm" class="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 class="font-semibold mb-4">Προσθήκη Νέας Υπηρεσίας</h4>
            <form @submit.prevent="addService" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Όνομα</label>
                <input v-model="newService.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Τιμή ($)</label>
                <input v-model="newService.price" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Διάρκεια (λεπτά)</label>
                <input v-model="newService.duration" type="number" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Κατάσταση</label>
                <select v-model="newService.is_active" class="w-full px-3 py-2 border rounded-md">
                  <option :value="true">Ενεργή</option>
                  <option :value="false">Ανενεργή</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                <textarea v-model="newService.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Αποθήκευση Υπηρεσίας
                </button>
                <button type="button" @click="cancelAddService" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Ακύρωση
                </button>
              </div>
            </form>
            <p v-if="serviceError" class="mt-2 text-red-500 text-sm">{{ serviceError }}</p>
            <p v-if="serviceSuccess" class="mt-2 text-green-500 text-sm">{{ serviceSuccess }}</p>
          </div>

          <!-- Edit Service Form -->
          <div v-if="editingService" class="mb-6 p-4 border rounded-lg bg-blue-50">
            <h4 class="font-semibold mb-4">Επεξεργασία Υπηρεσίας</h4>
            <form @submit.prevent="updateService" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Όνομα</label>
                <input v-model="editService.name" type="text" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Τιμή ($)</label>
                <input v-model="editService.price" type="number" step="0.01" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Διάρκεια (λεπτά)</label>
                <input v-model="editService.duration" type="number" required class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Κατάσταση</label>
                <select v-model="editService.is_active" class="w-full px-3 py-2 border rounded-md">
                  <option :value="true">Ενεργή</option>
                  <option :value="false">Ανενεργή</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                <textarea v-model="editService.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div class="md:col-span-2 flex gap-2">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Ενημέρωση Υπηρεσίας
                </button>
                <button type="button" @click="cancelEditService" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Ακύρωση
                </button>
              </div>
            </form>
            <p v-if="serviceError" class="mt-2 text-red-500 text-sm">{{ serviceError }}</p>
            <p v-if="serviceSuccess" class="mt-2 text-green-500 text-sm">{{ serviceSuccess }}</p>
          </div>

          <!-- Services List -->
          <div v-if="loadingServices" class="text-center py-8">
            <p class="text-gray-500">Φόρτωση υπηρεσιών...</p>
          </div>

          <div v-else-if="services.length === 0" class="text-center py-8">
            <p class="text-gray-500">Δεν βρέθηκαν υπηρεσίες.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Όνομα</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Τιμή</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Διάρκεια</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Κατάσταση</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services" :key="service.id" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm">{{ service.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ service.name }}</td>
                  <td class="py-3 px-4 text-sm">\${{ service.price }}</td>
                  <td class="py-3 px-4 text-sm">{{ service.duration }} λεπτά</td>
                  <td class="py-3 px-4">
                    <span :class="service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ service.is_active ? 'Ενεργή' : 'Ανενεργή' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button @click="startEditService(service)" class="text-blue-500 hover:text-blue-700 text-sm font-medium mr-3">
                      Επεξεργασία
                    </button>
                    <button @click="deleteService(service.id)" class="text-red-500 hover:text-red-700 text-sm font-medium">
                      Διαγραφή
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Calendar Tab -->
        <div v-show="activeTab === 'calendar'" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-6">Ημερολόγιο Ραντεβού</h3>

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
              <div v-for="day in ['Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ', 'Κυρ']" :key="day" class="text-center py-2 text-sm font-semibold text-gray-700 border-r last:border-r-0">
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                :class="[
                  'min-h-24 p-2 border-r border-b last:border-r-0 relative',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'bg-blue-50' : '',
                  isDateBlocked(day.date) ? 'bg-red-50' : ''
                ]"
              >
                <div :class="[
                  'text-sm font-medium mb-1 flex items-center justify-between',
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                ]">
                  <span>{{ day.day }}</span>
                  <span v-if="isDateBlocked(day.date)" class="text-red-600 text-lg" title="Μη διαθέσιμη ημέρα">⊗</span>
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

        <!-- Working Hours Tab -->
        <div v-show="activeTab === 'working-hours'" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-6">Διαχείριση Ωραρίου Εργασίας Τεχνικών</h3>

          <!-- Technician Selection -->
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2">Επιλογή Τεχνικού</label>
            <select
              v-model="selectedTechnicianForHours"
              @change="loadWorkingHours"
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Επιλέξτε Τεχνικό --</option>
              <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                {{ tech.name }}
              </option>
            </select>
          </div>

          <!-- Working Hours Form -->
          <div v-if="selectedTechnicianForHours" class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p class="text-sm text-blue-800">
                Ορίστε το ωράριο εργασίας για κάθε ημέρα της εβδομάδας. Απενεργοποιήστε τις ημέρες που δεν εργάζεται ο τεχνικός.
              </p>
            </div>

            <div v-for="(day, index) in weekDays" :key="index" class="border rounded-lg p-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <!-- Day Name -->
                <div class="w-full sm:w-32">
                  <label class="font-medium text-gray-700">{{ day.name }}</label>
                </div>

                <!-- Active Toggle -->
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="workingHoursForm[index].is_active"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label class="ml-2 text-sm text-gray-600">Ενεργό</label>
                </div>

                <!-- Time Inputs -->
                <div class="flex-1 flex gap-4" v-if="workingHoursForm[index].is_active">
                  <div class="flex-1">
                    <label class="block text-xs text-gray-600 mb-1">Ώρα Έναρξης</label>
                    <input
                      type="text"
                      v-model="workingHoursForm[index].start_time"
                      placeholder="09:00"
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                      maxlength="5"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs text-gray-600 mb-1">Ώρα Λήξης</label>
                    <input
                      type="text"
                      v-model="workingHoursForm[index].end_time"
                      placeholder="17:00"
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                      maxlength="5"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex gap-4 pt-4">
              <button
                @click="saveWorkingHours"
                :disabled="savingWorkingHours"
                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ savingWorkingHours ? 'Αποθήκευση...' : 'Αποθήκευση Ωραρίου' }}
              </button>
              <button
                @click="resetWorkingHoursForm"
                class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Επαναφορά
              </button>
            </div>

          <!-- Blocked Dates Section -->
          <div v-if="selectedTechnicianForHours" class="mt-8 border-t pt-6">
            <h4 class="text-lg font-semibold mb-4">Αποκλεισμός Ημερομηνιών</h4>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p class="text-sm text-yellow-800">
                Επιλέξτε εύρος ημερομηνιών για να τις κάνετε μη διαθέσιμες για ραντεβού (π.χ. άδεια, αργία).
              </p>
            </div>

            <!-- Block Dates Form -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Από Ημερομηνία</label>
                <input
                  type="date"
                  v-model="blockDatesForm.start_date"
                  :min="today"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Έως Ημερομηνία</label>
                <input
                  type="date"
                  v-model="blockDatesForm.end_date"
                  :min="blockDatesForm.start_date || today"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex items-end">
                <button
                  @click="blockDates"
                  :disabled="!canBlockDates || blockingDates"
                  class="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ blockingDates ? 'Αποκλεισμός...' : 'Αποκλεισμός Ημερομηνιών' }}
                </button>
              </div>
            </div>

            <!-- List of Blocked Date Ranges -->
            <div v-if="blockedDateRanges.length > 0" class="space-y-2">
              <h5 class="font-medium text-gray-700 mb-3">Αποκλεισμένες Ημερομηνίες</h5>
              <div
                v-for="(range, index) in blockedDateRanges"
                :key="index"
                class="flex items-center justify-between bg-red-50 border border-red-200 rounded-md p-3"
              >
                <div>
                  <span class="font-medium">{{ formatDateRange(range.start, range.end) }}</span>
                  <span class="text-sm text-gray-600 ml-2">({{ range.count }} {{ range.count === 1 ? 'ημέρα' : 'ημέρες' }})</span>
                </div>
                <button
                  @click="removeBlockedRange(range)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div v-else class="text-center py-4 text-gray-500">
              Δεν υπάρχουν αποκλεισμένες ημερομηνίες για αυτόν τον τεχνικό.
            </div>
          </div>
          </div>

          <!-- No Technician Selected -->
          <div v-else class="text-center py-8 text-gray-500">
            Παρακαλώ επιλέξτε έναν τεχνικό για να διαχειριστείτε το ωράριο εργασίας του.
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
        { id: 'dashboard', name: 'Πίνακας Ελέγχου' },
        { id: 'book', name: 'Κλείσιμο Ραντεβού' },
        { id: 'technicians', name: 'Τεχνικοί' },
        { id: 'services', name: 'Υπηρεσίες' },
        { id: 'calendar', name: 'Ημερολόγιο' },
        { id: 'working-hours', name: 'Ωράριο Εργασίας' }
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
      users: [],
      bookingForm: {
        user_id: '',
        service_id: '',
        technician_id: '',
        date: '',
        time: ''
      },
      bookingError: '',
      bookingSuccess: '',
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
      currentYear: new Date().getFullYear(),
      bookingMonth: new Date().getMonth(),
      bookingYear: new Date().getFullYear(),
      bookingTechnicianSchedule: null,
      selectedTechnicianForHours: '',
      workingHoursForm: [
        { day_of_week: 0, start_time: '09:00', end_time: '17:00', is_active: false },
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 6, start_time: '09:00', end_time: '17:00', is_active: false }
      ],
      weekDays: [
        { name: 'Κυριακή', value: 0 },
        { name: 'Δευτέρα', value: 1 },
        { name: 'Τρίτη', value: 2 },
        { name: 'Τετάρτη', value: 3 },
        { name: 'Πέμπτη', value: 4 },
        { name: 'Παρασκευή', value: 5 },
        { name: 'Σάββατο', value: 6 }
      ],
      savingWorkingHours: false,
      blockDatesForm: {
        start_date: '',
        end_date: ''
      },
      blockedDates: [],
      blockingDates: false,
      allBlockedDates: []
    }
  },
  computed: {
    canBookForClient() {
      return this.bookingForm.user_id && this.bookingForm.service_id &&
             this.bookingForm.technician_id && this.bookingForm.date && this.bookingForm.time;
    },
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    bookingMonthYear() {
      const date = new Date(this.bookingYear, this.bookingMonth);
      return date.toLocaleDateString('el-GR', { month: 'long', year: 'numeric' });
    },
    bookingCalendarDays() {
      const firstDay = new Date(this.bookingYear, this.bookingMonth, 1);
      const lastDay = new Date(this.bookingYear, this.bookingMonth + 1, 0);
      const prevLastDay = new Date(this.bookingYear, this.bookingMonth, 0);
      const days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Convert getDay() (0=Sunday) to Monday-first (0=Monday, 6=Sunday)
      const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      // Previous month days
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevLastDay.getDate() - i;
        const date = new Date(this.bookingYear, this.bookingMonth - 1, day);
        days.push({ day, date: this.formatDateString(date), isCurrentMonth: false, isToday: false, isSelected: false });
      }

      // Current month days
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(this.bookingYear, this.bookingMonth, d);
        const dateString = this.formatDateString(date);
        const isToday = date.getTime() === today.getTime();
        const isSelected = this.bookingForm.date === dateString;
        days.push({ day: d, date: dateString, isCurrentMonth: true, isToday, isSelected });
      }

      // Next month days to fill calendar
      const remaining = 42 - days.length;
      for (let d = 1; d <= remaining; d++) {
        const date = new Date(this.bookingYear, this.bookingMonth + 1, d);
        days.push({ day: d, date: this.formatDateString(date), isCurrentMonth: false, isToday: false, isSelected: false });
      }

      return days;
    },
    formatBookingSelectedDate() {
      if (!this.bookingForm.date) return '';
      return new Date(this.bookingForm.date).toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    currentMonthYear() {
      const date = new Date(this.currentYear, this.currentMonth);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);

      // Convert getDay() (0=Sunday) to Monday-first (0=Monday, 6=Sunday)
      const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
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
          date: this.formatDateString(date),
          isCurrentMonth: false,
          isToday: false
        });
      }

      // Current month days
      for (let day = 1; day <= lastDate; day++) {
        const date = new Date(this.currentYear, this.currentMonth, day);
        const dateString = this.formatDateString(date);
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
          date: this.formatDateString(date),
          isCurrentMonth: false,
          isToday: false
        });
      }

      return days;
    },
    today() {
      return new Date().toISOString().split('T')[0];
    },
    canBlockDates() {
      return this.selectedTechnicianForHours &&
             this.blockDatesForm.start_date &&
             this.blockDatesForm.end_date;
    },
    blockedDateRanges() {
      if (this.blockedDates.length === 0) return [];

      // Group consecutive dates into ranges
      const sorted = [...this.blockedDates].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      );

      const ranges = [];
      let currentRange = { start: sorted[0].date, end: sorted[0].date, count: 1 };

      for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i - 1].date);
        const currDate = new Date(sorted[i].date);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          // Consecutive day - extend range
          currentRange.end = sorted[i].date;
          currentRange.count++;
        } else {
          // Gap found - start new range
          ranges.push(currentRange);
          currentRange = { start: sorted[i].date, end: sorted[i].date, count: 1 };
        }
      }
      ranges.push(currentRange);

      return ranges;
    }
  },
  mounted() {
    this.loadUserInfo();
    this.fetchStats();
    this.fetchAppointments();
    this.fetchTechnicians();
    this.fetchServices();
    this.fetchUsers();
  },
  methods: {
    formatDateString(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
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
          this.technicianSuccess = 'Ο τεχνικός προστέθηκε με επιτυχία!';
          this.fetchTechnicians();
          this.fetchStats();
          this.newTechnician = { name: '', specialization: '', bio: '', is_available: true };
          setTimeout(() => {
            this.showAddTechnicianForm = false;
            this.technicianSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.technicianError = err.response?.data?.message || 'Αποτυχία προσθήκης τεχνικού';
        });
    },
    deleteTechnician(id) {
      if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον τεχνικό;')) return;

      axios.delete(`/api/technicians/${id}`)
        .then(() => {
          this.fetchTechnicians();
          this.fetchStats();
        })
        .catch(err => {
          alert(err.response?.data?.message || 'Αποτυχία διαγραφής τεχνικού');
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
          this.serviceSuccess = 'Η υπηρεσία προστέθηκε με επιτυχία!';
          this.fetchServices();
          this.fetchStats();
          this.newService = { name: '', description: '', price: '', duration: '', is_active: true };
          setTimeout(() => {
            this.showAddServiceForm = false;
            this.serviceSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.serviceError = err.response?.data?.message || 'Αποτυχία προσθήκης υπηρεσίας';
        });
    },
    deleteService(id) {
      if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την υπηρεσία;')) return;

      axios.delete(`/api/services/${id}`)
        .then(() => {
          this.fetchServices();
          this.fetchStats();
        })
        .catch(err => {
          alert(err.response?.data?.message || 'Αποτυχία διαγραφής υπηρεσίας');
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
          this.serviceSuccess = 'Η υπηρεσία ενημερώθηκε με επιτυχία!';
          this.fetchServices();
          this.fetchStats();
          setTimeout(() => {
            this.editingService = null;
            this.editService = { id: null, name: '', description: '', price: '', duration: '', is_active: true };
            this.serviceSuccess = '';
          }, 2000);
        })
        .catch(err => {
          this.serviceError = err.response?.data?.message || 'Αποτυχία ενημέρωσης υπηρεσίας';
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
        if (!apt.scheduled_at) return false; // ignore invalid entries
        const aptDateObj = new Date(apt.scheduled_at);
        if (isNaN(aptDateObj.getTime())) return false; // ignore invalid dates
        const aptDate = aptDateObj.toISOString().split('T')[0];
        return aptDate === date;
      });
    },
    isDateBlocked(date) {
      return this.allBlockedDates.some(blocked => blocked.date === date);
    },
    async fetchAllBlockedDates() {
      try {
        const token = localStorage.getItem('token');

        // Get all technicians
        const techsResponse = await axios.get('/api/technicians', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch blocked dates for all technicians in parallel
        const promises = techsResponse.data.map(tech =>
          axios.get('/api/technician-schedule/blocked', {
            params: { technician_id: tech.id },
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { blocked_dates: [] } }))
        );

        const results = await Promise.all(promises);

        // Flatten all blocked dates
        this.allBlockedDates = results.flatMap(r => r.data.blocked_dates);
      } catch (err) {
        console.error('Error fetching blocked dates:', err);
        this.allBlockedDates = [];
      }
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
    },
    fetchUsers() {
      axios.get('/api/users')
        .then(res => {
          this.users = res.data;
        })
        .catch(err => {
          console.error('Failed to fetch users:', err);
        });
    },
    bookAppointmentForClient() {
      this.bookingError = '';
      this.bookingSuccess = '';

      if (!this.canBookForClient) {
        this.bookingError = 'Παρακαλώ συμπληρώστε όλα τα πεδία';
        return;
      }

      const appointmentData = {
        user_id: this.bookingForm.user_id,
        service_id: this.bookingForm.service_id,
        technician_id: this.bookingForm.technician_id,
        date: this.bookingForm.date,
        time: this.bookingForm.time
      };

      axios.post('/api/admin/appointments', appointmentData)
        .then(() => {
          this.bookingSuccess = 'Το ραντεβού κλείστηκε με επιτυχία!';
          this.bookingError = '';
          this.bookingForm = {
            user_id: '',
            service_id: '',
            technician_id: '',
            date: '',
            time: ''
          };
          this.fetchAppointments();
          this.fetchStats();
          setTimeout(() => {
            this.bookingSuccess = '';
          }, 3000);
        })
        .catch(err => {
          this.bookingError = err.response?.data?.message || 'Αποτυχία κλεισίματος ραντεβού';
          this.bookingSuccess = '';
        });
    },
    resetBookingSelection() {
      this.bookingForm.service_id = '';
      this.bookingForm.technician_id = '';
      this.bookingForm.date = '';
      this.bookingForm.time = '';
      this.bookingTechnicianSchedule = null;
      const today = new Date();
      this.bookingMonth = today.getMonth();
      this.bookingYear = today.getFullYear();
    },
    resetTechnicianAndDateTime() {
      this.bookingForm.technician_id = '';
      this.bookingForm.date = '';
      this.bookingForm.time = '';
      this.bookingTechnicianSchedule = null;
    },
    resetDateTime() {
      this.bookingForm.date = '';
      this.bookingForm.time = '';
      this.bookingTechnicianSchedule = null;
    },
    getSelectedUserName() {
      const user = this.users.find(u => u.id == this.bookingForm.user_id);
      return user ? user.name : '';
    },
    getSelectedServiceName() {
      const service = this.services.find(s => s.id == this.bookingForm.service_id);
      return service ? service.name : '';
    },
    getSelectedTechnicianName() {
      const tech = this.technicians.find(t => t.id == this.bookingForm.technician_id);
      return tech ? tech.name : '';
    },
    timeStringToMinutes(str) {
      const [h, m] = str.split(':').map(Number);
      return h * 60 + m;
    },
    minutesToTimeString(mins) {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    },
    generateBookingSlotGrid() {
      if (!this.bookingForm.service_id || !this.bookingForm.technician_id || !this.bookingForm.date) return [];

      const service = this.services.find(s => s.id == this.bookingForm.service_id);
      if (!service) return [];

      // Use technician schedule or fallback to default
      const workingStart = this.bookingTechnicianSchedule?.start_time?.substring(0, 5) || "09:00";
      const workingEnd = this.bookingTechnicianSchedule?.end_time?.substring(0, 5) || "17:00";

      // Check if technician is available
      if (this.bookingTechnicianSchedule && !this.bookingTechnicianSchedule.is_available) {
        return [];
      }

      const duration = service.duration; // in minutes
      const slots = [];
      let currentTime = this.timeStringToMinutes(workingStart);
      const endTime = this.timeStringToMinutes(workingEnd);

      // Get appointments for selected technician and date
      const booked = this.appointments
        .filter(a => a.technician_id === this.bookingForm.technician_id && a.date === this.bookingForm.date)
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
    selectBookingDate(day) {
      if (!day.isCurrentMonth) return;
      this.bookingForm.date = day.date;
      this.bookingForm.time = '';
      this.fetchBookingTechnicianSchedule();
    },
    selectBookingSlot(slot) {
      if (!slot.isBooked) this.bookingForm.time = slot.time;
    },
    previousBookingMonth() {
      if (this.bookingMonth === 0) {
        this.bookingMonth = 11;
        this.bookingYear--;
      } else {
        this.bookingMonth--;
      }
    },
    nextBookingMonth() {
      if (this.bookingMonth === 11) {
        this.bookingMonth = 0;
        this.bookingYear++;
      } else {
        this.bookingMonth++;
      }
    },
    fetchBookingTechnicianSchedule() {
      if (!this.bookingForm.technician_id || !this.bookingForm.date) return;
      this.bookingError = '';
      axios.get('/api/technician-schedule', {
        params: {
          technician_id: this.bookingForm.technician_id,
          date: this.bookingForm.date
        }
      })
        .then(res => {
          this.bookingTechnicianSchedule = res.data;
        })
        .catch(err => {
          this.bookingError = err.response?.data?.message || 'Αποτυχία λήψης προγράμματος';
        });
    },
    deleteAppointment(id) {
      if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ραντεβού;')) return;

      axios.delete(`/api/appointments/${id}`)
        .then(() => {
          this.fetchAppointments();
          this.fetchStats();
        })
        .catch(err => {
          alert(err.response?.data?.message || 'Αποτυχία διαγραφής ραντεβού');
        });
    },

    // Working Hours Management
    async loadWorkingHours() {
      if (!this.selectedTechnicianForHours) {
        this.resetWorkingHoursForm();
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/working-hours', {
          params: { technician_id: this.selectedTechnicianForHours },
          headers: { Authorization: `Bearer ${token}` }
        });

        const workingHours = response.data.working_hours;

        // Reset form to defaults
        this.resetWorkingHoursForm();

        // Populate form with existing data
        if (workingHours && workingHours.length > 0) {
          workingHours.forEach(wh => {
            const index = wh.day_of_week;
            if (index >= 0 && index < 7) {
              this.workingHoursForm[index] = {
                day_of_week: wh.day_of_week,
                start_time: wh.start_time.substring(0, 5),
                end_time: wh.end_time.substring(0, 5),
                is_active: wh.is_active
              };
            }
          });
        }

        // Load blocked dates as well
        await this.loadBlockedDates();
      } catch (err) {
        console.error('Error loading working hours:', err);
        alert(err.response?.data?.message || 'Αποτυχία φόρτωσης ωραρίου');
      }
    },

    async saveWorkingHours() {
      if (!this.selectedTechnicianForHours) {
        alert('Παρακαλώ επιλέξτε τεχνικό');
        return;
      }

      // Time format validation regex (HH:MM in 24-hour format)
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      // Validate active days have valid times
      for (let i = 0; i < this.workingHoursForm.length; i++) {
        const day = this.workingHoursForm[i];
        if (day.is_active) {
          if (!day.start_time || !day.end_time) {
            alert(`Παρακαλώ ορίστε ώρες για ${this.weekDays[i].name}`);
            return;
          }
          // Validate time format
          if (!timePattern.test(day.start_time)) {
            alert(`Μη έγκυρη μορφή ώρας έναρξης για ${this.weekDays[i].name}. Χρησιμοποιήστε 24ωρη μορφή (π.χ. 09:00)`);
            return;
          }
          if (!timePattern.test(day.end_time)) {
            alert(`Μη έγκυρη μορφή ώρας λήξης για ${this.weekDays[i].name}. Χρησιμοποιήστε 24ωρη μορφή (π.χ. 17:00)`);
            return;
          }
          if (day.start_time >= day.end_time) {
            alert(`Η ώρα έναρξης πρέπει να είναι πριν την ώρα λήξης για ${this.weekDays[i].name}`);
            return;
          }
        }
      }

      this.savingWorkingHours = true;

      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/working-hours', {
          technician_id: this.selectedTechnicianForHours,
          working_hours: this.workingHoursForm
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Το ωράριο εργασίας αποθηκεύτηκε επιτυχώς!');
      } catch (err) {
        console.error('Error saving working hours:', err);
        alert(err.response?.data?.message || 'Αποτυχία αποθήκευσης ωραρίου');
      } finally {
        this.savingWorkingHours = false;
      }
    },

    resetWorkingHoursForm() {
      this.workingHoursForm = [
        { day_of_week: 0, start_time: '09:00', end_time: '17:00', is_active: false },
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_active: true },
        { day_of_week: 6, start_time: '09:00', end_time: '17:00', is_active: false }
      ];
    },

    // Blocked Dates Management
    async loadBlockedDates() {
      if (!this.selectedTechnicianForHours) {
        this.blockedDates = [];
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/technician-schedule/blocked', {
          params: { technician_id: this.selectedTechnicianForHours },
          headers: { Authorization: `Bearer ${token}` }
        });

        this.blockedDates = response.data.blocked_dates;
      } catch (err) {
        console.error('Error loading blocked dates:', err);
      }
    },

    async blockDates() {
      if (!this.canBlockDates) return;

      this.blockingDates = true;

      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/technician-schedule', {
          technician_id: this.selectedTechnicianForHours,
          start_date: this.blockDatesForm.start_date,
          end_date: this.blockDatesForm.end_date,
          start_time: '00:00',
          end_time: '23:59',
          is_available: false,
          reason: 'Μη διαθέσιμος'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Οι ημερομηνίες αποκλείστηκαν επιτυχώς!');

        // Reset form and reload
        this.blockDatesForm.start_date = '';
        this.blockDatesForm.end_date = '';
        await this.loadBlockedDates();
      } catch (err) {
        console.error('Error blocking dates:', err);
        alert(err.response?.data?.message || 'Αποτυχία αποκλεισμού ημερομηνιών');
      } finally {
        this.blockingDates = false;
      }
    },

    async removeBlockedRange(range) {
      if (!confirm(`Θέλετε να αφαιρέσετε τον αποκλεισμό για ${this.formatDateRange(range.start, range.end)};`)) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        await axios.delete('/api/technician-schedule/range', {
          params: {
            technician_id: this.selectedTechnicianForHours,
            start_date: range.start,
            end_date: range.end
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Ο αποκλεισμός αφαιρέθηκε επιτυχώς!');
        await this.loadBlockedDates();
      } catch (err) {
        console.error('Error removing blocked dates:', err);
        alert(err.response?.data?.message || 'Αποτυχία αφαίρεσης αποκλεισμού');
      }
    },

    formatDateRange(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const formatDate = (date) => date.toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (startDate === endDate) {
        return formatDate(start);
      }

      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  }
};
window.AdminPanel = AdminPanel


