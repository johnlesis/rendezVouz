<?php

use Illuminate\Support\Facades\Route;

// All other routes point to SPA
Route::get('/{any}', function () {
    return view('spa'); // your Vue SPA entry point
})->where('any', '.*');

