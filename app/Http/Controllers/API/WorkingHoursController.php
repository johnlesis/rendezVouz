<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TechnicianSchedule;
use App\Models\WorkingHour;
use Illuminate\Http\Request;
use App\Services\GetScheduleForDateService;
use Illuminate\Support\Carbon;

class WorkingHoursController extends Controller
{
    private GetScheduleForDateService $scheduleService;

    public function __construct(GetScheduleForDateService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'date' => 'required|date',
        ]);

        $schedule = $this->scheduleService->getScheduleForDate(
            $request->technician_id,
            $request->date
        );

        return response()->json($schedule);
    }

    public function create(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'required|boolean',
            'reason' => 'nullable|string',
        ]);

        $start = Carbon::parse($request->start_date);
        $end   = Carbon::parse($request->end_date);

        $days = [];

        while ($start->lte($end)) {
            $days[] = [
                'technician_id' => $request->technician_id,
                'date'          => $start->toDateString(),
                'start_time'    => $request->start_time,
                'end_time'      => $request->end_time,
                'is_available'  => $request->is_available,
                'reason'        => $request->reason,
                'created_at'    => now(),
                'updated_at'    => now(),
            ];

            $start->addDay();
        }

        TechnicianSchedule::insert($days);

        return response()->json([
            'message' => 'Schedule created for multiple days.',
            'count'   => count($days),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function edit(Request $request, string $id = null)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'required|boolean',
            'reason' => 'nullable|string',
        ]);

        $start = Carbon::parse($request->start_date);
        $end   = Carbon::parse($request->end_date);

        while ($start->lte($end)) {

            TechnicianSchedule::updateOrCreate(
                [
                    'technician_id' => $request->technician_id,
                    'date'          => $start->toDateString(),
                ],
                [
                    'start_time'   => $request->start_time,
                    'end_time'     => $request->end_time,
                    'is_available' => $request->is_available,
                    'reason'       => $request->reason,
                ]
            );

            $start->addDay();
        }

        return response()->json([
            'message' => 'Schedules updated for the selected date range.'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get weekly working hours for a technician
     */
    public function getWeeklyHours(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
        ]);

        $workingHours = WorkingHour::where('technician_id', $request->technician_id)
            ->orderBy('day_of_week')
            ->get();

        return response()->json([
            'working_hours' => $workingHours,
        ]);
    }

    /**
     * Set/Update weekly working hours for a technician
     */
    public function setWeeklyHours(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'working_hours' => 'required|array',
            'working_hours.*.day_of_week' => 'required|integer|between:0,6',
            'working_hours.*.start_time' => 'required|date_format:H:i',
            'working_hours.*.end_time' => 'required|date_format:H:i|after:working_hours.*.start_time',
            'working_hours.*.is_active' => 'required|boolean',
        ]);

        foreach ($request->working_hours as $workingHour) {
            WorkingHour::updateOrCreate(
                [
                    'technician_id' => $request->technician_id,
                    'day_of_week' => $workingHour['day_of_week'],
                ],
                [
                    'start_time' => $workingHour['start_time'],
                    'end_time' => $workingHour['end_time'],
                    'is_active' => $workingHour['is_active'],
                ]
            );
        }

        return response()->json([
            'message' => 'Working hours updated successfully.',
        ]);
    }

    /**
     * Delete weekly working hours for a technician
     */
    public function deleteWeeklyHours(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
        ]);

        WorkingHour::where('technician_id', $request->technician_id)->delete();

        return response()->json([
            'message' => 'Working hours deleted successfully.',
        ]);
    }

    /**
     * Get all blocked dates for a technician
     */
    public function getBlockedDates(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
        ]);

        $blockedDates = TechnicianSchedule::where('technician_id', $request->technician_id)
            ->where('is_available', false)
            ->orderBy('date')
            ->get();

        return response()->json([
            'blocked_dates' => $blockedDates,
        ]);
    }

    /**
     * Delete blocked dates in a range
     */
    public function destroyDateRange(Request $request)
    {
        $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        TechnicianSchedule::where('technician_id', $request->technician_id)
            ->whereBetween('date', [$request->start_date, $request->end_date])
            ->delete();

        return response()->json([
            'message' => 'Blocked dates deleted successfully.',
        ]);
    }
}
