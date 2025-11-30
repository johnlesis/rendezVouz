<?php

namespace App\Models;

use DateTimeImmutable;

final readonly class Appointment
{
    public function __construct(
        public ?int $id,
        public int $userId,
        public int $serviceId,
        public int $technicianId,
        public DateTimeImmutable $scheduledAt,
        public string $status,
        public ?string $notes,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
    ) {}
}
