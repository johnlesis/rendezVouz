<?php

namespace App\Models;

use DateTimeImmutable;

final readonly class WorkingHours
{
    public function __construct(
        public ?int $id,
        public int $technicianId,
        public int $dayOfWeek,
        public string $startTime,
        public string $endTime,
        public bool $isActive,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
    ) {}
}
