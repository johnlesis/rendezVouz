<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\AppointmentAvailabilityController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\TechnicianController;
use App\Http\Controllers\API\UserController;
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

    // Admin appointments - book for client
    Route::post('admin/appointments', [AppointmentController::class, 'storeForClient']);

    // Users (admin only)
    Route::get('users', [UserController::class, 'index']);

    // Technician Schedule
    Route::get('technician-schedule', [WorkingHoursController::class, 'index']);

    // Weekly Working Hours
    Route::get('working-hours', [WorkingHoursController::class, 'getWeeklyHours']);
    Route::post('working-hours', [WorkingHoursController::class, 'setWeeklyHours']);
    Route::delete('working-hours', [WorkingHoursController::class, 'deleteWeeklyHours']);

    // Technician Schedule Management (specific dates)
    Route::get('technician-schedule/blocked', [WorkingHoursController::class, 'getBlockedDates']);
    Route::post('technician-schedule', [WorkingHoursController::class, 'create']);
    Route::put('technician-schedule', [WorkingHoursController::class, 'edit']);
    Route::delete('technician-schedule/range', [WorkingHoursController::class, 'destroyDateRange']);

    // Technicians
    Route::apiResource('technicians', TechnicianController::class);

    Route::get('/available-slots', [AppointmentAvailabilityController::class, 'getAvailableSlots']);

    Route::post('/logout', [AuthController::class, 'logout']);

});

