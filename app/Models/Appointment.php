<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'technician_id',
        'scheduled_at',
        'status',
        'notes',
        'is_blocked',
        'is_week_block',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'is_blocked' => 'boolean',
        'is_week_block' => 'boolean',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    // Helper methods
    public function isFullDayBlocked(): bool
    {
        return $this->is_blocked && $this->start_time === null && $this->end_time === null;
    }
}
