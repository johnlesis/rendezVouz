<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // If filtering by technician and date (for available slots)
        if ($request->has('technician_id') && $request->has('date')) {
            $appointments = Appointment::where('technician_id', $request->technician_id)
                ->whereDate('start_time', $request->date)
                ->where('status', '!=', 'cancelled')
                ->get()
                ->map(function ($apt) {
                    return [
                        'id' => $apt->id,
                        'service_id' => $apt->service_id,
                        'technician_id' => $apt->technician_id,
                        'start_time' => $apt->start_time->format('H:i'),
                        'end_time' => $apt->end_time->format('H:i'),
                    ];
                });

            return response()->json($appointments);
        }

        // Admin sees all appointments
        if ($user->is_admin) {
            $appointments = Appointment::with(['service', 'user'])
                ->orderBy('start_time', 'desc')
                ->get()
                ->map(function ($apt) {
                    return [
                        'id' => $apt->id,
                        'user' => $apt->user->name ?? 'Unknown',
                        'service' => $apt->service->name ?? 'Unknown',
                        'start_time' => $apt->start_time->format('H:i'),
                        'end_time' => $apt->end_time->format('H:i'),
                        'status' => $apt->status,
                    ];
                });

            return response()->json($appointments);
        }

        // Otherwise return user's appointments
        $appointments = Appointment::where('user_id', $user->id)
            ->with('service')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(function ($apt) {
                return [
                    'id' => $apt->id,
                    'service' => $apt->service->name ?? 'Unknown',
                    'technician_id' => $apt->technician_id,
                    'date' => $apt->start_time->format('Y-m-d'),
                    'start_time' => $apt->start_time->format('H:i'),
                    'end_time' => $apt->end_time->format('H:i'),
                    'status' => $apt->status,
                ];
            });

        return response()->json($appointments);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'technician_id' => 'required|exists:technicians,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
        ]);

        $user = $request->user();

        // Get service duration
        $service = Service::findOrFail($request->service_id);
        $durationMinutes = $service->duration;

        // Parse start and end timestamps
        $startTime = Carbon::parse($request->date . ' ' . $request->time, config('app.timezone'));
        $endTime = $startTime->copy()->addMinutes($durationMinutes);

        // Check for overlapping appointments
        $overlap = Appointment::where('technician_id', $request->technician_id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
                });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'message' => 'The selected time overlaps with another appointment.'
            ], 422);
        }

        // Save appointment
        $appointment = Appointment::create([
            'user_id' => $user->id,
            'service_id' => $request->service_id,
            'technician_id' => $request->technician_id,
            'scheduled_at' => $startTime, 
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
