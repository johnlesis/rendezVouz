<?php

namespace App\Repositories;

use App\Contracts\Repositories\TechnicianScheduleRepositoryInterface;
use App\Models\TechnicianSchedule;

class TechnicianScheduleRepository extends BaseRepository implements TechnicianScheduleRepositoryInterface
{
    public function __construct()
    {
        parent::__construct('technician_schedules', TechnicianSchedule::class);
    }
}
