<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Technician extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'specialization',
        'bio',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    // Relationship to user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to schedules
    public function schedules()
    {
        return $this->hasMany(TechnicianSchedule::class);
    }

    // Relationship to appointments
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
