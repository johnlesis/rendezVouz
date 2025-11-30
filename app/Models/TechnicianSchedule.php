<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnicianSchedule extends Model
{
    protected $fillable = [
        'technician_id',
        'date',
        'start_time',
        'end_time',
        'is_available',
        'reason',
    ];

    protected $casts = [
        'date' => 'date',
        'is_available' => 'boolean',
    ];

    // Relationship to Technician
    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    // Scope for only available days
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }
}
