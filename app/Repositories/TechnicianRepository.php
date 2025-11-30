<?php

namespace App\Repositories;

use App\Contracts\Repositories\TechnicianRepositoryInterface;
use App\Models\Technician;

class TechnicianRepository extends BaseRepository implements TechnicianRepositoryInterface
{
    public function __construct()
    {
        parent::__construct('technicians', Technician::class);
    }
}
