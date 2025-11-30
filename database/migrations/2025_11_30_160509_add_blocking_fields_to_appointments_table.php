<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->boolean('is_blocked')->default(false)->after('notes');
            $table->boolean('is_week_block')->default(false)->after('is_blocked');
            $table->time('start_time')->nullable()->after('is_week_block'); // for partial hour blocks
            $table->time('end_time')->nullable()->after('start_time');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['is_blocked', 'is_week_block', 'start_time', 'end_time']);
        });
    }
};
