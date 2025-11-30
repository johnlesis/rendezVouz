<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ServicesTableSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('services')->insert([
            [
                'name' => 'Πεντικιούρ',
                'description' => 'Κλασική υπηρεσία πεντικιούρ',
                'price' => 30.0,
                'duration' => 45,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Μανικιούρ',
                'description' => 'Κλασική υπηρεσία μανικιούρ',
                'price' => 25.0,
                'duration' => 40,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Lash Lift',
                'description' => 'Ανύψωση βλεφαρίδων',
                'price' => 50.0,
                'duration' => 60,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Πεντικιούρ + Μανικιούρ',
                'description' => 'Συνδυαστική υπηρεσία πεντικιούρ και μανικιούρ',
                'price' => 50.0,
                'duration' => 85,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Πεντικιούρ + Lash Lift',
                'description' => 'Συνδυαστική υπηρεσία πεντικιούρ και ανύψωσης βλεφαρίδων',
                'price' => 75.0,
                'duration' => 105,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Μανικιούρ + Lash Lift',
                'description' => 'Συνδυαστική υπηρεσία μανικιούρ και ανύψωσης βλεφαρίδων',
                'price' => 70.0,
                'duration' => 100,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Πεντικιούρ + Μανικιούρ + Lash Lift',
                'description' => 'Πλήρης συνδυαστική υπηρεσία',
                'price' => 100.0,
                'duration' => 135,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
