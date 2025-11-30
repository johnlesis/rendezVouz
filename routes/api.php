<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\AppointmentAvailabilityController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\TechnicianController;
use App\Http\Controllers\API\WorkingHoursController;
use Illuminate\Support\Facades\Route;

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public endpoints


// Protected routes
Route::middleware('auth:sanctum')->group(function() {

    // Services
    Route::apiResource('services', ServiceController::class);

    // Appointments
    Route::apiResource('appointments', AppointmentController::class);

    // Technician Schedule
    Route::get('technician-schedule', [WorkingHoursController::class, 'index']);

    // Technicians
    Route::apiResource('technicians', TechnicianController::class);

    Route::get('/available-slots', [AppointmentAvailabilityController::class, 'getAvailableSlots']);

    Route::post('/logout', [AuthController::class, 'logout']);

});

