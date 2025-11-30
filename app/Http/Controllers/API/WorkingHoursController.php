<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TechnicianSchedule;
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
}
