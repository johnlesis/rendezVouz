<?php

namespace App\Repositories;

use App\Contracts\Repositories\WorkingHoursRepositoryInterface;
use App\Models\WorkingHours;

class WorkingHoursRepository extends BaseRepository implements WorkingHoursRepositoryInterface
{
    public function __construct()
    {
        parent::__construct('working_hours', WorkingHours::class);
    }
}
