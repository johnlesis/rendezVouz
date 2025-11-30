<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Drop old time columns if they exist
            if (Schema::hasColumn('appointments', 'start_time')) {
                $table->dropColumn('start_time');
            }
            if (Schema::hasColumn('appointments', 'end_time')) {
                $table->dropColumn('end_time');
            }

            // Add new timestamp with timezone columns
            $table->timestampTz('start_time')->after('technician_id');
            $table->timestampTz('end_time')->after('start_time');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time']);

            // Optionally recreate old time columns as `time` type if needed
            $table->time('start_time')->after('technician_id');
            $table->time('end_time')->after('start_time');
        });
    }
};
