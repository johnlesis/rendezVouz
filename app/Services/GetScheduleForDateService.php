<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\TechnicianSchedule;

class GetScheduleForDateService
{
    public function getScheduleForDate(int $technicianId, string $date)
    {
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

        // Default hours
        return [
            'date' => $date,
            'start_time' => '08:00:00',
            'end_time' => '20:00:00',
            'is_available' => true,
            'reason' => null,
        ];
    }
}
