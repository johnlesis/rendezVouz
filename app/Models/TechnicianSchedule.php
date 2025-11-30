<?php

namespace App\Models;

use DateTimeImmutable;

final readonly class TechnicianSchedule
{
    public function __construct(
        public ?int $id,
        public int $technicianId,
        public DateTimeImmutable $date,
        public string $startTime,
        public string $endTime,
        public bool $isAvailable,
        public ?string $reason,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
    ) {}
}
