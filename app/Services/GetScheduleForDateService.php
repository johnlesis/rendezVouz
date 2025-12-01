<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\TechnicianSchedule;
use App\Models\WorkingHour;

class GetScheduleForDateService
{
    public function getScheduleForDate(int $technicianId, string $date)
    {
        // Priority 1: Check for specific date schedule (overrides)
        $schedule = TechnicianSchedule::where('technician_id', $technicianId)
            ->whereDate('date', $date)
            ->first();

        if ($schedule) {
            return [
                'date' => $date,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'is_available' => $schedule->is_available,
                'reason' => $schedule->reason,
            ];
        }

        // Priority 2: Check for recurring weekly working hours
        $dayOfWeek = Carbon::parse($date)->dayOfWeek; // 0=Sunday, 1=Monday, ..., 6=Saturday

        $workingHour = WorkingHour::where('technician_id', $technicianId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if ($workingHour) {
            return [
                'date' => $date,
                'start_time' => $workingHour->start_time,
                'end_time' => $workingHour->end_time,
                'is_available' => $workingHour->is_active,
                'reason' => $workingHour->is_active ? null : 'Ο τεχνικός δεν εργάζεται αυτή την ημέρα',
            ];
        }

        // Priority 3: Default hours if no schedule is set
        return [
            'date' => $date,
            'start_time' => '08:00:00',
            'end_time' => '20:00:00',
            'is_available' => true,
            'reason' => null,
        ];
    }
}
