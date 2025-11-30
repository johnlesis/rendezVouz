<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Technician;
use App\Models\User;

class TechnicianSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::find(2);
        
        Technician::create([
            'user_id' => 2,
            'name' => $user->name,
            'specialization' => 'Nails & Beauty',
            'bio' => 'Experienced technician in manicure, pedicure, and lash lift.',
            'is_available' => true,
        ]);
    }
}
