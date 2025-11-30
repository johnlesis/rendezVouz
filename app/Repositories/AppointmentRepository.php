<?php

namespace App\Repositories;

use App\Contracts\Repositories\AppointmentRepositoryInterface;
use App\Models\Appointment;

class AppointmentRepository extends BaseRepository implements AppointmentRepositoryInterface
{
    public function __construct()
    {
        parent::__construct('appointments', Appointment::class);
    }
}
