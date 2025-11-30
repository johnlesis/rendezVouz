<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name', 'description', 'price', 'duration', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'float'
    ];

    // Scope for active services
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
