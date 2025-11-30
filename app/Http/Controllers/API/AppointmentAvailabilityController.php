<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use App\Models\Appointment;
use App\Models\Service;
use App\Services\GetScheduleForDateService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentAvailabilityController extends Controller
{
    private GetScheduleForDateService $scheduleService;

    public function __construct(GetScheduleForDateService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Return valid available time slots for a given technician, service, and date.
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'date' => 'required|date',
            'service_id' => 'required|exists:services,id',
        ]);

        $technicianId = $request->technician_id;
        $date = $request->date;
        $service = Service::findOrFail($request->service_id);
        $durationMinutes = $service->duration;

        $schedule = $this->scheduleService->getScheduleForDate($technicianId, $date);

        if (!$schedule['is_available']) {
            return response()->json([
                'slots' => [],
                'message' => $schedule['reason'] ?? 'Technician not available'
            ]);
        }

        $startTime = Carbon::parse($date . ' ' . $schedule['start_time']);
        $endTime = Carbon::parse($date . ' ' . $schedule['end_time']);

        $appointments = Appointment::where('technician_id', $technicianId)
            ->whereDate('start_time', $date)
            ->where('status', '!=', 'cancelled')
            ->get(['start_time', 'end_time']);

        $bookedIntervals = $appointments->map(function ($apt) {
            return [
                'start' => Carbon::parse($apt->start_time)->diffInMinutes(Carbon::parse($apt->start_time)->startOfDay()),
                'end' => Carbon::parse($apt->end_time)->diffInMinutes(Carbon::parse($apt->end_time)->startOfDay()),
            ];
        });

        $slots = [];
        $current = $startTime->copy();

        while ($current->addMinutes(0)->lessThanOrEqualTo($endTime->copy()->subMinutes($durationMinutes))) {
            $slotStart = $current->diffInMinutes($current->copy()->startOfDay());
            $slotEnd = $slotStart + $durationMinutes;

            $overlaps = collect($bookedIntervals)->contains(function ($interval) use ($slotStart, $slotEnd) {
                return $slotStart < $interval['end'] && $slotEnd > $interval['start'];
            });

            if (!$overlaps) {
                $slots[] = $current->format('H:i');
            }

            $current->addMinutes($durationMinutes);
        }

        return response()->json([
            'slots' => $slots
        ]);
    }
}
